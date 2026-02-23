# Deen Back – claude.md

## Project Overview

**Deen Back** (`deenback.com`) is an Islamic companion app website built with Next.js 15 + ContentLayer + Tailwind CSS v4. It was originally cloned from the **DeenUp** site and rebranded for DeenBack.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Content**: ContentLayer2 for MDX blog posts
- **Styling**: Tailwind CSS v4 (`css/tailwind.css`)
- **Fonts**: Libre Baskerville (serif), Noto Sans, Noto Sans Arabic
- **i18n**: English (`en`) + Arabic (`ar`) via middleware + `app/[lang]/` routing
- **Blog (optional)**: SEObot integration via `utils/seobot.ts` – requires `SEOBOT_API_KEY` in `.env.local`

## Brand / Design

- **App Store URL**: https://apps.apple.com/tn/app/deen-back-daily-dua-dhikr/id6755876142
- **App Store badge**: `/public/static/images/app-store-badge.svg`
- **Hero image**: `/public/static/images/hero.webp`
- **Background color**: `rgb(246, 245, 238)` = `#F6F5EE` (warm off-white)
- **Primary color**: `#327952` (green)
- **Logo/icon**: `/public/static/images/App_store_1024_1x.png` (app icon used in header & og)

## Color Palette (`css/tailwind.css`)

| Token                 | Value                   |
| --------------------- | ----------------------- |
| `--color-primary-500` | `#327952` (brand green) |
| `--color-cream-50`    | `#F6F5EE` (main bg)     |
| `--color-cream-100`   | `#F6F5EE` (alt bg)      |

## Project Structure

```
app/              # Next.js App Router pages
  page.tsx        # Homepage (hero + App Store button)
  layout.tsx      # Root layout (fonts, metadata, header)
  blog/           # Blog list + detail pages
  [lang]/         # Arabic locale pages
components/       # Reusable UI components (Header, Footer, etc.)
css/tailwind.css  # Global styles + Tailwind v4 theme tokens
data/
  blog/en/        # English MDX blog posts
  blog/ar/        # Arabic MDX blog posts
  siteMetadata.js # Site-wide metadata (title, URL, socials)
  headerNavLinks.ts
utils/seobot.ts   # SEObot API integration (disable by leaving SEOBOT_API_KEY empty)
public/static/    # Images, favicons
```

## Blog

- MDX files live in `data/blog/en/` and `data/blog/ar/`
- **SEObot**: only fetches if `SEOBOT_API_KEY` is set in `.env.local`. Leave blank to disable external posts.
- To add a new blog post, copy `data/blog/en/template-post.mdx` and fill in frontmatter.

## Environment Variables (`.env.local`)

| Variable         | Purpose                                                          |
| ---------------- | ---------------------------------------------------------------- |
| `SEOBOT_API_KEY` | SEObot API key for automated blog posts. Leave empty to disable. |
| `NEXT_UMAMI_ID`  | Umami analytics website ID (optional)                            |

## Key Notes

- This site was **cloned from DeenUp** — always verify that old DeenUp branding/content has been replaced.
- Arabic RTL is handled via `middleware.ts` + `RTLHandler` component.
- The header logo is the app icon (`App_store_1024_1x.png`), not the App Store badge.
- Use `app-store-badge.svg` for the "Download on the App Store" CTA button.
