---
name: seo-write
description: Write an SEO-optimized MDX blog post for islamful.com using the prompts from data/seo-prompts.ts
---

# SEO Blog Writer

You write a complete, publish-ready MDX blog post for Islamful.com.

**Input**: `$ARGUMENTS` should be in the format: `KEYWORD: [keyword] | TYPE: [article-type]`
If only a keyword is given, auto-detect the type using the rules below.

## How the Prompt System Works

The SEO prompts live in `data/seo-prompts.ts`. Read this file first. It contains:

- **4 article type prompts**: `IS_X_HARAM_PROMPT`, `DUA_PROMPT`, `HOW_TO_GUIDE_PROMPT`, `EXPLAINER_PROMPT`
- Each is built from shared blocks: `STYLE_AND_TONE`, `ISLAMIC_CONTENT_RULES`, `SEO_FORMATTING`, `META_RULES`
- **Auto-detection**: `detectArticleType(topic)` maps keywords to article types via regex

**You ARE the LLM that these prompts are designed for.** Read the appropriate prompt from the file and follow its instructions exactly as if it were your system prompt. The prompt tells you:

- The article structure (sections, word counts)
- The tone and style rules
- Islamic content accuracy requirements
- SEO formatting rules
- The output format (JSON with `meta` + `content`)

## Steps

1. **Read `data/seo-prompts.ts`** to get the full prompt for the detected article type.

2. **Detect article type** from the keyword:
   - "haram", "halal", "permissible", "forbidden", "allowed", "sinful" → `is-x-haram`
   - "dua", "supplication", "prayer for", "dhikr" → `dua`
   - "how to", "guide", "step", "tutorial" → `how-to`
   - Everything else → `explainer`

3. **Check existing blog posts** in `data/blog/en/` to avoid duplicate content and find internal linking opportunities.

4. **Follow the prompt instructions exactly** to generate the article content. The prompt specifies:
   - Exact section structure
   - Word count targets per section
   - How to format Arabic text, hadith citations, scholar opinions
   - How to handle tables, Q&A blocks, quick answer boxes

5. **Embed tool components** where relevant. These React components are registered in MDXComponents and render interactively inside the blog post:

   For **"is-x-haram"** articles — embed the halal checker:

   ```mdx
   ## Check It Yourself

   Use our AI-powered halal checker to verify any food, ingredient, or practice:

   <HaramChecker lang="en" />
   ```

   For **"dua"** articles — embed the dua collection:

   ```mdx
   ## Browse More Duas

   Explore our full collection of authentic duas for every occasion:

   <DuaCollection lang="en" />
   ```

   For **"how-to"** articles about prayer — embed prayer times:

   ```mdx
   ## Check Your Prayer Times

   Get accurate prayer times for your location:

   <PrayerTimes lang="en" />
   ```

   Place the tool embed naturally within the article flow — typically near the end of the article, before the summary section. Only embed ONE tool per article. Only embed if genuinely relevant.

6. **Generate the MDX file** with this exact frontmatter structure:

   ```yaml
   ---
   title: '[SEO Title from meta — 30-60 chars]'
   date: '[today YYYY-MM-DD]'
   lastmod: '[today YYYY-MM-DD]'
   summary: '[Meta Description — 120-155 chars]'
   tags: ['tag1', 'tag2', 'tag3']
   authors: ['mathias-yussif']
   draft: false
   images: ['/static/images/blog/[slug].webp']
   layout: 'PostLayout'
   faqs:
     - question: '[FAQ question 1 from Common Misconceptions / FAQ section]'
       answer: '[Answer 1]'
     - question: '[FAQ question 2]'
       answer: '[Answer 2]'
     - question: '[FAQ question 3]'
       answer: '[Answer 3]'
   ---
   ```

   The `faqs` field generates FAQ rich results (schema.org FAQPage) automatically via ContentLayer.

   **Immediately after the frontmatter closing `---`**, add the hero image wrapped in a constrained div:

   ```mdx
   <div className="not-prose my-6 overflow-hidden rounded-xl">
     <Image
       src="/static/images/blog/[slug].webp"
       alt="[descriptive alt text for the article topic]"
       width={1200}
       height={630}
       priority
       className="h-[280px] w-full object-cover"
     />
   </div>
   ```

   The `h-[280px]` constrains the rendered height. `object-cover` crops the image to fill the space. `not-prose` prevents Tailwind typography styles from interfering.

7. **Write the file** to `data/blog/en/[slug].mdx`

8. **Internal linking requirements**:
   - Valid tool pages (always exist): `/haram-check`, `/prayer-times`, `/dua`, `/quran`
   - Link to these tool pages when genuinely relevant
   - For blog post links (`/blog/[slug]`): ONLY link to slugs that already exist as `.mdx` files in `data/blog/en/`. Check with `ls data/blog/en/` first.
   - **Never link to blog posts that don't exist yet** — this causes 404s
   - Aim for 3-5 internal links per article

9. **Link validation** — before writing the file, verify every link in your draft:

   **Internal `/blog/` links:**
   - Run `ls data/blog/en/` to get the list of existing posts
   - For each `/blog/[slug]` link, confirm `data/blog/en/[slug].mdx` exists
   - Remove or replace any `/blog/` links that point to non-existent posts
   - Tool page links (`/haram-check`, `/prayer-times`, `/dua`) are always valid — no check needed

   **External `https://` links:**
   - Do NOT guess or invent URLs. Find real, specific pages for the topic:
     1. **Hadith citations** — construct the sunnah.com URL from the collection and number:
        - Format: `https://sunnah.com/[collection]:[number]` (e.g. `https://sunnah.com/muslim:2102`)
        - Always verify the URL returns 200 before using it
     2. **Quran verses** — use `https://quran.com/[chapter]/[verse]` (e.g. `https://quran.com/2/195`)
     3. **Scholar fatwas** — find the specific IslamQA answer for the topic. IslamQA is a JS-rendered SPA so search results are not in the HTML. Instead, try known relevant answer IDs by checking URLs directly:
        ```bash
        curl -sIL --max-time 5 "https://islamqa.info/en/answers/[ID]" 2>/dev/null | awk 'NR==1{print $2}'
        ```
        Also check the page title to confirm relevance:
        ```bash
        curl -sL --max-time 8 "https://islamqa.info/en/answers/[ID]" 2>/dev/null | python3 -c "import sys,re; d=sys.stdin.read(); t=re.search(r'<title[^>]*>([^<]+)', d); print(t.group(1) if t else 'no title')"
        ```
        Only use the URL if the title clearly matches the topic. If no good match is found, skip IslamQA and use another source.
     4. **Other authoritative sources** — dar-alifta.org, e-cfr.org (European Council for Fatwa)
   - For every external URL, verify it's reachable before including it:
     ```bash
     curl -sIL --max-time 5 "https://example.com/page" 2>/dev/null | head -1
     ```
   - A `200` or `301/302` response = valid. A `404`, `403`, timeout = broken — find a different URL
   - Keep external links to 2-5 per article, each pointing to the specific relevant page

## Quality Checklist

Before writing the file, verify:

- [ ] H1 title is NOT in the content (ContentLayer adds it from frontmatter)
- [ ] Heading hierarchy: H2 → H3 only (no H1, no H4 under H2)
- [ ] Summary is 120-155 characters
- [ ] At least 3 internal links, all pointing to valid pages
- [ ] No `/blog/` links pointing to posts that don't exist in `data/blog/en/`
- [ ] All external links return HTTP 200/301/302 (verified with curl)
- [ ] Arabic text uses proper Arabic script (not transliteration alone)
- [ ] Every ruling cites a real Quran verse or hadith
- [ ] FAQs in frontmatter match the Q&A sections in the article
- [ ] Tool component embedded if relevant (HaramChecker, DuaCollection, or PrayerTimes) — do NOT pass `standalone` prop in blog embeds
- [ ] Hero image `<Image>` tag immediately after frontmatter
- [ ] No emojis
- [ ] Slug matches the `images` path
