import { buildQaPrompt } from '../prompts/qa-prompt.js'
import { runQaPrompt } from './openai.js'

const HTTP_TIMEOUT_MS = 12000
const MAX_CONCURRENT_FETCHES = 5
const USER_AGENT = 'Deen BackSEOQA/1.0 (+https://www.deenback.com)'

const URL_REGEX = /(https?:\/\/[^\s"'()<>]+(?:\([\w\d]+\))?)/gi
const SKIP_URL_PATTERNS = [/^https?:\/\/localhost/i, /^https?:\/\/127\./i]
const YT_EMBED_REGEX =
  /<iframe[\s\S]*?src=["']https?:\/\/(?:www\.|m\.|music\.)?(?:youtube|-nocookie)\.com\/embed\/([a-zA-Z0-9_-]{6,})["'][\s\S]*?<\/iframe>/gi

function shouldSkipUrl(url) {
  return SKIP_URL_PATTERNS.some((regex) => regex.test(url))
}

function extractUrls(mdxContent) {
  if (!mdxContent) return []
  const matches = new Set()

  let result
  while ((result = URL_REGEX.exec(mdxContent)) !== null) {
    const raw = result[1]
    const cleaned = raw.replace(/[),.]+$/, '') // strip trailing punctuation
    if (!shouldSkipUrl(cleaned)) {
      matches.add(cleaned)
    }
  }

  return Array.from(matches)
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': USER_AGENT, ...(options.headers || {}) },
      ...options,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(timeout)
  }
}

async function probeUrl(url) {
  const result = { url }

  try {
    let response = await fetchWithTimeout(url, { method: 'HEAD' })

    if (!response.ok || response.status >= 400) {
      response = await fetchWithTimeout(url, { method: 'GET' })
    }

    result.ok = response.ok
    result.status = response.status
    result.finalUrl = response.url
  } catch (error) {
    // Retry once with GET if HEAD failed before hitting the network
    if (!result.ok) {
      try {
        const fallbackResponse = await fetchWithTimeout(url, { method: 'GET' })
        result.ok = fallbackResponse.ok
        result.status = fallbackResponse.status
        result.finalUrl = fallbackResponse.url
        if (!fallbackResponse.ok) {
          result.error = `HTTP ${fallbackResponse.status}`
        }
      } catch (fallbackError) {
        result.ok = false
        result.error = fallbackError.message
      }
    } else {
      result.ok = false
      result.error = error.message
    }
  }

  if (!result.ok && !result.error && result.status) {
    result.error = `HTTP ${result.status}`
  }

  return result
}

async function mapWithConcurrency(items, limit, mapper) {
  if (!items.length) return []
  const results = new Array(items.length)
  let index = 0

  async function worker() {
    while (index < items.length) {
      const currentIndex = index++
      results[currentIndex] = await mapper(items[currentIndex], currentIndex)
    }
  }

  const workers = []
  for (let i = 0; i < Math.min(limit, items.length); i += 1) {
    workers.push(worker())
  }

  await Promise.all(workers)
  return results
}

async function validateUrls(urls) {
  return await mapWithConcurrency(urls, MAX_CONCURRENT_FETCHES, probeUrl)
}

function extractYouTubeEmbeds(mdxContent) {
  if (!mdxContent) return []
  const embeds = []
  let match

  while ((match = YT_EMBED_REGEX.exec(mdxContent)) !== null) {
    embeds.push({
      embedUrl: match[0].match(/src=["']([^"']+)["']/i)?.[1],
      videoId: match[1],
    })
  }

  return embeds
}

async function validateYouTubeEmbeds(mdxContent) {
  const embeds = extractYouTubeEmbeds(mdxContent)

  const validated = await mapWithConcurrency(embeds, MAX_CONCURRENT_FETCHES, async (embed) => {
    const watchUrl = `https://www.youtube.com/watch?v=${embed.videoId}`
    const endpoint = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(watchUrl)}`
    const result = { ...embed }

    try {
      const response = await fetchWithTimeout(endpoint, { method: 'GET' })
      result.status = response.status

      if (response.ok) {
        const payload = await response.json()
        result.valid = true
        result.title = payload.title
        result.author = payload.author_name
      } else {
        result.valid = false
        result.error = `oEmbed HTTP ${response.status}`
      }
    } catch (error) {
      result.valid = false
      result.error = error.message
    }

    return result
  })

  return { embeds: validated, found: embeds.length > 0 }
}

function extractFixedMdx(text) {
  if (!text) return null
  const match = text.match(/<fixed_mdx>\s*([\s\S]*?)\s*<\/fixed_mdx>/i)
  if (match) {
    return match[1].trim()
  }
  return null
}

export async function runContentQA({ mdxContent, language = 'en', topic }) {
  const urls = extractUrls(mdxContent)
  const [linkAudit, youtubeStatus] = await Promise.all([
    validateUrls(urls),
    validateYouTubeEmbeds(mdxContent),
  ])
  const brokenLinks = linkAudit.filter((link) => !link.ok)

  const prompt = buildQaPrompt({
    language,
    topicTitle: topic?.title || 'Untitled',
    mdxContent,
    linkAudit,
    brokenLinks,
    youtubeStatus,
  })

  let qaResponseText
  try {
    qaResponseText = await runQaPrompt(prompt)
  } catch (error) {
    return { success: false, error: error.message, linkAudit, youtubeStatus }
  }

  if (!qaResponseText) {
    return { success: false, error: 'Empty response from QA prompt', linkAudit, youtubeStatus }
  }

  const fixedMdx = extractFixedMdx(qaResponseText) || qaResponseText.trim()

  return {
    success: true,
    mdx: fixedMdx,
    linkAudit,
    youtubeStatus,
    prompt,
    adjusted: fixedMdx.trim() !== mdxContent.trim(),
    brokenLinkCount: brokenLinks.length,
  }
}
