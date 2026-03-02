---
name: seo-validate
description: Validate a blog post for technical SEO standards before publishing
---

# SEO Validator

Validate an Islamful blog post against technical SEO requirements.

**Input**: `$ARGUMENTS` should be the file path, e.g., `data/blog/en/is-music-haram.mdx`

## Steps

1. **Read the MDX file** at the given path.

2. **Check frontmatter** (all required):

   | Field     | Rule                              |
   | --------- | --------------------------------- |
   | `title`   | Present, 30-60 characters         |
   | `date`    | Present, valid YYYY-MM-DD         |
   | `lastmod` | Present, valid YYYY-MM-DD         |
   | `summary` | Present, 120-155 characters       |
   | `tags`    | Present, 3-5 tags                 |
   | `authors` | Present, non-empty array          |
   | `draft`   | Must be `false`                   |
   | `images`  | Present, path exists in `public/` |
   | `layout`  | Must be `PostLayout`              |
   | `faqs`    | Present, at least 2 FAQ items     |

3. **Check heading structure**:
   - NO H1 headings in content (title comes from frontmatter)
   - H2 → H3 hierarchy only (no H4 directly under H2, no skipping levels)
   - At least 3 H2 sections
   - No duplicate headings

4. **Check content quality**:
   - Word count: minimum 800 words
   - At least 3 internal links (links to `/prayer-times`, `/haram-check`, `/dua`, `/blog/*`, etc.)
   - At least 1 external link to a credible Islamic source (quran.com, sunnah.com, etc.)
   - No more than 5 external links
   - At least 1 Arabic text block (proper Arabic script, not transliteration)
   - At least 1 hadith or Quran citation

5. **Check tool embeds**:
   - For `is-x-haram` articles: `<HaramChecker` should be present
   - For `dua` articles: `<DuaCollection` should be present
   - For prayer-related `how-to` articles: `<PrayerTimes` should be present
   - Only ONE tool embed per article
   - Tool embed should NOT be inside a heading

6. **Check image**:
   - `images` frontmatter path points to a file that exists in `public/`
   - File size is reasonable (> 10KB, < 2MB)
   - File is WebP format

7. **Check slug consistency**:
   - Filename slug matches the `images` path slug
   - Slug is lowercase, hyphenated, keyword-rich
   - Under 60 characters

## Output Format

```
SEO VALIDATION REPORT: [filename]
=====================================

PASS/FAIL SUMMARY:
  [x] Frontmatter complete
  [x] Heading structure valid
  [ ] Missing: summary too short (98 chars, need 120-155)
  ...

SCORE: 14/16 checks passed

ISSUES TO FIX:
  1. [CRITICAL] summary is 98 characters — must be 120-155
  2. [WARNING] Only 2 internal links — aim for 3-5

READY TO PUBLISH: YES / NO
```

Categorize issues as:

- **CRITICAL**: Must fix before publishing (missing frontmatter, broken structure, no citations)
- **WARNING**: Should fix but not a blocker (low internal link count, word count slightly below target)
- **INFO**: Suggestions for improvement (could add more FAQs, consider a table)
