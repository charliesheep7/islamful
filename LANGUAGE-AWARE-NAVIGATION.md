# Language-Aware Navigation System

## Overview

This document explains how the language-aware navigation system works in the DeenUp website, ensuring that all links stay within the current language context.

## Problem Solved

Previously, when users selected Arabic (`/ar`), clicking on navigation links would take them back to English URLs (e.g., `/ar` → `/blog` instead of `/ar/blog`).

Now, all internal links automatically respect the current language and stay within the appropriate language context.

## Implementation

### 1. **useLocale Hook** (`components/hooks/useLocale.tsx`)

A custom React hook that provides:

- `currentLang`: The current language ('en' or 'ar')
- `getLocalePath(path)`: Converts any path to a language-aware path
- `isArabic`: Boolean flag for Arabic language
- `isEnglish`: Boolean flag for English language

**Example:**

```tsx
import { useLocale } from '@/components/hooks/useLocale'

function MyComponent() {
  const { currentLang, getLocalePath } = useLocale()

  // If on /ar/page, currentLang = 'ar'
  // getLocalePath('/blog') returns '/ar/blog'

  // If on /page, currentLang = 'en'
  // getLocalePath('/blog') returns '/blog'
}
```

### 2. **Updated Link Component** (`components/Link.tsx`)

The custom Link component now automatically localizes all internal links:

```tsx
import Link from '@/components/Link'

// This link will automatically become:
// - '/blog' when in English context
// - '/ar/blog' when in Arabic context
;<Link href="/blog">Blog</Link>
```

**Important:** Always use the custom `Link` component from `@/components/Link`, not directly from `next/link`.

### 3. **Updated Navigation Components**

Both `Header.tsx` and `MobileNav.tsx` now use:

- The `useLocale` hook for language detection
- The custom `Link` component for navigation
- Translation functions for displaying localized text

## How It Works

### URL Structure

- **English (default)**: `/`, `/blog`, `/about`, etc.
- **Arabic**: `/ar`, `/ar/blog`, `/ar/about`, etc.

### Automatic Link Conversion

When a user is on `/ar/blog` and clicks a link to `/about`:

1. The custom `Link` component detects the current language (Arabic)
2. It automatically converts `/about` to `/ar/about`
3. The user stays in the Arabic context

### Language Switching

The `LocaleSwitcher` component allows users to switch languages:

- It detects the current page path
- It generates equivalent URLs in other languages
- Example: `/ar/blog` → `/blog` (when switching to English)

## Usage Guidelines for Future Pages

### ✅ DO:

```tsx
import Link from '@/components/Link'

// Simple internal link - automatically localized
;<Link href="/new-page">New Page</Link>

// Using the hook directly
import { useLocale } from '@/components/hooks/useLocale'

function MyComponent() {
  const { getLocalePath } = useLocale()
  const router = useRouter()

  const handleClick = () => {
    router.push(getLocalePath('/new-page'))
  }
}
```

### ❌ DON'T:

```tsx
// DON'T use Next.js Link directly for internal links
import Link from 'next/link'
<Link href="/blog">Blog</Link> // This won't be localized!

// DON'T hardcode language paths
<Link href="/ar/blog">Blog</Link> // This is always Arabic!

// DON'T use anchor tags for internal navigation
<a href="/blog">Blog</a> // This won't be client-side routed
```

## File Structure

```
components/
├── hooks/
│   └── useLocale.tsx       # Language detection and path conversion
├── Link.tsx                # Language-aware Link component
├── Header.tsx              # Main navigation (uses useLocale)
├── MobileNav.tsx           # Mobile navigation (uses useLocale)
└── LocaleSwitcher.tsx      # Language switcher dropdown
```

## Benefits

1. **User Experience**: Users stay in their preferred language throughout navigation
2. **SEO**: Proper language-specific URLs for search engines
3. **Maintainability**: Add new pages without worrying about language routing
4. **Consistency**: All navigation automatically respects language context
5. **Future-Proof**: New pages automatically inherit language-aware navigation

## Testing

To test the language-aware navigation:

1. Start the dev server: `npm run dev`
2. Navigate to home page (`http://localhost:3000`)
3. Switch to Arabic using the language switcher
4. Click on any navigation link (Blog, About, etc.)
5. Verify the URL stays within `/ar/*`
6. Switch back to English
7. Verify the URL returns to root paths

## Adding Translations

When adding new navigation items, update the translation object in both `Header.tsx` and `MobileNav.tsx`:

```tsx
const getNavText = (key: string) => {
  const translations: Record<string, Record<string, string>> = {
    en: {
      home: 'Home',
      blog: 'Blog',
      newpage: 'New Page', // Add here
    },
    ar: {
      home: 'الرئيسية',
      blog: 'المدونة',
      newpage: 'صفحة جديدة', // And here
    },
  }
  return translations[currentLang]?.[key] || key
}
```

## Troubleshooting

**Issue:** Links still going to English pages

- **Solution:** Make sure you're importing `Link` from `@/components/Link`, not `next/link`

**Issue:** Need to manually handle navigation

- **Solution:** Use the `useLocale` hook and call `getLocalePath(yourPath)`

**Issue:** Need to detect current language

- **Solution:** Use `const { currentLang } = useLocale()`

## Summary

The entire site is now language-aware. Any internal link created with the custom `Link` component will automatically stay within the current language context. This ensures a consistent multilingual experience without requiring manual path management for each link.
