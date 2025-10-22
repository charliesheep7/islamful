# VisaSimpler MVP — Product Requirements Document (PRD)

Last updated: 2025-09-30 (rev E)
Owner: You (PM/Founder)

## 1) Overview

VisaSimpler helps users navigate U.S. immigration with AI-powered case tracking and trustworthy guidance. MVP focuses on visa status prediction with visualization ("My Status" feature), a compelling marketing landing page, i18n for Spanish and Chinese, and clean branding. AI Q&A chatbot is deferred to post-MVP but featured as "coming soon" in marketing copy.

## 2) Goals (MVP)

- Launch visasimpler.com with premium, trustworthy visual design and clean information architecture.
- Replace all template boilerplate with VisaSimpler branding and content.
- Ship "My Status" feature: users can input case numbers and see prediction visualization after completing USCIS Cloudflare verification.
- Publish one flagship SEO article (H‑1B) as reference for future content.
- Add i18n routing for English, Spanish, and Chinese with SEO‑correct signals.
- Build marketing landing page with hero, feature cards, media ticker, testimonials, and FAQ sections (blog moves to /blog).

## 3) Non‑Goals (MVP)

- AI Q&A chatbot (planned as next milestone; landing page shows as "coming soon").
- CMS integration; content will be managed via MDX in the repo.
- Social embeds and growth features (defer). Newsletter disabled for MVP; comments enabled (Giscus).
- Advanced animations and visual polish (structure and basic styling only; refinements in Phase 2).

## 4) Target Audience & UX Principles

- Primary: International professionals and students exploring US immigration paths (H‑1B, F‑1/OPT/CPT, O‑1, EB categories, family-based green cards) and employers/HR.
- Secondary: Spanish‑ and Chinese‑speaking communities.
- Principles: simpler, credible, transparent. No fluff, fast load, excellent readability, mobile‑first, and inclusive language.

## 5) Success Metrics

- Technical: Lighthouse >= 95 Performance/Best Practices/SEO on homepage and article pages; CLS < 0.1, TTI < 3s on 4G.
- SEO: Indexed pages with correct hreflang; H‑1B article ranks for long‑tail queries within 4–8 weeks; CTR >= 3% for branded queries.
- Engagement: Avg. time on page > 2:00 for H‑1B article; bounce rate < 60%.

---

## 6) Scope & Deliverables

Progress (Phase 1)

- Done: Removed /tags and /projects (routes, nav, sitemap)
- Done: Footer simplified (only X), Privacy/Terms placeholders added
- Done: Site metadata rebranded; newsletter disabled
- Done: Filler posts removed; draft H‑1B 101 added
- Done: i18n implemented using official Next.js patterns (removed next-intl) for ES (`/es`) and ZH (`/zh`): smooth dropdown language switcher with flags (🇺🇸 English, 🇪🇸 Español, 🇨🇳 中文), pathname-based locale detection, server-side dictionaries, localized routes, hreflang metadata, navigation translations
- Pending: Landing page redesign; per‑page localized metadata; translated blog content; comments provider config

### A) Template Cleanup and Content

Requirements

- Update site metadata (title, description, author, URLs) to VisaSimpler.
- Logo: text-only "VisaSimpler" using DM Serif Text font (no icon for MVP).
- Remove all filler blog posts. Keep exactly one example SEO article about H‑1B.
- Remove routes completely: /tags and /projects.
- Remove/replace all filler words/links in UI and metadata, including:
  - github, facebook, youtube, linkedin, bluesky, x, instagram, threads, medium
  - "Tails Azimuth", "Next.js Starter Blog", "Tailwind Nextjs Theme", "VisaCalm"
  - Ensure footer shows only "VisaSimpler" and © {current year} VisaSimpler.
- Decision updates: Footer socials show only X (Twitter); disable newsletter; enable comments (Giscus).
- Update sitemap and robots to include: `/`, `/status`, `/blog`, and each blog post.
- Keep search (kbar) optional; default disabled if it still exposes removed routes.

Technical implementation notes

- Update `data/siteMetadata.js` (title, author, description, `siteUrl=https://visasimpler.com`, socials emptied or VisaSimpler‑specific only).
- Delete pages: `app/tags`, `app/tags/[tag]`, `app/projects`.
- Remove references in nav: update `data/headerNavLinks.ts` to include Home, My Status, Blog.
- Update `app/sitemap.ts` to drop `projects` and `tags` from static routes; add `/status`; ensure blog routes still included from Contentlayer.
- Update footer (`components/Footer.tsx`) to remove template credit link and social icons we don't use; keep only X.
- Contentlayer: keep tags in frontmatter if useful for internal organization, but do not render tag pages or tag links.
- Create one H‑1B sample post: `data/blog/h1b-101.mdx` (title "H‑1B 101", meta description, headings, FAQ). Mark `draft: true` until publish.
- Add DM Serif Text font via next/font for logo usage.

Acceptance criteria

- No references to template brand or social icons listed above anywhere in UI or metadata.
- Visiting `/tags` or `/projects` returns 404 and they are not in the sitemap.
- H‑1B article compiles and renders with correct SEO `<title>` and `<meta name="description">`.

### B) Internationalization (i18n)

Status: ✅ Implemented (Simplified using official Next.js patterns)

Locales

- Default: English (`en`)
- Spanish (`es`)
- Chinese Simplified (`zh`) — path label is `/zh` with `hreflang="zh-Hans"`

Routing strategy

- Use subpath routing: `/{lang}/...` with default locale at root (`/`). Examples:
  - Homepage: `/` (EN), `/es`, `/zh`
  - Blog list: `/blog` (EN), `/es/blog`, `/zh/blog`
  - Post: `/blog/h1b-101`, `/es/blog/h1b-101` (or localized slug), `/zh/blog/h1b-101` (or localized slug)

Implementation (Simplified from next-intl to native Next.js)

- **Official Next.js Pattern** (no third-party i18n library):
  - Custom middleware for locale detection using `negotiator` library
  - Browser language preferences (`Accept-Language` header) automatically redirect users
  - Server-side dictionary loading via `getDictionary()` function
  - Route structure: `app/[lang]/` for non-English locales
  - Static generation with `generateStaticParams()` for all locales
- **Dictionaries** in `dictionaries/{en,es,zh}.json` (renamed from `messages/`)
- **Language Switcher** with smooth dropdown UI:
  - Shows flag emoji + language name (🇺🇸 English, 🇪🇸 Español, 🇨🇳 中文)
  - Auto-detects current locale from pathname
  - Click-outside-to-close behavior
  - Active language highlighted with checkmark
- **Navigation translations**: Header links (Home, Blog, About) fully translated
- **No client-side i18n overhead**: All translations loaded server-side
- MDX content: per‑locale directories `data/blog/{en,es,zh}/...` or frontmatter `lang:` field (TBD). Spanish posts should target Spanish queries, not just translations.
- SEO: `hreflang` and canonical tags via Next.js metadata; alternates in sitemap with `xhtml:link rel="alternate" hreflang="..."`.
- Fallbacks: Missing translations fall back to English dictionary.

Content process

- UI copy fully localized for ES and ZH‑Hans.
- Articles: publish English first, then human‑reviewed Spanish and Chinese versions within 2 weeks for evergreen posts. Where appropriate, write Spanish‑specific SEO posts.
- Track translation status per post (frontmatter: `translated: ['es', 'zh-Hans']`).

Acceptance criteria

- Language switcher toggles among EN/ES/ZH‑Hans and updates URLs and metadata.
- `hreflang` present for all localized pages; sitemap includes localized entries.
- No broken or duplicate canonical links; only published locales are indexed.

Recommendation on Spanish SEO blogs

- Confirmed: write Spanish‑specific posts targeting Spanish queries and vocabulary; localize slugs, titles, and meta descriptions to match Spanish search intent.

Open decisions (please confirm)

- Spanish variant: `es` vs `es-MX`/`es-US`?
- Chinese variant: stick with `zh-Hans` (Simplified) for MVP? Any need for `zh-Hant` later?
- Subpaths (`/es`) vs subdomains (`es.visasimpler.com`)? Default is subpaths.

### C) Design System (Tailwind CSS v4)

Design intent

- Premium, calm, trustworthy. Subtle depth, warm accent, generous white space. Perfect gradients that feel refined, not loud.

Provided palette (from you)

- Background: rgb(250, 249, 245) → `#FAF9F5`
- Surface/Elevated: rgb(240, 238, 230) → `#F0EEE6`
- Accent: rgb(217, 119, 87) → `#D97757`
- Text/Dark: rgb(61, 61, 58) → `#3D3D3A`

Theme tokens (Tailwind v4 `@theme` in `css/tailwind.css`)

- Add custom scales (approximate):
  - `--color-accent-50:  #FDEFE9`
  - `--color-accent-100: #F9DFD4`
  - `--color-accent-200: #F2C2AF`
  - `--color-accent-300: #EAA287`
  - `--color-accent-400: #E38F72`
  - `--color-accent-500: #D97757` (primary)
  - `--color-accent-600: #C66547`
  - `--color-accent-700: #A94E36`
  - `--color-accent-800: #8A3E2C`
  - `--color-accent-900: #6E3123`
- Neutrals:
  - `--color-bg:        #FAF9F5`
  - `--color-surface:   #F0EEE6`
  - `--color-text:      #3D3D3A`

Usage examples

- Background: `bg-[--color-bg]` / surfaces: `bg-[--color-surface]`.
- Text: `text-[--color-text]`.
- Accent: use Tailwind color tokens mapped to `--color-accent-*` for `text-accent-600`, `bg-accent-500`, `border-accent-200`, etc.
- Gradients: subtle hero gradient `bg-gradient-to-br from-[--color-bg] via-[#F6F3EC] to-[--color-surface]`; CTA/button gradient `from-accent-500 via-accent-600 to-accent-700`.
- Radii and shadows: slightly rounded (`--radius-md: 12px`) with soft, layered shadows for elevated cards on `--color-surface`.

Typography

- Keep Space Grotesk or swap to Inter for body; Headings weight 700, comfortable line‑height; max line length ~70ch.

Acceptance criteria

- Tailwind theme tokens defined and used by landing, header, footer, buttons, and cards.
- Visual contrast passes WCAG AA for text on background/surface.

### D) Homepage Revamp (Landing)

Requirements
Replace current index (blog list) with a marketing landing page about VisaSimpler. Blog list moves to `/blog`.

Section structure (MVP focuses on semantic HTML + basic styling; animations and visual polish deferred to Phase 2)

**1. Hero Section**

- **Tagline**: "Immigration made simpler" (H1)
- **Subtitle**: "Your AI immigration partner"
- **CTAs**:
  - Primary: "Try for free" (links to `/status`)
  - Secondary: Optional "Learn more" (anchor link to features)
- Visual treatment: Placeholder for gradient background; save animations for later.

**2. Feature Cards**

- Layout: Grid with varying card sizes for visual hierarchy (not uniform 2×3).
- Icons: Use lucide-react icons (install if needed).
- Cards are informational only (no click/expand behavior).
- Content:
  1. **Ask Anything** — Get instant answers to any immigration question _(Coming Soon badge)_
  2. **Track & Predict** — See where your case stands and when to expect results
  3. **Verified Answers** — Every response backed by official immigration documents _(Coming Soon badge)_
  4. **50x Cheaper, Same Results** — Expert immigration guidance without the massive legal fees
  5. **Interview with Confidence** — Rehearse the real questions before the big day _(Coming Soon badge)_

**3. CTA Section**

- Single large button: "Try for free" linking to `/status`.
- Optional subtext: "No credit card required" or similar trust signal.

**4. Featured Media Ticker**

- Infinite horizontal scroll ticker showing ~8 media/partner logos.
- Placeholder images for MVP (real logos post-launch).
- Implementation: CSS-based infinite scroll or lightweight library (e.g., `react-fast-marquee`).

**5. Real Stories (Testimonials)**

- Display exactly 3 testimonial cards:
  1. H-1B story
  2. Marriage Green Card story
  3. One additional category (O-1, EB-2, etc.)
- Card structure:
  - Category icon (lucide icon)
  - Category badge (e.g., "Marriage Green Card", "H-1B")
  - Short testimonial quote (~2 sentences)
  - "Read more" link/button that expands inline (accordion-style) or opens modal.
- Content: You will provide actual testimonial text; use placeholder for MVP structure.

**6. FAQ Section**

- Display 5 FAQs.
- UI: Show only question text; click to expand answer (accordion).
- Questions TBD (you will provide); use generic placeholders for MVP structure.

Technical implementation notes

- Use Next.js App Router Server Components where possible.
- Lucide icons: `npm install lucide-react` if not already present.
- DM Serif Text font for logo/headers (already specified in section A).
- Sections use design tokens from section C (accent colors, surface, bg).
- Mobile-first responsive design; test on 375px viewport minimum.

Acceptance criteria

- `/` renders landing with all 6 sections; `/blog` lists posts; nav links updated.
- Hero CTA links to `/status`; feature cards render in non-uniform grid.
- Media ticker animates smoothly (infinite scroll); 3 testimonials render with expand/collapse.
- FAQ accordion works (click to expand/collapse).
- Lighthouse SEO/Perf >= 95 on `/` and `/blog` locally.

### E) My Status Feature (Case Tracking & Prediction)

Requirements
Core MVP feature allowing users to track USCIS case status and see prediction visualization.

**User Flow**

1. User navigates to `/status` from nav or hero CTA.
2. User enters their USCIS case number (format: ABC1234567890).
3. System prompts user to complete verification at `https://egov.uscis.gov/` in embedded browser or new tab.
4. After Cloudflare verification, system fetches case data and displays prediction visualization.

**Technical Implementation (Open)**

- Cloudflare verification requirement: USCIS site requires human verification (click to prove not spam).
- Implementation options TBD:
  - Option A: Open `egov.uscis.gov` in iframe/webview, detect verification completion, then fetch via backend proxy.
  - Option B: Open in new tab with "Click here when done" flow; user confirms manually.
  - Option C: Browser extension approach (defer to post-MVP if complex).
- Backend: Fetch case status from USCIS after verification; cache results to avoid repeated verifications.
- Visualization: Display case timeline, current status, predicted next step, and estimated timeline.

**UI Components**

- Input form: Case number field with validation (format check).
- Verification prompt: Clear instructions for Cloudflare verification step.
- Prediction display:
  - Timeline visualization (horizontal or vertical).
  - Current status indicator.
  - Predicted next step with confidence level (if applicable).
  - Estimated timeline (e.g., "Expected decision in 45–60 days").
- Error states: Invalid case number, verification failure, USCIS service unavailable.

**Data Requirements**

- Case number format validation.
- USCIS status codes mapping (e.g., "Case Was Received", "Request for Evidence", etc.).
- Historical data for prediction model (optional for MVP; use static estimates if needed).

**Acceptance Criteria**

- `/status` route renders case input form.
- User can enter case number and initiate verification.
- After verification, system displays case status and prediction visualization.
- Error handling for invalid input, verification failure, and API errors.
- Mobile-responsive design; works on 375px viewport.

---

## 7) Information Architecture & Routes

- `/` — Landing (new marketing page)
- `/status` — My Status feature (case tracking & prediction)
- `/blog` — Blog index (English default)
- `/blog/[slug]` — Post detail (English)
- `/{locale}` — Localized home for `es` and `zh`
- `/{locale}/status` — Localized My Status page
- `/{locale}/blog` — Localized blog index
- `/{locale}/blog/[slug]` — Localized post detail
- Removed: `/tags`, `/projects`

## 8) SEO & Metadata

- Title/description per page with localized variants.
- Canonical URL on each page; localized alternates with `hreflang`.
- Sitemap includes localized routes; robots references correct sitemap.
- Friendly, keyword‑informed slugs per locale.
- Images: descriptive `alt`, responsive sizes, lazy loading, modern formats.

## 9) Accessibility

- Keyboard‑navigable menu and focus states; aria labels on nav and language switcher.
- Color contrast AA for text; skip‑to‑content link.
- Headings are hierarchical with one H1 per page.

## 10) Performance

- Optimize hero/background gradients and imagery; no oversized images.
- Avoid client JS for static content; prefer RSC and streaming where possible.
- Use prefetch for important internal links (`/blog`).

## 11) Analytics (Optional for MVP)

- If enabled, use a privacy‑friendly provider (e.g., Umami) and add CSP allowances. Otherwise keep disabled for a clean MVP.

## 12) Rollout Plan

Milestone 1 (Cleanup & Branding)

- Replace all VisaCalm → VisaSimpler in metadata, UI, and content.
- Add DM Serif Text font for logo.
- Remove routes (/tags, /projects), purge filler content, create H‑1B article (draft), update sitemap/robots/footer/nav.

Milestone 2 (Design System & Landing)

- Implement theme tokens and gradients.
- Redesign header/footer/buttons/cards.
- Build landing page with 6 sections (hero, features, CTA, media ticker, testimonials, FAQ).
- Move blog to `/blog`.

Milestone 3 (My Status Feature)

- Build `/status` route with case input form.
- Implement USCIS verification flow (technical approach TBD).
- Display prediction visualization with timeline.
- Add error handling and mobile responsive design.

Milestone 4 (i18n Completion)

- Localize `/status` page for ES and ZH‑Hans.
- Add localized routes, hreflang/sitemap updates.
- Ship localized H‑1B title/meta; optionally hold article body until human‑reviewed.

Next Milestone (Post‑MVP)

- AI Q&A chatbot (model selection, prompt/UI flows).
- Advanced animations and visual polish for landing page.
- CMS/editorial workflow, newsletter, comments, richer category pages.

## 13) Acceptance Checklist (Go‑Live)

- [ ] All VisaCalm references replaced with VisaSimpler in UI, metadata, and content.
- [ ] Logo displays "VisaSimpler" in DM Serif Text font.
- [ ] `/`, `/status`, `/blog`, `/blog/h1b-101` render without errors.
- [x] `/tags` and `/projects` return 404 and are not in sitemap.
- [ ] Sitemap + robots reference `https://visasimpler.com` and localized routes including `/status`.
- [x] i18n routes for `/es` and `/zh` exist; smooth dropdown language switcher with flags works; hreflang added for blog pages and global layout; navigation links translated.
- [ ] Landing page renders all 6 sections (hero, features, CTA, media ticker, testimonials, FAQ).
- [ ] My Status feature: case input form works; verification flow functional; prediction visualization displays.
- [ ] Lighthouse Perf/SEO >= 95 on `/`, `/status`, and `/blog`.
- [ ] A11y spot check passes (keyboard nav, focus states, contrast).
- [ ] Newsletter disabled; Comments enabled and rendering (Giscus by default).

## 14) Risks & Mitigations

- Duplicate content across locales → use `hreflang` and localized slugs/meta; avoid indexing machine translations.
- Design token drift → centralize with Tailwind `@theme`; audit before merge.
- Future CMS migration → keep MDX structure clean and locale‑aware to ease migration.
- USCIS Cloudflare verification complexity → evaluate technical approach early; consider fallback to manual "open in new tab" flow if iframe/automation is blocked.
- Prediction accuracy expectations → clearly communicate estimates are projections, not guarantees; add disclaimer.

## 15) Open Questions & Decisions Needed

1. **My Status technical approach**: Confirm preferred implementation for Cloudflare verification flow (iframe, new tab, or other).
2. **Prediction model**: Use static estimates based on case type, or integrate historical data? Data source?
3. **Testimonial content**: Provide 3 real testimonial quotes (H-1B, Marriage Green Card, one more) or use placeholder for MVP?
4. **FAQ content**: Provide 5 FAQ questions/answers or use generic placeholders?
5. **X (Twitter) profile URL**: Provide link for footer social icon.
6. **Media ticker logos**: Real partner/media logos or placeholder for MVP?
7. **Spanish variant**: Confirm `es` vs `es-MX`/`es-US`.
8. **Chinese variant**: Confirm `zh-Hans` (Simplified) for MVP; need for `zh-Hant` later?
