# Islamful — Product Context for Blog Posts

## About Islamful

**Islamful** (islamful.com) is an all-in-one Islamic tools platform — the web-based tools every
Muslim needs daily, plus an SEO-driven blog. Tagline: **"Your Complete Islamic Companion."**

- **Domain / site URL:** `https://www.islamful.com`
- **Brand green:** `#327952`  ·  **Background cream:** `#F6F5EE`
- **Voice:** A knowledgeable friend answering a genuine question. Clear, direct, warm, never preachy,
  never academic. Answer first, evidence second, context last. (Full style rules live in
  `data/seo-prompts.ts` → `STYLE_AND_TONE` and `ISLAMIC_CONTENT_RULES`.)

Unlike app-based Islamic sites, Islamful's "CTA" is its own **free web tools** — there is no app to
download. Posts should pull readers into the relevant tool, embedded inline as a live React component.

## The tools (embed the right one inline)

These components are registered in MDXComponents and render interactively inside the post. Embed at
most ONE topical tool per article, plus always `<ToolsBox />`.

| Component | Embed in | What it does | Tool page |
| --- | --- | --- | --- |
| `<HaramChecker lang="en" />` | `is-x-haram` articles | AI halal/haram checker (static DB + Gemini) | `/haram-check` |
| `<DuaCollection lang="en" />` | `dua` articles | Browsable dua collection (Arabic + translation) | `/dua` |
| `<PrayerTimes lang="en" />` | prayer-related `how-to` articles | Prayer times by location (Aladhan API) | `/prayer-times` |
| `<ToolsBox />` | **every** article | Grid of 6 free tools — encourages exploration | — |

Rules:
- Place the topical tool naturally in the flow (usually after the main scholarly/answer sections,
  before the summary). Introduce it with one line of context, e.g. *"Want to check if something else is
  halal? Try our free Haram Checker:"* then the component.
- **Never** pass a `standalone` prop in blog embeds.
- A tool embed must NOT sit inside a heading.
- `how-to` guides that are NOT about prayer, and `explainer` articles, get only `<ToolsBox />` (no
  topical tool) unless one genuinely fits.
- `<ToolsBox />` takes no props — place it roughly two-thirds through, after the main content and
  before the final summary/conclusion. Include it in **every** article, no exceptions.

## Internal link targets

Always-valid pages (link when genuinely relevant — aim for 3–5 internal links total):
- `/haram-check` — halal/haram checker
- `/prayer-times` — prayer times
- `/dua` — dua collection
- `/quran` — Quran reader

Blog cross-links (`/blog/[slug]`): **only** link to slugs that already exist as `.mdx` files in
`data/blog/en/`. Check with a glob first. Never link to a post that hasn't been written — it 404s.

## External links

- ✅ quran.com, sunnah.com, islamqa.info, dar-alifta.org, yaqeeninstitute.org, seekersguidance.org,
  Wikipedia (general context only).
- ❌ e-commerce, affiliate, review/comparison sites.
- 2–5 per article. **Verify every external URL returns 200/301/302 with curl before publishing**
  (`curl -s -o /dev/null -w "%{http_code}" "URL"`). Never invent hadith/verse/fatwa URLs.
- Hadith → `https://sunnah.com/[collection]:[number]`. Quran → `https://quran.com/[chapter]/[verse]`.

## GEO / answer-engine optimization (the quality edge)

Islamful posts should win AI Overviews, ChatGPT, and "People Also Ask" — not just blue links.

- **Answer capsule:** right after the opening hook, give the direct answer in one self-contained
  paragraph (40–70 words) with the key citation. For `is-x-haram`, this is the `> **Quick Answer:**`
  blockquote that `data/seo-prompts.ts` already mandates. A reader (or an AI) must get the ruling
  without scrolling.
- **FAQs are schema:** the 3–5 `faqs` in frontmatter render as `FAQPage` JSON-LD via ContentLayer.
  Write each answer self-contained (40–60 words), restating the question's subject so it can be quoted
  standalone. Mirror real "People Also Ask" phrasing.
- **Phrase H2/H3 as real questions** people search ("Is the duff allowed?", "How many rakahs is Witr?")
  where natural, not vague statements.
- **One comparison/reference table** where the topic supports it (madhab differences, rakah counts,
  halal-vs-haram at a glance, Hajj vs Umrah). GFM tables render. Don't duplicate the table in prose.

## Author & frontmatter constants

- `authors: ['sih-c']` — always. (Do not use `mathias-yussif`; only one legacy post does.)
- `layout: 'PostLayout'`
- `images: ['/static/images/blog/[slug].webp']`
- `draft: false`
- `date` and `lastmod`: today, `YYYY-MM-DD`.
