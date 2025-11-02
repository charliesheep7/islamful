# PRD: DeenUp SEO Blog Generator

**Version:** 1.0
**Last Updated:** 2025-10-28
**Status:** Design Phase
**Author:** DeenUp Team

---

## 1. Executive Summary

### 1.1 Overview
An automated AI-powered blog generation system for DeenUp that creates high-quality, SEO-optimized Islamic content in both English and Arabic. The system uses OpenAI GPT models to generate complete blog posts with frontmatter, hero images, YouTube videos, FAQ schema, and Quranic verse citations.

### 1.2 Objectives
- Generate 1 English blog post daily (6 AM UTC)
- Generate 1 Arabic blog post daily (8 AM UTC)
- Total output: 730 blog posts per year (365 EN + 365 AR)
- Full SEO optimization with exact control over meta tags
- Automatic ContentLayer integration
- Google-compatible FAQ schema (JSON-LD)
- Quranic verse citations in bilingual format

### 1.3 Key Features
- JSONL-based topic management with strict schema validation
- Exact slug, title, keywords, and meta description control
- Bilingual Quranic verse citations (Arabic + English)
- Automated hero image generation via OpenAI
- YouTube video search and embedding
- 6 FAQ pairs per article with schema.org markup
- GitHub Actions automation for daily generation
- Independent English and Arabic content pipelines

---

## 2. System Architecture

### 2.1 Technology Stack
- **Runtime:** Node.js (v20+)
- **AI Models:**
  - Text: OpenAI GPT-4 (gpt-4-turbo or latest)
  - Images: DALL-E 3
- **Content Framework:** ContentLayer2 + Next.js 15
- **Automation:** GitHub Actions (scheduled workflows)
- **Storage:** MDX files in `data/blog/en/` and `data/blog/ar/`

### 2.2 Directory Structure
```
DeenUp-website/
├── seo-blog-generator/
│   ├── config/
│   │   ├── settings.js              # API keys, paths, config
│   │   └── topics-config.js         # Article types, audience
│   ├── utils/
│   │   ├── openai.js                # OpenAI API client
│   │   ├── formatter.js             # MDX formatting
│   │   └── jsonl-parser.js          # JSONL topic parser
│   ├── prompts/
│   │   ├── master-prompt-en.js      # English generation prompt
│   │   └── master-prompt-ar.js      # Arabic generation prompt
│   ├── topics-en.jsonl              # English topic queue
│   ├── topics-ar.jsonl              # Arabic topic queue
│   ├── current-topic-en.txt         # English counter (1-indexed)
│   ├── current-topic-ar.txt         # Arabic counter (1-indexed)
│   ├── generate-en.js               # English generator script
│   ├── generate-ar.js               # Arabic generator script
│   ├── package.json
│   └── .env
├── data/
│   └── blog/
│       ├── en/                      # English blog posts (output)
│       └── ar/                      # Arabic blog posts (output)
├── public/
│   └── images/
│       └── blog/
│           ├── en/                  # English blog images
│           │   └── {slug}/
│           │       └── hero.webp
│           └── ar/                  # Arabic blog images
│               └── {slug}/
│                   └── hero.webp
├── contentlayer.config.ts           # ContentLayer config (FAQs support)
└── .github/
    └── workflows/
        └── generate-blogs.yml       # Daily automation workflow
```

---

## 3. JSONL Schema Specification

### 3.1 Schema Definition

```typescript
interface BlogTopic {
  number: number;           // Sequential counter (1-indexed)
  slug: string;             // Exact URL slug (kebab-case)
  title: string;            // Exact H1 title
  keywords: string[];       // 3-5 keywords (hard requirement)
  description: string;      // Exact meta description (50-160 chars)
  verse: {
    arabic: string;         // Quranic verse in Arabic (with diacritics)
    english: string;        // English translation
    reference: string;      // Format: "Quran X:Y"
  };
}
```

### 3.2 Field Requirements

| Field | Type | Required | Constraints | AI Usage |
|-------|------|----------|-------------|----------|
| `number` | integer | ✅ | 1-indexed, sequential | Counter tracking |
| `slug` | string | ✅ | Lowercase, hyphens only, URL-safe | **Use exactly as-is** |
| `title` | string | ✅ | Max 70 chars for SEO | **Use exactly as-is** |
| `keywords` | array | ✅ | 3-5 items | **Must mention all** |
| `description` | string | ✅ | 50-160 chars | **Use exactly as-is** |
| `verse.arabic` | string | ✅ | Valid Arabic text | Include after intro |
| `verse.english` | string | ✅ | Valid English text | Include after intro |
| `verse.reference` | string | ✅ | Format: "Quran X:Y" | Include after intro |

### 3.3 Validation Rules

**Slug:**
- Must match regex: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- No uppercase letters
- No special characters except hyphens
- Must be unique within language

**Keywords:**
- Minimum 3, maximum 5 keywords
- Each keyword 2-30 characters
- No duplicates within array

**Description:**
- Minimum 50 characters
- Maximum 160 characters (Google meta description limit)
- Must end with period or question mark

**Verse:**
- All three subfields required
- Reference must match pattern: `Quran \d+:\d+`
- Arabic text must contain Arabic script
- English text must be valid translation

---

## 4. Example Topic Files

### 4.1 English Topics (`topics-en.jsonl`)

```jsonl
{"number": 1, "slug": "how-to-pray-fajr-on-time", "title": "How to Wake Up for Fajr Prayer: A Complete Islamic Guide", "keywords": ["Fajr Prayer", "Morning Prayer", "Salah", "Wudu", "Islamic Routine"], "description": "Master the art of waking up for Fajr prayer with practical Islamic guidance, proven routines, and spiritual motivation.", "verse": {"arabic": "إِنَّ ٱلصَّلَوٰةَ كَانَتْ عَلَى ٱلْمُؤْمِنِينَ كِتَـٰبًۭا مَّوْقُوتًۭا", "english": "Indeed, prayer has been decreed upon the believers a decree of specified times.", "reference": "Quran 4:103"}}
{"number": 2, "slug": "benefits-of-reading-quran-daily", "title": "7 Powerful Benefits of Reading Quran Daily", "keywords": ["Quran Reading", "Daily Dhikr", "Barakah", "Spiritual Growth", "Islamic Practice"], "description": "Discover the spiritual, mental, and emotional blessings of reading the Quran every single day according to authentic Islamic teachings.", "verse": {"arabic": "إِنَّ هَـٰذَا ٱلْقُرْءَانَ يَهْدِى لِلَّتِى هِىَ أَقْوَمُ", "english": "Indeed, this Quran guides to that which is most suitable.", "reference": "Quran 17:9"}}
{"number": 3, "slug": "halal-income-complete-guide", "title": "Halal Income: Complete Guide to Earning in Islam", "keywords": ["Halal Income", "Islamic Finance", "Riba-Free", "Shariah Compliant", "Halal Business"], "description": "Complete guide to earning through Shariah-compliant means, avoiding prohibited income, and building wealth according to Islamic principles.", "verse": {"arabic": "يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ لَا تَأْكُلُوٓا۟ أَمْوَٰلَكُم بَيْنَكُم بِٱلْبَـٰطِلِ", "english": "O you who have believed, do not consume one another's wealth unjustly.", "reference": "Quran 4:29"}}
```

### 4.2 Arabic Topics (`topics-ar.jsonl`)

```jsonl
{"number": 1, "slug": "كيفية-الاستيقاظ-لصلاة-الفجر", "title": "كيفية الاستيقاظ لصلاة الفجر: دليل إسلامي كامل", "keywords": ["صلاة الفجر", "الاستيقاظ المبكر", "الوضوء", "الصلاة في وقتها", "العبادة"], "description": "دليل عملي شامل للاستيقاظ لصلاة الفجر في وقتها مع نصائح إسلامية مجربة وتحفيز روحي قوي", "verse": {"arabic": "إِنَّ ٱلصَّلَوٰةَ كَانَتْ عَلَى ٱلْمُؤْمِنِينَ كِتَـٰبًۭا مَّوْقُوتًۭا", "english": "Indeed, prayer has been decreed upon the believers a decree of specified times.", "reference": "Quran 4:103"}}
{"number": 2, "slug": "فوائد-قراءة-القرآن-يوميا", "title": "7 فوائد قوية لقراءة القرآن يوميًا", "keywords": ["قراءة القرآن", "الذكر اليومي", "البركة", "النمو الروحي", "العبادة"], "description": "اكتشف الفوائد الروحية والنفسية والعاطفية لقراءة القرآن الكريم كل يوم حسب التعاليم الإسلامية الصحيحة", "verse": {"arabic": "إِنَّ هَـٰذَا ٱلْقُرْءَانَ يَهْدِى لِلَّتِى هِىَ أَقْوَمُ", "english": "Indeed, this Quran guides to that which is most suitable.", "reference": "Quran 17:9"}}
```

---

## 5. Generation Workflow

### 5.1 Process Flow

```
START
  ↓
Read current-topic-{lang}.txt → Get topic number N
  ↓
Parse topics-{lang}.jsonl → Extract line N
  ↓
Validate JSONL schema → Ensure all fields present
  ↓
┌─────────────────────────────────────────────┐
│  OpenAI Generation (3 parallel tasks)       │
├─────────────────────────────────────────────┤
│  1. Generate Blog Content (GPT-4)           │
│     - Use exact title, slug, description    │
│     - Enforce all keywords in content       │
│     - Insert Quranic verse after intro      │
│     - Generate 6 FAQ pairs                  │
│     - 2000-3000 words                       │
│                                             │
│  2. Search YouTube Video (GPT-4)            │
│     - Find Islamic video matching topic     │
│     - Return video ID + title               │
│                                             │
│  3. Generate Hero Image (DALL-E 3)          │
│     - Create Islamic-themed image           │
│     - Save as WebP format                   │
│     - Path: public/images/blog/{lang}/{slug}/│
└─────────────────────────────────────────────┘
  ↓
Format MDX with ContentLayer frontmatter
  ↓
Save to data/blog/{lang}/{slug}.mdx
  ↓
Update current-topic-{lang}.txt → N + 1 (wrap to 1 if end)
  ↓
Log generation to logs/generation-{date}.log
  ↓
END (Success)
```

### 5.2 Counter Management

**English Counter:**
- File: `current-topic-en.txt`
- Initial value: `1`
- Increment after successful generation
- Wrap: If `N >= total_topics_en`, reset to `1`

**Arabic Counter:**
- File: `current-topic-ar.txt`
- Initial value: `1`
- Increment after successful generation
- Wrap: If `N >= total_topics_ar`, reset to `1`

### 5.3 Error Handling

| Error Type | Handling Strategy |
|------------|-------------------|
| JSONL parse error | Log error, skip to next topic |
| OpenAI API failure | Retry 3 times with exponential backoff |
| Image generation failure | Use fallback image, continue |
| YouTube search failure | Skip video embedding, continue |
| File write failure | Critical error, halt process |
| Counter update failure | Critical error, halt process |

---

## 6. MDX Output Format

### 6.1 Frontmatter Schema

```yaml
---
title: "Exact title from JSONL"
date: "YYYY-MM-DD"
lastmod: "YYYY-MM-DD"
summary: "Exact description from JSONL"
tags: ["keyword1", "keyword2", "keyword3"]
authors: ["mathias-yussif"]
draft: false
images: ["/images/blog/{lang}/{slug}/hero.webp"]
layout: "PostLayout"
faqs:
  - question: "FAQ Question 1"
    answer: "Detailed answer with Islamic references"
  - question: "FAQ Question 2"
    answer: "Detailed answer..."
  # ... 6 total FAQs
---
```

### 6.2 Content Structure

```markdown
# {exact-title}

<Image src="/images/blog/{lang}/{slug}/hero.webp" alt="{title}" />

{Introduction paragraph establishing topic and value...}

> **"{verse.arabic}"**
>
> *"{verse.english}"*
>
> — {verse.reference}

{Main content sections...}

## Section 1 (H2)
{Content mentioning all required keywords...}

### Subsection 1.1 (H3)
{Detailed content...}

<div className="my-6 aspect-video">
  <iframe
    src="https://www.youtube.com/embed/{VIDEO_ID}"
    title="{video title}"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
</div>

{More content sections...}

## Conclusion
{Summary and call to action...}
```

### 6.3 Quranic Verse Format

**Placement:** After introduction, before main content sections

**Markdown Structure:**
```markdown
> **"{arabic-text}"**
>
> *"{english-translation}"*
>
> — {reference}
```

**Rendered Example:**
> **"إِنَّ ٱلصَّلَوٰةَ كَانَتْ عَلَى ٱلْمُؤْمِنِينَ كِتَـٰبًۭا مَّوْقُوتًۭا"**
>
> *"Indeed, prayer has been decreed upon the believers a decree of specified times."*
>
> — Quran 4:103

---

## 7. ContentLayer Integration

### 7.1 Schema Updates Required

Update `contentlayer.config.ts` to support FAQs:

```typescript
export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    lastmod: { type: 'date', required: false },
    summary: { type: 'string', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    authors: { type: 'list', of: { type: 'string' }, default: [] },
    draft: { type: 'boolean', default: false },
    images: { type: 'list', of: { type: 'string' }, default: [] },
    layout: { type: 'string', default: 'PostLayout' },
    // NEW: FAQ schema for Google rich snippets
    faqs: {
      type: 'list',
      of: {
        type: 'nested',
        fields: {
          question: { type: 'string', required: true },
          answer: { type: 'string', required: true },
        },
      },
      default: [],
    },
  },
  computedFields: {
    // ... existing computed fields
    // NEW: Generate FAQ JSON-LD for SEO
    faqSchema: {
      type: 'json',
      resolve: (doc) => {
        if (!doc.faqs || doc.faqs.length === 0) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: doc.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        };
      },
    },
  },
}));
```

### 7.2 Template Usage

In blog post layout component:

```tsx
export default function BlogPost({ post }: { post: Blog }) {
  return (
    <>
      {/* Inject FAQ Schema into <head> */}
      {post.faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(post.faqSchema),
          }}
        />
      )}

      {/* Rest of blog post... */}
      <article>{post.body.code}</article>

      {/* FAQ Section */}
      {post.faqs && post.faqs.length > 0 && (
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          {post.faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
```

---

## 8. GitHub Actions Automation

### 8.1 Workflow Schedule

**File:** `.github/workflows/generate-blogs.yml`

**Schedule:**
- **English:** Daily at 06:00 UTC (6 AM UTC)
- **Arabic:** Daily at 08:00 UTC (8 AM UTC)

**Cron Expressions:**
```yaml
on:
  schedule:
    - cron: '0 6 * * *'  # English: 6 AM UTC daily
    - cron: '0 8 * * *'  # Arabic: 8 AM UTC daily
  workflow_dispatch:      # Manual trigger option
```

### 8.2 Workflow Structure

```yaml
name: Generate SEO Blogs

on:
  schedule:
    - cron: '0 6 * * *'  # 6 AM UTC - English
    - cron: '0 8 * * *'  # 8 AM UTC - Arabic
  workflow_dispatch:
    inputs:
      language:
        description: 'Language (en or ar)'
        required: true
        type: choice
        options:
          - en
          - ar

jobs:
  generate-english:
    if: github.event.schedule == '0 6 * * *' || github.event.inputs.language == 'en'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: |
          cd seo-blog-generator
          npm install
      - name: Generate English blog
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          cd seo-blog-generator
          npm run generate:en
      - name: Commit and push
        run: |
          git config user.name "DeenUp Bot"
          git config user.email "bot@deenup.com"
          git add data/blog/en/ public/images/blog/en/
          git commit -m "🤖 Generate English blog post [skip ci]"
          git push

  generate-arabic:
    if: github.event.schedule == '0 8 * * *' || github.event.inputs.language == 'ar'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: |
          cd seo-blog-generator
          npm install
      - name: Generate Arabic blog
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          cd seo-blog-generator
          npm run generate:ar
      - name: Commit and push
        run: |
          git config user.name "DeenUp Bot"
          git config user.email "bot@deenup.com"
          git add data/blog/ar/ public/images/blog/ar/
          git commit -m "🤖 Generate Arabic blog post [skip ci]"
          git push
```

### 8.3 Required Secrets

| Secret Name | Description | Source |
|-------------|-------------|--------|
| `OPENAI_API_KEY` | OpenAI API key for GPT-4 & DALL-E 3 | OpenAI Dashboard |

**Setup:** GitHub Repository → Settings → Secrets and variables → Actions → New repository secret

---

## 9. AI Prompt Requirements

### 9.1 English Prompt Structure

```
You are an expert Islamic content writer creating blog posts for DeenUp,
a platform helping Muslims strengthen their Deen and practice Islam.

TARGET AUDIENCE:
English-speaking Muslims worldwide seeking authentic Islamic knowledge,
practical guidance, and spiritual growth.

EXACT REQUIREMENTS (DO NOT DEVIATE):
- Title (use exactly): "{title}"
- Meta description (use exactly): "{description}"
- URL slug (use exactly): "{slug}"
- Keywords (MUST mention all): {keywords}
- Quranic verse (include after introduction):
  Arabic: "{verse.arabic}"
  English: "{verse.english}"
  Reference: {verse.reference}

CONTENT REQUIREMENTS:
1. Word count: 2000-3000 words
2. Tone: Respectful, authentic, educational
3. Sources: Quran and authentic Hadith only
4. Structure: Clear H2/H3 sections, bullet points, practical examples
5. Keywords: Naturally integrate ALL keywords into content
6. FAQs: Generate exactly 6 question-answer pairs
7. External links: Include 5-8 links to authentic Islamic sources

STYLE GUIDELINES:
- Use active voice and clear language
- Include practical action steps
- Reference Quranic verses and Hadith appropriately
- Avoid controversial topics or sectarian views
- Focus on what unites Muslims

OUTPUT FORMAT:
Return complete MDX with frontmatter as specified.
```

### 9.2 Arabic Prompt Structure

```
أنت كاتب محتوى إسلامي خبير تكتب مقالات لـ DeenUp، منصة تساعد
المسلمين على تقوية دينهم وممارسة الإسلام.

الجمهور المستهدف:
المسلمون الناطقون بالعربية في جميع أنحاء العالم الذين يبحثون عن
المعرفة الإسلامية الأصيلة والإرشاد العملي والنمو الروحي.

المتطلبات الدقيقة (لا تحيد عنها):
- العنوان (استخدمه بالضبط): "{title}"
- الوصف التعريفي (استخدمه بالضبط): "{description}"
- الرابط (استخدمه بالضبط): "{slug}"
- الكلمات المفتاحية (يجب ذكر الجميع): {keywords}
- الآية القرآنية (ضمّنها بعد المقدمة):
  عربي: "{verse.arabic}"
  إنجليزي: "{verse.english}"
  المرجع: {verse.reference}

متطلبات المحتوى:
1. عدد الكلمات: 2000-3000 كلمة
2. النبرة: محترمة، أصيلة، تعليمية
3. المصادر: القرآن والحديث الصحيح فقط
4. البنية: أقسام H2/H3 واضحة، نقاط، أمثلة عملية
5. الكلمات المفتاحية: دمج جميع الكلمات المفتاحية بشكل طبيعي
6. الأسئلة الشائعة: توليد 6 أزواج سؤال-جواب بالضبط
7. الروابط الخارجية: تضمين 5-8 روابط لمصادر إسلامية موثوقة

إرشادات الأسلوب:
- استخدم صوتًا نشطًا ولغة واضحة
- ضمّن خطوات عملية قابلة للتطبيق
- أشر إلى الآيات القرآنية والأحاديث بشكل مناسب
- تجنب المواضيع المثيرة للجدل أو الآراء الطائفية
- ركز على ما يوحد المسلمين

تنسيق الإخراج:
أرجع MDX كاملاً مع البيانات الوصفية كما هو محدد.
```

---

## 10. Implementation Phases

### Phase 1: Foundation (Week 1)
- ✅ Design JSONL schema
- ✅ Write PRD documentation
- ⏳ Create JSONL parser utility
- ⏳ Update config files for DeenUp paths
- ⏳ Create example topic files (20 topics each language)

### Phase 2: Core Logic (Week 1-2)
- ⏳ Adapt OpenAI client for exact value usage
- ⏳ Create English generation script (`generate-en.js`)
- ⏳ Create Arabic generation script (`generate-ar.js`)
- ⏳ Update prompts for Islamic content
- ⏳ Implement Quranic verse insertion

### Phase 3: ContentLayer Integration (Week 2)
- ⏳ Update `contentlayer.config.ts` with FAQ schema
- ⏳ Test ContentLayer parsing with sample MDX
- ⏳ Create blog post template with FAQ rendering
- ⏳ Implement JSON-LD schema injection

### Phase 4: Testing (Week 2)
- ⏳ Generate 3 test English posts locally
- ⏳ Generate 3 test Arabic posts locally
- ⏳ Validate SEO tags and schema
- ⏳ Check ContentLayer build success
- ⏳ Review content quality and accuracy

### Phase 5: Automation (Week 3)
- ⏳ Create GitHub Actions workflow
- ⏳ Configure secrets in GitHub
- ⏳ Test manual workflow dispatch
- ⏳ Test scheduled generation
- ⏳ Monitor first week of automated posts

### Phase 6: Production (Week 3+)
- ⏳ Deploy to production
- ⏳ Monitor daily generations
- ⏳ Track SEO performance
- ⏳ Iterate on prompts based on quality
- ⏳ Expand topic library to 100+ per language

---

## 11. Success Metrics

### 11.1 Technical Metrics
- **Generation Success Rate:** >95% (successful generations / total attempts)
- **Average Generation Time:** <5 minutes per article
- **ContentLayer Build Success:** 100% (no schema errors)
- **Image Generation Success:** >90%
- **YouTube Embed Success:** >80%

### 11.2 Content Quality Metrics
- **Keyword Coverage:** 100% (all keywords mentioned)
- **Title Match:** 100% exact match
- **Description Match:** 100% exact match
- **Slug Match:** 100% exact match
- **FAQ Count:** 6 per article (100%)
- **Verse Citation:** 100% (present in all articles)

### 11.3 SEO Metrics (90 days post-launch)
- **Google Search Console Impressions:** >10,000/month
- **Average CTR:** >2%
- **Indexed Pages:** >90% of generated content
- **Rich Snippets:** >50% of articles show FAQ schema
- **Organic Traffic:** 500+ sessions/month from organic search

### 11.4 Content Coverage
- **Total Posts (Year 1):** 730 (365 EN + 365 AR)
- **Topic Diversity:** 100+ unique topics per language
- **Content Freshness:** Daily updates

---

## 12. Risk Mitigation

### 12.1 Identified Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| OpenAI API outage | High | Low | Retry logic, queue system |
| API cost overrun | Medium | Medium | Monitor daily costs, set alerts |
| Content quality issues | High | Low | Regular manual reviews, feedback loop |
| Duplicate content | Medium | Low | Slug uniqueness validation |
| GitHub Actions quota | Low | Low | Self-hosted runner option |
| Theological inaccuracy | Critical | Low | Expert review process, authentic sources only |

### 12.2 Safeguards

**Theological Accuracy:**
- Prompts explicitly require Quran and authentic Hadith sources only
- Avoid controversial or sectarian topics
- Implement quarterly review by Islamic scholars

**Content Quality:**
- Weekly spot-checks of generated content
- User feedback mechanism on blog posts
- Continuous prompt refinement based on quality metrics

**Cost Control:**
- Daily OpenAI API cost alerts (>$50/day)
- Monthly budget cap ($1500/month)
- Token usage optimization in prompts

**System Reliability:**
- Comprehensive error logging
- Slack/email alerts for generation failures
- Manual generation fallback process

---

## 13. Maintenance & Operations

### 13.1 Daily Operations
- Monitor GitHub Actions workflow status
- Review generated content quality (sample 2 posts/day)
- Check OpenAI API costs and usage
- Verify blog posts are live and rendering correctly

### 13.2 Weekly Operations
- Add 7-10 new topics to JSONL files
- Review SEO performance in Google Search Console
- Check for and fix any broken links
- Update prompts if quality issues identified

### 13.3 Monthly Operations
- Generate usage and performance report
- Review and optimize OpenAI costs
- Plan new topic categories
- Theological accuracy review (sample 20 posts)
- Update documentation with learnings

### 13.4 Quarterly Operations
- Comprehensive SEO audit
- Islamic scholar review of content
- Prompt optimization based on performance data
- Expand topic library with seasonal content

---

## 14. Future Enhancements (Post-MVP)

### 14.1 Content Features
- **Hadith Integration:** Add relevant Hadith quotes alongside Quranic verses
- **Multi-verse Support:** Include 2-3 related verses per article
- **Author Attribution:** Assign specific DeenUp team members as authors
- **Content Series:** Create multi-part series on complex topics
- **Interactive Elements:** Embed calculators, quizzes, or timers

### 14.2 Technical Features
- **A/B Testing:** Test different titles/descriptions for CTR optimization
- **Translation System:** Auto-translate EN↔AR content
- **Content Calendar:** UI for managing topic queues
- **Analytics Dashboard:** Real-time tracking of blog performance
- **Smart Scheduling:** ML-based optimal posting times

### 14.3 SEO Enhancements
- **Internal Linking:** Auto-suggest related articles for interlinking
- **Image Alt Optimization:** AI-generated alt text for hero images
- **Meta Image Generation:** Custom OG images per post
- **Keyword Clustering:** Organize topics by semantic keyword groups
- **Schema Expansion:** Add HowTo, Article, and other schema types

---

## 15. Appendix

### 15.1 Glossary

| Term | Definition |
|------|------------|
| **JSONL** | JSON Lines - newline-delimited JSON format |
| **ContentLayer** | TypeScript content SDK for Next.js |
| **MDX** | Markdown with JSX components |
| **Frontmatter** | YAML metadata at top of MDX files |
| **Schema.org** | Structured data vocabulary for SEO |
| **FAQ Schema** | JSON-LD markup for Google rich snippets |
| **Slug** | URL-friendly identifier (e.g., "how-to-pray-fajr") |
| **Deen** | Islamic term for religion/way of life |

### 15.2 References

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [ContentLayer Documentation](https://contentlayer.dev)
- [Schema.org FAQ Page](https://schema.org/FAQPage)
- [Google Search Central - FAQ Schema](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

### 15.3 Contact & Support

- **Project Owner:** Mathias Yussif
- **Repository:** `github.com/deenup/DeenUp-website`
- **Documentation:** `/prd-seogen.md`
- **Issues:** GitHub Issues

---

**Document Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-28 | DeenUp Team | Initial PRD creation |

---

*This PRD is a living document and will be updated as the project evolves.*
