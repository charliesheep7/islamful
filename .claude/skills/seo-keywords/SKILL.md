---
name: seo-keywords
description: Fetch SEO keywords from the published Google Sheet and pick the next one to write about
---

# SEO Keyword Picker

You fetch the Islamful keyword list from a published Google Sheet CSV and help the user pick the next keyword to write about.

## Steps

1. **Fetch the CSV** by running:

   ```
   curl -sL "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwZHPc3_pfyVs-r14W_O0i5PKpWVvOqggEZn6XYqu-tng9wpC8ZYIEJh6GMCf8vJqrGjPINd7c3TQ7/pub?gid=0&single=true&output=csv"
   ```

2. **Parse the CSV** — it has two columns (both headers are "Keyword"). Flatten both columns into a single keyword list by reading **column A top-to-bottom first, then column B top-to-bottom**. Skip the header row and any empty cells.

3. **Check which keywords already have blog posts** by listing existing MDX files in `data/blog/en/` and comparing slugs. A keyword like "is music haram" would match a file named `is-music-haram.mdx`.

4. **Show the user**:
   - Total keywords in the sheet
   - How many already have blog posts
   - The remaining unwritten keywords as a numbered list
   - Auto-detect the article type for each using this logic:
     - Contains "haram", "halal", "permissible", "forbidden", "allowed", "sinful" → `is-x-haram`
     - Contains "dua", "supplication", "prayer for", "dhikr" → `dua`
     - Contains "how to", "guide", "step", "tutorial" → `how-to`
     - Everything else → `explainer`

5. **If `$ARGUMENTS` is provided**, treat it as the chosen keyword and output just that keyword with its detected article type. Otherwise, show the full list and ask the user to pick one.

## Output Format

When a keyword is selected, output:

```
KEYWORD: [the keyword]
ARTICLE_TYPE: [is-x-haram | dua | how-to | explainer]
SLUG: [url-friendly-slug]
```
