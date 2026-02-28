# Islamful — CLAUDE.md

## Project Overview

**Islamful** (`islamful.com`) is an all-in-one Islamic tools platform built with Next.js 15 + ContentLayer + Tailwind CSS v4 + Supabase Edge Functions. It provides web-based tools every Muslim needs daily (prayer times, AI-powered halal checker, Quran, dua, etc.) combined with an SEO-driven blog.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Content**: ContentLayer2 for MDX blog posts
- **Styling**: Tailwind CSS v4 (`css/tailwind.css`)
- **Fonts**: Libre Baskerville (serif), Noto Sans, Noto Sans Arabic
- **i18n**: English (`en`) + Arabic (`ar`) via middleware + `app/[lang]/` routing
- **AI Backend**: Supabase Edge Functions → Gemini 3 Flash (`gemini-3-flash-preview`)
- **APIs**: Aladhan API (prayer times), BigDataCloud (reverse geocode)

## Brand / Design

- **Domain**: `islamful.com`
- **Tagline**: "Your Complete Islamic Companion"
- **Background color**: `#F6F5EE` (warm off-white)
- **Primary color**: `#327952` (green)

## Color Palette (`css/tailwind.css`)

| Token                 | Value                   |
| --------------------- | ----------------------- |
| `--color-primary-500` | `#327952` (brand green) |
| `--color-cream-50`    | `#F6F5EE` (main bg)     |

## Architecture

### Frontend (Next.js)

```
/                      → Homepage (Hero + ToolsGrid + CTA + FAQ)
/prayer-times          → Prayer times by location (Aladhan API, client-side)
/haram-check           → AI-powered halal/haram checker
/blog                  → Blog index
/blog/[slug]           → Blog post (MDX, can embed tool widgets)
/ar/...                → Arabic mirrors of all routes
/about, /privacy, /terms → Static pages
```

### Backend (Supabase Edge Functions)

```
supabase/functions/haram-check/  → Gemini 3 Flash AI for halal/haram rulings
```

The haram checker has a dual strategy:

1. **Static database** (23 items) — instant local results for common queries
2. **AI fallback** (Gemini 3 Flash via Supabase) — handles any query not in the static DB

### Data Flow

```
User query → Static DB match? → Return instantly
                    ↓ (no match)
           → Supabase Edge Function → Gemini 3 Flash → Structured JSON response
```

## Project Structure

```
app/
  page.tsx              # Homepage
  layout.tsx            # Root layout (fonts, metadata, header, footer)
  seo.tsx               # SEO utilities (canonical, hreflang, metadata)
  sitemap.ts            # Auto-generated sitemap
  robots.ts             # Robots.txt
  prayer-times/         # Prayer Times tool page
  haram-check/          # Haram Check tool page
  blog/                 # Blog list + detail + pagination
  [lang]/               # Arabic locale (mirrors all routes)

components/
  Header.tsx            # Sticky navigation
  Footer.tsx            # 4-column footer (brand, tools, content, legal)
  landing/
    Hero.tsx            # Homepage hero
    ToolsGrid.tsx       # Tool cards grid
    CTA.tsx             # Call-to-action
    FAQ.tsx             # FAQ accordion
  tools/
    PrayerTimes.tsx     # Prayer times (Aladhan API + geolocation)
    HaramChecker.tsx    # AI haram checker (static DB + Supabase/Gemini)
  seo/
    JsonLd.tsx          # Reusable JSON-LD schema
    Breadcrumbs.tsx     # Breadcrumbs with schema

supabase/
  functions/
    haram-check/        # Edge function: Gemini 3 Flash proxy
      index.ts

data/
  siteMetadata.js       # Site-wide metadata
  headerNavLinks.ts     # Navigation links
  tools.ts              # Tool registry (8 tools, 2 live, 6 coming-soon)
  blog/en/              # English MDX blog posts
  blog/ar/              # Arabic MDX blog posts

dictionaries/           # i18n translations (en.json, ar.json)
```

## Environment Variables (`.env.local`)

| Variable                        | Purpose                               |
| ------------------------------- | ------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable/anon key         |
| `NEXT_UMAMI_ID`                 | Umami analytics website ID (optional) |

### Supabase Secrets (set via `supabase secrets set`)

| Secret           | Purpose                      |
| ---------------- | ---------------------------- |
| `GEMINI_API_KEY` | Google Gemini API key for AI |

## Deployment

### Edge Function

```bash
supabase functions deploy haram-check --project-ref fkifiwgbroehluxksfte
supabase secrets set GEMINI_API_KEY=your_key --project-ref fkifiwgbroehluxksfte
```

## Key Notes

- `tsconfig.json` excludes `supabase/` directory (Deno code, not Node)
- Arabic RTL handled via `middleware.ts` + `RTLHandler` component
- Tool components work both standalone and embedded in MDX blog posts
- The haram checker gracefully degrades: if Supabase/Gemini is unavailable, static DB still works
- Static DB entries return instantly (no loading state), AI results show a loading spinner
