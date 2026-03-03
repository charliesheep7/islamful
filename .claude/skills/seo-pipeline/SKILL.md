---
name: seo-pipeline
description: Full SEO blog pipeline — auto-picks next unwritten keyword, writes article, generates image, validates SEO
---

# SEO Blog Pipeline

End-to-end pipeline for publishing an SEO-optimized blog post on Islamful.com.

**Default behavior**: Automatically fetches the keyword list from the Google Sheet, finds the next unwritten keyword, and runs the full pipeline. No arguments needed.

**Input**: `$ARGUMENTS` is optional:

- Empty (default) → auto-pick the next unwritten keyword, generate 1 article
- A number (e.g., `5`) → auto-pick and generate that many articles in sequence
- A specific keyword (e.g., `is music haram`) → use that keyword, generate 1 article

## Batch Mode

When `$ARGUMENTS` is a number N, run the **entire pipeline (Steps 1-6) N times in a loop**. Each iteration auto-picks the next unwritten keyword. Between iterations, re-fetch the existing blog posts list so the next keyword is correctly identified.

Show a progress header before each iteration:

```
========================================
ARTICLE [X/N] — Starting...
========================================
```

After all iterations, show a final batch summary:

```
BATCH COMPLETE: [X/N] articles published
=========================================
1. [slug-1] — [title] — Indexed: [Yes/No]
2. [slug-2] — [title] — Indexed: [Yes/No]
...
```

## Pipeline Steps

Execute these steps in order. After each step, briefly show the result before proceeding.

### Step 1: Pick Keyword

1. Fetch the Google Sheet CSV:
   ```
   curl -sL "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwZHPc3_pfyVs-r14W_O0i5PKpWVvOqggEZn6XYqu-tng9wpC8ZYIEJh6GMCf8vJqrGjPINd7c3TQ7/pub?gid=0&single=true&output=csv"
   ```
2. Parse the CSV — it has **two columns** (both headers are "Keyword"). Flatten both columns into a single keyword list by reading **column A top-to-bottom first, then column B top-to-bottom**. Skip the header row and any empty cells.
3. List existing blog posts in `data/blog/en/` to find which keywords are already written.
4. If `$ARGUMENTS` is empty, pick the **first keyword from the flattened list that doesn't have a matching MDX file**. A keyword like "is music haram" matches `is-music-haram.mdx`.
5. If `$ARGUMENTS` is a specific keyword, use that instead.
6. Auto-detect the article type:
   - "haram", "halal", "permissible", "forbidden", "allowed", "sinful" → `is-x-haram`
   - "dua", "supplication", "prayer for", "dhikr" → `dua`
   - "how to", "guide", "step", "tutorial" → `how-to`
   - Everything else → `explainer`

Show: the picked keyword, article type, and slug.

### Step 2: Write Article

1. Read `data/seo-prompts.ts` to get the full prompt for the detected article type.
2. Follow the prompt instructions exactly — it defines structure, tone, word count, citation rules, and output format.
3. Embed the relevant tool component where natural:
   - `is-x-haram` → `<HaramChecker lang="en" />`
   - `dua` → `<DuaCollection lang="en" />`
   - prayer-related `how-to` → `<PrayerTimes lang="en" />`
4. Write to `data/blog/en/[SLUG].mdx` with full frontmatter (title, date, summary, tags, authors, images, layout, faqs). Always use `authors: ['sih-c']` — never use any other author.

Show: filename, title, summary, word count, which tool was embedded.

### Step 3: Generate Hero Image

1. Read `IMAGE_PROMPT_RULES` from `data/seo-prompts.ts`.
2. Craft an image prompt following those rules (John Singer Sargent oil painting style, warm muted palette, no text/faces).
3. Call the Gemini image generation API using model `gemini-2.5-flash-image` (exact model ID — no other model is acceptable):
   ```bash
   curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=$GEMINI_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"Generate an image: [PROMPT]"}]}],"generationConfig":{"responseModalities":["TEXT","IMAGE"]}}'
   ```
4. Save to `public/static/images/blog/[SLUG].webp`.

Show: image path, file size.

### Step 4: Validate SEO

Run the full SEO validation checklist:

- Frontmatter completeness (title, summary 120-155 chars, tags, faqs, images path)
- Heading hierarchy (H2 → H3 only, no H1 in content)
- Word count (800+ words)
- Internal links (3-5)
- Arabic text present
- Hadith/Quran citations present
- Tool embed present and correct for article type
- Image file exists

If CRITICAL issues found, fix them and re-validate. Show the validation report.

### Step 5: Submit to Google Indexing API

After validation passes, submit the new blog URL to Google for indexing using the service account key at `google-indexing-key.json`.

1. Load the service account JSON from `google-indexing-key.json`
2. Create a JWT signed with the private key, requesting scope `https://www.googleapis.com/auth/indexing`
3. Exchange the JWT for an access token at `https://oauth2.googleapis.com/token`
4. POST to `https://indexing.googleapis.com/v3/urlNotifications:publish` with:
   ```json
   {
     "url": "https://islamful.com/blog/[SLUG]",
     "type": "URL_UPDATED"
   }
   ```
5. Use Python with the `cryptography` library for JWT signing:
   ```python
   from cryptography.hazmat.primitives import hashes, serialization
   from cryptography.hazmat.primitives.asymmetric import padding
   ```

Show: success/failure status and the submitted URL.

If the key file is missing or the API call fails, show a warning but do NOT fail the pipeline — the article is still published.

### Step 6: Summary

```
BLOG POST PUBLISHED
===================
Keyword:    [keyword]
Type:       [article-type]
File:       data/blog/en/[slug].mdx
Image:      public/static/images/blog/[slug].webp
Title:      [seo title]
Summary:    [meta description]
Word Count: [count]
Tool Embed: [HaramChecker / DuaCollection / PrayerTimes / None]
SEO Score:  [X/Y checks passed]
Indexed:    [Yes / No (reason)]
Status:     READY

Next: run /seo-pipeline again to generate the next article.
```

## Important

- Default is ALWAYS auto-pick next unwritten keyword — the user should just run `/seo-pipeline`
- NEVER skip validation
- If image generation fails, continue with placeholder and note it
- Follow `data/seo-prompts.ts` exactly — do not improvise article structure
- Check for existing posts with the same slug before writing
