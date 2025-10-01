# Multilingual Implementation PRD — VisaCalm

**Version:** 1.0
**Date:** 2025-09-29
**Status:** Implemented ✅

---

## 1. Overview

This document describes the simplified multilingual (i18n) implementation for VisaCalm, following the official Next.js internationalization patterns. The implementation removes complexity from third-party libraries (`next-intl`) and adopts a native, lightweight approach aligned with Next.js 15 best practices.

## 2. Implementation Approach

### 2.1 Official Next.js Pattern

Based on the [Next.js Internationalization Documentation](https://nextjs.org/docs/app/building-your-application/routing/internationalization), we implement:

- **Dictionary-based translations** using dynamic imports
- **Middleware for locale detection** using `negotiator` for browser language preferences
- **Route-based locale organization** with `app/[lang]/` structure
- **Static generation** for all supported locales
- **No client-side i18n library** — translations loaded server-side

### 2.2 Supported Locales

| Locale | Code | Path Pattern | hreflang |
|--------|------|--------------|----------|
| English (Default) | `en` | `/` | `en-US` |
| Spanish | `es` | `/es/*` | `es-ES` |
| Chinese (Simplified) | `zh` | `/zh/*` | `zh-Hans` |

**Note:** English is the default locale and doesn't require a path prefix.

---

## 3. Technical Architecture

### 3.1 File Structure

```
app/
├── [lang]/
│   ├── dictionaries.ts          # Dictionary loader function
│   ├── DictionaryProvider.tsx   # Client context for translations (future)
│   ├── layout.tsx              # Lang-specific layout with metadata
│   ├── page.tsx                # Localized home page
│   └── blog/                   # Localized blog routes
│       ├── page.tsx
│       └── [...slug]/page.tsx
├── layout.tsx                  # Root layout (handles 'en')
├── page.tsx                    # English home page
└── blog/                       # English blog routes

dictionaries/
├── en.json                     # English translations
├── es.json                     # Spanish translations
└── zh.json                     # Chinese translations

middleware.ts                   # Locale detection and routing
```

### 3.2 Middleware Implementation

**Location:** `middleware.ts`

**Responsibilities:**
1. Detect user's preferred language from `Accept-Language` header
2. Redirect non-English users to appropriate locale path (`/es` or `/zh`)
3. Allow English users to stay at root path (`/`)
4. Skip redirects for:
   - API routes
   - Static files (images, fonts, etc.)
   - Next.js internals (`_next`)
   - RSS feed

**Key Code:**
```typescript
import { NextResponse } from 'next/server'
import Negotiator from 'negotiator'

const locales = ['en', 'es', 'zh']
const defaultLocale = 'en'

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  // Match against available locales
  for (const lang of languages) {
    const locale = locales.find((l) => lang.startsWith(l))
    if (locale) return locale
  }
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if locale already in path
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  if (pathnameHasLocale) return

  // Detect and redirect for non-default locales
  const locale = getLocale(request)
  if (locale === defaultLocale) return

  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}
```

### 3.3 Dictionary System

**Location:** `app/[lang]/dictionaries.ts`

**Structure:**
```typescript
import 'server-only'

const dictionaries = {
  en: () => import('../../dictionaries/en.json').then((module) => module.default),
  es: () => import('../../dictionaries/es.json').then((module) => module.default),
  zh: () => import('../../dictionaries/zh.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'en' | 'es' | 'zh') =>
  dictionaries[locale]?.() ?? dictionaries.en()
```

**Dictionary Format** (`dictionaries/en.json`):
```json
{
  "nav": {
    "home": "Home",
    "blog": "Blog",
    "about": "About"
  },
  "footer": {
    "privacy": "Privacy",
    "terms": "Terms"
  },
  "home": {
    "latest": "Latest",
    "noPosts": "No posts found.",
    "readMore": "Read more →",
    "allPosts": "All Posts →",
    "publishedOn": "Published on"
  }
}
```

### 3.4 Layout Implementation

**Root Layout** (`app/layout.tsx`):
- Handles English locale (default)
- Accepts optional `lang` param from route
- Sets `<html lang={locale}>` attribute

**Lang Layout** (`app/[lang]/layout.tsx`):
- Generates static params for `es` and `zh`
- Loads dictionary for the locale
- Provides localized metadata (OpenGraph, alternates)

**Key Code:**
```typescript
// app/[lang]/layout.tsx
export function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'zh' }]
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: 'es' | 'zh' }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  return <DictionaryProvider dictionary={dict}>{children}</DictionaryProvider>
}
```

---

## 4. Component Implementations

### 4.1 Language Switcher

**Location:** `components/LocaleSwitcher.tsx`

**Features:**
- Smooth dropdown menu with flag emojis
- Auto-detects current locale from pathname
- Preserves current path when switching languages
- Click-outside-to-close functionality
- Visual indicator for active language

**UI:**
- Default button shows: 🇺🇸 English (or current locale)
- Dropdown shows all 3 options with flags
- Active language highlighted with checkmark
- Smooth transitions and hover states

**Locales:**
- 🇺🇸 English
- 🇪🇸 Español
- 🇨🇳 中文

### 4.2 Header Navigation

**Location:** `components/Header.tsx`

**Translation Strategy:**
- Detects current locale from pathname
- Uses inline translation object (synced with dictionaries)
- Translates navigation links: Home, Blog, About
- Server-side component, no client hooks needed

### 4.3 Footer

**Location:** `components/Footer.tsx`

**Translation Strategy:**
- Uses simple capitalization for "Privacy" and "Terms"
- Future: could be enhanced to use full translation system

---

## 5. SEO Implementation

### 5.1 Metadata

Each page includes:
- **Localized `<title>`** and `<meta name="description">`
- **`lang` attribute** on `<html>` tag
- **Canonical URL** pointing to current page
- **Alternate language links** via `alternates.languages`:
  ```typescript
  alternates: {
    languages: {
      en: '/',
      es: '/es',
      'zh-Hans': '/zh',
    },
  }
  ```

### 5.2 hreflang Implementation

The `alternates.languages` metadata automatically generates:
```html
<link rel="alternate" hreflang="en" href="https://visacalm.com/" />
<link rel="alternate" hreflang="es" href="https://visacalm.com/es" />
<link rel="alternate" hreflang="zh-Hans" href="https://visacalm.com/zh" />
```

### 5.3 Sitemap

**Location:** `app/sitemap.ts`

**Requirements:**
- Include all localized routes
- Generate entries for each blog post in all languages
- Use correct hreflang values

---

## 6. Content Strategy

### 6.1 Translation Levels

| Content Type | Translation Approach |
|--------------|---------------------|
| UI Strings | Fully translated in dictionaries |
| Navigation | Fully translated |
| Blog Content | Per-post basis (frontmatter flag) |
| Legal Pages | Translated for compliance |

### 6.2 Blog Post Localization

**Approach 1: Separate MDX files** (Recommended)
```
data/blog/
├── en/
│   └── h1b-101.mdx
├── es/
│   └── h1b-101.mdx
└── zh/
    └── h1b-101.mdx
```

**Approach 2: Frontmatter flag** (Current)
```mdx
---
title: "H-1B 101"
lang: en
translations:
  es: /es/blog/h1b-101
  zh: /zh/blog/h1b-101
---
```

### 6.3 Spanish SEO Strategy

**Goal:** Not just translations, but Spanish-optimized content

**Examples:**
- English: "H-1B Visa Guide" → Spanish: "Guía completa de la visa H-1B"
- Target Spanish search queries: "requisitos visa H-1B", "cómo aplicar visa trabajo USA"
- Use localized examples (Mexican vs. Spanish perspective)

---

## 6.4 Content Translation Workflow — Quick Reference

> **When you add new content or features, follow this guide to properly translate everything.**

### Adding New UI Strings (Navigation, Buttons, Labels)

**Files to Edit:**
1. `dictionaries/en.json` — Add English text
2. `dictionaries/es.json` — Add Spanish translation
3. `dictionaries/zh.json` — Add Chinese translation

**Example: Adding a "Contact" link**

```json
// dictionaries/en.json
{
  "nav": {
    "home": "Home",
    "blog": "Blog",
    "about": "About",
    "contact": "Contact"  // ← Add this
  }
}

// dictionaries/es.json
{
  "nav": {
    "home": "Inicio",
    "blog": "Blog",
    "about": "Acerca de",
    "contact": "Contacto"  // ← Add this
  }
}

// dictionaries/zh.json
{
  "nav": {
    "home": "首页",
    "blog": "博客",
    "about": "关于",
    "contact": "联系我们"  // ← Add this
  }
}
```

**Using in Components:**

For **server components** (pages):
```typescript
import { getDictionary } from './[lang]/dictionaries'

export default async function Page({ params }) {
  const dict = await getDictionary(params.lang)
  return <h1>{dict.nav.contact}</h1>
}
```

For **client components** (Header, Footer):
```typescript
// Add to inline translations object
const translations = {
  en: { contact: 'Contact' },
  es: { contact: 'Contacto' },
  zh: { contact: '联系我们' }
}
```

---

### Adding New Pages

**For each new page, create 3 versions:**

```
app/
├── contact/
│   └── page.tsx          # English version
└── [lang]/
    └── contact/
        └── page.tsx      # Spanish/Chinese version
```

**English version** (`app/contact/page.tsx`):
```typescript
export default function ContactPage() {
  return <div>Contact content in English</div>
}
```

**Localized version** (`app/[lang]/contact/page.tsx`):
```typescript
import { getDictionary } from '../dictionaries'

export function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'zh' }]
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: 'es' | 'zh' }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return <div>{dict.contact.title}</div>
}
```

**Add translations to dictionaries:**
```json
// dictionaries/en.json
{
  "contact": {
    "title": "Contact Us",
    "description": "Get in touch with our team"
  }
}
```

---

### Adding New Blog Posts

**Option 1: English-only first (Quick)**

Create post in `data/blog/`:
```mdx
---
title: 'New H-1B Changes 2025'
date: '2025-01-15'
tags: ['h1b', 'visa']
draft: false
summary: 'Latest updates on H-1B visa regulations'
---

Your English content here...
```

**Option 2: Add Spanish/Chinese translations**

When ready, create translated versions with localized slugs:

```
data/blog/
├── new-h1b-changes-2025.mdx          # English
├── cambios-h1b-2025.mdx              # Spanish
└── h1b-2025-xinzhengce.mdx           # Chinese (pinyin slug)
```

**Spanish version:**
```mdx
---
title: 'Cambios en la visa H-1B 2025'
date: '2025-01-15'
tags: ['h1b', 'visa']
draft: false
summary: 'Últimas actualizaciones sobre las regulaciones de visa H-1B'
lang: es
---

Tu contenido en español aquí...
```

**Key Points:**
- Use **localized slugs** for better SEO
- Translate **all frontmatter** (title, summary, tags)
- Keep `date` consistent across translations
- Add `lang` field to indicate language

---

### Adding New Components with Text

**Server Component** (Recommended):
```typescript
import { getDictionary } from '@/app/[lang]/dictionaries'

export default async function MyComponent({ lang = 'en' }) {
  const dict = await getDictionary(lang)
  return <div>{dict.mySection.text}</div>
}
```

**Client Component** (when needed):
```typescript
'use client'
import { usePathname } from 'next/navigation'

export default function MyComponent() {
  const pathname = usePathname()
  const lang = pathname.startsWith('/es') ? 'es' :
               pathname.startsWith('/zh') ? 'zh' : 'en'

  const text = {
    en: 'English text',
    es: 'Texto en español',
    zh: '中文文本'
  }[lang]

  return <div>{text}</div>
}
```

---

### Updating Navigation Links

**1. Add to Header (`data/headerNavLinks.ts`):**
```typescript
const headerNavLinks = [
  { href: '/', title: 'Home' },
  { href: '/blog', title: 'Blog' },
  { href: '/about', title: 'About' },
  { href: '/contact', title: 'Contact' },  // ← Add
]
```

**2. Add translations to dictionaries** (see "Adding New UI Strings" above)

**3. Update Header component** (`components/Header.tsx`):
```typescript
const translations: Record<string, Record<string, string>> = {
  en: { home: 'Home', blog: 'Blog', about: 'About', contact: 'Contact' },
  es: { home: 'Inicio', blog: 'Blog', about: 'Acerca de', contact: 'Contacto' },
  zh: { home: '首页', blog: '博客', about: '关于', contact: '联系我们' }
}
```

---

### Checklist Before Deployment

**When adding new content/features, verify:**

- [ ] English content created in `app/` or `data/blog/`
- [ ] Localized versions created in `app/[lang]/`
- [ ] UI strings added to all 3 dictionaries (`en`, `es`, `zh`)
- [ ] `generateStaticParams()` includes `es` and `zh`
- [ ] Metadata includes `alternates.languages` for all locales
- [ ] Test navigation between languages preserves new pages
- [ ] Build succeeds: `yarn build`
- [ ] Preview all locales: `/`, `/es`, `/zh`

---

### Translation Quality Guidelines

**Spanish (es):**
- Target: Mexican/Latin American Spanish (more users)
- Use formal "usted" for professional tone
- Localize visa terminology: "aplicar" (not "solicitar"), "patrocinio" (not "esponsorización")
- Examples: "visa de trabajo" not just translated but contextually appropriate

**Chinese (zh):**
- Use Simplified Chinese (mainland China audience)
- Professional terminology: 签证 (visa), 工作许可 (work permit)
- Keep English terms when commonly used: H-1B, USCIS
- Date format: 2025年1月15日

**Both:**
- Don't just translate — **localize** for the target audience
- Research keywords in target language for SEO
- Use native speakers for review when possible
- Test readability with target demographic

---

## 7. Performance Considerations

### 7.1 Static Generation

All localized routes are statically generated at build time:
```typescript
export function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'zh' }]
}
```

### 7.2 Dictionary Loading

- Dictionaries loaded **server-side only**
- Dynamic imports ensure code-splitting
- Only the required locale dictionary is loaded per page
- No client-side translation overhead

### 7.3 Bundle Size Impact

**Before:** ~50KB (next-intl + formatjs dependencies)
**After:** ~5KB (negotiator only)
**Savings:** 90% reduction in i18n dependencies

---

## 8. Migration Summary

### 8.1 Changes Made

| Item | Before | After |
|------|--------|-------|
| Library | `next-intl` | Native Next.js |
| Route param | `[locale]` | `[lang]` |
| Folder | `messages/` | `dictionaries/` |
| Client hooks | `useTranslations()` | Server `getDictionary()` |
| Navigation | `next-intl/navigation` | `next/navigation` |
| Middleware | `createMiddleware()` | Custom with `negotiator` |

### 8.2 Files Modified

- ✅ `middleware.ts` — Custom locale detection
- ✅ `app/[lang]/dictionaries.ts` — Dictionary loader
- ✅ `app/[lang]/layout.tsx` — Simplified layout
- ✅ `app/layout.tsx` — Root layout with lang support
- ✅ `components/LocaleSwitcher.tsx` — Dropdown with flags
- ✅ `components/Header.tsx` — Pathname-based translations
- ✅ `components/Footer.tsx` — Simplified translations
- ✅ `components/Link.tsx` — Native Next.js Link

### 8.3 Files Removed

- ❌ `app/[locale]/` — Renamed to `[lang]`
- ❌ `i18n/request.ts` — No longer needed
- ❌ `messages/` — Renamed to `dictionaries/`
- ❌ `next-intl` package — Removed from dependencies

---

## 9. Testing Checklist

- [x] English users stay at `/` (default locale)
- [x] Spanish users redirect to `/es/*`
- [x] Chinese users redirect to `/zh/*`
- [x] Language switcher dropdown works smoothly
- [x] Language switcher shows correct flags (🇺🇸 English, 🇪🇸 Español, 🇨🇳 中文)
- [x] Navigation links translate properly (Home/Blog/About)
- [x] Path preservation when switching languages
- [x] Static generation for all locale routes (`generateStaticParams`)
- [x] No redirect loops or flashing when accessing `/es` or `/zh`
- [x] Build succeeds with all localized routes
- [ ] hreflang tags present on all pages
- [ ] Sitemap includes all localized routes
- [ ] Lighthouse scores maintained (>95)

---

## 10. Future Enhancements

### 10.1 Short-term
- [ ] Complete sitemap with localized blog posts
- [ ] Add language detection from cookies (preference persistence)
- [ ] Translate blog post content (Spanish/Chinese versions)
- [ ] Add "This page is also available in:" banner

### 10.2 Long-term
- [ ] Add more locales (Portuguese, French, etc.)
- [ ] Implement regional variants (es-MX, es-ES)
- [ ] Build translation management workflow
- [ ] Add automatic translation suggestions
- [ ] Implement content translation status dashboard

---

## 11. Dependencies

### 11.1 Required Packages

```json
{
  "dependencies": {
    "negotiator": "^0.6.3"
  },
  "devDependencies": {
    "@types/negotiator": "^0.6.4"
  }
}
```

### 11.2 Removed Packages

```json
{
  "dependencies": {
    "next-intl": "^3.16.0"  // ❌ Removed
  }
}
```

---

## 12. References

- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Negotiator Library](https://www.npmjs.com/package/negotiator)
- [hreflang Best Practices](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Accept-Language Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)

---

## 13. Support

For questions or issues related to the i18n implementation:
- Check this PRD first
- Review the official Next.js i18n docs
- Open an issue in the project repo