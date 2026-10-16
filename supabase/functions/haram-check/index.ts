import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

import { createClient } from 'npm:@supabase/supabase-js@2'
import { createHmac } from 'node:crypto'
async function checkRateLimit(ip: string): Promise<boolean> {
  const secret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const db = createClient(Deno.env.get('SUPABASE_URL')!, secret)
  const bucket = createHmac('sha256', secret)
    .update(`${new Date().toISOString().slice(0, 10)}:${ip}`)
    .digest('hex')
  const local = await db.rpc('allow_ai_request', { p_bucket: bucket, p_limit: 10, p_seconds: 60 })
  if (local.error || !local.data) return false
  const global = await db.rpc('allow_ai_request', {
    p_bucket: 'global',
    p_limit: 100,
    p_seconds: 86400,
  })
  return !global.error && global.data === true
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

  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405, req)
  if (!ALLOWED_ORIGINS.includes(req.headers.get('origin') || ''))
    return jsonResponse({ error: 'Origin not allowed' }, 403, req)
  if (!req.headers.get('content-type')?.startsWith('application/json'))
    return jsonResponse({ error: 'JSON required' }, 415, req)

  try {
    const raw = await req.text()
    if (raw.length > 2048) return jsonResponse({ error: 'Request too large' }, 413, req)
    let input
    try {
      input = JSON.parse(raw)
    } catch {
      return jsonResponse({ error: 'Invalid JSON' }, 400, req)
    }
    if (!input || typeof input !== 'object')
      return jsonResponse({ error: 'Invalid request' }, 400, req)
    const { query, lang = 'en' } = input

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return jsonResponse({ error: 'Query is required' }, 400, req)
    }

    if (query.trim().length > 200) {
      return jsonResponse({ error: 'Query too long (max 200 characters)' }, 400, req)
    }

    // Rate limit by IP
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!(await checkRateLimit(clientIP))) {
      return jsonResponse({ error: 'Too many requests. Please try again later.' }, 429, req)
    }

    const apiKey = Deno.env.get('APIMART_API_KEY')
    if (!apiKey) {
      return jsonResponse({ error: 'Service unavailable' }, 503, req)
    }

    const responseLang =
      ({ en: 'English', ar: 'Arabic', fr: 'French', de: 'German' } as Record<string, string>)[
        lang
      ] || 'English'

    const systemPrompt = `You provide general information about Islamic perspectives. You are not a scholar and do not issue fatwas. Do not present a generated answer as a verified religious ruling.

RESPOND ONLY WITH A SINGLE JSON OBJECT. No other text, no markdown.

The JSON must have these exact keys:
- "name": the item name in ${responseLang}
- "ruling": exactly one of: "halal", "haram", "mashbooh", "depends", "not_applicable". These are general labels, not personal fatwas.
- "explanation": 2-3 sentences in ${responseLang}. State relevant conditions or scholarly disagreement instead of claiming consensus without evidence.
- "source": an exact Quran verse or numbered Hadith reference only if you are confident it directly supports the explanation; otherwise an empty string. Do not invent a citation or attribute a view to an unnamed scholarly body.

Use "depends" when a question has missing context, a product needs ingredient or certification checks, or schools differ. Pay attention to negation and qualifiers such as "pork-free" or "without alcohol"; do not classify a whole question from a single keyword. If the query is unrelated to Islamic rulings, use "not_applicable" as the ruling.`

    const res = await fetch('https://api.apimart.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(45000),
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        temperature: 0.2,
        max_tokens: 800,
        stream: false,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Explain this question in ${responseLang}: ${JSON.stringify(query.trim())}`,
          },
        ],
      }),
    })
    if (!res.ok) return jsonResponse({ error: 'AI service error' }, 502, req)
    const responseData = await res.json()
    const text = responseData?.choices?.[0]?.message?.content || ''
    if (!text) {
      console.error('Empty AI response')
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
