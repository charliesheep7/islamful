# Multilingual Implementation PRD — DeenUp

**Version:** 3.0
**Date:** 2025-10-27
**Status:** Production - SEO Optimized with Independent Canonical Strategy

---

## 1. Overview

This document describes the bilingual (English/Arabic) implementation for DeenUp, following Next.js 15 best practices with **Strategy B: Independent Canonical Languages** for optimal SEO in both English and Arabic markets.

**DeenUp-Specific Requirements:**

- Full RTL (Right-to-Left) support for Arabic
- **Independent canonical pages** - Each language version is treated as unique content
- Bilingual focus on English and Arabic for global Muslim audience
- SEO optimization targeting both English-speaking and Arabic-speaking Muslims
- Unique content for each language (not simple translations)

---

## 2. SEO Strategy: Independent Canonical Languages (Strategy B)

### 2.1 Why Strategy B?

DeenUp uses **Strategy B** because:

- ✅ Arabic content is **independent**, not just translations
- ✅ Arabic market is huge and deserves dedicated content
- ✅ Different blog topics for different audiences
- ✅ Each language targets different search queries

### 2.2 How It Works

**English Pages (Default Locale):**

```html
<link rel="canonical" href="https://deenup.app/" />
<link rel="alternate" hreflang="en" href="https://deenup.app/" />
<link rel="alternate" hreflang="ar" href="https://deenup.app/ar" />
<link rel="alternate" hreflang="x-default" href="https://deenup.app/" />
```

**Arabic Pages:**

```html
<link rel="canonical" href="https://deenup.app/ar" />
<link rel="alternate" hreflang="en" href="https://deenup.app/" />
<link rel="alternate" hreflang="ar" href="https://deenup.app/ar" />
<!-- NO x-default on Arabic pages to avoid canonical conflicts -->
```

**Key Points:**

- ✅ Both `/` and `/ar` are canonical (independent content)
- ✅ x-default only on English pages (default locale)
- ✅ hreflang on both for language targeting
- ✅ Sitemap includes both language versions

---

## 3. Technical Architecture

### 3.1 Current File Structure

```
app/
├── [lang]/                         # Arabic locale routes
│   ├── dictionaries.ts            # Dictionary loader
│   ├── DictionaryProvider.tsx     # Client context
│   ├── layout.tsx                 # Arabic layout (dir="rtl")
│   ├── page.tsx                   # Arabic homepage (unique content)
│   ├── blog/
│   │   ├── page.tsx              # Arabic blog listing
│   │   └── [...slug]/page.tsx    # Arabic blog posts
│   ├── privacy/
│   │   └── page.tsx              # Arabic privacy policy (unique content)
│   ├── terms/
│   │   └── page.tsx              # Arabic terms of service (unique content)
│   └── about/
│       └── page.tsx              # Arabic about page
├── layout.tsx                     # Root layout (handles English)
├── page.tsx                       # English homepage
├── blog/
│   ├── page.tsx                  # English blog listing
│   └── [...slug]/page.tsx        # English blog posts
├── privacy/page.tsx              # English privacy policy
├── terms/page.tsx                # English terms of service
├── about/page.tsx                # English about page
├── seo.tsx                       # SEO utilities (buildLanguageAlternates)
├── sitemap.ts                    # Dynamic sitemap generator
└── robots.ts                     # robots.txt generator

data/
└── blog/
    ├── en/                       # English blog posts
    │   ├── post-1.mdx
    │   └── post-2.mdx
    └── ar/                       # Arabic blog posts
        ├── post-1.mdx
        └── post-2.mdx

components/
└── RTLHandler.tsx                # Client component for RTL navigation handling

dictionaries/
├── en.json                       # English UI translations
└── ar.json                       # Arabic UI translations
```

### 3.2 SEO Utilities (app/seo.tsx)

**Core Functions:**

```typescript
// Build language alternates with proper canonical strategy
buildLanguageAlternates(
  path: string,
  options?: {
    includeArabic?: boolean
    includeEnglish?: boolean
    xDefault?: 'en' | 'ar' | string
    englishPath?: string
    arabicPath?: string
    canonical?: string
    currentLanguage?: 'en' | 'ar'  // IMPORTANT: Controls x-default
  }
): Metadata['alternates']

// Generate page metadata with localized content
genPageMetadata({
  title: string
  description?: string
  image?: string
  alternates?: Metadata['alternates']
  ...rest
}): Metadata
```

**Key Implementation Detail:**

```typescript
// x-default ONLY appears on English pages (currentLanguage === 'en')
// This prevents canonical conflicts with Arabic pages
if (currentLanguage === 'en') {
  languages['x-default'] = normalizedEnglish
}
```

---

## 4. Adding New Pages - Step-by-Step Guide

### 4.1 Rule: Always Create Both Versions

When adding a new page, you **MUST** create:

1. English version in `app/`
2. Arabic version in `app/[lang]/`
3. Unique content for each (not just translations)

### 4.2 Example: Adding a "Contact" Page

**Step 1: Create English Version**

`app/contact/page.tsx`:

```typescript
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
import SectionContainer from '@/components/SectionContainer'

export const metadata = genPageMetadata({
  title: 'Contact Us',
  description: 'Get in touch with the DeenUp team for support and inquiries.',
  alternates: buildLanguageAlternates('/contact'), // currentLanguage defaults to 'en'
})

export default function ContactPage() {
  return (
    <SectionContainer>
      <div className="prose dark:prose-invert max-w-none py-8">
        <h1>Contact Us</h1>
        <p>Email: support@deenup.app</p>
        {/* English content here */}
      </div>
    </SectionContainer>
  )
}
```

**Step 2: Create Arabic Version**

`app/[lang]/contact/page.tsx`:

```typescript
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
import SectionContainer from '@/components/SectionContainer'

export const metadata = genPageMetadata({
  title: 'اتصل بنا',
  description: 'تواصل مع فريق ديّن أب للدعم والاستفسارات.',
  alternates: buildLanguageAlternates('/contact', { currentLanguage: 'ar' }), // Important!
})

export function generateStaticParams() {
  return [{ lang: 'ar' }] // Required for static generation
}

export default async function ContactPageAr({
  params,
}: {
  params: Promise<{ lang: 'ar' }>
}) {
  return (
    <SectionContainer>
      <div className="prose dark:prose-invert max-w-none py-8" dir="rtl">
        <h1>اتصل بنا</h1>
        <p>البريد الإلكتروني: support@deenup.app</p>
        {/* Arabic content here */}
      </div>
    </SectionContainer>
  )
}
```

**Step 3: Add to Sitemap**

Update `app/sitemap.ts`:

```typescript
const routes = ['', 'blog', 'privacy', 'terms', 'contact'].map((route) => ({
  // Add 'contact'
  url: `${siteUrl}/${route}`,
  lastModified: new Date().toISOString().split('T')[0],
}))

const arabicRoutes = ['', 'blog', 'privacy', 'terms', 'contact'].map((route) => ({
  // Add 'contact'
  url: `${siteUrl}/ar${route === '' ? '' : `/${route}`}`,
  lastModified: new Date().toISOString().split('T')[0],
}))
```

**Step 4: Run Prettier**

```bash
npx prettier --write "app/contact/page.tsx" "app/[lang]/contact/page.tsx"
```

**Step 5: Test Build**

```bash
npm run build
```

### 4.3 Checklist for New Pages

- [ ] English page created in `app/{page}/page.tsx`
- [ ] Arabic page created in `app/[lang]/{page}/page.tsx`
- [ ] Both have unique `title` and `description`
- [ ] Arabic page uses `currentLanguage: 'ar'` in `buildLanguageAlternates()`
- [ ] Arabic page has `generateStaticParams()` returning `[{ lang: 'ar' }]`
- [ ] Arabic content wrapped in `<div dir="rtl">`
- [ ] Both pages added to sitemap.ts (English and Arabic routes)
- [ ] Run prettier on both files
- [ ] Test build succeeds

---

## 5. Adding New Blog Posts - Step-by-Step Guide

### 5.1 Blog Post Structure

Blog posts are stored in `data/blog/` organized by language:

```
data/blog/
├── en/
│   └── my-post-slug.mdx
└── ar/
    └── my-post-slug.mdx
```

### 5.2 Example: Adding a Blog Post

**Step 1: Create English Post**

`data/blog/en/ramadan-preparation-guide.mdx`:

```mdx
---
title: 'Complete Guide to Preparing for Ramadan 2025'
date: '2025-03-01'
lastmod: '2025-03-01'
tags: ['Ramadan', 'Fasting', 'Preparation', 'Guide']
draft: false
summary: 'Everything you need to know to prepare spiritually and physically for the blessed month of Ramadan.'
images: ['/static/images/ramadan-prep.jpg']
authors: ['mathias-yussif']
layout: 'PostLayout'
---

## Introduction

Ramadan is approaching, and proper preparation is key to maximizing...

{/* English content here */}
```

**Step 2: Create Arabic Post (Optional but Recommended)**

`data/blog/ar/ramadan-preparation-guide.mdx`:

```mdx
---
title: 'دليل شامل للاستعداد لرمضان 2025'
date: '2025-03-01'
lastmod: '2025-03-01'
tags: ['رمضان', 'صيام', 'استعداد', 'دليل']
draft: false
summary: 'كل ما تحتاج معرفته للاستعداد روحيًا وجسديًا لشهر رمضان المبارك.'
images: ['/static/images/ramadan-prep.jpg']
authors: ['mathias-yussif']
layout: 'PostLayout'
---

## مقدمة

يقترب شهر رمضان، والاستعداد السليم هو مفتاح الاستفادة القصوى...

{/* Arabic content here */}
```

**Step 3: ContentLayer Will Auto-Detect**

Your `contentlayer.config.ts` automatically:

- Detects language from folder (`/en/` or `/ar/`)
- Generates correct paths (`blog/ramadan-preparation-guide`)
- Adds `lang` field to frontmatter
- Includes in sitemap when you rebuild

**Step 4: Build & Verify**

```bash
npm run build
```

Verify these URLs work:

- `/blog/ramadan-preparation-guide` (English)
- `/ar/blog/ramadan-preparation-guide` (Arabic)

### 5.3 Blog Post Best Practices

**Frontmatter Requirements:**

- ✅ `title` - Unique for each language
- ✅ `date` - Same for both versions
- ✅ `summary` - Different for SEO optimization
- ✅ `tags` - Translate for Arabic, keep English for English
- ✅ `draft: false` - Must be false to appear on site
- ✅ `authors` - Array of author slugs (e.g., `['mathias-yussif']`)

**Content Guidelines:**

- Write **unique content**, not just translations
- Arabic posts can cover different topics than English
- Use RTL-friendly formatting (markdown handles this automatically)
- Add images that work for both audiences

**Slug Guidelines:**

- Keep the same slug for related posts: `ramadan-guide.mdx` (both languages)
- This helps with:
  - Easier content management
  - Language switcher (future feature)
  - URL consistency

---

## 6. RTL (Right-to-Left) Support

### 6.1 Automatic RTL Implementation

DeenUp uses a **dual-approach RTL system** that handles both initial page loads and client-side navigation:

#### Initial Page Load (SEO-friendly)

Inline script in `<head>` detects Arabic URLs and sets `dir="rtl"` immediately:

```typescript
// app/layout.tsx
<script
  dangerouslySetInnerHTML={{
    __html: `
      (function() {
        const path = window.location.pathname;
        const isArabic = path.startsWith('/ar/') || path === '/ar';
        if (isArabic) {
          document.documentElement.setAttribute('lang', 'ar');
          document.documentElement.setAttribute('dir', 'rtl');
        }
      })();
    `,
  }}
/>
```

#### Client-Side Navigation

`RTLHandler` component listens to route changes and updates HTML attributes:

```typescript
// components/RTLHandler.tsx
'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function RTLHandler() {
  const pathname = usePathname()

  useEffect(() => {
    const isArabic = pathname.startsWith('/ar/') || pathname === '/ar'

    if (isArabic) {
      document.documentElement.setAttribute('lang', 'ar')
      document.documentElement.setAttribute('dir', 'rtl')
    } else {
      document.documentElement.setAttribute('lang', 'en')
      document.documentElement.setAttribute('dir', 'ltr')
    }
  }, [pathname])

  return null
}
```

**Why Both Approaches?**

- ✅ Inline script ensures RTL on first load (prevents FOUC - Flash of Unstyled Content)
- ✅ Client component handles Next.js client-side navigation
- ✅ SEO-friendly (crawlers see correct `dir` attribute immediately)
- ✅ Works seamlessly when navigating from homepage to Arabic pages

### 6.2 Tailwind RTL Classes

DeenUp uses **Tailwind v4** which has built-in RTL support via the `rtl:` variant:

**PostLayout RTL Classes:**

```typescript
// layouts/PostLayout.tsx

// Author section - spacing reverses in RTL
<ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-y-8 xl:space-x-0 sm:rtl:space-x-reverse">
  <li className="flex items-center space-x-3 text-start rtl:space-x-reverse">
    {/* Content */}
  </li>
</ul>

// Navigation - arrows flip direction
{isArabic ? 'العودة إلى المدونة →' : '← Back to the blog'}
```

**Key RTL Classes Used:**

| Class                 | Purpose                                            |
| --------------------- | -------------------------------------------------- |
| `rtl:space-x-reverse` | Reverses horizontal spacing between flex items     |
| `text-start`          | Logical property for text alignment (auto RTL/LTR) |
| `ltr:pl-[calc(...)]`  | Left padding for LTR scrollbar compensation        |
| `rtl:pr-[calc(...)]`  | Right padding for RTL scrollbar compensation       |

### 6.3 Component-Level RTL Adaptations

**PostLayout.tsx Localization:**

The blog post layout adapts content based on language:

```typescript
const isArabic = lang === 'ar'

// Date formatting
{new Date(date).toLocaleDateString(
  isArabic ? 'ar-SA' : siteMetadata.locale,
  postDateTemplate
)}

// Labels
<dt className="sr-only">{isArabic ? 'نُشر في' : 'Published on'}</dt>
<dt className="sr-only">{isArabic ? 'المؤلفون' : 'Authors'}</dt>
<Link>{isArabic ? 'ناقش على X' : 'Discuss on X'}</Link>

// Navigation order (prev/next swap for RTL reading direction)
const firstArticle = isArabic ? next : prev
const secondArticle = isArabic ? prev : next
```

### 6.4 Logical CSS Properties

**Use Tailwind's Logical Properties:**

```css
/* ✅ Good - Works with RTL */
.component {
  ms-4    /* margin-inline-start (auto left/right based on dir) */
  me-4    /* margin-inline-end */
  ps-4    /* padding-inline-start */
  pe-4    /* padding-inline-end */
  text-start  /* logical text-align */
}

/* ❌ Bad - Breaks in RTL */
.component {
  ml-4    /* margin-left (always left, ignores RTL) */
  mr-4    /* margin-right (always right, ignores RTL) */
  text-left  /* always left-aligned */
}
```

### 6.5 Testing RTL

**Manual Testing:**

1. Visit English homepage: `http://localhost:3000/`
2. Navigate to Arabic blog: Click "المدونة" or go to `/ar/blog`
3. Check that layout **automatically switches to RTL** without refresh
4. Inspect `<html>` element - should show `dir="rtl"` and `lang="ar"`
5. Verify:
   - ✅ Text flows right-to-left
   - ✅ Author avatar on RIGHT side
   - ✅ Spacing reversed (margins, padding)
   - ✅ Navigation labels in Arabic
   - ✅ Arrows point correct direction (→ for "back")

**DevTools Verification:**

```javascript
// Check in browser console
document.documentElement.getAttribute('dir') // Should be "rtl"
document.documentElement.getAttribute('lang') // Should be "ar"
```

**Common Issues:**

| Issue                                 | Cause                    | Fix                                              |
| ------------------------------------- | ------------------------ | ------------------------------------------------ |
| RTL not working on navigation         | Cache not cleared        | Hard refresh (Cmd+Shift+R)                       |
| Layout doesn't switch when navigating | `RTLHandler` not mounted | Check `app/layout.tsx` includes `<RTLHandler />` |
| FOUC (flash of wrong direction)       | Inline script missing    | Verify `<script>` in `<head>` before body        |

---

## 7. Sitemap Configuration

### 7.1 Current Implementation

`app/sitemap.ts` generates a dynamic sitemap including:

1. **English main routes:** `/`, `/blog`, `/privacy`, `/terms`
2. **Arabic main routes:** `/ar`, `/ar/blog`, `/ar/privacy`, `/ar/terms`
3. **English blog posts:** All posts in `data/blog/en/`
4. **Arabic blog posts:** All posts in `data/blog/ar/`
5. **SEObot posts:** AI-generated English posts (if enabled)

**Code Structure:**

```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = siteMetadata.siteUrl

  // English blog routes
  const blogRoutes = allBlogs
    .filter((post) => !post.draft && (post.lang === 'en' || !post.lang))
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  // Arabic blog routes
  const localizedBlogRoutes = allBlogs
    .filter((post) => !post.draft && post.lang === 'ar')
    .map((post) => ({
      url: `${siteUrl}/ar/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  // English main routes
  const routes = ['', 'blog', 'privacy', 'terms'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  // Arabic main routes
  const arabicRoutes = ['', 'blog', 'privacy', 'terms'].map((route) => ({
    url: `${siteUrl}/ar${route === '' ? '' : `/${route}`}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...arabicRoutes, ...blogRoutes, ...localizedBlogRoutes]
}
```

### 7.2 Adding New Routes to Sitemap

When you add a new page, update **both** arrays:

```typescript
// Add to English routes
const routes = ['', 'blog', 'privacy', 'terms', 'contact'].map(...)

// Add to Arabic routes
const arabicRoutes = ['', 'blog', 'privacy', 'terms', 'contact'].map(...)
```

---

## 8. Metadata Best Practices

### 8.1 Required Metadata for All Pages

Every page MUST have:

```typescript
export const metadata = genPageMetadata({
  title: 'Page Title', // Required
  description: 'Unique page description', // Required for SEO
  alternates: buildLanguageAlternates('/path', {
    currentLanguage: 'ar', // 'ar' for Arabic pages, 'en' (default) for English
  }),
})
```

### 8.2 English Page Template

```typescript
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Your Page Title',
  description: 'Your unique English description here.',
  alternates: buildLanguageAlternates('/your-page'), // Default is English
})

export default function YourPage() {
  return <div>{/* Content */}</div>
}
```

### 8.3 Arabic Page Template

```typescript
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'عنوان صفحتك',
  description: 'وصف فريد باللغة العربية هنا.',
  alternates: buildLanguageAlternates('/your-page', {
    currentLanguage: 'ar' // CRITICAL: Must specify for Arabic
  }),
})

export function generateStaticParams() {
  return [{ lang: 'ar' }] // Required for static generation
}

export default async function YourPageAr({
  params,
}: {
  params: Promise<{ lang: 'ar' }>
}) {
  return (
    <div dir="rtl">{/* Arabic content */}</div>
  )
}
```

### 8.4 Common Mistakes to Avoid

❌ **WRONG:**

```typescript
// Arabic page WITHOUT currentLanguage: 'ar'
alternates: buildLanguageAlternates('/page') // Will have x-default conflict!
```

✅ **CORRECT:**

```typescript
// Arabic page WITH currentLanguage: 'ar'
alternates: buildLanguageAlternates('/page', { currentLanguage: 'ar' })
```

❌ **WRONG:**

```typescript
// Forgetting generateStaticParams on Arabic pages
export default function PageAr() {
  /* Won't be statically generated! */
}
```

✅ **CORRECT:**

```typescript
export function generateStaticParams() {
  return [{ lang: 'ar' }]
}
```

---

## 9. Redirects for Legacy URLs

### 9.1 Current Redirects (next.config.js)

```javascript
async redirects() {
  return [
    // Redirect old .ar extension URLs to correct Arabic routes
    {
      source: '/blog/:slug.ar',
      destination: '/ar/blog/:slug',
      permanent: true,
    },
    {
      source: '/ar/blog/:slug.ar',
      destination: '/ar/blog/:slug',
      permanent: true,
    },
  ]
}
```

### 9.2 When to Add Redirects

Add redirects when:

- You change URL structure
- You rename pages
- Google crawled incorrect URLs
- You migrate from old structure

**Format:**

```javascript
{
  source: '/old-url',
  destination: '/new-url',
  permanent: true, // 301 redirect (passes SEO authority)
}
```

---

## 10. Testing Checklist

### 10.1 Before Every Deployment

- [ ] **Build succeeds:** `npm run build`
- [ ] **No TypeScript errors**
- [ ] **No ESLint errors**
- [ ] **Prettier formatted:** Run on all modified files

### 10.2 SEO Validation

- [ ] **Check hreflang tags:** View source on `/ar` page
  - Should have `hreflang="en"` and `hreflang="ar"`
  - Should NOT have `x-default` on Arabic pages
  - Should have `x-default` on English pages
- [ ] **Check canonical tags:** Each page should have correct canonical
  - English: `<link rel="canonical" href="https://deenup.app/" />`
  - Arabic: `<link rel="canonical" href="https://deenup.app/ar" />`
- [ ] **Check sitemap:** Visit `/sitemap.xml`
  - Should include both English and Arabic routes
  - Should include all blog posts

### 10.3 Content Validation

- [ ] **Unique titles:** No duplicate titles across pages
- [ ] **Unique descriptions:** Each page has unique meta description
- [ ] **RTL works:** Arabic pages display correctly right-to-left
- [ ] **Links work:** All internal links navigate correctly
- [ ] **Images load:** All images display on both languages

### 10.4 Performance Validation

- [ ] **Lighthouse score:** >90 on both English and Arabic pages
- [ ] **Load time:** <2s on both languages
- [ ] **No console errors:** Check browser console

---

## 11. Common Issues & Solutions

### 11.1 Hreflang Conflicts

**Issue:** Semrush reports "Conflicting hreflang and rel=canonical"

**Cause:** Arabic page has x-default pointing to English while canonical points to itself

**Solution:** Ensure Arabic pages use `currentLanguage: 'ar'`:

```typescript
alternates: buildLanguageAlternates('/path', { currentLanguage: 'ar' })
```

### 11.2 Duplicate Meta Descriptions

**Issue:** Google reports duplicate descriptions

**Cause:** Missing or shared descriptions between pages

**Solution:** Add unique descriptions to all pages:

```typescript
export const metadata = genPageMetadata({
  title: 'Unique Title',
  description: 'Unique description specific to this page', // Required!
  alternates: buildLanguageAlternates('/path'),
})
```

### 11.3 Pages Not in Sitemap

**Issue:** New pages don't appear in sitemap

**Cause:** Forgot to add route to sitemap.ts

**Solution:** Add to both English and Arabic route arrays in `app/sitemap.ts`

### 11.4 Build Fails with Prettier Errors

**Issue:** `prettier/prettier` errors in build

**Cause:** Code not formatted

**Solution:**

```bash
npx prettier --write "path/to/file.tsx"
```

Or format all modified files:

```bash
npx prettier --write "app/**/*.tsx"
```

---

## 12. Future Enhancements

### 12.1 Short-term Roadmap

- [ ] Language switcher component (preserve current page when switching)
- [ ] "This page is available in Arabic/English" banner
- [ ] Automatic Arabic slug generation for blog posts
- [ ] Translation status dashboard

### 12.2 Long-term Roadmap

- [ ] Add more languages (Urdu, Turkish, French)
- [ ] Translation management system
- [ ] Automatic translation suggestions for new content
- [ ] Language-specific analytics tracking

---

## 13. Quick Reference

### 13.1 Key Files

| File                        | Purpose                                                  |
| --------------------------- | -------------------------------------------------------- |
| `app/seo.tsx`               | SEO utilities (buildLanguageAlternates, genPageMetadata) |
| `app/sitemap.ts`            | Dynamic sitemap generator                                |
| `app/robots.ts`             | robots.txt generator                                     |
| `app/layout.tsx`            | Root layout (English + RTL script injection)             |
| `app/[lang]/layout.tsx`     | Arabic layout wrapper                                    |
| `components/RTLHandler.tsx` | Client-side RTL handler for navigation                   |
| `layouts/PostLayout.tsx`    | Blog post layout with RTL adaptations                    |
| `contentlayer.config.ts`    | Blog post processing and language detection              |
| `middleware.ts`             | Locale detection and header injection                    |
| `next.config.js`            | Redirects and Next.js config                             |

### 13.2 Common Commands

```bash
# Build for production
npm run build

# Format code
npx prettier --write "path/to/file.tsx"

# Check sitemap
curl http://localhost:3000/sitemap.xml

# Test Arabic page
curl http://localhost:3000/ar
```

### 13.3 Environment Variables

```bash
# Required for SEObot integration
SEOBOT_API_KEY=your_key_here

# Site URL (used in sitemap and metadata)
NEXT_PUBLIC_SITE_URL=https://deenup.app
```

---

## 14. Support & Resources

### 14.1 Documentation

- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Google hreflang Guidelines](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Contentlayer Docs](https://contentlayer.dev/docs)

### 14.2 Tools

- [Google Search Console](https://search.google.com/search-console) - Monitor SEO
- [Semrush](https://www.semrush.com/) - SEO auditing
- [hreflang Testing Tool](https://technicalseo.com/tools/hreflang/) - Validate hreflang tags

### 14.3 Internal Support

For questions about this implementation:

1. Check this PRD first
2. Review the code in `app/seo.tsx`
3. Test locally before asking
4. Open an issue with reproduction steps

---

## 15. Version History

| Version | Date       | Changes                                                                               |
| ------- | ---------- | ------------------------------------------------------------------------------------- |
| 3.1     | 2025-11-10 | Added dual-approach RTL system (inline script + RTLHandler component), PostLayout RTL |
| 3.0     | 2025-10-27 | Complete rewrite for Strategy B, SEO optimization, production guidelines              |
| 2.0     | 2025-10-21 | Initial bilingual implementation (English/Arabic)                                     |
| 1.0     | -          | Legacy next-intl implementation (deprecated)                                          |

---

**End of Document**
