import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

// Rate limiting: 10 requests/min per IP + 100 requests/day global
const PER_IP_LIMIT = 10
const PER_IP_WINDOW_MS = 60_000
const DAILY_LIMIT = 100
const ipCounts = new Map<string, { count: number; resetAt: number }>()
let dailyCount = 0
let dailyResetAt = Date.now() + 86_400_000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()

  // Global daily cap
  if (now > dailyResetAt) {
    dailyCount = 0
    dailyResetAt = now + 86_400_000
  }
  if (dailyCount >= DAILY_LIMIT) return false
  dailyCount++

  // Per-IP per-minute limit
  const entry = ipCounts.get(ip)
  if (!entry || now > entry.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + PER_IP_WINDOW_MS })
    return true
  }
  if (entry.count >= PER_IP_LIMIT) return false
  entry.count++
  return true
}

const ALLOWED_ORIGINS = ['https://islamful.com', 'https://www.islamful.com']

function getCorsHeaders(origin: string | null) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

function jsonResponse(data: unknown, status = 200, req?: Request) {
  const origin = req?.headers.get('origin') ?? null
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...getCorsHeaders(origin), 'Content-Type': 'application/json' },
  })
}

function extractJson(text: string): Record<string, unknown> | null {
  // Try direct parse first
  try {
    return JSON.parse(text)
  } catch {
    // ignore
  }

  // Try extracting from markdown code blocks
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeBlock) {
    try {
      return JSON.parse(codeBlock[1].trim())
    } catch {
      // ignore
    }
  }

  // Try finding first { ... } block
  const braceMatch = text.match(/\{[\s\S]*\}/)
  if (braceMatch) {
    try {
      return JSON.parse(braceMatch[0])
    } catch {
      // ignore
    }
  }

  return null
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'))

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Rate limit by IP
  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(clientIP)) {
    return jsonResponse({ error: 'Too many requests. Please try again later.' }, 429, req)
  }

  try {
    const { query, lang = 'en' } = await req.json()

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return jsonResponse({ error: 'Query is required' }, 400, req)
    }

    if (query.trim().length > 200) {
      return jsonResponse({ error: 'Query too long (max 200 characters)' }, 400, req)
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      return jsonResponse({ error: 'Service unavailable' }, 503, req)
    }

    const isArabic = lang === 'ar'
    const responseLang = isArabic ? 'Arabic' : 'English'

    const systemPrompt = `You provide general information about Islamic perspectives. You are not a scholar and do not issue fatwas. Do not present a generated answer as a verified religious ruling.

RESPOND ONLY WITH A SINGLE JSON OBJECT. No other text, no markdown.

The JSON must have these exact keys:
- "name": the item name in ${responseLang}
- "ruling": exactly one of: "halal", "haram", "mashbooh", "depends", "not_applicable". These are general labels, not personal fatwas.
- "explanation": 2-3 sentences in ${responseLang}. State relevant conditions or scholarly disagreement instead of claiming consensus without evidence.
- "source": an exact Quran verse or numbered Hadith reference only if you are confident it directly supports the explanation; otherwise an empty string. Do not invent a citation or attribute a view to an unnamed scholarly body.

Use "depends" when a question has missing context, a product needs ingredient or certification checks, or schools differ. Pay attention to negation and qualifiers such as "pork-free" or "without alcohol"; do not classify a whole question from a single keyword. If the query is unrelated to Islamic rulings, use "not_applicable" as the ruling.`

    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Give general information about this halal-or-haram question in ${responseLang}: ${JSON.stringify(query.trim())}`,
                },
              ],
            },
          ],
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 512,
            responseMimeType: 'application/json',
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    )

    if (!res.ok) {
      const errText = await res.text()
      console.error('Gemini API error:', res.status, errText)
      return jsonResponse({ error: 'AI service error' }, 502, req)
    }

    const geminiData = await res.json()

    // Find the text part (skip thinking parts)
    const parts = geminiData?.candidates?.[0]?.content?.parts || []
    let text = ''
    for (const part of parts) {
      if (part.text && !part.thought) {
        text = part.text
        break
      }
    }

    if (!text) {
      console.error('No text in response:', JSON.stringify(geminiData).slice(0, 500))
      return jsonResponse({ error: 'No response from AI' }, 502, req)
    }

    const result = extractJson(text)
    if (!result) {
      console.error('Failed to extract JSON from:', text.slice(0, 500))
      return jsonResponse({ error: 'Failed to parse AI response' }, 502, req)
    }

    // Validate and sanitize
    const validRulings = ['halal', 'haram', 'mashbooh', 'depends', 'not_applicable']
    const ruling = validRulings.includes(result.ruling as string) ? result.ruling : 'depends'

    const name = typeof result.name === 'string' ? result.name.trim().slice(0, 200) : ''
    const explanation =
      typeof result.explanation === 'string' ? result.explanation.trim().slice(0, 1200) : ''
    const source = typeof result.source === 'string' ? result.source.trim().slice(0, 200) : ''

    return jsonResponse(
      {
        name: name || query.trim(),
        ruling,
        explanation,
        source,
      },
      200,
      req
    )
  } catch (err) {
    console.error('Edge function error:', err)
    return jsonResponse({ error: 'Internal server error' }, 500, req)
  }
})
