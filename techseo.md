# Comprehensive Technical SEO Best Practices Guide (2026)

This guide covers 15 critical areas of technical SEO with specific thresholds, implementation checklists, code examples (focused on Next.js 15), and common pitfalls. All information has been sourced from Google Search Central, web.dev, MDN, and other authoritative references as of February 2026.

---

## 1. Core Web Vitals (CWV)

### What It Is and Why It Matters

Core Web Vitals are three metrics that Google uses as ranking signals to measure real-user experience: loading performance, interactivity/responsiveness, and visual stability. Sites passing all three CWV thresholds see **24% lower bounce rates** and measurably better organic rankings.

### Thresholds (75th Percentile of Field Data)

| Metric                              | Good     | Needs Improvement | Poor    |
| ----------------------------------- | -------- | ----------------- | ------- |
| **LCP** (Largest Contentful Paint)  | <= 2.5s  | <= 4.0s           | > 4.0s  |
| **INP** (Interaction to Next Paint) | <= 200ms | <= 500ms          | > 500ms |
| **CLS** (Cumulative Layout Shift)   | <= 0.1   | <= 0.25           | > 0.25  |

To pass, **75% of page visits** must score "good" for each metric.

### Implementation Checklist

**LCP Optimization:**

- [ ] Identify the LCP element (usually hero image or largest heading) using Chrome DevTools Performance panel
- [ ] Preload the LCP image with `<link rel="preload" as="image">` or Next.js `priority` prop
- [ ] Use `next/image` with `priority` for above-the-fold images (this adds `fetchpriority="high"` and disables lazy loading)
- [ ] Inline critical CSS; defer non-critical CSS
- [ ] Preconnect to CDN/image origins: `<link rel="preconnect" href="https://cdn.example.com">`
- [ ] Keep server TTFB under 200ms using SSR/SSG + CDN edge caching
- [ ] Preload web fonts used in the LCP element

**INP Optimization:**

- [ ] Break long JavaScript tasks (>50ms) into smaller chunks using `scheduler.yield()` or `setTimeout`
- [ ] Use `React.startTransition` for non-urgent state updates
- [ ] Defer non-critical third-party scripts with `next/script strategy="lazyOnload"`
- [ ] Minimize DOM size (target <1,500 elements)
- [ ] Move heavy computation to Web Workers
- [ ] Avoid forced synchronous layouts (reading layout properties after DOM writes)

```typescript
// Breaking long tasks with scheduler.yield()
async function processLargeList(items: Item[]) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i])
    // Yield every 5 items to keep INP low
    if (i % 5 === 0) {
      await scheduler.yield()
    }
  }
}
```

**CLS Optimization:**

- [ ] Set explicit `width` and `height` on all `<img>` and `<video>` elements (Next.js `Image` does this automatically)
- [ ] Reserve space for ads/embeds with CSS `aspect-ratio` or `min-height`
- [ ] Use `font-display: swap` with font metric overrides (next/font handles this)
- [ ] Never inject content above existing content after load
- [ ] Use CSS `contain: layout` on elements that might shift

### Common Mistakes

- Lazy-loading the LCP image (causes 35% slower LCP per Chrome UX Report data)
- 43% of websites fail INP -- this is the most commonly failed metric
- Using `font-display: swap` without size-adjust causes CLS from font reflow
- Not measuring field data (lab data alone is insufficient; use CrUX or RUM)

---

## 2. Crawling & Indexing

### What It Is and Why It Matters

If Google cannot crawl and index your pages, nothing else matters. Proper crawling configuration ensures your important pages are discovered, indexed, and served correctly while avoiding wasted crawl budget on irrelevant URLs.

### Specific Requirements

- **robots.txt**: Controls crawler access. Does NOT prevent indexing (use `noindex` for that).
- **Sitemap**: Max 50MB uncompressed or 50,000 URLs per file. Use sitemap index for larger sites.
- **Canonical URLs**: Must be absolute, consistent across all canonicalization signals.
- **Crawl budget**: Finite for every site; wasting it on parameterized, duplicate, or error pages hurts discovery of important content.

### Implementation Checklist

- [ ] Create `robots.txt` that allows crawling of all important content and blocks irrelevant paths (e.g., `/api/`, `/admin/`)
- [ ] Generate an XML sitemap with only canonical, indexable, 200-status URLs
- [ ] Include `<lastmod>` only when the date reflects actual meaningful content changes
- [ ] Set `rel="canonical"` on every page, including self-referencing canonicals
- [ ] Ensure canonical signals are consistent: the canonical URL, sitemap URL, internal links, and hreflang all point to the same URL
- [ ] Submit sitemap to Google Search Console
- [ ] For paginated content, use self-referencing canonicals on each page (rel=prev/next is no longer used by Google)
- [ ] Return proper HTTP status codes: 200 (OK), 301 (permanent redirect), 404 (not found), 410 (gone)

```typescript
// app/robots.ts — Next.js
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
    ],
    sitemap: 'https://islamful.com/sitemap.xml',
  }
}
```

```typescript
// app/sitemap.ts — Next.js
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://islamful.com'

  // Static routes
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    {
      url: `${baseUrl}/prayer-times`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/haram-check`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Dynamic blog posts (fetch from your content source)
  const posts = allBlogs.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.lastmod || post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Arabic mirrors
  const arabicRoutes = staticRoutes.map((route) => ({
    ...route,
    url: route.url.replace(baseUrl, `${baseUrl}/ar`),
  }))

  return [...staticRoutes, ...arabicRoutes, ...posts]
}
```

### Common Mistakes

- Using robots.txt to block pages you want de-indexed (use `noindex` meta tag instead)
- Specifying different canonical URLs through different mechanisms (e.g., one URL in sitemap, another in `rel="canonical"`)
- Including non-canonical or redirecting URLs in the sitemap
- Forgetting self-referencing canonical tags
- Setting `<lastmod>` to the current date on every build (Google learns to ignore it)

---

## 3. Structured Data / Schema (JSON-LD)

### What It Is and Why It Matters

Structured data helps search engines understand page content semantically and can trigger Rich Results (stars, FAQs, breadcrumbs, etc.) in the SERP. Pages with properly implemented structured data earn **35% higher click-through rates** through rich results. Google recommends JSON-LD as the preferred format.

### Schema Types and Their Use Cases

| Schema Type           | Use Case                                 | Rich Result              |
| --------------------- | ---------------------------------------- | ------------------------ |
| `WebSite`             | Site-level, enables Sitelinks Search Box | Sitelinks search         |
| `Organization`        | Company info, logo, social profiles      | Knowledge Panel          |
| `FAQPage`             | FAQ sections                             | Expandable Q&A in SERP   |
| `Article`             | Blog posts, news                         | Article rich result      |
| `BreadcrumbList`      | Navigation breadcrumbs                   | Breadcrumb trail in SERP |
| `HowTo`               | Step-by-step guides                      | Step-by-step rich result |
| `SoftwareApplication` | Apps/tools                               | App info rich result     |
| `Product`             | Products with reviews/pricing            | Product rich result      |

### Implementation Checklist

- [ ] Add `WebSite` + `Organization` schema on the homepage / root layout
- [ ] Add `Article` schema on every blog post with `headline`, `datePublished`, `dateModified`, `author`, `image`
- [ ] Add `BreadcrumbList` on all pages with breadcrumb navigation
- [ ] Add `FAQPage` on pages with FAQ sections
- [ ] Add `SoftwareApplication` on tool pages (prayer-times, haram-check)
- [ ] Validate all markup with Google's Rich Results Test before deploying
- [ ] Monitor the Enhancements section in Search Console weekly for errors
- [ ] Use `@id` anchors to link entities together (entity-first approach)
- [ ] Ensure all structured data accurately reflects visible page content

```typescript
// components/seo/JsonLd.tsx — Reusable JSON-LD component
interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'), // XSS prevention
      }}
    />
  )
}

// Usage in app/layout.tsx — WebSite + Organization
<JsonLd
  data={{
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://islamful.com/#website',
        url: 'https://islamful.com',
        name: 'Islamful',
        description: 'Your Complete Islamic Companion',
        publisher: { '@id': 'https://islamful.com/#organization' },
        inLanguage: ['en', 'ar'],
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: 'https://islamful.com/blog?q={search_term_string}' },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://islamful.com/#organization',
        name: 'Islamful',
        url: 'https://islamful.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://islamful.com/logo.png',
        },
      },
    ],
  }}
/>

// Usage on a blog post page — Article schema
<JsonLd
  data={{
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.lastmod || post.date,
    author: { '@type': 'Organization', name: 'Islamful' },
    publisher: { '@id': 'https://islamful.com/#organization' },
    image: post.images?.[0],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://islamful.com/blog/${post.slug}`,
    },
  }}
/>

// Usage on FAQ page — FAQPage schema
<JsonLd
  data={{
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }}
/>

// Usage on tool page — SoftwareApplication schema
<JsonLd
  data={{
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Islamful Prayer Times',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Accurate prayer times based on your location',
  }}
/>
```

### Common Mistakes

- Adding structured data that does not reflect visible page content (Google penalizes misleading markup)
- Partial implementation (missing required fields produces zero rich-result lift)
- Not validating with Rich Results Test before deployment
- Using Microdata or RDFa instead of JSON-LD (harder to maintain, same result)
- Not linking entities with `@id` references (missed opportunity for Knowledge Graph connections)

---

## 4. On-Page SEO

### What It Is and Why It Matters

On-page SEO covers the content and HTML source code elements that you control on each page. Search engines now prioritize user intent, content depth, page experience, and credibility. Note: Google overrides more than **62% of meta descriptions** with its own AI-generated snippets, but well-written ones still influence CTR when they are displayed.

### Specific Requirements

- **Title tags**: 50-60 characters. Include primary keyword near the beginning.
- **Meta descriptions**: 120-160 characters. Action-oriented, include a value proposition.
- **H1**: Exactly one per page. Should match the primary topic/keyword.
- **H2-H6**: Logical hierarchy. H2 for major sections, H3 for subsections. Never skip levels.

### Implementation Checklist

- [ ] Every page has a unique `<title>` tag under 60 characters with the primary keyword
- [ ] Every page has a unique meta description under 160 characters
- [ ] Exactly one `<h1>` per page that clearly states the page topic
- [ ] H2/H3 hierarchy is logical and never skips levels (no H1 -> H3)
- [ ] 2-6 internal links per page using descriptive anchor text (never "click here")
- [ ] Internal linking follows three directions:
  - **Upward**: Link to parent/hub pages (e.g., blog post links to `/blog`)
  - **Lateral**: Link to related content at the same level (e.g., one tool links to another)
  - **Downward**: Link from hub pages to detail pages (e.g., homepage links to tools)
- [ ] All images have descriptive `alt` text that serves both accessibility and keyword targeting
- [ ] Use `<strong>` and `<em>` for semantic emphasis (not just visual)
- [ ] First paragraph answers the user's primary intent (inverted pyramid structure)
- [ ] Content depth: aim for comprehensive coverage that addresses related questions

```typescript
// app/blog/[slug]/page.tsx — generateMetadata example
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug)
  return {
    title: `${post.title} | Islamful`, // Under 60 chars
    description: post.summary, // Under 160 chars
    alternates: {
      canonical: `https://islamful.com/blog/${post.slug}`,
      languages: {
        en: `https://islamful.com/blog/${post.slug}`,
        ar: `https://islamful.com/ar/blog/${post.slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.lastmod,
      url: `https://islamful.com/blog/${post.slug}`,
      images: [{ url: post.images?.[0] || 'https://islamful.com/og-default.png' }],
    },
  }
}
```

### Common Mistakes

- Duplicate title tags across pages (each page must have a unique title)
- Using multiple H1 tags on a single page (dilutes the primary topic signal)
- Internal links with generic anchor text ("click here", "read more", "learn more")
- Orphan pages with no internal links pointing to them
- Keyword stuffing in titles, headings, or alt text

---

## 5. International SEO

### What It Is and Why It Matters

International SEO ensures search engines serve the correct language/regional version of your site to users. For a bilingual site like Islamful (English + Arabic), proper hreflang implementation prevents duplicate content issues and ensures users see content in their language. Over **65% of international websites** have significant hreflang implementation errors.

### Specific Requirements

- **hreflang**: Use ISO 639-1 language codes (e.g., `en`, `ar`) and optionally ISO 3166-1 Alpha-2 region codes (e.g., `en-US`)
- **Bidirectional rule**: Every page must link to ALL its alternate versions, including itself (self-referencing)
- **x-default**: Specifies the fallback for users whose language/region does not match any defined version
- **URLs**: Must be fully qualified absolute URLs (including `https://`)

### Implementation Checklist

- [ ] Add hreflang link tags on every page, including a self-referencing tag
- [ ] Add `x-default` pointing to the primary/English version (or a language selector page)
- [ ] Ensure bidirectional linking: EN page references AR page AND AR page references EN page
- [ ] Set `<html lang="en" dir="ltr">` or `<html lang="ar" dir="rtl">` appropriately
- [ ] Set OG locale: `og:locale="en_US"` and `og:locale:alternate="ar_SA"`
- [ ] Canonical URLs for each language version are self-referencing (the EN canonical points to EN, AR canonical points to AR)
- [ ] Sitemap includes all language versions with hreflang annotations (or use separate hreflang link tags)
- [ ] Content is fully translated (not machine-translated without review)

```typescript
// app/layout.tsx or seo.tsx — hreflang implementation
// In generateMetadata:
alternates: {
  canonical: 'https://islamful.com/prayer-times',
  languages: {
    en: 'https://islamful.com/prayer-times',
    ar: 'https://islamful.com/ar/prayer-times',
    'x-default': 'https://islamful.com/prayer-times',
  },
},

// This generates:
// <link rel="alternate" hreflang="en" href="https://islamful.com/prayer-times" />
// <link rel="alternate" hreflang="ar" href="https://islamful.com/ar/prayer-times" />
// <link rel="alternate" hreflang="x-default" href="https://islamful.com/prayer-times" />

// In the Arabic page's generateMetadata, the SAME alternates must appear (bidirectional):
alternates: {
  canonical: 'https://islamful.com/ar/prayer-times',
  languages: {
    en: 'https://islamful.com/prayer-times',
    ar: 'https://islamful.com/ar/prayer-times',
    'x-default': 'https://islamful.com/prayer-times',
  },
},
```

```html
<!-- Root HTML tag for RTL Arabic pages -->
<html lang="ar" dir="rtl">
  <!-- Root HTML tag for LTR English pages -->
  <html lang="en" dir="ltr"></html>
</html>
```

### Common Mistakes

- Missing bidirectional linking (EN links to AR but AR does not link back to EN -- Google ignores the entire hreflang set)
- Using relative URLs in hreflang tags (must be absolute)
- Canonical on Arabic page pointing to the English version (each version should self-canonicalize)
- Missing x-default (users in unsupported regions get no signal about which version to show)
- Setting the same canonical URL for both language versions (treats them as duplicates)

---

## 6. Security Headers

### What It Is and Why It Matters

Security headers protect users from XSS, clickjacking, MIME sniffing, and other attacks. While most security headers are not direct ranking factors, HTTPS is confirmed as a ranking signal, and security issues (malware warnings, mixed content) actively harm SEO by triggering browser warnings that increase bounce rate. A 2026 scan of 7,510 top sites found an average security score of 58.0/100.

### Recommended Headers

| Header                      | Value                                          | Purpose                     |
| --------------------------- | ---------------------------------------------- | --------------------------- |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS for 2 years     |
| `Content-Security-Policy`   | (See below)                                    | Prevent XSS, data injection |
| `X-Content-Type-Options`    | `nosniff`                                      | Prevent MIME-type sniffing  |
| `X-Frame-Options`           | `DENY` or `SAMEORIGIN`                         | Prevent clickjacking        |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`              | Control referrer leakage    |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=(self)` | Restrict browser APIs       |

### Implementation Checklist

- [ ] Enable HSTS with at least 1-year `max-age` (31536000 seconds), ideally 2 years
- [ ] Submit to the HSTS preload list at `hstspreload.org`
- [ ] Start with `Content-Security-Policy-Report-Only` to test before enforcing
- [ ] Set `X-Content-Type-Options: nosniff` on all responses
- [ ] Set `X-Frame-Options: DENY` (unless your site needs to be embedded)
- [ ] Set `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] Set `Permissions-Policy` restricting unused browser features
- [ ] Eliminate all mixed content (HTTP resources on HTTPS pages)

```typescript
// next.config.js — Security headers for Next.js
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
  // Start with report-only CSP, then enforce once validated:
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.vercel-insights.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self'",
      "connect-src 'self' https://*.supabase.co https://api.aladhan.com",
      "frame-ancestors 'none'",
    ].join('; '),
  },
]

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}
```

### Common Mistakes

- Using `unsafe-inline` and `unsafe-eval` in CSP without understanding the XSS implications (48.8% of sites with CSP use `unsafe-inline`)
- Setting HSTS `max-age` too short (Google recommends at least 1 year for preload eligibility)
- Not testing CSP in report-only mode first (can break third-party scripts, analytics, etc.)
- Mixed content: loading HTTP images/scripts on an HTTPS page (breaks the security chain and harms CWV)

---

## 7. Image Optimization

### What It Is and Why It Matters

Images are typically the largest payload on web pages and are often the LCP element. Proper optimization can reduce image payload by **50-80%** while maintaining visual quality. Image optimization directly impacts LCP, CLS, and page weight.

### Format Hierarchy (2026)

1. **AVIF**: 50% smaller than JPEG at equivalent quality. Best compression.
2. **WebP**: 25-35% smaller than JPEG. Broad browser support.
3. **JPEG/PNG**: Final fallback for legacy browsers only.

### Implementation Checklist

- [ ] Use `next/image` for all images (automatic WebP/AVIF, srcset, lazy loading)
- [ ] Set `priority` on LCP/above-the-fold images (disables lazy loading, adds `fetchpriority="high"`)
- [ ] NEVER add `loading="lazy"` to above-the-fold images (causes 35% slower LCP)
- [ ] Always provide `width` and `height` attributes (prevents CLS)
- [ ] Write descriptive alt text: describe the image content, include relevant keywords naturally
- [ ] For decorative images, use `alt=""` (empty string, not missing attribute)
- [ ] Use responsive `sizes` attribute to match your layout breakpoints
- [ ] Compress images before upload (target 85% quality for lossy formats)
- [ ] Serve images from a CDN; preconnect to the CDN origin

```tsx
// Above-the-fold hero image — priority loaded
import Image from 'next/image'

<Image
  src="/images/hero-mosque.jpg"
  alt="A peaceful mosque at sunset with golden minarets — Islamful prayer times tool"
  width={1200}
  height={630}
  priority // Disables lazy loading, adds fetchpriority="high"
  sizes="100vw"
  className="w-full h-auto"
/>

// Below-the-fold blog image — lazy loaded (default)
<Image
  src="/images/blog/halal-food-guide.jpg"
  alt="A selection of halal-certified food products on a kitchen counter"
  width={800}
  height={450}
  sizes="(max-width: 768px) 100vw, 800px"
  className="rounded-lg"
/>

// Using <picture> for manual format fallback (when not using next/image)
<picture>
  <source srcSet="/images/hero.avif" type="image/avif" />
  <source srcSet="/images/hero.webp" type="image/webp" />
  <img src="/images/hero.jpg" alt="Description" width="1200" height="630" />
</picture>
```

### Common Mistakes

- Lazy-loading the LCP element (the most damaging image SEO mistake)
- Missing `alt` text entirely (accessibility violation AND missed SEO signal)
- Using `alt` text like "image" or "photo" instead of a meaningful description
- Not setting `width`/`height`, causing layout shift
- Serving uncompressed originals (10MB hero images are still common)
- Using PNG for photographic content (use JPEG/WebP/AVIF instead)

---

## 8. Performance (SSR/SSG, Fonts, Preconnect, Code Splitting, CDN)

### What It Is and Why It Matters

Page speed is both a direct ranking signal (via CWV) and an indirect one (affecting bounce rate and dwell time). The goal is to keep TTFB under 200ms, FCP under 1.8s, and LCP under 2.5s.

### Implementation Checklist

**Rendering Strategy:**

- [ ] Use SSG (`generateStaticParams`) for content that does not change per request (blog posts, static pages)
- [ ] Use SSR for pages with dynamic per-request data (user-specific content)
- [ ] Use ISR (Incremental Static Regeneration) for content that changes periodically
- [ ] Use client-side rendering only for interactive widgets that do not need SEO (e.g., prayer times after initial server render)

**Font Loading:**

- [ ] Use `next/font` to self-host fonts (eliminates external requests and layout shift)
- [ ] Apply `font-display: swap` (next/font does this by default)
- [ ] Use `adjustFontFallback` to minimize CLS during font swap
- [ ] Limit font weights: only load the weights you actually use

```typescript
// app/layout.tsx — Font optimization with next/font
import { Libre_Baskerville, Noto_Sans, Noto_Sans_Arabic } from 'next/font/google'

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-libre',
})

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto',
})

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-noto-arabic',
})
```

**Resource Hints:**

- [ ] `<link rel="preconnect">` for critical third-party origins (Supabase, Aladhan API, CDN)
- [ ] `<link rel="dns-prefetch">` for lower-priority third-party origins
- [ ] `<link rel="preload">` for critical resources (LCP image, critical fonts)

```html
<!-- In app/layout.tsx <head> -->
<link rel="preconnect" href="https://fkifiwgbroehluxksfte.supabase.co" />
<link rel="dns-prefetch" href="https://api.aladhan.com" />
```

**Code Splitting:**

- [ ] Use dynamic imports (`next/dynamic`) for heavy components not needed at initial load
- [ ] Use `React.lazy()` + `Suspense` for client-side-only components
- [ ] Analyze bundle with `@next/bundle-analyzer` to identify bloated dependencies
- [ ] Tree-shake unused code; avoid importing entire libraries (`import { format } from 'date-fns'` not `import * as dateFns`)

```typescript
// Lazy load the haram checker only when the user navigates to that section
import dynamic from 'next/dynamic'

const HaramChecker = dynamic(() => import('@/components/tools/HaramChecker'), {
  loading: () => <div className="animate-pulse h-64 bg-cream-50 rounded" />,
  ssr: false, // Client-only component
})
```

**CDN:**

- [ ] Deploy to Vercel Edge Network or equivalent CDN with global PoPs
- [ ] Enable static asset caching with immutable Cache-Control headers
- [ ] Use `stale-while-revalidate` for ISR pages

### Common Mistakes

- Client-side rendering entire pages that need SEO (Google CAN render JS but deprioritizes heavy CSR pages)
- Loading all fonts upfront instead of subsetting to what is needed
- Missing `preconnect` to the LCP image origin (one of the highest-impact LCP fixes)
- Not code-splitting: shipping the entire app as a single bundle
- Using `ssr: false` on components that contain content Google should index

---

## 9. Mobile-First Indexing

### What It Is and Why It Matters

Since 2024, Google exclusively uses the mobile version of every website as the primary input for its search index. Mobile-first indexing is no longer a transition -- it is the permanent reality. If your mobile experience is broken, your desktop rankings will suffer too.

### Specific Requirements

- **Viewport**: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- **Tap targets**: Minimum 48x48px with at least 8px spacing between them
- **Font size**: Minimum 16px for body text (no zoom required to read)
- **No horizontal scrolling**: Content must fit within the viewport
- **No intrusive interstitials**: Full-screen popups that block content on mobile are penalized

### Implementation Checklist

- [ ] Viewport meta tag is present and does NOT include `user-scalable=no` or `maximum-scale=1`
- [ ] All tap targets (buttons, links) are at least 48x48px
- [ ] At least 8px spacing between adjacent tap targets
- [ ] Body font size is at least 16px
- [ ] No horizontal overflow (test with `overflow-x: hidden` temporarily, then fix root causes)
- [ ] Content parity: mobile version has all the same content as desktop (no hidden content behind "show more" toggles that Google cannot expand)
- [ ] Images and media are responsive (`max-width: 100%` or `next/image`)
- [ ] No interstitials that cover content on page load (app install banners, newsletter popups, cookie walls that block content)
- [ ] Test with Google's Mobile-Friendly Test and Search Console's Mobile Usability report

```css
/* Minimum tap target sizing */
button,
a,
[role='button'] {
  min-height: 48px;
  min-width: 48px;
  padding: 12px;
}

/* Prevent horizontal overflow */
html,
body {
  overflow-x: hidden;
}

img,
video,
iframe {
  max-width: 100%;
  height: auto;
}
```

### Common Mistakes

- Adding `maximum-scale=1` to the viewport meta (prevents pinch-to-zoom, accessibility violation)
- Tap targets smaller than 48px (common in navbars and footers)
- Font size below 16px requiring users to zoom
- Hiding important content on mobile behind accordions/tabs that desktop shows openly
- Large fixed/sticky headers or banners that eat into limited mobile viewport space

---

## 10. AI Overview / SGE Optimization

### What It Is and Why It Matters

Google AI Overviews (formerly SGE) are AI-generated summaries that appear at the top of search results, synthesizing information from an average of **5-6 different websites**. Brands cited in AI Overviews earn **35% more organic clicks** and **91% more engagement** compared to uncited competitors. A study by SeoClarity found that **99.5% of AI Overview sources come from the top 10 organic rankings**, so traditional SEO remains the foundation.

### How to Get Cited

- [ ] **Answer-first structure**: Start content with the most critical information, then provide supporting details (inverted pyramid). AI extracts the core answer for its summary.
- [ ] **Use structured formatting**: 40-61% of AI Overviews use lists or bullet points. Structure content with clear lists, tables, numbered steps, and definition patterns.
- [ ] **Build E-E-A-T signals**: Experience, Expertise, Authoritativeness, Trust. Include author bios, cite sources, demonstrate first-hand experience.
- [ ] **Create comprehensive content**: AI cites sources that cover topics from multiple angles. Aim for 1,500+ word guides that address common questions, challenges, and practical steps (not shallow 300-word posts).
- [ ] **Include original data/insights**: Proprietary data, unique perspectives, and original research give AI reason to cite your content specifically over generic sources.
- [ ] **Target question-based queries**: AI Overviews are most common for informational queries. Structure content around "What is...", "How to...", "Is X halal/haram..." patterns.
- [ ] **Use clear heading hierarchy**: H2 boundaries help Google identify where one topic ends and another begins (Passage Indexing).
- [ ] **Keep content fresh**: Update cornerstone content regularly with new data, updated advice, and current references.
- [ ] **Rank in top 10 first**: 99.5% of AI Overview citations come from page-one results. Prioritize traditional SEO fundamentals.

### Content Structure Pattern for AI Citations

```markdown
### Is [Food/Practice] Halal or Haram? ← Clear question heading

[Food/Practice] is [ruling]. ← Direct answer first (1-2 sentences)

### Why [Food/Practice] Is [Ruling] ← Supporting evidence

- Point 1 with Quran/Hadith reference
- Point 2 with scholarly consensus
- Point 3 with practical consideration

### Common Misconceptions ← Addresses related queries

...

### Scholarly References ← E-E-A-T signals

...
```

### Common Mistakes

- Writing thin content and expecting AI citations (depth is essential)
- Not ranking on page one organically (prerequisite for AI Overview inclusion)
- Using only paragraphs with no structural formatting (lists, tables, definition patterns)
- Ignoring content freshness (stale content gets deprioritized)
- Not structuring content around the specific questions users ask

---

## 11. Page Experience Signals

### What It Is and Why It Matters

Page experience is a set of signals that measure how users perceive the experience of interacting with a web page beyond its information content. Google confirmed HTTPS as a ranking signal, and a site with mixed content is not fully HTTPS.

### Specific Requirements

- **HTTPS**: All pages served over HTTPS with a valid TLS certificate
- **No mixed content**: Zero HTTP subresources (images, scripts, stylesheets) on HTTPS pages
- **No intrusive interstitials**: No full-screen popups blocking content
- **bfcache compatibility**: Pages should be eligible for the browser back/forward cache

### Implementation Checklist

- [ ] HTTPS on all pages with a valid, unexpired TLS certificate
- [ ] Audit for mixed content: all image `src`, script `src`, stylesheet `href`, iframe `src` must use `https://`
- [ ] Use `upgrade-insecure-requests` CSP directive as a safety net
- [ ] No full-screen interstitials on page load (cookie consent must be compliant, not blocking)
- [ ] bfcache compatibility:
  - No `unload` event listeners (use `pagehide` instead)
  - No `Cache-Control: no-store` on HTML documents
  - No active WebSocket connections on page unload
  - Close IndexedDB connections when page is hidden
- [ ] Test bfcache eligibility in Chrome DevTools > Application > Back/forward cache
- [ ] No browser security warnings (expired certs, unsafe content)

```typescript
// Ensure all API calls and resources use HTTPS
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL // Must be https://
const ALADHAN_API = 'https://api.aladhan.com/v1' // Always HTTPS

// CSP header to auto-upgrade HTTP to HTTPS
// Content-Security-Policy: upgrade-insecure-requests
```

### Common Mistakes

- Hardcoded HTTP URLs in content (images in blog posts, links in footer)
- Third-party scripts or widgets loading HTTP resources
- Using `unload` event listeners (blocks bfcache, use `pagehide` instead)
- `Cache-Control: no-store` on HTML pages (prevents bfcache)
- Cookie consent banners that fully block page content (use compliant non-blocking designs)

---

## 12. Accessibility & SEO Overlap

### What It Is and Why It Matters

AI crawlers and LLMs rely on the same semantic structures that assistive technologies use. If a screen reader cannot traverse a page, a search engine crawler is equally likely to misinterpret the content. Accessibility improvements (semantic HTML, alt text, heading structure) can impact rankings within weeks as Google recrawls affected pages.

### Implementation Checklist

**Semantic HTML:**

- [ ] Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` instead of generic `<div>`
- [ ] Use `<button>` for actions and `<a>` for navigation (never `<div onClick>`)
- [ ] Use `<ul>/<ol>` for lists, `<table>` for tabular data
- [ ] Prefer native HTML elements over ARIA (e.g., `<nav>` instead of `<div role="navigation">`)

**Heading Hierarchy:**

- [ ] Exactly one `<h1>` per page
- [ ] Headings follow a logical hierarchy: H1 > H2 > H3 (never skip levels)
- [ ] Headings describe the content that follows them (not decorative text in heading tags)

**ARIA Landmarks:**

- [ ] `<main>` wraps the primary content (one per page)
- [ ] `<nav>` has `aria-label` when there are multiple nav elements (e.g., "Main navigation", "Footer navigation")
- [ ] Interactive elements have accessible names (`aria-label` or visible text)

**Skip Navigation:**

- [ ] Include a skip-nav link as the first focusable element: `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>`

**Color Contrast:**

- [ ] Minimum 4.5:1 contrast ratio for body text (WCAG AA)
- [ ] Minimum 3:1 for large text (18px+ or 14px+ bold)
- [ ] Verify the brand green `#327952` on cream `#F6F5EE` meets contrast requirements

**Focus Management:**

- [ ] All interactive elements have visible focus indicators
- [ ] Focus order follows logical reading order
- [ ] Modal dialogs trap focus within them

```tsx
// Accessible page layout structure
export default function Layout({ children }) {
  return (
    <>
      <a
        href="#main-content"
        className="focus:bg-primary-500 sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:text-white"
      >
        Skip to content
      </a>
      <header>
        <nav aria-label="Main navigation">{/* Navigation links */}</nav>
      </header>
      <main id="main-content">{children}</main>
      <footer>
        <nav aria-label="Footer navigation">{/* Footer links */}</nav>
      </footer>
    </>
  )
}
```

### Common Mistakes

- Using `<div>` for everything instead of semantic elements (crawlers lose structural context)
- Skipping heading levels (H1 directly to H3)
- Putting decorative text in heading tags or using headings purely for styling
- Missing alt text on informational images
- Interactive elements without accessible names (icon buttons without `aria-label`)
- Color contrast below 4.5:1 for body text

---

## 13. URL Structure

### What It Is and Why It Matters

Clean, descriptive URLs help search engines understand page content and improve click-through rates in SERPs. URLs with and without trailing slashes are treated as separate pages by Google, so consistency is critical to avoid duplicate content.

### Specific Requirements

- **Clean URLs**: Lowercase, hyphenated, descriptive (e.g., `/blog/is-gelatin-halal`)
- **Trailing slash consistency**: Pick one format and use it everywhere; redirect the other with 301
- **Status codes**: 200 (OK), 301 (permanent redirect), 404 (not found), 410 (permanently gone)
- **Max length**: Keep under 75 characters for full visibility in SERPs (no hard limit from Google)

### Implementation Checklist

- [ ] URLs are lowercase, hyphenated, and descriptive of content
- [ ] Trailing slash policy is consistent across the entire site (Next.js default: no trailing slash)
- [ ] Configure `trailingSlash` in `next.config.js` to enforce your choice
- [ ] 301 redirect all non-canonical URL variations (with/without trailing slash, with/without www)
- [ ] No URL parameters for canonical content (use path segments instead)
- [ ] Return 404 for pages that never existed, 410 for pages intentionally removed
- [ ] No redirect chains (A->B->C); each redirect should go directly to the final destination
- [ ] No redirect loops
- [ ] URLs do not contain: uppercase letters, underscores, special characters, session IDs, or unnecessary parameters

```typescript
// next.config.js — Trailing slash configuration
module.exports = {
  trailingSlash: false, // Enforces URLs without trailing slashes
  async redirects() {
    return [
      // Redirect old URLs to new structure
      {
        source: '/tools/prayer-times',
        destination: '/prayer-times',
        permanent: true, // 301 redirect
      },
      // Redirect removed pages with 410
      {
        source: '/old-removed-page',
        destination: '/404',
        permanent: true,
      },
    ]
  },
}
```

### Common Mistakes

- Inconsistent trailing slash usage (creates duplicate content across every page on the site)
- Using 302 (temporary) redirects for permanent URL changes (does not pass full link equity)
- Redirect chains: old-url -> intermediate-url -> final-url (crawl budget waste, slower for users)
- Uppercase letters in URLs (Google treats `/Blog` and `/blog` as different pages)
- Including stop words or dates in URLs that make them unnecessarily long

---

## 14. Monitoring & Tools

### What It Is and Why It Matters

Without monitoring, SEO issues go undetected until traffic drops. Early detection allows you to fix crawl errors, indexing issues, and performance regressions before they significantly impact rankings.

### Essential Tools

| Tool                             | Purpose                                                         |
| -------------------------------- | --------------------------------------------------------------- |
| **Google Search Console**        | Indexing status, crawl errors, performance data, manual actions |
| **Google Analytics / Umami**     | User behavior, traffic sources, engagement metrics              |
| **Chrome DevTools (Lighthouse)** | Lab-based CWV testing, accessibility audits                     |
| **PageSpeed Insights**           | Field data (CrUX) + lab data for CWV                            |
| **Rich Results Test**            | Validate structured data before deployment                      |
| **Schema Markup Validator**      | Validate schema.org compliance                                  |
| **Screaming Frog**               | Site crawl for broken links, missing tags, redirect chains      |
| **Ahrefs / Semrush**             | Competitive analysis, keyword tracking, backlink monitoring     |

### Implementation Checklist

- [ ] Google Search Console is set up and verified for both `islamful.com` and `www.islamful.com`
- [ ] Sitemap is submitted in Search Console
- [ ] Email alerts are enabled in Search Console for critical issues
- [ ] Analytics is installed (Umami for privacy-focused analytics)
- [ ] Monitor Search Console weekly:
  - **Coverage report**: Check for crawl errors, excluded pages, indexing issues
  - **Performance report**: Track clicks, impressions, CTR, position trends
  - **Enhancements**: Check structured data errors
  - **Core Web Vitals**: Monitor field data trends
  - **Mobile Usability**: Check for mobile issues
- [ ] Run Lighthouse audits on key pages after every deployment
- [ ] Set up automated CWV monitoring (e.g., SpeedCurve, Calibre, or custom CrUX API dashboards)
- [ ] Monitor 404 errors and set up redirects for important broken URLs
- [ ] Check URL Inspection tool for specific indexing issues
- [ ] Integrate Search Console data with Looker Studio for custom dashboards

```typescript
// Umami analytics integration in app/layout.tsx
// Already configured via NEXT_UMAMI_ID environment variable
{process.env.NEXT_UMAMI_ID && (
  <Script
    src="https://analytics.umami.is/script.js"
    data-website-id={process.env.NEXT_UMAMI_ID}
    strategy="afterInteractive"
  />
)}
```

### Common Mistakes

- Not checking Search Console for weeks/months (issues compound)
- Only running lab tests (Lighthouse) without monitoring field data (CrUX)
- Ignoring the "Excluded" tab in the Coverage report (often reveals canonicalization problems)
- Not setting up email alerts for manual actions or security issues
- Not monitoring structured data errors (broken schema = lost rich results)

---

## 15. Next.js Specific SEO

### What It Is and Why It Matters

Next.js 15 provides built-in primitives for SEO that, when used correctly, handle the technical foundations automatically. Using the framework's native APIs (instead of fighting them) ensures best practices are maintained as the framework evolves.

### Key APIs and Their Purpose

| API                      | Purpose                                                                           |
| ------------------------ | --------------------------------------------------------------------------------- |
| `metadata` export        | Static metadata for pages that do not need dynamic data                           |
| `generateMetadata()`     | Dynamic metadata based on params, fetched data                                    |
| `sitemap.ts`             | Auto-generates `/sitemap.xml`                                                     |
| `robots.ts`              | Auto-generates `/robots.txt`                                                      |
| `next/image`             | Automatic WebP/AVIF, srcset, lazy loading, CLS prevention                         |
| `next/font`              | Self-hosted fonts, zero layout shift, `font-display: swap`                        |
| `next/script`            | Script loading strategies (`beforeInteractive`, `afterInteractive`, `lazyOnload`) |
| `generateStaticParams()` | SSG for dynamic routes                                                            |
| `opengraph-image.tsx`    | Auto-generate OG images at build time                                             |

### Implementation Checklist

- [ ] Use static `metadata` export for pages with fixed metadata (homepage, about, privacy)
- [ ] Use `generateMetadata()` for dynamic pages (blog posts, tool pages with params)
- [ ] Do NOT use `generateMetadata` for static pages (unnecessary overhead)
- [ ] Export `sitemap.ts` from `app/` with all canonical, indexable URLs
- [ ] Export `robots.ts` from `app/` with appropriate rules
- [ ] Use `next/image` for ALL images with appropriate `priority`, `sizes`, `alt`
- [ ] Use `next/font` for ALL fonts (eliminates external font requests and CLS)
- [ ] Use `next/script` with appropriate strategy:
  - `beforeInteractive`: Critical scripts (rarely needed)
  - `afterInteractive`: Analytics, tag managers
  - `lazyOnload`: Non-critical third-party scripts
- [ ] Use `generateStaticParams` for blog posts and other SSG-eligible dynamic routes
- [ ] Set canonical URLs via `alternates.canonical` in metadata
- [ ] Set OpenGraph metadata (title, description, images, type, locale)
- [ ] Set Twitter Card metadata (card type, title, description, image)
- [ ] Implement JSON-LD structured data as `<script>` tags in Server Components
- [ ] Use `opengraph-image.tsx` for dynamic OG image generation (or provide static OG images)

```typescript
// app/page.tsx — Static metadata for homepage
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Islamful — Your Complete Islamic Companion',
  description: 'Free Islamic tools: accurate prayer times, AI halal checker, Quran, duas, and more. Built for every Muslim.',
  alternates: {
    canonical: 'https://islamful.com',
    languages: {
      en: 'https://islamful.com',
      ar: 'https://islamful.com/ar',
      'x-default': 'https://islamful.com',
    },
  },
  openGraph: {
    title: 'Islamful — Your Complete Islamic Companion',
    description: 'Free Islamic tools: accurate prayer times, AI halal checker, Quran, duas, and more.',
    url: 'https://islamful.com',
    siteName: 'Islamful',
    locale: 'en_US',
    type: 'website',
    images: [{ url: 'https://islamful.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Islamful — Your Complete Islamic Companion',
    description: 'Free Islamic tools for every Muslim.',
    images: ['https://islamful.com/og-image.png'],
  },
}

// app/blog/[slug]/page.tsx — Dynamic metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = allBlogs.find((p) => p.slug === params.slug)
  if (!post) return { title: 'Not Found' }

  return {
    title: `${post.title} | Islamful`,
    description: post.summary,
    alternates: {
      canonical: `https://islamful.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.lastmod,
      images: post.images || ['https://islamful.com/og-default.png'],
    },
  }
}

// Generate static params for SSG
export async function generateStaticParams() {
  return allBlogs.map((post) => ({ slug: post.slug }))
}

// next/script for third-party scripts
import Script from 'next/script'

// Analytics — loads after page is interactive
<Script
  src="https://analytics.umami.is/script.js"
  data-website-id={process.env.NEXT_UMAMI_ID}
  strategy="afterInteractive"
/>

// Non-critical widget — loads after everything else
<Script
  src="https://some-widget.com/embed.js"
  strategy="lazyOnload"
/>
```

### Common Mistakes

- Using `generateMetadata` on static pages where a simple `metadata` export suffices
- Forgetting to set `canonical` in the `alternates` field (leaves canonicalization ambiguous)
- Using `<img>` instead of `next/image` (loses automatic optimization, srcset, CLS prevention)
- Loading Google Fonts via `<link>` instead of `next/font` (extra network request, CLS risk)
- Setting `ssr: false` on components containing indexable content
- Not using `generateStaticParams` for blog posts (forces SSR on every request instead of SSG)
- Missing OG image metadata (pages appear as plain text links when shared on social media)
- Not escaping `<` in JSON-LD output (XSS vulnerability; use `.replace(/</g, '\\u003c')`)

---

## Quick Reference: Combined Implementation Priority

For a Next.js site like Islamful, here is the recommended order of implementation by impact:

| Priority | Area                                                        | Why                                |
| -------- | ----------------------------------------------------------- | ---------------------------------- |
| 1        | **Metadata API** (title, description, canonical, OG)        | Foundation of on-page SEO          |
| 2        | **Structured Data** (JSON-LD)                               | Rich results = higher CTR          |
| 3        | **Core Web Vitals** (next/image, next/font, code splitting) | Direct ranking signal              |
| 4        | **Hreflang / International SEO**                            | Critical for en/ar bilingual site  |
| 5        | **Sitemap + robots.txt**                                    | Crawling foundation                |
| 6        | **HTTPS + Security Headers**                                | Page experience signal             |
| 7        | **AI Overview Optimization**                                | Emerging traffic source            |
| 8        | **Accessibility**                                           | SEO overlap + legal compliance     |
| 9        | **Monitoring** (Search Console, analytics)                  | Detect regressions                 |
| 10       | **Mobile optimization**                                     | Already default in Next.js, verify |

---

## Sources

- [Core Web Vitals Thresholds - web.dev](https://web.dev/articles/defining-core-web-vitals-thresholds)
- [Core Web Vitals 2026: INP, LCP & CLS Optimization](https://www.digitalapplied.com/blog/core-web-vitals-2026-inp-lcp-cls-optimization-guide)
- [Core Web Vitals and Google Search Results - Google Search Central](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [Most Important Core Web Vitals Metrics 2026 - NitroPack](https://nitropack.io/blog/most-important-core-web-vitals-metrics/)
- [Robots.txt Introduction - Google Search Central](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Build and Submit a Sitemap - Google Search Central](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Canonical URLs - Google Search Central](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Robots.txt and SEO 2026 - Search Engine Land](https://searchengineland.com/robots-txt-seo-453779)
- [Structured Data Introduction - Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Schema Markup Best Practices 2026 - Geneo](https://geneo.app/blog/schema-markup-best-practices-2026-json-ld-audit/)
- [Structured Data SEO 2026 Rich Results Guide](https://www.digitalapplied.com/blog/structured-data-seo-2026-rich-results-guide)
- [Google AI Overviews Optimization 2026 - Averi](https://www.averi.ai/blog/google-ai-overviews-optimization-how-to-get-featured-in-2026)
- [AI Overviews Optimization Guide - LinkGraph](https://www.linkgraph.com/blog/ai-overviews-optimization/)
- [How to Rank in Google AI Overviews 2026 - Snezzi](https://snezzi.com/blog/how-to-appear-in-google-ai-overviews-a-2025-visibility-guide/)
- [Get Cited in Google AI Overviews - Digital Web Xpert](https://www.digitalwebxpert.com/get-cited-google-ai-overviews/)
- [generateMetadata - Next.js Docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Metadata and OG Images - Next.js Docs](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js 15 SEO Complete Guide](https://www.digitalapplied.com/blog/nextjs-seo-guide)
- [Complete Next.js SEO Guide - Adeel Imran](https://www.adeelhere.com/blog/2025-12-09-complete-nextjs-seo-guide-from-zero-to-hero)
- [Hreflang Implementation Guide - LinkGraph](https://www.linkgraph.com/blog/hreflang-implementation-guide/)
- [Localized Versions - Google Search Central](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [X-Default Hreflang Tags - Amsive](https://www.amsive.com/insights/seo/x-default-hreflang-tags-for-international-seo-path-interactive/)
- [Security Headers Guide - Barrion](https://barrion.io/blog/security-headers-guide)
- [Security Headers Adoption Study 2026](https://appsecsanta.com/research/security-headers-study-2026)
- [Security HTTP Headers for SEO - Zeo](https://zeo.org/resources/blog/security-http-headers-you-need-to-know-for-seo-http-headers-optimization)
- [Image SEO 2026 Visual Search Guide](https://www.digitalapplied.com/blog/image-seo-2026-visual-search-optimization-guide)
- [Image Optimization for the Web 2026 - NitroPack](https://nitropack.io/blog/image-optimization-for-the-web-the-essential-guide/)
- [High Performance Images 2026 - Request Metrics](https://requestmetrics.com/web-performance/high-performance-images/)
- [Mobile SEO 2026 Mobile-First Indexing](https://www.digitalapplied.com/blog/mobile-seo-2026-mobile-first-indexing-guide)
- [Mobile-First Indexing Best Practices 2026 - PageTest.AI](https://pagetest.ai/blog/mobile-first-indexing-best-practices-2026)
- [Accessibility as a Ranking Factor 2026 - SearchAtlas](https://searchatlas.com/blog/accessibility-a11y-seo-ranking-factor-2026/)
- [Semantic HTML for SEO - SearchAtlas](https://searchatlas.com/blog/semantic-html/)
- [Header Structure SEO 2026](https://designindc.com/blog/why-header-structure-still-matters-in-2026/)
- [URL Structure for SEO 2026](https://dmb.sg/blog/url-structure-for-seo/)
- [Trailing Slash SEO - Safari Digital](https://www.safaridigital.com.au/blog/trailing-slash-seo/)
- [To Slash or Not to Slash - Google Search Central](https://developers.google.com/search/blog/2010/04/to-slash-or-not-to-slash)
- [Google Search Console Complete Guide 2026 - ALM Corp](https://almcorp.com/blog/google-search-console-complete-guide/)
- [Optimize Long Tasks - web.dev](https://web.dev/articles/optimize-long-tasks)
- [Optimize INP - web.dev](https://web.dev/articles/optimize-inp)
- [JSON-LD Guide - Next.js Docs](https://nextjs.org/docs/app/guides/json-ld)
- [Next.js SEO Optimization Guide 2026 - Djamware](https://www.djamware.com/post/697a19b07c935b6bb054313e/next-js-seo-optimization-guide--2026-edition)
- [Next.js sitemap.xml - Next.js Docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [On-Page SEO Checklist 2026 - Pentame](https://www.pentame.com/blog/on-page-seo-checklist-2026-top-10-proven-ranking-fixes/)
- [Title Tags and Meta Descriptions 2026 - Straight North](https://www.straightnorth.com/blog/title-tags-and-meta-descriptions-how-to-write-and-optimize-them-in-2026/)
- [Mixed Content - MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content)
- [Content Security Policy - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
