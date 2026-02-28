# Islamful.com — Refactor Plan

> Transforming the Deen Back single-app marketing site into **Islamful.com**, an all-in-one Islamic tools platform with SEO-driven blog content.

---

## 1. Vision & Positioning

**Deen Back** = single iOS app marketing site (addiction recovery niche)
**Islamful** = comprehensive Islamic tools web platform (broad audience)

Islamful.com is the Muslim's daily companion on the web — prayer times, halal/haram checker, Quran tools, dua collections, and more — monetized through organic SEO traffic and (eventually) app downloads.

---

## 2. Site Architecture

### 2.1 URL Structure

```
islamful.com/                        → Homepage (tool directory + value prop)
islamful.com/prayer-times            → Prayer times tool (by location)
islamful.com/haram-check             → Is This Haram? checker tool
islamful.com/quran                   → Quran reader/search (future)
islamful.com/dua                     → Dua collection (future)
islamful.com/dhikr                   → Dhikr counter (future)
islamful.com/names-of-allah          → 99 Names of Allah (future)
islamful.com/islamic-calendar        → Hijri calendar (future)
islamful.com/zakat-calculator        → Zakat calculator (future)

islamful.com/blog                    → Blog index
islamful.com/blog/[slug]             → Blog posts (SEO content)
islamful.com/blog/page/[n]           → Blog pagination
islamful.com/tags/[tag]              → Tag archive pages

islamful.com/about                   → About
islamful.com/privacy                 → Privacy policy
islamful.com/terms                   → Terms of service

islamful.com/ar/...                  → Arabic mirror (all routes)
```

### 2.2 Information Architecture

```
Homepage
├── Tool Cards Grid (primary navigation to tools)
├── Featured Blog Posts (SEO entry points)
└── CTA (app download / newsletter)

/prayer-times (Tool Page)
├── Tool UI (interactive, client-side)
├── SEO content below fold (what are prayer times, how they work)
├── Related blog posts
└── Schema: SoftwareApplication or WebApplication

/haram-check (Tool Page)
├── Tool UI (search/input → answer)
├── SEO content below fold
├── Related blog posts
└── Schema: WebApplication + FAQPage

/blog/[slug] (Blog Post)
├── Article content (MDX)
├── Embedded tool widget (optional, e.g. haram checker inline)
├── FAQPage schema
├── Related posts
└── Internal links to tools (upward) and related posts (lateral)
```

### 2.3 Internal Linking Strategy

- **Upward links**: Blog posts → Tool pages (e.g., "Check if something is halal with our [Haram Checker](/haram-check)")
- **Lateral links**: Blog post ↔ Blog post (related content)
- **Downward links**: Tool pages → Relevant blog posts
- **Navigation**: Header always shows top tools + Blog

---

## 3. Technical SEO Checklist Implementation

### 3.1 Information Architecture / Routing

- [ ] All tool pages return 200
- [ ] Old Deen Back URLs → 301 redirect (or remove if not indexed)
- [ ] Custom 404 page with links to tools
- [ ] Clean, semantic URLs (no query params for core pages)
- [ ] Flat URL hierarchy (islamful.com/tool-name, not /tools/tool-name)

### 3.2 Crawling & Indexing

- [ ] `robots.txt` — allow all, point to sitemap
- [ ] `sitemap.xml` — auto-generated, includes all tool pages + blog posts + tag pages
- [ ] `lastmod` on all sitemap entries (real dates, not current date)
- [ ] `<link rel="canonical">` on every page (absolute URLs)
- [ ] `hreflang` tags (en ↔ ar) on all pages with Arabic equivalents
- [ ] No duplicate content (canonical handles www vs non-www)
- [ ] Ping Google/Bing on sitemap update (via GSC API or manual)

### 3.3 Structured Data (Schema.org)

- [ ] **Homepage**: `Organization` + `WebSite` with `SearchAction`
- [ ] **Tool pages**: `WebApplication` (name, description, applicationCategory: "LifestyleApplication")
- [ ] **Blog posts**: `Article` with author, datePublished, dateModified, image
- [ ] **FAQ sections**: `FAQPage` schema (on tool pages + blog posts with FAQs)
- [ ] **Breadcrumbs**: `BreadcrumbList` on all inner pages
- [ ] Validate with Google Rich Results Test

### 3.4 Performance / Core Web Vitals

- [ ] LCP < 2.5s — SSG for tool pages, preload hero images
- [ ] CLS < 0.1 — explicit dimensions on all images, font-display: swap
- [ ] INP < 200ms — minimize client-side JS on landing, lazy-load tool interactivity
- [ ] SSG/ISR for blog posts (already via ContentLayer)
- [ ] SSR for dynamic tool data (prayer times by location)
- [ ] WebP/AVIF images (already using next/image)
- [ ] Lazy load below-fold images and tool widgets
- [ ] CDN via Vercel Edge Network
- [ ] Cache headers on static assets

### 3.5 On-Page SEO

- [ ] Unique `<title>` per page (50-60 chars) with primary keyword
- [ ] Unique `<meta description>` per page (150-160 chars)
- [ ] Single `<h1>` per page, keyword-rich
- [ ] Logical heading hierarchy (H1 → H2 → H3)
- [ ] Internal links in every blog post (upward to tools, lateral to related posts)
- [ ] `alt` text on all images
- [ ] Open Graph + Twitter Card meta on all pages

### 3.6 Observability

- [ ] Google Search Console connected
- [ ] GA4 or Umami analytics
- [ ] Monitor crawl errors in GSC
- [ ] Core Web Vitals monitoring

---

## 4. Refactoring Steps

### Phase 1: Rebrand & Clean Up (Day 1)

1. **Update `data/siteMetadata.js`**
   - title: "Islamful — Your Complete Islamic Companion"
   - author: "Islamful"
   - description: new description about all-in-one Islamic tools
   - siteUrl: "https://www.islamful.com"
   - email: update to islamful email
   - headerTitle: "Islamful"

2. **Update `package.json`**
   - name: "islamful"

3. **Update `dictionaries/en.json` and `ar.json`**
   - Replace all "Deen Back" references with "Islamful"
   - Update hero text, feature descriptions, etc.

4. **Update `app/layout.tsx`**
   - Organization schema → "Islamful" + islamful.com
   - Update meta tags

5. **Replace brand assets**
   - New logo/icon for Islamful
   - New hero image (tools showcase instead of app screenshot)
   - New favicon set
   - New OG image

6. **Update `data/headerNavLinks.ts`**
   - Add tool links: Prayer Times, Haram Check
   - Keep Blog
   - Remove app-specific "Support" or repurpose

7. **Remove Deen Back-specific content**
   - Remove/rework Features.tsx (app features → tool cards)
   - Remove Testimonials.tsx (or adapt for Islamful)
   - Remove App Store CTAs from Hero, CTA components
   - Remove app-specific blog post

### Phase 2: New Homepage (Day 2)

1. **Redesign Homepage** (`app/page.tsx`)
   - Hero: "Your Complete Islamic Companion" + search/tool grid
   - Tool Cards section: grid of available tools with icons + descriptions
   - Featured Blog Posts: 3-4 latest posts
   - Newsletter CTA (optional)

2. **Create Tool Card component** (`components/ToolCard.tsx`)
   - Icon, title, description, link
   - Reusable across homepage + tool page sidebars

3. **Create `data/tools.ts`**
   - Central registry of all tools (name, slug, description, icon, status)
   - Used by homepage, navigation, sitemap, schema

### Phase 3: Tool Pages (Day 3-5)

1. **Create tool page layout** (`components/ToolPageLayout.tsx`)
   - Tool UI area (top)
   - SEO content area (below fold)
   - Related blog posts sidebar/section
   - Breadcrumbs
   - Schema.org structured data (WebApplication)

2. **Prayer Times** (`app/prayer-times/page.tsx`)
   - Use Aladhan API (https://aladhan.com/prayer-times-api) — free, no key needed
   - Geolocation or city search
   - Display 5 daily prayers + sunrise/sunset
   - SSR with ISR for SEO (pre-render popular cities)
   - SEO content: "What are the 5 daily prayers in Islam?"

3. **Haram Check** (`app/haram-check/page.tsx`)
   - Search input → categorized results
   - Can start with a curated JSON dataset of common items
   - Later: AI-powered answers with sources
   - SEO content: "Understanding Halal and Haram in Islam"
   - Embeddable widget component for blog posts

4. **Arabic versions** (`app/[lang]/prayer-times/page.tsx`, etc.)
   - Mirror all tool pages in Arabic

### Phase 4: Blog Infrastructure Upgrade (Day 3-4)

1. **Blog post MDX components for tool embeds**
   - `<HaramChecker />` — inline haram check widget
   - `<PrayerTimesWidget />` — inline prayer times
   - Register in `components/MDXComponents.tsx`

2. **Related posts component**
   - Auto-suggest based on shared tags
   - Manual override via frontmatter `relatedPosts: [slug1, slug2]`

3. **Breadcrumbs component** (`components/Breadcrumbs.tsx`)
   - Auto-generate from route
   - Schema.org BreadcrumbList JSON-LD

4. **Enhanced blog post schema**
   - Ensure `Article` schema includes all required fields
   - Add `FAQPage` schema when post has FAQs

5. **Internal linking helper**
   - Create a convention for linking to tools from blog posts
   - Standardized CTA blocks within content

### Phase 5: SEO Hardening (Day 5-6)

1. **Sitemap upgrade** (`app/sitemap.ts`)
   - Add all tool pages
   - Use real lastmod dates (not `new Date()`)
   - Add `changefreq` and `priority` hints

2. **Schema.org on all pages**
   - Homepage: Organization + WebSite + SearchAction
   - Tool pages: WebApplication
   - Blog: Article + FAQPage
   - All inner pages: BreadcrumbList

3. **Canonical & hreflang audit**
   - Ensure every page has absolute canonical URL
   - Ensure hreflang pairs are correct (en ↔ ar)
   - x-default points to English

4. **Performance audit**
   - Lighthouse CI baseline
   - Image optimization pass
   - Font subsetting review
   - JS bundle analysis

5. **robots.txt refinement**
   - Block crawling of API routes
   - Block crawling of internal assets

---

## 5. New Component Architecture

```
components/
├── Header.tsx              # Updated nav with tools dropdown
├── Footer.tsx              # Site footer with tool links, blog links, legal
├── Breadcrumbs.tsx         # NEW: auto breadcrumbs with schema
├── ToolCard.tsx            # NEW: tool preview card for homepage/sidebars
├── ToolPageLayout.tsx      # NEW: shared layout for all tool pages
├── RelatedPosts.tsx        # NEW: related blog posts section
├── ToolEmbed.tsx           # NEW: wrapper for embedding tools in blog posts
├── landing/
│   ├── Hero.tsx            # Rewrite: Islamful hero (not app-focused)
│   ├── ToolsGrid.tsx       # NEW: replaces Features.tsx
│   ├── FeaturedBlog.tsx    # NEW: latest blog posts section
│   └── CTA.tsx             # Rewrite: newsletter or general CTA
├── tools/
│   ├── PrayerTimes.tsx     # NEW: prayer times interactive UI
│   ├── HaramChecker.tsx    # NEW: haram check interactive UI
│   └── ... (future tools)
├── seo/
│   ├── JsonLd.tsx          # NEW: reusable JSON-LD component
│   └── Breadcrumbs.tsx     # NEW: breadcrumb schema + UI
└── ... (existing blog/layout components stay)
```

---

## 6. Data Architecture

```
data/
├── siteMetadata.js         # Updated for Islamful
├── headerNavLinks.ts       # Updated: tools + blog
├── tools.ts                # NEW: tool registry
│   export const tools = [
│     { slug: 'prayer-times', name: 'Prayer Times', ... },
│     { slug: 'haram-check', name: 'Haram Check', ... },
│     ...
│   ]
├── blog/
│   ├── en/                 # English blog posts
│   └── ar/                 # Arabic blog posts
└── authors/                # Author MDX files
```

---

## 7. Files to Delete

- `components/landing/Features.tsx` — replaced by ToolsGrid
- `components/landing/Testimonials.tsx` — not relevant for tools platform
- `components/landing/MediaTicker.tsx` — not relevant
- `components/status/CaseTracker.tsx` — Deen Back-specific
- `data/blog/en/how-to-build-daily-islamic-habits.mdx` — Deen Back content (or rewrite)
- Old Deen Back images (hero.webp, app store badges, app icon)

---

## 8. Blog Content Strategy (SEO)

### High-Intent Tool Pages (programmatic SEO potential)

- `/prayer-times/[city]` — "Prayer Times in [City]" (future: SSG for top 100 cities)
- `/haram-check/[item]` — "Is [Item] Haram?" (future: SSG for common queries)

### Blog Categories

1. **Prayer & Worship** — links to Prayer Times tool
2. **Halal & Haram** — links to Haram Check tool + embeds the checker
3. **Quran & Hadith** — links to future Quran tool
4. **Daily Dhikr & Dua** — links to future Dhikr tool
5. **Islamic Lifestyle** — general Islamic living content
6. **Ramadan & Occasions** — seasonal SEO spikes

### Example Blog Posts (with tool embeds)

- "Is Gelatin Haram? A Complete Guide" → embeds `<HaramChecker defaultQuery="gelatin" />`
- "How to Pray Fajr: Complete Guide" → embeds `<PrayerTimesWidget highlight="fajr" />`
- "10 Morning Duas Every Muslim Should Know" → links to Dua tool
- "Understanding Zakat: Calculator & Guide" → embeds Zakat calculator

---

## 9. Migration Risks & Mitigations

| Risk                                    | Mitigation                                                        |
| --------------------------------------- | ----------------------------------------------------------------- |
| Losing existing Deen Back indexed pages | 301 redirects if domain changes; remove if staying on same domain |
| Breaking Arabic/RTL support             | Test every tool page in both languages                            |
| Performance regression from tool JS     | Lazy-load tool components, SSG where possible                     |
| Content quality for SEO                 | Research keywords first, write E-E-A-T compliant content          |
| Scope creep on tools                    | Start with 2 tools (Prayer Times + Haram Check), ship, iterate    |

---

## 10. Priority Order

1. **Rebrand** — siteMetadata, layout, package.json, dictionaries
2. **Homepage redesign** — tool cards + featured posts
3. **Prayer Times tool** — highest search volume Islamic query
4. **Haram Check tool** — unique value prop, high engagement
5. **Blog infrastructure** — MDX embeds, internal linking, schema
6. **SEO hardening** — sitemap, schema, canonical audit, performance
7. **Content production** — 10-20 blog posts targeting tool-related keywords
8. **Arabic versions** — full i18n for all tool pages
9. **Future tools** — Quran, Dua, Dhikr, Names of Allah, Zakat Calculator, Islamic Calendar
