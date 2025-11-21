const LANGUAGE_HINTS = {
  en: 'English (US) readers who expect pastoral, respectful guidance rooted in mainstream Islamic scholarship.',
  ar: 'Modern Standard Arabic readers expecting dignified Islamic guidance that honours Qur’an and sunnah.',
}

function formatLinkAudit(linkAudit = []) {
  if (!linkAudit.length) {
    return 'No HTTP/HTTPS links were detected in this document.'
  }

  return linkAudit
    .map((item, idx) => {
      const details = [
        `url: ${item.url}`,
        `status: ${item.status ?? 'n/a'}`,
        `ok: ${item.ok}`,
        item.finalUrl && item.finalUrl !== item.url ? `finalUrl: ${item.finalUrl}` : null,
        item.error ? `error: ${item.error}` : null,
      ]
        .filter(Boolean)
        .join(' | ')

      return `${idx + 1}. ${details}`
    })
    .join('\n')
}

function formatBrokenLinks(brokenLinks = []) {
  if (!brokenLinks.length) {
    return 'None. All validated links returned 2xx or 3xx responses.'
  }

  return brokenLinks
    .map((item, idx) => {
      const note = item.error ? `error: ${item.error}` : `status: ${item.status ?? 'n/a'}`
      return `${idx + 1}. ${item.url} (${note})`
    })
    .join('\n')
}

function formatYouTubeStatus(youtubeStatus = {}) {
  const { embeds = [] } = youtubeStatus
  if (!embeds.length) {
    return 'No YouTube iframe embeds were found in the MDX.'
  }

  return embeds
    .map((embed, idx) => {
      const parts = [
        `embedUrl: ${embed.embedUrl}`,
        `videoId: ${embed.videoId}`,
        `valid: ${embed.valid}`,
        embed.title ? `title: ${embed.title}` : null,
        embed.error ? `error: ${embed.error}` : null,
        embed.status ? `status: ${embed.status}` : null,
      ]
        .filter(Boolean)
        .join(' | ')

      return `${idx + 1}. ${parts}`
    })
    .join('\n')
}

export function buildQaPrompt({
  language = 'en',
  topicTitle,
  mdxContent,
  linkAudit = [],
  brokenLinks = [],
  youtubeStatus = {},
}) {
  const languageHint = LANGUAGE_HINTS[language] || LANGUAGE_HINTS.en
  const linkAuditSection = formatLinkAudit(linkAudit)
  const brokenLinksSection = formatBrokenLinks(brokenLinks)
  const youtubeSection = formatYouTubeStatus(youtubeStatus)

  return `
You are DeenUp's Islamic content QA assistant for ${language === 'ar' ? 'Arabic' : 'English'} SEO blogs.
Your job: quietly fix ALL issues so the MDX is flawless for publication—do not produce a report or commentary.

Reader context: ${languageHint}
Topic title: ${topicTitle}
Islamic guardrail: every line must respect Islamic teachings, reference credible Islamic knowledge, and avoid disrespectful phrasing.
Auto-fix policy: apply corrections directly without asking for approval.

Verified HTTP link crawl results (already fetched via real requests):
${linkAuditSection}

Links that failed validation and MUST be replaced with working Islamic resources:
${brokenLinksSection}

YouTube validation results:
${youtubeSection}

CRITICAL TASKS - YOU MUST DO ALL OF THESE:

1. **REMOVE ALL PROMPT TEMPLATE ARTIFACTS**: Delete these exact phrases if they appear in the content:
   - "Bold statement:"
   - "Start with the answer:"
   - "Quick overview:"
   - "Bridge to details:"
   - Any other meta-instructions or template markers that are not part of the actual blog content

2. **FIX ALL BROKEN URLS**: For each broken link in the list above:
   - Replace with a working, credible Islamic resource (quran.com, sunnah.com, islamqa.info, seekersguidance.org, yaqeeninstitute.org)
   - Preserve anchor text
   - Use https URLs only
   - DO NOT leave broken URLs in the final output

3. **ADD OR FIX YOUTUBE VIDEO**:
   ${
     youtubeStatus.found
       ? 'If the YouTube video is flagged invalid, search for a relevant Islamic educational video about "' +
         topicTitle +
         '" and replace the videoId.'
       : 'The MDX is missing a YouTube video. Add an iframe embed with a relevant Islamic educational video about "' +
         topicTitle +
         '". Use this format:\n\n<iframe\n  width="100%"\n  style={{ aspectRatio: \'16/9\', maxWidth: \'800px\' }}\n  src="https://www.youtube.com/embed/VIDEO_ID_HERE"\n  title="' +
         topicTitle +
         '"\n  frameBorder="0"\n  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"\n  allowFullScreen\n></iframe>'
   }

4. **CLEAN UP GRAMMAR AND READABILITY**: Fix typos, awkward phrasing, unclear transitions

5. **VERIFY ISLAMIC ACCURACY AND RESPECT**:
   - For Arabic content: Double-check all Quranic verses, hadith quotes, and du'ā wording for accuracy
   - Common error example: "الساحب" should be "الصاحب" in travel du'ā
   - Ensure all Islamic content respects teachings and maintains proper honorifics (ﷺ, رضي الله عنه, etc.)
   - If uncertain about Arabic Islamic text accuracy, mark for human review or use trusted sources

PRESERVE: YAML frontmatter, hero images, image paths, slugs, layout metadata

Original MDX:
<original_mdx>
${mdxContent}
</original_mdx>

Return ONLY the final corrected MDX enclosed by the markers below—no explanations, no summaries, no code fences:
<fixed_mdx>
...final mdx...
</fixed_mdx>
`
}
