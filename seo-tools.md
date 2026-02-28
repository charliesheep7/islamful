# SEO Guide for Islamful Tool Pages & Programmatic (pSEO) Pages

> Reference this document whenever building, improving, or auditing tool pages on islamful.com.
> Last updated: February 2026.

---

## Table of Contents

1. [Tool Page Architecture](#1-tool-page-architecture)
2. [Metadata: Title Tags & Meta Descriptions](#2-metadata-title-tags--meta-descriptions)
3. [Structured Data (JSON-LD)](#3-structured-data-json-ld)
4. [Programmatic City Pages (pSEO)](#4-programmatic-city-pages-pseo)
5. [Content Strategy: Helpful vs Thin](#5-content-strategy-helpful-vs-thin)
6. [Internal Linking](#6-internal-linking)
7. [Bilingual (en/ar) Requirements](#7-bilingual-enar-requirements)
8. [Sitemap & Indexing](#8-sitemap--indexing)
9. [Performance & Core Web Vitals](#9-performance--core-web-vitals)
10. [OpenGraph & Social Cards](#10-opengraph--social-cards)
11. [FAQ Schema: Current State](#11-faq-schema-current-state)
12. [Checklist: New Tool Page](#12-checklist-new-tool-page)
13. [Checklist: New pSEO City/Location Page](#13-checklist-new-pseo-citylocation-page)
14. [Common Mistakes to Avoid](#14-common-mistakes-to-avoid)

---

## 1. Tool Page Architecture

Every tool on Islamful follows a **hub-and-spoke** model:

```
/prayer-times                  ← Hub page (the tool itself)
/prayer-times/london           ← Spoke page (city-specific pSEO)
/prayer-times/new-york         ← Spoke page
/ar/prayer-times               ← Arabic hub
/ar/prayer-times/london        ← Arabic spoke
```

### Hub Page Responsibilities

- Contains the interactive tool (e.g., PrayerTimes component)
- Links to ALL spoke pages, organized by region
- Has its own SEO content section below the fold
- Uses `WebApplication` schema
- Targets the broad keyword (e.g., "prayer times")

### Spoke Page Responsibilities

- Contains the tool pre-loaded with city-specific data
- Links back to hub + links to related spokes (same region first)
- Has city-specific unique content (not just string interpolation)
- Uses `WebPage` schema with `isPartOf` referencing the hub's `WebApplication`
- Targets the long-tail keyword (e.g., "prayer times in London")

### File Structure Convention

```
app/
  {tool-slug}/
    page.tsx                    # English hub
    [city]/page.tsx             # English spoke (if applicable)
  [lang]/
    {tool-slug}/
      page.tsx                  # Arabic hub
      [city]/page.tsx           # Arabic spoke (if applicable)
```

---

## 2. Metadata: Title Tags & Meta Descriptions

### Title Tag Rules

| Rule                | Details                                              |
| ------------------- | ---------------------------------------------------- |
| Max length          | 60 characters (600px). Google truncates beyond this. |
| Format — Hub        | `{Tool Name} — {Subtitle} \| Islamful`               |
| Format — Spoke      | `{Tool} in {City} Today \| Islamful`                 |
| Format — Arabic Hub | `{Arabic Tool Name} — {Arabic Subtitle}`             |
| Brand               | Always end with `\| Islamful` (or Arabic equivalent) |
| Primary keyword     | Must appear in the first 30 characters               |

#### Examples

```
Hub:    Prayer Times — Accurate Salah Times for Any City | Islamful     (58 chars ✓)
Spoke:  Prayer Times in London Today | Islamful                         (42 chars ✓)
Spoke:  Prayer Times in Kuala Lumpur | Islamful                         (44 chars ✓)
```

For cities with very long names, drop "Today" to stay under 60:

```
Prayer Times in Johannesburg | Islamful                                 (44 chars ✓)
```

### Meta Description Rules

| Rule                | Details                                                    |
| ------------------- | ---------------------------------------------------------- |
| Max length          | 155 characters                                             |
| NO keyword stuffing | Don't repeat city name multiple times                      |
| Include date signal | Mention "today" or the actual date for freshness           |
| Natural language    | Write for humans, not search engines                       |
| CTA element         | Include a differentiator ("Free", "no app required", etc.) |

#### Hub Description Template

```
{Brief tool description} for {scope}. {Key feature}. Free online tool — no app required.
```

Example:

```
Accurate prayer times for Fajr, Dhuhr, Asr, Maghrib & Isha for 50+ cities worldwide. Multiple calculation methods. Free online tool.
```

#### Spoke Description Template

```
Accurate {tool data} for {City}, {Country} — {key details} for today. Updated daily. Free, no app required.
```

Example:

```
Accurate prayer times for London, UK — Fajr, Dhuhr, Asr, Maghrib & Isha for today. Updated daily. Free, no app required.
```

**Bad example (keyword stuffing — do NOT do this):**

```
Today's prayer times in London, United Kingdom. Fajr London, Dhuhr London, Asr, Maghrib, and Isha.
```

### Implementation

Use `generateMetadata()` for dynamic pages, static `metadata` export for static pages. Always use `buildLanguageAlternates()` for canonical/hreflang — never hardcode URLs.

```tsx
// Hub page (static metadata)
export const metadata: Metadata = {
  title: 'Prayer Times — Accurate Salah Times for Any City | Islamful',
  description: 'Accurate prayer times for Fajr, Dhuhr, Asr, Maghrib & Isha...',
  alternates: buildLanguageAlternates('/prayer-times'),
}

// Spoke page (dynamic metadata)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getCityBySlug(slug)
  return {
    title: `Prayer Times in ${city.name} Today | Islamful`,
    description: `Accurate prayer times for ${city.name}, ${city.country}...`,
    alternates: buildLanguageAlternates(`/prayer-times/${city.slug}`),
    openGraph: { ... },
  }
}
```

---

## 3. Structured Data (JSON-LD)

### Which Schema Types to Use

| Page Type         | Primary Schema                         | Rich Result?                   | Notes                                         |
| ----------------- | -------------------------------------- | ------------------------------ | --------------------------------------------- |
| Tool Hub          | `WebApplication`                       | No                             | Semantically correct, no visible rich result  |
| Tool Spoke (city) | `WebPage` + `isPartOf: WebApplication` | No                             | Links spoke to hub semantically               |
| Blog Post         | `Article`                              | Yes (date, author)             | ContentLayer may handle this                  |
| FAQ section       | `FAQPage`                              | No (restricted since Aug 2023) | Keep for AI Overviews / Bing                  |
| All pages         | `BreadcrumbList`                       | Yes                            | Already implemented via Breadcrumbs component |
| Site-wide         | `Organization`                         | Yes (knowledge panel)          | In root layout                                |
| Site-wide         | `WebSite` + `SearchAction`             | Yes (sitelinks search)         | In root layout                                |

### Hub Page Schema Template

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Islamful Prayer Times",
  "description": "Accurate prayer times for any location worldwide...",
  "url": "https://www.islamful.com/prayer-times",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Web",
  "inLanguage": "en",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

### Spoke Page Schema Template

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Prayer Times in London Today",
  "description": "Today's prayer times for London, United Kingdom",
  "url": "https://www.islamful.com/prayer-times/london",
  "dateModified": "2026-02-28",
  "inLanguage": "en",
  "isPartOf": {
    "@type": "WebApplication",
    "name": "Islamful Prayer Times",
    "url": "https://www.islamful.com/prayer-times",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  },
  "about": {
    "@type": "City",
    "name": "London",
    "containedInPlace": {
      "@type": "Country",
      "name": "United Kingdom"
    }
  }
}
```

The `about: City` entity helps Google understand geographic scope and can improve local search performance.

### Key Rules

- Always include `inLanguage` (`"en"` or `"ar"`)
- Always include `dateModified` on spoke pages (dynamic content)
- Hub and spoke schemas should reference each other via `isPartOf`
- Use absolute URLs (`https://www.islamful.com/...`), never relative
- The `@context` is added automatically by the `JsonLd` component

---

## 4. Programmatic City Pages (pSEO)

### The Core Principle

> Every piece of content on a pSEO page must be **genuinely different from city to city because of the underlying data**, not just because you swapped a string.

Google's March 2024 core update specifically targets "scaled content abuse" — programmatic pages that exist solely to match search queries without providing unique value.

### What Makes a City Page "Unique Enough"

#### Data-Driven Uniqueness (Required)

These elements are different per city because the data itself differs:

| Element            | Why It's Unique                             | Implementation                 |
| ------------------ | ------------------------------------------- | ------------------------------ |
| Prayer times       | Different lat/lng = different times         | Server-fetched via Aladhan API |
| Calculation method | Each country/region uses a different method | `city.method` from cities data |
| Hijri date         | Same globally but contextualizes the page   | Already implemented            |
| Coordinates        | Genuinely unique                            | Already shown in SEO text      |
| Timezone           | Varies by city                              | Available in city data         |

#### Contextual Uniqueness (Recommended to Add)

| Element                        | Why It Adds Value                                                                | Implementation                   |
| ------------------------------ | -------------------------------------------------------------------------------- | -------------------------------- |
| Calculation method explanation | "London uses Moonsighting Committee (method 15), recommended by most UK mosques" | Map `city.method` to a paragraph |
| Seasonal variation note        | "In Stockholm, Fajr ranges from 3:15 AM (summer) to 6:45 AM (winter)"            | Calculable from lat/lng          |
| Qibla direction                | Genuinely unique bearing per city                                                | Calculate from coordinates       |
| Monthly prayer timetable       | Full month's data, unique per city                                               | Fetch from API                   |

#### What NOT to Add

- AI-generated paragraphs about the city ("London is the capital of England...")
- Generic Islamic content that's the same on every page
- Keyword-stuffed text ("Fajr London, Dhuhr London, Asr London...")
- Tourism information or unrelated city facts

### City Data Structure

Each city in `data/cities.ts` should include:

```ts
export interface City {
  slug: string // URL-safe identifier
  name: string // English display name
  nameAr: string // Arabic display name
  country: string // English country name
  countryAr: string // Arabic country name
  countryCode: string // ISO 3166-1 alpha-2
  lat: number // Latitude
  lng: number // Longitude
  method: number // Aladhan calculation method ID
  timezone: string // IANA timezone
}
```

### Scaling Rules

1. **Start with 50 cities. Do NOT expand to 500+ until the first 50 are indexed and ranking.**
2. Only add cities with meaningful search volume for "{tool} in {city}"
3. Monitor Google Search Console: if pages are stuck in "Discovered — currently not indexed," it signals thin content
4. Quality over quantity — Google penalizes "scaling content production primarily to manipulate rankings"

---

## 5. Content Strategy: Helpful vs Thin

### Google's Helpful Content Criteria (Post-March 2024)

Google asks these questions. Every tool page must pass:

| Question                                                        | How to Pass                                            |
| --------------------------------------------------------------- | ------------------------------------------------------ |
| "Would someone find this page useful if they came directly?"    | Tool works immediately, data is visible above the fold |
| "Does this provide substantial value vs. other pages in SERPs?" | Unique data, better UX, faster than competitors        |
| "Is this created for people, not search engines?"               | Content serves the user, not just keyword matching     |
| "Does the page have a primary purpose beyond ranking?"          | The tool has genuine utility                           |

### Hub Page Content Structure

```
1. H1: Tool name
2. Subtitle: Brief description
3. [THE INTERACTIVE TOOL — above the fold]
4. H2: City/Category links section (internal links)
5. H2: SEO content section (educational, keyword-rich)
   - What is {topic}?
   - How does {tool} work?
   - Why use Islamful for {topic}?
6. FAQ schema (visible Q&A pairs matching the JSON-LD)
```

### Spoke Page Content Structure

```
1. Breadcrumbs
2. H1: "{Tool} in {City}"
3. Date display (Gregorian + Hijri)
4. [THE TOOL WITH CITY-SPECIFIC DATA — above the fold]
5. H2: Other cities (contextual links)
6. SEO content section:
   - Calculation method explanation (city-specific)
   - Additional city-specific data points
```

### Content That Actually Differs Per City

The SEO content section on spoke pages should NOT be a generic template. It should reference city-specific data:

**Good (data-driven, unique):**

```
Prayer times in London are calculated using the Moonsighting Committee method
(method 15), which is recommended by most UK mosques and the East London Mosque.
London's high latitude (51.5°N) means significant seasonal variation — Fajr can
range from 2:30 AM in midsummer to 6:15 AM in midwinter.
```

**Bad (generic template with string swap):**

```
Prayer times in {city} are important for Muslims. Use Islamful to find accurate
prayer times for {city}. Never miss Fajr, Dhuhr, Asr, Maghrib, or Isha in {city}.
```

---

## 6. Internal Linking

### Hub-and-Spoke Links (Required)

| From                         | To                                 | Implementation                  |
| ---------------------------- | ---------------------------------- | ------------------------------- |
| Hub → All spokes             | Every city page linked from hub    | Group by region, render all     |
| Spoke → Hub                  | "View all cities →" link           | Always present                  |
| Spoke → Related spokes       | 12-16 contextual city links        | Same region first, then popular |
| Homepage → Hub               | ToolsGrid links to `/prayer-times` | Already done                    |
| Footer → Top spokes          | 6-8 popular cities                 | On every page                   |
| Blog posts → Relevant spokes | Contextual in-content links        | Manual in MDX                   |

### Contextual "Other Cities" Logic

On a spoke page, the "Other Cities" section should prioritize:

1. **Same country** (e.g., London → Manchester, Birmingham)
2. **Same region** (e.g., London → Paris, Berlin, Amsterdam)
3. **Globally popular** (e.g., Mecca, Medina, Istanbul)

Do NOT just show the first N cities from the array.

```tsx
// Pseudocode for contextual linking
const sameCountry = cities.filter((c) => c.countryCode === city.countryCode && c.slug !== city.slug)
const sameRegion = cities.filter((c) => getRegion(c) === getRegion(city) && c.slug !== city.slug)
const popular = ['mecca', 'medina', 'istanbul', 'london', 'new-york', 'dubai']
const otherCities = deduplicate([...sameCountry, ...sameRegion, ...popular.map(getCityBySlug)])
  .filter((c) => c.slug !== city.slug)
  .slice(0, 16)
```

### Cross-Tool Linking

At the bottom of each tool page, add a "More Islamic Tools" section linking to other live tools:

```tsx
<section>
  <h2>More Islamic Tools</h2>
  <div>{tools.filter(t => t.status === 'live' && t.slug !== currentSlug).map(...)}</div>
</section>
```

---

## 7. Bilingual (en/ar) Requirements

### Every Page Must Have Both Versions

If an English page exists, the Arabic version MUST also exist. Hreflang and sitemap reference both — if one is missing, Google sees broken hreflang signals.

### hreflang Implementation

Always use `buildLanguageAlternates()` from `app/seo.tsx`. Never hardcode URLs.

```tsx
// English page
alternates: buildLanguageAlternates('/prayer-times/london')

// Arabic page
alternates: buildLanguageAlternates('/prayer-times/london', { currentLanguage: 'ar' })
```

This ensures:

- Absolute URLs (prevents duplicate canonical errors)
- Correct `x-default` (only on English pages)
- Consistent `en` and `ar` hreflang tags

### Arabic Page Requirements

| Element               | Requirement                           |
| --------------------- | ------------------------------------- |
| `dir="rtl"`           | On the wrapper div                    |
| `font-arabic` class   | On Arabic text elements               |
| `inLanguage: "ar"`    | In JSON-LD schema                     |
| Arabic city name      | Use `city.nameAr` in H1 and content   |
| Arabic country name   | Use `city.countryAr` in descriptions  |
| Arabic metadata       | Title and description in Arabic       |
| Same interactive tool | Use `lang="ar"` prop on the component |

### Arabic Metadata Template

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getCityBySlug(slug)
  return {
    title: `مواقيت الصلاة في ${city.nameAr} اليوم | إسلامفُل`,
    description: `مواقيت صلاة دقيقة في ${city.nameAr}، ${city.countryAr} — الفجر والظهر والعصر والمغرب والعشاء. تُحدّث يومياً.`,
    alternates: buildLanguageAlternates(`/prayer-times/${city.slug}`, { currentLanguage: 'ar' }),
  }
}
```

---

## 8. Sitemap & Indexing

### Sitemap Structure

All pages are generated in `app/sitemap.ts`. Priority hierarchy:

| Page Type        | Priority | changeFrequency | lastModified   |
| ---------------- | -------- | --------------- | -------------- |
| Homepage         | 1.0      | weekly          | Static date    |
| Tool hubs (en)   | 0.9      | daily           | `today`        |
| Tool hubs (ar)   | 0.8      | daily           | `today`        |
| City spokes (en) | 0.8      | daily           | `today`        |
| City spokes (ar) | 0.7      | daily           | `today`        |
| Blog posts       | 0.7      | monthly         | `post.lastmod` |
| Static pages     | 0.3      | monthly         | Static date    |

Note: Google officially ignores `priority`, but other search engines may use it.

### Ensuring Indexing

1. **Internal links are the #1 signal.** Every spoke page must be linked from the hub, other spokes, and ideally the footer.
2. **Submit sitemap** in Google Search Console manually.
3. **Use URL Inspection** in GSC to request indexing for top 10 pages first.
4. **Monitor "Pages" report** in GSC:
   - "Discovered — currently not indexed" = Google found it but didn't bother crawling (thin content signal)
   - "Crawled — currently not indexed" = Google crawled it but didn't think it was worth indexing (quality issue)
5. **robots.txt** must allow all tool and city pages (currently correct).
6. **No `noindex` tags** on tool or city pages.

### Future: Sitemap Splitting

When you exceed 200+ URLs, consider splitting into multiple sitemaps:

- `sitemap-static.xml` — homepage, about, privacy, terms
- `sitemap-tools.xml` — tool hub pages
- `sitemap-cities.xml` — all city spoke pages
- `sitemap-blog.xml` — all blog posts

This helps monitor indexing per category in Search Console.

### IndexNow (Optional)

IndexNow (supported by Bing, Yandex) lets you ping search engines when pages change. Google does NOT support IndexNow. For Google, rely on sitemap + internal links.

---

## 9. Performance & Core Web Vitals

Tool pages are heavily judged on CWV because they serve interactive utility.

### Targets

| Metric | Target  | How to Achieve                                                           |
| ------ | ------- | ------------------------------------------------------------------------ |
| LCP    | < 2.5s  | SSG/ISR ensures fast TTFB. Keep above-fold content server-rendered.      |
| INP    | < 200ms | Minimize client-side JS. Tool interactions should be lightweight.        |
| CLS    | < 0.1   | Reserve space for dynamic content. No layout shifts from loading states. |
| TTFB   | < 200ms | SSG achieves this automatically. ISR revalidation is async.              |

### Key Principles

- **Server-render the initial data.** City pages fetch prayer times at build time via `fetchPrayerTimes()`. The first render has real data — no client-side loading spinner. This is excellent for CWV.
- **Client-side only for interactivity.** The countdown timer, method picker, etc. are client-side (`'use client'`). This is correct — the initial data is server-rendered.
- **No interstitials or popups.** Google demotes pages with intrusive interstitials.
- **Mobile-first.** Tool pages get 70%+ mobile traffic. Touch targets must be at least 48px.
- **Preconnect to APIs.** Add `<link rel="preconnect" href="https://api.aladhan.com">` in the root layout (already done).

### ISR Revalidation

Prayer time city pages use `{ next: { revalidate: 3600 } }` (1 hour). This is reasonable. Consider reducing to `1800` (30 minutes) for freshness signals on "today" queries.

---

## 10. OpenGraph & Social Cards

Every tool page needs proper OG tags for social sharing.

### Required OG Fields

```tsx
openGraph: {
  title: 'Prayer Times in London Today | Islamful',
  description: 'Accurate prayer times for London, UK...',
  url: 'https://www.islamful.com/prayer-times/london',
  siteName: 'Islamful',
  images: ['/static/images/og-image.png'],  // or tool-specific image
  type: 'website',
},
twitter: {
  title: 'Prayer Times in London Today | Islamful',
  description: 'Accurate prayer times for London, UK...',
  card: 'summary_large_image',
  images: ['/static/images/og-image.png'],
},
```

### Best Practice

- Use `genPageMetadata()` from `app/seo.tsx` for consistent OG generation
- If you create tool-specific OG images (e.g., `/static/images/og-prayer-times.png`), pass them as the `image` parameter
- The fallback is `siteMetadata.socialBanner` (`/static/images/og-image.png`)

---

## 11. FAQ Schema: Current State

### Important: FAQ Rich Results Are Restricted

Since August 2023, Google only shows FAQ rich results for well-known, authoritative government and health websites. For Islamful:

- FAQ schema **will NOT generate visible rich results in Google SERPs**
- It **is still valid** and passes the Rich Results Test
- It **may be used by AI Overviews** (Google SGE) as source material
- **Bing still shows** FAQ rich results more broadly
- **No harm** in keeping it — marginal benefits for voice search and AI citations

### Recommendation

Keep FAQ schema on hub pages. Don't invest significant effort expanding it to every spoke page. Focus effort on `BreadcrumbList` (visible rich result, already implemented) and `HowTo` schema on relevant blog posts.

### When to Add FAQ Schema

- Hub tool pages: Yes (already done for prayer-times and haram-check)
- Spoke city pages: Optional (low ROI, but no harm)
- Blog posts: Only if the post is structured as Q&A

---

## 12. Checklist: New Tool Page

When adding a new tool (e.g., `/dua`, `/dhikr`, `/zakat-calculator`):

### Files to Create

- [ ] `app/{slug}/page.tsx` — English hub page
- [ ] `app/[lang]/{slug}/page.tsx` — Arabic hub page
- [ ] `components/tools/{Component}.tsx` — The tool component

### Metadata

- [ ] Title under 60 characters with primary keyword
- [ ] Natural meta description under 155 characters
- [ ] `buildLanguageAlternates('/{slug}')` for canonical/hreflang
- [ ] OpenGraph title, description, url, image
- [ ] Twitter card metadata

### Structured Data

- [ ] `WebApplication` schema with `name`, `description`, `url`, `applicationCategory`, `operatingSystem`, `inLanguage`, `offers`
- [ ] `BreadcrumbList` via `<Breadcrumbs>` component
- [ ] `FAQPage` schema if applicable (on hub page only)

### Content

- [ ] H1 with primary keyword
- [ ] Brief subtitle/description
- [ ] Interactive tool above the fold
- [ ] SEO content section below the fold (educational, not keyword-stuffed)
- [ ] Cross-links to other tools at the bottom

### Arabic Version

- [ ] Arabic title and description
- [ ] `dir="rtl"` on wrapper
- [ ] `font-arabic` class on Arabic text
- [ ] `inLanguage: "ar"` in schema
- [ ] Tool component with `lang="ar"` prop
- [ ] Same FAQ/SEO content translated to Arabic

### Registration

- [ ] Add to `data/tools.ts` with `status: 'live'`
- [ ] Add to `data/headerNavLinks.ts` if it should appear in navigation
- [ ] Verify tool appears in sitemap (`app/sitemap.ts` auto-includes live tools)
- [ ] Add tool link to `components/Footer.tsx`

---

## 13. Checklist: New pSEO City/Location Page

When adding city-specific pages for a tool (e.g., prayer times by city):

### Files to Create

- [ ] `app/{tool}/[city]/page.tsx` — English spoke with `generateStaticParams()`
- [ ] `app/[lang]/{tool}/[city]/page.tsx` — Arabic spoke with `generateStaticParams()`

### Data

- [ ] Add city entries to `data/cities.ts` (or relevant data file)
- [ ] Include: slug, name, nameAr, country, countryAr, countryCode, lat, lng, method, timezone

### Metadata (per city)

- [ ] `generateMetadata()` with city-specific title/description
- [ ] Title: `{Tool} in {City} Today | Islamful` (under 60 chars)
- [ ] Description: natural language, no keyword stuffing
- [ ] `buildLanguageAlternates('/tool/city-slug')` — never hardcode URLs
- [ ] OpenGraph with city-specific title and URL
- [ ] Twitter card

### Structured Data (per city)

- [ ] `WebPage` schema with `isPartOf: WebApplication` referencing the hub
- [ ] `about: City` entity with `containedInPlace: Country`
- [ ] `dateModified` set to current date
- [ ] `inLanguage` set correctly
- [ ] `BreadcrumbList` via Breadcrumbs component: Home → Tool → City

### Content (per city)

- [ ] City-specific H1
- [ ] Server-rendered tool data above the fold (no client-side loading for initial render)
- [ ] Contextual "Other Cities" links (same region first, then popular)
- [ ] "View all cities →" link back to hub
- [ ] City-specific SEO text (data-driven, not generic)

### Hub Page Updates

- [ ] Hub page links to ALL new city pages, organized by region
- [ ] Arabic hub also links to all Arabic city pages

### Sitemap

- [ ] Verify new cities appear in sitemap (auto if using `cities.map(...)`)
- [ ] Both English and Arabic versions included
- [ ] `changeFrequency: 'daily'`, `priority: 0.8`

### Indexing Verification

- [ ] Submit sitemap in GSC after deploy
- [ ] Use URL Inspection on 3-5 new city pages
- [ ] Monitor "Pages" report after 1-2 weeks
- [ ] If "Discovered — not indexed": add more internal links, enrich content

---

## 14. Common Mistakes to Avoid

### Metadata Mistakes

| Mistake                           | Why It's Bad                                          | Fix                               |
| --------------------------------- | ----------------------------------------------------- | --------------------------------- |
| Hardcoding URLs in alternates     | Causes duplicate canonical errors between www/non-www | Use `buildLanguageAlternates()`   |
| Title over 60 chars               | Gets truncated in SERPs                               | Keep under 60 chars               |
| Keyword-stuffed descriptions      | Looks spammy, reduces CTR                             | Write natural language            |
| Missing OG image                  | Poor social sharing appearance                        | Always include `openGraph.images` |
| Forgetting `inLanguage` in schema | Google can't determine content language               | Always add to JSON-LD             |

### Content Mistakes

| Mistake                          | Why It's Bad                     | Fix                                 |
| -------------------------------- | -------------------------------- | ----------------------------------- |
| Same text with city name swapped | "Scaled content abuse" penalty   | Use data-driven unique content      |
| AI-generated city descriptions   | Explicitly flagged by Google HCU | Only use real data differences      |
| No SEO text at all               | Page appears thin to Google      | Add meaningful below-fold content   |
| Generic FAQ on every page        | Duplicate content signal         | Only FAQ on hub, or unique per page |

### Linking Mistakes

| Mistake                      | Why It's Bad                            | Fix                               |
| ---------------------------- | --------------------------------------- | --------------------------------- |
| Not linking hub → all spokes | Spokes don't get discovered/indexed     | Hub must link to every spoke      |
| Random "other cities" list   | Missed contextual relevance signal      | Same region first, then popular   |
| Missing Arabic version       | Broken hreflang, 404 for Google         | Always create both en + ar pages  |
| hreflang pointing to 404     | Critical SEO error, wastes crawl budget | Verify all hreflang targets exist |

### Performance Mistakes

| Mistake                              | Why It's Bad                   | Fix                               |
| ------------------------------------ | ------------------------------ | --------------------------------- |
| Client-side data fetch on spoke page | Loading spinner = bad LCP, CLS | Server-fetch with ISR             |
| Huge "other cities" section          | Slow page weight               | Limit to 16 links, lazy-load rest |
| No preconnect to APIs                | Slow subsequent fetches        | Add `<link rel="preconnect">`     |

---

## Quick Reference: Files That Matter

| File                             | Purpose                                          |
| -------------------------------- | ------------------------------------------------ |
| `app/seo.tsx`                    | `buildLanguageAlternates()`, `genPageMetadata()` |
| `components/seo/JsonLd.tsx`      | Reusable JSON-LD component                       |
| `components/seo/Breadcrumbs.tsx` | Breadcrumbs with BreadcrumbList schema           |
| `data/tools.ts`                  | Tool registry (all tools, status)                |
| `data/cities.ts`                 | City data for pSEO pages                         |
| `data/siteMetadata.js`           | Site-wide metadata, URLs, branding               |
| `app/sitemap.ts`                 | Sitemap generation                               |
| `app/robots.ts`                  | Robots.txt                                       |
| `next.config.js`                 | CSP, security headers, image config              |
