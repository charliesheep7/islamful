---
name: islamful-blog-writer
description: Generate SEO-optimized Islamic blog posts for islamful.com. Auto-detects the next unwritten keyword from a bundled queue, researches authentic sources, writes a publish-ready MDX post in Islamful's format, generates a hero image locally (no API), validates SEO, submits to IndexNow, and tracks progress. Use when asked to write a blog, generate an article, or create content for Islamful.
---

# Islamful Blog Writer

End-to-end, self-contained pipeline for publishing an SEO-optimized blog post on **islamful.com**.
One skill does everything: pick keyword → research → write → hero image → proofread → validate →
IndexNow → track. The keyword queue, written-tracker, references, and a fallback image generator are
all bundled in this folder, so a run is never blocked by an external dependency.

**Default behavior:** just run `/islamful-blog-writer`. It picks the next unwritten keyword from the
bundled queue and runs the whole pipeline. No arguments needed.

## Input

`$ARGUMENTS` is optional:

- **Empty** (default) → auto-pick the next unwritten keyword, generate 1 article.
- **A number `N`** (e.g. `3`) → batch mode, generate N articles in sequence.
- **A specific keyword** (e.g. `is poker haram`) → use that keyword, generate 1 article.

## Bundled files (paths relative to the islamful repo root)

- Blog posts: `data/blog/en/[SLUG].mdx`
- Hero image: `public/static/images/blog/[SLUG].webp`, referenced as `/static/images/blog/[SLUG].webp`
- Keyword queue: `.claude/skills/islamful-blog-writer/keywords.csv` (single column, header `Keyword`)
- Written tracker: `.claude/skills/islamful-blog-writer/written.csv` (`Keyword,Slug`)
- Fallback image generator: `.claude/skills/islamful-blog-writer/generate-hero-image.js`
- Product/tools/links/GEO context: `.claude/skills/islamful-blog-writer/references/islamful-context.md`
- **Article-structure prompts (canonical source):** `data/seo-prompts.ts` — the 4 article-type
  prompts (`IS_X_HARAM_PROMPT`, `DUA_PROMPT`, `HOW_TO_GUIDE_PROMPT`, `EXPLAINER_PROMPT`),
  `IMAGE_PROMPT_RULES`, and `detectArticleType()`. **Read it every run and follow it exactly** — do not
  improvise article structure.
- Site URL: `https://www.islamful.com` · Author: `sih-c` · Layout: `PostLayout`

## Batch mode

When `$ARGUMENTS` is a number `N`, run Steps 1–9 N times. Re-read `written.csv` and re-glob
`data/blog/en/` between iterations so each pass picks the next unwritten keyword. Print a header before
each: `===== ARTICLE [X/N] — [keyword] =====`. After all iterations, print a batch summary listing each
slug + title + IndexNow status.

---

## Pipeline

### Step 1 — Pick keyword

1. Read `keywords.csv` (the queue, in order) and `written.csv` (already done).
2. Glob `data/blog/en/*.mdx` for existing slugs (secondary dedupe — source of truth).
3. **Empty args:** pick the first keyword in `keywords.csv` that is (a) not in `written.csv`, (b) not an
   existing slug, and (c) **not a semantic duplicate** of an existing post. The queue is pre-deduped,
   but still apply judgment: e.g. skip "dua for a journey" if `dua-for-travel` exists, skip "is weed
   haram" if `is-cbd-haram` covers it. When in doubt, prefer a clearly distinct topic.
4. **Specific keyword:** use it (still check it isn't already written; warn and pick the next queue item
   if it is).
5. Generate the slug: lowercase, kebab-case, strip apostrophes/special chars, ~60 chars max. Match
   Islamful's existing convention (e.g. `is music haram` → `is-music-haram`).
6. Detect the article type using the regex in `data/seo-prompts.ts` → `detectArticleType()`:
   `is-x-haram` | `dua` | `how-to` | `explainer`.

**If the queue is exhausted** (every keyword in `keywords.csv` is already written / a semantic dup —
i.e. no pickable keyword remains), do NOT stop. **Research and generate a fresh batch of keywords,**
then append them to `keywords.csv` and continue:
- Web-search current high-intent Islamic searches and "People Also Ask" / autocomplete for the gaps.
  Islamful's strongest gaps are **how-to guides** and **explainers**; also fresh `is-x-haram` topics
  (new foods, brands, tech, finance, trends) and genuinely distinct `dua` occasions.
- Generate ~20–40 candidates, then dedupe each against `written.csv` and existing slugs (exact AND
  semantic — skip anything a current post already covers). Keep only genuinely new topics.
- Append the survivors (one per line) to `keywords.csv`, then pick the first one and proceed.
- Note in the summary that the queue was replenished and how many keywords were added.

Show: picked keyword, article type, slug.

### Step 2 — Research

Read `references/islamful-context.md` first (tools, links, GEO rules, frontmatter constants).

Then do 2–3 web searches for authentic, citable material on the topic:
- Quran verses (quran.com) and hadith (sunnah.com — Bukhari, Muslim, Abu Dawud, Tirmidhi, etc.).
- Scholarly context (islamqa.info, dar-alifta.org, yaqeeninstitute.org, seekersguidance.org).

**Never fabricate** hadith, verses, scholar names, gradings, statistics, or URLs. Record collection +
number precisely so you can build verifiable links in Step 3.

### Step 3 — Write the article

1. Read `data/seo-prompts.ts` and load the prompt for the detected type. **You are the writer these
   prompts target — follow the structure, word counts, citation format, tone, and output rules exactly.**
2. Write the MDX to `data/blog/en/[SLUG].mdx`.

**Frontmatter** (Islamful's exact format — verified against real posts):

```yaml
---
title: '[SEO title, 30–60 chars, primary keyword front-loaded]'
date: '[today YYYY-MM-DD]'
lastmod: '[today YYYY-MM-DD]'
summary: '[meta description, 120–155 chars]'
tags: ['tag1', 'tag2', 'tag3']
authors: ['sih-c']
draft: false
images: ['/static/images/blog/[SLUG].webp']
layout: 'PostLayout'
faqs:
  - question: '[real People-Also-Ask question]'
    answer: '[self-contained 40–60 word answer]'
  - question: '...'
    answer: '...'
  - question: '...'
    answer: '...'
---
```

- Provide **3–5 FAQs**; each answer self-contained and restating the subject (renders as `FAQPage`
  JSON-LD via ContentLayer → wins AI Overviews / PAA).
- **YAML apostrophe safety:** if any single-quoted value contains `'` (e.g. `Allah's`, `don't`,
  `scholars'`), switch THAT value to double quotes. Unescaped apostrophes in single-quoted YAML break
  the ContentLayer build. Scan every frontmatter line before saving.

**Immediately after the closing `---`**, the hero image in a constrained div:

```mdx
<div className="not-prose my-6 overflow-hidden rounded-xl">
  <Image
    src="/static/images/blog/[SLUG].webp"
    alt="[descriptive alt for the topic]"
    width={1200}
    height={630}
    priority
    className="h-[280px] w-full object-cover"
  />
</div>
```

**Body rules** (see `references/islamful-context.md` for full detail):
- No `# H1` — the frontmatter title is the H1. Start at `## H2`, use `###` for subsections only. Never
  skip levels; never an H2 with a single lone H3.
- **Answer capsule** right after the opening hook (for `is-x-haram`, the `> **Quick Answer:**` block
  that `seo-prompts.ts` mandates) — direct answer + key citation in 40–70 words.
- Arabic in proper script → *transliteration* → "translation", with the source cited.
- **One comparison/reference table** where the topic supports it (madhab differences, rakah counts,
  halal-vs-haram at a glance). Don't repeat the table in prose.
- Phrase H2/H3 as real questions where natural.
- **Embed exactly one topical tool** matching the type, then **always `<ToolsBox />`**:
  - `is-x-haram` → `<HaramChecker lang="en" />`
  - `dua` → `<DuaCollection lang="en" />`
  - prayer-related `how-to` → `<PrayerTimes lang="en" />`
  - Place `<ToolsBox />` ~two-thirds through, before the summary. Never pass `standalone`. Never put a
    tool inside a heading.

**Links (verify before saving):**
- 3–5 internal links. Tool pages (`/haram-check`, `/prayer-times`, `/dua`, `/quran`) are always valid.
  For `/blog/[slug]` links, glob `data/blog/en/` and link ONLY to slugs that exist — never to unwritten
  posts (they 404).
- 2–5 external links to authoritative sources. Verify each returns 200/301/302:
  `curl -s -o /dev/null -w "%{http_code}" "URL"`. Drop or replace any non-200.

### Step 4 — Hero image (local, no API)

Generate the hero image **locally** with the bundled generator — like DeenUp, there is **no Gemini, no
API key, and no network call**. It renders a 1200x630 branded title card: an Islamful green/cream
gradient with film grain and the article title in a serif, deterministic from the slug.

```bash
node .claude/skills/islamful-blog-writer/generate-hero-image.js "[SLUG]" "[palette]" "[Article Title]"
```

- **Palette** (optional) — pick one that fits the topic's mood, or omit to auto-pick from the slug:
  - `dawn` — light cream → soft green; calm/welcoming (duas, beginners, reflection)
  - `meadow` — mid brand green; everyday how-to guides
  - `sand` — neutral warm cream/sand; explainers, reference, history
  - `forest` — deep green → near-black; serious/solemn topics (death, judgment, hardship)
  - `garden` — saturated brand green; strong/motivational topics
- **Title** — pass the article's real title (3–6 words read best) so the card is legible.
- On a fresh checkout with no `node_modules`, the script auto-installs `sharp` into the skill folder on
  first run (~20s — let it finish). When it prints `SUCCESS`, the image exists.

**Verify** `public/static/images/blog/[SLUG].webp` exists and is > 10 KB. The frontmatter `images` path
and the `<Image src>` must both be `/static/images/blog/[SLUG].webp`. The hero alt text should describe
the topic plainly (the card is typographic, so no need to describe a painted scene).

### Step 5 — Proofread

Re-read the draft. Cut robotic phrasing, repeated openers, filler ("In today's world", "Let's dive
in"), and passive voice where active is clearer. Confirm the tone is a knowledgeable friend — direct,
warm, never preachy. Confirm every ruling has a citation and all Arabic has translation.

### Step 6 — SEO validation

Run this checklist; fix any CRITICAL/WARNING and re-check before continuing:

Frontmatter: title 30–60 chars · date & lastmod valid · summary 120–155 chars · 3–5 tags ·
`authors: ['sih-c']` · `draft: false` · `images` path matches the slug · `layout: 'PostLayout'` ·
3–5 self-contained faqs · **no single-quoted value contains an apostrophe**.

Body: no `# H1` · ≥3 `## H2` · H2→H3 hierarchy only · answer capsule present · word count meets the
type target in `seo-prompts.ts` (≥800 min) · ≥1 reference table where the topic supports it ·
≥2 Arabic phrases (script + translation) · ≥2 Quran/hadith citations · the correct tool embed +
`<ToolsBox />` present, neither inside a heading, no `standalone` prop · hero `<Image>` right after
frontmatter · 3–5 internal links (all valid) · 2–5 external links (all 200/301/302) · image file
exists, WebP, >10 KB.

### Step 7 — Submit to IndexNow

Notify Bing, Yandex, and participating engines (Google honors IndexNow too). Non-fatal on failure.

```bash
SLUG='[SLUG]' python3 - <<'PY'
import os, json, urllib.request, urllib.error
slug = os.environ['SLUG']; key = "58177d47b0dc5d40d790d5b276f81b2b"
payload = {"host":"www.islamful.com","key":key,
           "keyLocation":f"https://www.islamful.com/{key}.txt",
           "urlList":[f"https://www.islamful.com/blog/{slug}"]}
req = urllib.request.Request("https://api.indexnow.org/indexnow",
        data=json.dumps(payload).encode(),
        headers={"Content-Type":"application/json; charset=utf-8"})
try:
    r = urllib.request.urlopen(req, timeout=30)
    print(f"IndexNow: SUCCESS (HTTP {r.status})")
except urllib.error.HTTPError as e:
    print(f"IndexNow: FAILED (HTTP {e.code}: {e.read().decode()[:200]})")
except Exception as e:
    print(f"IndexNow: FAILED ({e})")
PY
```

HTTP 200/202 = success. On failure, warn but continue — the post is still published.

### Step 8 — Track

Append `"[keyword]","[slug]"` to `.claude/skills/islamful-blog-writer/written.csv` so the next run skips
it. (Quote fields to be CSV-safe.)

### Step 9 — Summary

```
BLOG POST PUBLISHED
===================
Keyword:    [keyword]
Type:       [article type]
File:       data/blog/en/[slug].mdx
Image:      public/static/images/blog/[slug].webp  (local, [palette])
Title:      [SEO title]
Summary:    [meta description]
Words:      [count]
Tool:       [HaramChecker | DuaCollection | PrayerTimes | none] + ToolsBox
Internal:   [count]   External: [count] (all 200)
SEO:        [X/Y checks passed]
IndexNow:   [SUCCESS (HTTP 200) | FAILED: reason]
Status:     READY

Next: run /islamful-blog-writer again for the next keyword.
```

---

## Hard rules

- Always auto-pick the next unwritten keyword unless a specific keyword is passed. Never re-write an
  existing or semantically duplicate post.
- Never stop because the queue is empty — research and append a fresh batch of keywords to
  `keywords.csv` (see Step 1), then continue. The pipeline should always be able to produce the next post.
- Follow `data/seo-prompts.ts` exactly — do not improvise article structure.
- Author is always `['sih-c']`.
- Never fabricate hadith, verses, scholar names, gradings, statistics, or URLs. Verify external links.
- Scan frontmatter for apostrophes in single-quoted YAML before saving — they break the build.
- The hero image is generated locally (no API, no key, no network) — like DeenUp. Never call Gemini.
- Every article embeds `<ToolsBox />` plus the one matching topical tool.
- Always append to `written.csv` after publishing so the queue advances.
