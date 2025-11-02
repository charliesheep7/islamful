import fs from 'fs-extra'
import path from 'path'
import OpenAIClient from './openai.js'

export class LinkAuditor {
  constructor() {
    this.openai = new OpenAIClient()
  }

  static extractLinksFromMDX(mdxContent) {
    const linkRegex = /\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/g
    const urls = new Set()
    let match
    while ((match = linkRegex.exec(mdxContent)) !== null) {
      urls.add(match[1])
    }
    return Array.from(urls)
  }

  async auditFile(filePath) {
    const content = await fs.readFile(filePath, 'utf8')
    const links = LinkAuditor.extractLinksFromMDX(content)
    if (links.length === 0) {
      return { ok: true, linksChecked: 0, failures: [] }
    }

    const systemPrompt = `You are a careful content validator. You will be given a list of URLs extracted from a published MDX blog post. Your task: for each URL, reason step-by-step about whether it likely returns HTTP 200 (valid) versus broken like 400/404. Use your knowledge of well-known domains and typical permalink formats. Do not fabricate. Mark anything suspicious as not-ok. Output strict JSON with fields: {\n  "summary": string,\n  "results": [{ "url": string, "status": "ok" | "not_ok", "reason": string }]\n}.`

    const userPrompt = `Check each link is live and returns 200 (not 400/404). Links to validate (one per line):\n${links.join('\n')}\n\nImportant: If uncertain, mark as not_ok.`

    const response = await this.openai.client.responses.create({
      model: 'gpt-5-mini-2025-08-07',
      input: [
        { role: 'system', content: [{ type: 'input_text', text: systemPrompt }] },
        { role: 'user', content: [{ type: 'input_text', text: userPrompt }] },
      ],
      reasoning: { effort: 'low' },
      text: { format: 'plain' },
    })

    const text = response.output_text || ''
    const jsonMatch = text.match(/\{[\s\S]*\}$/)
    let parsed
    try {
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text)
    } catch {
      // Fallback minimal result when parsing fails
      parsed = {
        summary: 'Parsing failed',
        results: links.map((u) => ({ url: u, status: 'not_ok', reason: 'LLM output parse error' })),
      }
    }

    const failures = (parsed.results || []).filter((r) => r.status !== 'ok')
    return { ok: failures.length === 0, linksChecked: links.length, failures, raw: parsed }
  }
}

export default LinkAuditor
