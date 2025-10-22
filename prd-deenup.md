# DeenUp MVP — Product Requirements Document (PRD)

Last updated: 2025-10-21 (Initial)
Owner: DeenUp Founder

## 1) Overview

DeenUp is your Islamic companion app that helps Muslims strengthen their Deen through:

- **AI-powered Q&A**: Quranic-cited answers available 24/7
- **Daily Good Deen Checklist**: Track your daily Islamic practices
- **Deen Progress Streaks**: Unlock beautiful Quranic scene postcards as you complete daily goals
- **Anonymous Muslim Letters**: Connect with Muslim brothers and sisters globally through encouraging messages

This PRD focuses on the **landing page website** (deenup.app) — a bilingual (English/Arabic) marketing site with SEO blog, not the full app features.

## 2) Goals (MVP)

- Launch deenup.app with premium, trustworthy visual design targeting Muslim audience
- Replace all VisaSimpler/template boilerplate with DeenUp branding and content
- Implement full English/Arabic (EN/AR) internationalization with RTL support
- Build compelling landing page showcasing the app's value proposition
- Publish initial blog content targeting Islamic lifestyle and spiritual guidance keywords
- SEO optimization for both English-speaking Muslims and Arabic-speaking Muslims (Middle East)

## 3) Non-Goals (MVP)

- Actual app functionality (AI companion, checklist, streaks, letters) — website only introduces these features
- User authentication or account management
- CMS integration; content managed via MDX in repo
- Newsletter/email capture (may add post-MVP)
- Advanced animations (focus on structure and basic styling)

## 4) Target Audience & UX Principles

- **Primary**: English-speaking Muslims globally (converts, diaspora, English-educated)
- **Secondary**: Arabic-speaking Muslims in Middle East and North Africa
- **User Intent**: Learn about DeenUp app, download when available, read Islamic lifestyle content
- **Principles**: Respectful, authentic, spiritually uplifting, culturally appropriate, fast, mobile-first

## 5) Success Metrics

- **Technical**: Lighthouse >= 95 Performance/Best Practices/SEO; CLS < 0.1, TTI < 3s on 4G
- **SEO**:
  - English: Rank for "Islamic habit tracker", "daily deen checklist", "Islamic companion app"
  - Arabic: Rank for equivalent Arabic terms
  - Blog articles indexed with correct hreflang
- **Engagement**: Avg. time on page > 2:00; bounce rate < 60%

---

## 6) Branding & Identity

### Brand Name

**DeenUp** (deenup.app)

### Tagline

"Your Islamic Companion"

### Brand Voice

- Respectful and authentic to Islamic values
- Encouraging and supportive (focus on helping, not judging)
- Clear and accessible (no overly academic language)
- Warm and welcoming to all Muslims regardless of their journey

### Visual Identity

- Keep existing color palette (warm, trustworthy tones)
- Logo: TBD (will be provided later)
- Typography: Clean, readable fonts suitable for both Latin and Arabic scripts

### Social Presence

- **TikTok**: [To be provided]
- **X (Twitter)**: [To be provided]
- **Instagram**: [To be provided]

---

## 7) Scope & Deliverables

### A) Template Cleanup and Content

**Requirements:**

- Update all site metadata to DeenUp:
  - Title: "DeenUp - Your Islamic Companion"
  - Description: "Track your daily Deen, get Quranic-cited answers 24/7, and connect with Muslim brothers and sisters worldwide"
  - Author: DeenUp
  - URL: https://deenup.app
- Remove all VisaSimpler/VisaCalm/template references
- Update footer: © {current year} DeenUp, social links (TikTok, X, Instagram)
- Remove filler blog posts
- Create initial Islamic lifestyle blog posts (topics TBD)
- Remove `/tags` and `/projects` routes completely
- Update navigation: Home, Blog
- Enable comments (Giscus) for blog posts
- Newsletter: Disabled for MVP

**Technical Implementation:**

- Update `data/siteMetadata.js`
- Delete `app/tags`, `app/tags/[tag]`, `app/projects`
- Update `data/headerNavLinks.ts` to include: Home, Blog
- Update `app/sitemap.ts` to include only `/`, `/blog`, and blog posts
- Update `components/Footer.tsx` with DeenUp branding and social links

**Acceptance Criteria:**

- No template/VisaSimpler references anywhere in UI or metadata
- `/tags` and `/projects` return 404
- Social links functional (TikTok, X, Instagram)

---

### B) Internationalization (i18n)

**Status:** To be implemented

**Locales:**
| Locale | Code | Path Pattern | hreflang | Direction |
|--------|------|--------------|----------|-----------|
| English (Default) | `en` | `/` | `en-US` | LTR |
| Arabic | `ar` | `/ar/*` | `ar` | RTL |

**Routing Strategy:**

- Subpath routing: `/{lang}/...` with English default at root (`/`)
- Examples:
  - Homepage: `/` (EN), `/ar` (AR)
  - Blog list: `/blog` (EN), `/ar/blog` (AR)
  - Post: `/blog/ramadan-habits`, `/ar/blog/ramadan-habits`

**RTL (Right-to-Left) Support for Arabic:**

- **CRITICAL**: Full layout mirroring including component positioning
- `<html dir="rtl" lang="ar">` for Arabic
- `<html dir="ltr" lang="en">` for English
- Use logical CSS properties (`margin-inline-start` instead of `margin-left`)
- Navigation, header, footer all mirror horizontally
- Text alignment automatic via `dir` attribute

**Implementation:**

- Official Next.js i18n pattern (no third-party libraries)
- Middleware for locale detection using `negotiator`
- Server-side dictionary loading
- Static generation with `generateStaticParams()`
- Dictionaries: `dictionaries/en.json`, `dictionaries/ar.json`

**Language Switcher:**

- Dropdown with flags: 🇺🇸 English, 🇸🇦 العربية
- Auto-detects current locale from pathname
- Preserves current path when switching

**Content Translation:**

- UI strings fully translated for EN and AR
- Blog posts: Publish English first, add Arabic translations for evergreen content
- Arabic content should be culturally appropriate, not just literal translations
- Track translation status in frontmatter: `lang: 'en'` or `lang: 'ar'`

**SEO:**

- `hreflang` tags for all pages
- Canonical URLs
- Sitemap includes both locales
- Localized meta titles and descriptions

**Acceptance Criteria:**

- Language switcher works smoothly
- Arabic pages display in RTL with full component mirroring
- All UI elements translated
- `hreflang` tags present
- No broken canonical links

---

### C) Design System

**Design Intent:**

- Islamic aesthetic: calm, spiritual, trustworthy
- Generous white space, subtle depth
- Respectful color choices (avoid overly bright or flashy)

**Existing Color Palette (Keep):**

- Background: `#FAF9F5`
- Surface/Elevated: `#F0EEE6`
- Accent: `#D97757`
- Text/Dark: `#3D3D3A`

**Typography:**

- Latin script: Current font stack (clean, modern)
- **Arabic script**: Add Arabic-optimized web font (e.g., Noto Sans Arabic, Cairo, Tajawal)
- Ensure proper line-height and spacing for Arabic text
- Headings: Weight 700, comfortable line-height

**Acceptance Criteria:**

- Arabic text renders beautifully with appropriate font
- Visual contrast passes WCAG AA
- Design feels authentically Islamic and welcoming

---

### D) Homepage / Landing Page

**Purpose:** Introduce DeenUp app and drive app downloads/waitlist signups

**Section Structure:**

#### 1. Hero Section

- **Headline (H1)**: "Your Islamic Companion"
- **Subheading**: "Strengthen your Deen with AI-powered guidance, daily habit tracking, and a global Muslim community"
- **Quranic Quote**: Display Quran 4:114 with Arabic, English, and transliteration

  ```
  لَا خَيْرَ فِي كَثِيرٍ مِن نَّجْوَاهُمْ إِلَّا مَنْ أَمَرَ بِصَدَقَةٍ أَوْ مَعْرُوفٍ أَوْ إِصْلَاحٍ بَيْنَ النَّاسِ…

  "No good is in much of their private talk—except those who encourage charity, goodness,
  or making peace between people; and whoever does so seeking Allah's pleasure,
  We will grant a great reward." (Qur'an 4:114)

  Transliteration: Lā khayra fī kathīrin min najwāhum illā man amara biṣ-ṣadaqati
  aw maʿrūfin aw iṣlāḥin bayna an-nās…
  ```

- **CTAs**:
  - Primary: "Download App" (Coming Soon badge)
  - Secondary: "Join Waitlist" or "Learn More"

#### 2. Feature Highlights

Three main features emphasized in order:

**Feature 1: AI Companion with Quranic Citations** ⭐ PRIMARY FOCUS

- **Title**: "Ask Anything, Anytime"
- **Description**: "Get instant answers to your Islamic questions, backed by authentic Quranic citations and Hadith references. Your AI companion is available 24/7 to help guide you."
- **Visual**: Placeholder for chat interface screenshot
- **Icon**: Book/Quran icon

**Feature 2: Daily Good Deen Checklist**

- **Title**: "Build Better Habits"
- **Description**: "Track your daily Islamic practices and watch your Deen grow stronger. Complete your Daily Good Deen checklist and build lasting spiritual habits."
- **Visual**: Placeholder for checklist interface
- **Icon**: Checkmark/list icon
- **Note**: DO NOT specify what's on the checklist (intentionally vague)

**Feature 3: Anonymous Muslim Letters**

- **Title**: "Connect with the Ummah"
- **Description**: "Write and receive anonymous letters to help Muslim brothers and sisters around the globe. Share encouragement, seek advice, and strengthen bonds—like a message in a bottle across the Muslim world."
- **Visual**: Placeholder for letter interface
- **Icon**: Mail/envelope icon
- **Reference to Quran 4:114** (helping fellow Muslims)

#### 3. App Status Banner

- **Text**: "Coming Soon to iOS and Android"
- **CTA**: "Join Waitlist" button
- **Visual**: App store badges (grayed out/coming soon)

#### 4. Blog Preview / Featured Content

- Display 3 most recent blog posts
- Categories: Islamic Lifestyle, Spiritual Guidance, Ramadan Tips, Daily Duas, etc.
- CTA: "Read More Articles →"

#### 5. Footer

- Links: Home, Blog
- Social: TikTok, X, Instagram
- Legal: Privacy Policy, Terms of Service (placeholders for MVP)
- Copyright: © 2025 DeenUp

**Technical Implementation:**

- Next.js App Router Server Components
- Mobile-first responsive design
- Optimize for Core Web Vitals
- Lazy load images

**Acceptance Criteria:**

- All sections render correctly
- CTAs functional (waitlist form TBD)
- Hero displays Quranic quote beautifully in both EN and AR
- Features emphasize AI companion first
- Mobile responsive (375px minimum)
- Lighthouse >= 95

---

### E) Blog Structure

**Purpose:**

- SEO content targeting Islamic lifestyle queries
- Establish authority and trust
- Rank high in both English and Arabic searches

**Content Strategy:**

**English Blog Topics (Priority):**

1. Daily Islamic habits and routines
2. Spiritual growth and self-improvement
3. Ramadan preparation and tips
4. Quranic reflections and Tafsir summaries
5. Hadith explanations and applications
6. Muslim lifestyle in Western countries
7. Convert/revert resources and guidance
8. Islamic parenting and family life
9. Dua guides and prayer tips
10. Islamic productivity and time management

**Arabic Blog Topics (Secondary):**

- Same topics translated and culturally adapted
- Focus on Middle East-specific concerns
- More scholarly tone where appropriate
- Target Arabic search queries

**SEO Keywords to Target:**

- English: "Islamic habit tracker", "daily deen checklist", "Muslim productivity", "Islamic self-improvement", "Ramadan habits", "daily duas"
- Arabic: Equivalent terms in Arabic (مراقبة العادات الإسلامية، قائمة الأعمال اليومية، etc.)

**Blog Post Structure:**

- Frontmatter: title, date, tags, lang, summary, draft status
- Markdown/MDX content
- Comments enabled (Giscus)
- Reading time estimate
- Related posts

**Initial Posts (Create 3-5):**

1. "5 Simple Habits to Strengthen Your Deen Daily" (English)
2. "How to Build a Consistent Quran Reading Routine" (English)
3. "The Power of Morning Adhkar: Transform Your Day" (English)
4. [Arabic translations of above]

**Acceptance Criteria:**

- Blog accessible at `/blog` (EN) and `/ar/blog` (AR)
- Posts render with proper formatting
- Tags work for organization (but no public tag pages)
- Reading time displayed
- Comments functional
- SEO metadata correct

---

## 8) Information Architecture & Routes

**English (Default):**

- `/` — Landing page
- `/blog` — Blog index
- `/blog/[slug]` — Individual blog post

**Arabic:**

- `/ar` — Arabic landing page (RTL)
- `/ar/blog` — Arabic blog index (RTL)
- `/ar/blog/[slug]` — Arabic blog post (RTL)

**Removed:**

- `/tags`, `/projects`, `/status` (not needed for this app)

---

## 9) SEO & Metadata

**Per-Page Requirements:**

- Unique `<title>` and `<meta name="description">` for EN and AR
- Canonical URL
- `hreflang` tags for language alternates
- Open Graph tags (social sharing)
- Twitter Card metadata
- Structured data (Article schema for blog posts)

**Sitemap:**

- Include all localized routes
- Blog posts in both languages
- Proper lastmod dates

**Robots.txt:**

- Allow all (no restrictions for MVP)

**Image SEO:**

- Descriptive `alt` text
- Optimized file sizes
- Modern formats (WebP)
- Lazy loading

---

## 10) Accessibility

- Keyboard navigation for all interactive elements
- ARIA labels on navigation and language switcher
- Color contrast meets WCAG AA standards
- Skip-to-content link
- Semantic HTML with proper heading hierarchy (one H1 per page)
- Focus indicators visible
- Screen reader friendly (test with VoiceOver/NVDA)

---

## 11) Performance

- Lighthouse Performance >= 95
- Core Web Vitals:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
- Optimize images and fonts
- Minimize client-side JavaScript
- Use Next.js Server Components where possible
- Prefetch important links
- CDN for static assets

---

## 12) Content Translation Guidelines

**Arabic Translation Principles:**

1. **Culturally Appropriate**: Not just literal translation, but culturally resonant
2. **Respectful Tone**: Use formal/respectful Arabic (فصحى) for religious content
3. **Islamic Terminology**: Use correct Islamic terms in Arabic
4. **Quranic References**: Always use authentic Arabic Quranic text
5. **RTL Formatting**: Ensure numbers, dates, and mixed content display correctly in RTL

**Translation Workflow:**

1. Write English content first
2. Use AI-assisted translation for initial draft
3. Human review by native Arabic speaker (recommended)
4. Islamic scholar review for religious content (recommended)
5. Publish with `lang: 'ar'` in frontmatter

---

## 13) Rollout Plan

### Milestone 1: Cleanup & Branding (1-2 days)

- [ ] Replace all VisaSimpler → DeenUp in metadata, UI, content
- [ ] Update social links (TikTok, X, Instagram)
- [ ] Remove routes (`/tags`, `/projects`, `/status`)
- [ ] Update sitemap and robots
- [ ] Update footer and header with DeenUp branding

### Milestone 2: i18n Implementation (2-3 days)

- [ ] Set up middleware for EN/AR locale detection
- [ ] Create dictionaries (`en.json`, `ar.json`)
- [ ] Implement language switcher with flags
- [ ] Add RTL support for Arabic (including component mirroring)
- [ ] Update layouts with `dir` attribute
- [ ] Add Arabic web font
- [ ] Test all UI elements in RTL

### Milestone 3: Landing Page (3-4 days)

- [ ] Build hero section with Quranic quote
- [ ] Create feature highlights (3 features)
- [ ] Add app status banner
- [ ] Build blog preview section
- [ ] Update footer
- [ ] Mobile responsive design
- [ ] Optimize for Core Web Vitals

### Milestone 4: Blog Setup (2-3 days)

- [ ] Update blog structure for EN/AR
- [ ] Create 3-5 initial English blog posts
- [ ] Translate 2-3 posts to Arabic
- [ ] Test comments (Giscus)
- [ ] Add reading time
- [ ] SEO optimization (meta tags, structured data)

### Milestone 5: SEO & Polish (1-2 days)

- [ ] Add hreflang tags
- [ ] Update sitemap with all locales
- [ ] Test all meta tags
- [ ] Lighthouse audit and optimization
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Mobile device testing

### Milestone 6: Launch Prep (1 day)

- [ ] Final content review
- [ ] Test all links and CTAs
- [ ] Verify social sharing works
- [ ] Test Arabic RTL thoroughly
- [ ] Analytics setup (optional)
- [ ] Deploy to production

---

## 14) Open Questions & Decisions Needed

1. **Logo**: Provide final DeenUp logo (or placeholder for MVP)
2. **Social Media Links**: Provide actual URLs for TikTok, X, Instagram
3. **App Store Links**: Provide when available (use "Coming Soon" for MVP)
4. **Waitlist Form**: Where should waitlist signups go? (Email service, Typeform, etc.)
5. **Blog Post Content**: Provide initial blog post topics/outlines or approve suggested topics
6. **Arabic Font**: Preferred Arabic web font? (Noto Sans Arabic, Cairo, Tajawal, etc.)
7. **Analytics**: Use analytics for MVP? If yes, which provider? (Umami, Plausible, Google Analytics)
8. **Comments**: Confirm Giscus configuration (GitHub repo for comments)
9. **Newsletter**: Add later or skip entirely?
10. **Privacy Policy & Terms**: Need actual legal documents or placeholders for MVP?

---

## 15) Acceptance Checklist (Go-Live)

- [ ] All DeenUp branding in place (name, tagline, social links)
- [ ] Logo displayed (or placeholder)
- [ ] `/` and `/ar` landing pages render correctly
- [ ] `/blog` and `/ar/blog` functional
- [ ] 3-5 blog posts published (at least 2-3 in Arabic)
- [ ] Language switcher works smoothly
- [ ] Arabic RTL works perfectly (including component mirroring)
- [ ] Quranic quote (4:114) displays beautifully on hero
- [ ] All 3 features explained clearly
- [ ] "Coming Soon" badges on app download CTAs
- [ ] Social links functional (TikTok, X, Instagram)
- [ ] Sitemap includes EN and AR routes
- [ ] hreflang tags correct
- [ ] Lighthouse Performance/SEO >= 95
- [ ] Accessibility audit passed
- [ ] Mobile responsive (tested on 375px viewport)
- [ ] Comments enabled and working
- [ ] No VisaSimpler/template references anywhere
- [ ] Cross-browser testing passed (Chrome, Safari, Firefox)
- [ ] Arabic text displays with proper font and spacing

---

## 16) Risks & Mitigations

| Risk                                | Impact | Mitigation                                                      |
| ----------------------------------- | ------ | --------------------------------------------------------------- |
| RTL layout bugs                     | High   | Thorough testing on all components, use logical CSS properties  |
| Arabic translation quality          | High   | Get native speaker review, use authentic Islamic terminology    |
| SEO competition in Islamic niche    | Medium | Focus on long-tail keywords, quality content, both EN and AR    |
| Slow performance with web fonts     | Medium | Optimize font loading, subset fonts, use `font-display: swap`   |
| Cultural insensitivity              | High   | Review content with Muslim community members, avoid stereotypes |
| Duplicate content issues (EN vs AR) | Medium | Proper hreflang implementation, unique meta descriptions        |

---

## 17) Future Enhancements (Post-MVP)

- [ ] Newsletter/email capture
- [ ] More blog categories and tags pages
- [ ] Advanced animations and visual polish
- [ ] Video content embeds
- [ ] Podcast integration (Islamic content)
- [ ] Community features (forums, discussions)
- [ ] More languages (Urdu, Indonesian, Turkish, French)
- [ ] CMS integration for non-technical content updates
- [ ] A/B testing for CTAs and messaging
- [ ] Integration with actual app (deep linking)
- [ ] Scholar-reviewed content badges
- [ ] Audio recitation of Quranic quotes

---

## 18) References & Resources

- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [RTL Styling in CSS](https://rtlstyling.com/)
- [Islamic Typography Best Practices](https://www.smashingmagazine.com/2010/08/arabic-typography-guide/)
- [Quranic Arabic Fonts](https://fonts.google.com/?subset=arabic)
- [hreflang Best Practices](https://developers.google.com/search/docs/specialty/international/localized-versions)

---

**Document Status:** Draft - Awaiting approval and clarifications on open questions
