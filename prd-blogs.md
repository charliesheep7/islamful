# PRD: Multilingual Blog System for DeenUp

**Last Updated:** October 26, 2025
**Status:** ✅ Implemented
**Version:** 2.0

---

## Overview

DeenUp's blog system supports both English and Arabic content with a clean, folder-based language structure. This document outlines how to create, manage, and publish blog posts in either or both languages.

---

## File Structure

### Current Organization

```
data/blog/
  ├── en/                          # English blog posts
  │   ├── top-10-islamic-practices.mdx
  │   ├── ramadan-guide.mdx
  │   └── ...
  └── ar/                          # Arabic blog posts (translations)
      ├── top-10-islamic-practices.mdx
      └── ...
```

### Key Principles

1. **Language detection is automatic** - based on folder location (`en/` or `ar/`)
2. **No `.ar` or `.en` suffixes** in filenames
3. **Same filename = translation pair** (e.g., both folders have `ramadan-guide.mdx`)
4. **No `lang:` field needed** in frontmatter

---

## Writing Blog Posts

### Scenario 1: English-Only Post (Most Common)

**File Location:** `data/blog/en/my-new-post.mdx`

**Frontmatter:**

```yaml
---
title: 'How to Stay Consistent with Islamic Habits'
date: '2025-10-26'
summary: 'Learn practical tips for maintaining daily Islamic practices'
tags: ['Islam', 'Habits', 'Deen']
draft: false
authors: ['mathias-yussif']
---
```

**Content:** Write in English using Markdown/MDX

**Result:**

- URL: `https://deenup.app/blog/my-new-post`
- No Arabic alternate link
- Appears in English blog listings
- Included in sitemap

---

### Scenario 2: Bilingual Post (English + Arabic Translation)

**Step 1 - Create English Version:**

File: `data/blog/en/ramadan-guide.mdx`

```yaml
---
title: 'Complete Guide to Ramadan 2025'
date: '2025-03-15'
summary: 'Everything you need to know about Ramadan: fasting, prayer, and spiritual growth'
tags: ['Ramadan', 'Fasting', 'Quran']
draft: false
authors: ['mathias-yussif']
---
# Complete Guide to Ramadan 2025

Ramadan is the ninth month of the Islamic calendar...
```

**Step 2 - Create Arabic Version:**

File: `data/blog/ar/ramadan-guide.mdx` ⚠️ **Same filename!**

```yaml
---
title: 'دليل شامل لشهر رمضان 2025'
date: '2025-03-15'
summary: 'كل ما تحتاج معرفته عن رمضان: الصيام والصلاة والنمو الروحي'
tags: ['Ramadan', 'Fasting', 'Quran']
draft: false
authors: ['mathias-yussif']
---
# دليل شامل لشهر رمضان 2025

رمضان هو الشهر التاسع من التقويم الإسلامي...
```

**Result:**

- English URL: `https://deenup.app/blog/ramadan-guide`
- Arabic URL: `https://deenup.app/ar/blog/ramadan-guide`
- Automatic hreflang links between them:
  ```html
  <link rel="alternate" hreflang="en" href="/blog/ramadan-guide" />
  <link rel="alternate" hreflang="ar" href="/ar/blog/ramadan-guide" />
  ```
- Both appear in their respective language blog listings
- Both included in sitemap

---

### Scenario 3: Arabic-Only Post (Rare)

**File Location:** `data/blog/ar/arabic-topic.mdx`

**Frontmatter:**

```yaml
---
title: 'موضوع خاص بالعربية'
date: '2025-10-26'
summary: 'موضوع متخصص للقراء العرب فقط'
tags: ['Islam', 'Arabic']
draft: false
authors: ['mathias-yussif']
---
```

**Result:**

- URL: `https://deenup.app/ar/blog/arabic-topic`
- No English alternate link
- Appears only in Arabic blog listings
- Included in sitemap

---

## Frontmatter Fields

### Required Fields

| Field     | Type    | Example                 | Description                                |
| --------- | ------- | ----------------------- | ------------------------------------------ |
| `title`   | string  | `'My Post Title'`       | Post title (use language of post)          |
| `date`    | date    | `'2025-10-26'`          | Publication date (YYYY-MM-DD)              |
| `summary` | string  | `'Post description...'` | Meta description for SEO                   |
| `tags`    | array   | `['Islam', 'Quran']`    | Post categories/tags                       |
| `draft`   | boolean | `false`                 | If `true`, post won't appear in production |
| `authors` | array   | `['mathias-yussif']`    | Author slugs from `data/authors/`          |

### Optional Fields

| Field          | Type   | Example                       | Description                             |
| -------------- | ------ | ----------------------------- | --------------------------------------- |
| `lastmod`      | date   | `'2025-10-27'`                | Last modified date                      |
| `images`       | array  | `['/static/images/post.jpg']` | Featured images                         |
| `layout`       | string | `'PostBanner'`                | Layout override (default: `PostLayout`) |
| `canonicalUrl` | string | `'https://...'`               | Canonical URL if reposting              |

### Deprecated Fields (Do NOT Use)

❌ `lang: en` or `lang: ar` - Language is auto-detected from folder path

---

## Technical Implementation

### Language Detection

**File:** `contentlayer.config.ts`

```typescript
lang: {
  type: 'string',
  resolve: (doc) => {
    // Detect language from folder path: blog/en/... or blog/ar/...
    const match = doc._raw.sourceFilePath.match(/blog\/(en|ar)\//)
    return match ? match[1] : 'en'
  },
}
```

### Slug Generation

Both `data/blog/en/my-post.mdx` and `data/blog/ar/my-post.mdx` generate:

- **Slug:** `my-post` (same for both)
- **Path:** `blog/my-post` (language prefix added at routing level)

```typescript
slug: {
  type: 'string',
  resolve: (doc) => {
    // blog/en/my-post.mdx → slug: "my-post"
    // blog/ar/my-post.mdx → slug: "my-post"
    return doc._raw.flattenedPath.replace(/^blog\/(en|ar)\//, '')
  },
}
```

### URL Routing

| Post Location           | Generated URL   |
| ----------------------- | --------------- |
| `data/blog/en/post.mdx` | `/blog/post`    |
| `data/blog/ar/post.mdx` | `/ar/blog/post` |

**Routes:**

- English: `app/blog/[...slug]/page.tsx` (no language prefix)
- Arabic: `app/[lang]/blog/[...slug]/page.tsx` (with `/ar/` prefix)

### Metadata & Hreflang

**Only posts with BOTH language versions get hreflang links:**

```typescript
// app/blog/[...slug]/page.tsx
const hasArabicVersion = allBlogs.some((p) => p.slug === post.slug && p.lang === 'ar')

alternates: hasArabicVersion
  ? {
      languages: {
        'x-default': `/blog/${post.slug}`,
        en: `/blog/${post.slug}`,
        ar: `/ar/blog/${post.slug}`,
      },
    }
  : undefined
```

---

## SEObot Integration

### English-Only Posts from SEObot

SEObot posts are **automatically fetched** and merged with ContentLayer posts:

- They only exist in **English**
- No Arabic versions are generated
- No `/ar/` URLs created for them
- Appear in English blog listings and sitemap only

**Examples of SEObot posts:**

- `https://deenup.app/blog/struggling-fajr-solutions-work`
- `https://deenup.app/blog/islamic-goal-tracking-apps-guide`

### How to Identify SEObot Posts

```typescript
post.isSeoBotPost // true for SEObot, false for ContentLayer
```

---

## Tags System

### Tag Pages Created

| URL              | Shows Posts From                              |
| ---------------- | --------------------------------------------- |
| `/tags/islam`    | English posts with tag "Islam" + SEObot posts |
| `/ar/tags/islam` | Arabic posts with tag "Islam"                 |

### Tag Slugification

Tags are automatically slugified:

- Input: `'Best Practices'`
- URL: `/tags/best-practices`

---

## Sitemap Generation

**File:** `app/sitemap.ts`

### Sitemap Logic

```typescript
// English posts (including SEObot)
const englishPosts = allBlogs.filter((p) => p.lang === 'en' || !p.lang)
// → https://deenup.app/blog/post-name

// Arabic posts (only those that exist)
const arabicPosts = allBlogs.filter((p) => p.lang === 'ar')
// → https://deenup.app/ar/blog/post-name

// SEObot posts (English only)
const seoBotPosts = await getSeoBotPosts()
// → https://deenup.app/blog/seobot-post
```

**Result:** Only URLs that actually exist are added to sitemap.

---

## Migration Summary (v1 → v2)

### What Changed

| Before (v1)               | After (v2)                |
| ------------------------- | ------------------------- |
| `data/blog/post.mdx`      | `data/blog/en/post.mdx`   |
| `data/blog/post.ar.mdx`   | `data/blog/ar/post.mdx`   |
| `lang: ar` in frontmatter | Auto-detected from folder |
| `/ar/blog/post.ar` URL    | `/ar/blog/post` URL       |
| Manual language tracking  | Folder-based organization |

### Issues Fixed

1. ✅ Removed `.ar` suffix from URLs (SEO issue)
2. ✅ Fixed 404s for non-existent Arabic versions of SEObot posts
3. ✅ Added missing tags pages (`/tags/[tag]` and `/ar/tags/[tag]`)
4. ✅ Only generate hreflang for posts that exist in both languages
5. ✅ Clean sitemap with only real URLs

---

## Checklist for New Blog Posts

### Before Publishing

- [ ] Created file in correct language folder (`en/` or `ar/`)
- [ ] All required frontmatter fields filled
- [ ] `draft: false` when ready to publish
- [ ] If bilingual: both files have same filename
- [ ] If bilingual: both files have same `date`
- [ ] Tags are relevant and consistent
- [ ] Author slug exists in `data/authors/`
- [ ] Images (if any) uploaded to `/public/static/images/`

### After Publishing

- [ ] Run `npm run build` to verify no errors
- [ ] Check post appears on blog listing page
- [ ] Verify URL structure is correct
- [ ] Test both desktop and mobile views
- [ ] Submit sitemap to Google Search Console (automatic on next crawl)

---

## Common Mistakes to Avoid

### ❌ DON'T Do This

```yaml
# Don't add lang field - it's auto-detected
---
title: 'My Post'
lang: en # ❌ REMOVE THIS
---
```

```
# Don't use .ar suffix in filename
data/blog/en/my-post.ar.mdx  # ❌ WRONG
```

```
# Don't put Arabic in English folder
data/blog/en/arabic-post.mdx  # ❌ WRONG (put in ar/ folder)
```

### ✅ DO This Instead

```yaml
# Clean frontmatter
---
title: 'My Post'
date: '2025-10-26'
summary: 'Description'
tags: ['Islam']
draft: false
authors: ['mathias-yussif']
---
```

```
# Correct file structure
data/blog/en/my-post.mdx  # ✅ CORRECT
data/blog/ar/my-post.mdx  # ✅ CORRECT (translation)
```

---

## FAQ

### Q: Can I have different slugs for English vs Arabic?

**A:** Yes! Use different filenames:

- `data/blog/en/prayer-guide.mdx` → `/blog/prayer-guide`
- `data/blog/ar/dalil-salah.mdx` → `/ar/blog/dalil-salah`

They won't be linked as translations (no hreflang).

### Q: What happens if I only translate some posts?

**A:** Totally fine! Only posts with matching filenames get linked. Others appear as language-specific.

### Q: Can I draft a post in one language but not the other?

**A:** Yes! Use `draft: true` in one version:

- `en/post.mdx` → `draft: false` (published)
- `ar/post.mdx` → `draft: true` (hidden, work in progress)

### Q: Do SEObot posts support Arabic?

**A:** No, SEObot posts are English-only. They don't generate `/ar/` URLs.

### Q: How do I unpublish a post?

**A:** Set `draft: true` in frontmatter, or delete the file.

---

## Maintenance

### Adding a New Language (Future)

To add French (`fr`):

1. Create `data/blog/fr/` folder
2. Update `contentlayer.config.ts` regex: `/blog\/(en|ar|fr)\//`
3. Add French routes: `app/[lang]/blog/[...slug]/page.tsx`
4. Update middleware to support `fr` locale
5. Add French to sitemap generation

---

## Support

**Issues?** Check:

1. File is in correct folder (`en/` or `ar/`)
2. Frontmatter has all required fields
3. Run `npm run build` to see errors
4. Check `.contentlayer/generated/` for processed files

**Questions?** Contact: mathias@deenup.app
