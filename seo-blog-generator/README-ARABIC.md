# Arabic Blog Generator for DeenUp

## Overview

Complete SEO-optimized Arabic blog content generation system for DeenUp, tailored specifically for Arabic-speaking Muslim readers.

## 📁 File Structure

```
seo-blog-generator/
├── prompts/
│   ├── master-prompt-ar.js      # Arabic-specific prompt template
│   └── master-prompt-en.js      # English prompt template
├── data/
│   ├── topics-ar.jsonl          # 30 Arabic topics
│   └── topics-en.jsonl          # English topics
├── config/
│   └── settings.js              # Config with AR/EN paths
├── generate-ar.js               # Arabic blog generator
└── generate-en.js               # English blog generator
```

## 🎯 Key Features for Arabic Content

### 1. **Arabic-First Content Structure**

- **RTL-aware formatting**
- **Arabic text prioritized** over translation
- **Proper diacritics (tashkeel)** for Quranic verses
- **Classical Arabic terminology** (فقه، حديث، تفسير)

### 2. **Scholarly Depth**

- Citations from classical scholars (ابن كثير، السعدي، النووي)
- Detailed fiqh rulings
- Madhahib sensitivity (different schools of thought)
- More formal tone than English version

### 3. **Content Differences from English**

| Aspect        | English                        | Arabic                                             |
| ------------- | ------------------------------ | -------------------------------------------------- |
| **Tone**      | Conversational, approachable   | Formal, scholarly                                  |
| **Structure** | Introduction → Value → Content | Arabic text → Translation → Evidence → Application |
| **Citations** | Brief mentions                 | Detailed scholarly references                      |
| **Audience**  | General Muslims                | Arabic speakers + Islamic learners                 |
| **Focus**     | Practical daily practice       | Ritual correctness + spiritual depth               |

## 📋 30 Arabic Topics

### Category Breakdown:

1. **Core Islamic Practices** (9 topics)
   - Salat al-Fajr, Wudu, Prayer requirements
   - Prayer pillars, obligations, and conditions
   - Witr prayer, Dhuha prayer

2. **Duas & Supplications** (11 topics)
   - Travel, deceased, sick, forgiveness
   - Protection, provision, relief from distress
   - Qunut, Taraweeh, personal duas

3. **Spiritual Protection** (4 topics)
   - Ruqyah (general + for children)
   - Evil eye and envy protection
   - Daily protection adhkar

4. **Quran & Tafsir** (3 topics)
   - Surat Al-Fatihah tafsir
   - Beginning of Surat Al-Baqarah
   - Quran apps and resources

5. **Islamic Knowledge** (3 topics)
   - Religious Q&A
   - Marriage duas
   - Dhikr and istighfar

## 🚀 Usage

### Generate Single Arabic Post

```bash
cd seo-blog-generator
node generate-ar.js 1
```

This will generate:

- **MDX file**: `../data/blog/ar/salat-al-fajr-kayfa-uwazib.mdx`
- **Hero image**: `../public/images/blog/salat-al-fajr-kayfa-uwazib/hero.png`
- **URL**: `https://www.deenup.app/ar/blog/salat-al-fajr-kayfa-uwazib`

### Generate Multiple Posts

```bash
# Generate topics 1-5
for i in {1..5}; do node generate-ar.js $i; sleep 10; done
```

### Generate All 30 Topics

```bash
# Generate all Arabic topics
for i in {1..30}; do node generate-ar.js $i; sleep 10; done
```

## 📝 Arabic Prompt Structure

The [master-prompt-ar.js](prompts/master-prompt-ar.js) follows the exact structure as English but with key adaptations:

### 1. **Language & Style**

```javascript
// Arabic-specific style requirements
- Right-to-left (RTL) formatting awareness
- Arabic typography with proper diacritics
- Formality level: More formal than English
- Classical Arabic references included
```

### 2. **Content Structure**

```markdown
## Mandatory Arabic Sections:

1. **النص العربي الأصلي** (Original Arabic Text)
2. **الترجمة والمعنى** (Translation & Meaning)
3. **الأدلة الشرعية** (Scholarly Evidence)
4. **الفوائد والحكم** (Benefits & Wisdom)
5. **التطبيق العملي** (Practical Application)
```

### 3. **FAQ Style**

```markdown
Arabic FAQ patterns:
✅ "ما هو..." (What is...)
✅ "كيف..." (How...)
✅ "متى..." (When...)
✅ "لماذا..." (Why...)
✅ Formal second person: أنت، يجب عليك
```

### 4. **External Links**

- 8 authoritative Islamic sources (same as English)
- Links to specific Arabic articles when available
- Natural Arabic anchor text

## 🎨 Image Generation

Arabic blog images use the same Islamic art style:

- Oil painting on canvas aesthetic
- Geometric Islamic patterns
- Warm golden hour lighting
- NO human figures or faces
- Arabic calligraphy elements when appropriate

## 📊 Output Format

### Arabic MDX Structure:

```markdown
---
title: 'صلاة الفجر: كيف تداوم عليها وفضلها وسنة الفجر'
date: '2025-11-10'
lastmod: '2025-11-10'
summary: 'دليل عملي للمداومة على الفجر مع بيان الفضائل وسنة الفجر'
tags: ['صلاة الفجر', 'فضل صلاة الفجر', 'سنة الفجر']
authors: ['mathias-yussif']
draft: false
images: ['/images/blog/salat-al-fajr-kayfa-uwazib/hero.webp']
layout: 'PostLayout'
faqs:
  - question: 'ما فضل صلاة الفجر في جماعة؟'
    answer: 'من صلى الفجر في جماعة فكأنما قام الليل كله...'
  # ... 5 more FAQs
---

<Image src="/images/blog/salat-al-fajr-kayfa-uwazib/hero.webp" alt="..." width={1200} height={630} />

{Arabic introduction with hook}

## الملخص السريع

- {6-8 action-oriented bullets in Arabic}

> **"إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا"**
>
> _"Indeed, the prayer is prescribed upon the believers at fixed times."_
>
> — Quran 4:103

## {Contextual H2 for video}

{YouTube iframe embed}

{Main content sections...}

## الخاتمة

{Conclusion summary}
```

## 🔗 URL Structure

All Arabic blog posts follow the multilingual PRD structure:

```
English:  https://www.deenup.app/blog/{slug}
Arabic:   https://www.deenup.app/ar/blog/{slug}
```

### Hreflang Tags (Automatic):

```html
<!-- English page -->
<link rel="canonical" href="https://deenup.app/blog/salat-al-fajr-kayfa-uwazib" />
<link rel="alternate" hreflang="en" href="https://deenup.app/blog/salat-al-fajr-kayfa-uwazib" />
<link rel="alternate" hreflang="ar" href="https://deenup.app/ar/blog/salat-al-fajr-kayfa-uwazib" />
<link
  rel="alternate"
  hreflang="x-default"
  href="https://deenup.app/blog/salat-al-fajr-kayfa-uwazib"
/>

<!-- Arabic page -->
<link rel="canonical" href="https://deenup.app/ar/blog/salat-al-fajr-kayfa-uwazib" />
<link rel="alternate" hreflang="en" href="https://deenup.app/blog/salat-al-fajr-kayfa-uwazib" />
<link rel="alternate" hreflang="ar" href="https://deenup.app/ar/blog/salat-al-fajr-kayfa-uwazib" />
```

## ✅ Quality Checklist

Before generating Arabic content, ensure:

- [ ] **OpenAI API key** configured in `.env`
- [ ] **Topics file** exists: `data/topics-ar.jsonl`
- [ ] **Output directory** exists: `../data/blog/ar/`
- [ ] **Image directory** exists: `../public/images/blog/`
- [ ] **Prompt template** reviewed: `prompts/master-prompt-ar.js`

After generation, verify:

- [ ] **MDX file** created in `../data/blog/ar/`
- [ ] **Hero image** generated in `../public/images/blog/{slug}/`
- [ ] **Arabic text** has proper diacritics in Quranic verses
- [ ] **FAQs** extracted (6 Q&A pairs in frontmatter)
- [ ] **External links** (8 authoritative sources)
- [ ] **RTL formatting** works correctly
- [ ] **URL** follows pattern: `/ar/blog/{slug}`

## 🎯 Key Differences from English Generator

| Feature          | English (generate-en.js) | Arabic (generate-ar.js)              |
| ---------------- | ------------------------ | ------------------------------------ |
| **Prompt**       | master-prompt-en.js      | master-prompt-ar.js                  |
| **Topics**       | topics-en.jsonl          | topics-ar.jsonl                      |
| **Output**       | ../data/blog/en/         | ../data/blog/ar/                     |
| **URL**          | /blog/{slug}             | /ar/blog/{slug}                      |
| **Tone**         | Conversational           | Formal, scholarly                    |
| **Structure**    | Value-first              | Arabic text → Evidence → Application |
| **Citations**    | Brief                    | Detailed scholarly references        |
| **Console logs** | English                  | Arabic (🚀 بدء توليد...)             |

## 🛠️ Configuration

### Environment Variables

```bash
# .env file (in seo-blog-generator/)
OPENAI_API_KEY=sk-...
OPENAI_ORG_ID=org-...
MAX_TOKENS=4000
TEMPERATURE=0.7
```

### Settings (config/settings.js)

```javascript
export const config = {
  openai: {
    textModel: 'gpt-5-mini-2025-08-07',
    imageModel: 'gpt-5',
    maxTokens: 4000,
    temperature: 0.7,
  },
  TOPICS_AR: './data/topics-ar.jsonl',
  OUTPUT_DIR_AR: '../data/blog/ar/',
}
```

## 📚 Topics List (All 30)

1. صلاة الفجر: كيف تداوم عليها وفضلها
2. دعاء السفر كامل: الصيغ الثابتة وآداب المسافر
3. دعاء للميت: أدعية الرحمة والمغفرة
4. تحصين النفس: آيات وأذكار الحفظ من كل شر
5. الرُّقية الشرعية: نصوصها الصحيحة وطريقتها
6. الرُّقية الشرعية للأطفال
7. العين والحسد: آيات التحصين وأدعية الوقاية
8. دعاء للمريض: أدعية الشفاء وفضل عيادة المريض
9. الأذكار والاستغفار: صيغ ثابتة وأفضل الأوقات
10. صفة الصلاة: الأركان والواجبات والسنن
11. كيفية الوضوء الصحيح: خطوات عملية ونواقضه
12. شروط الصلاة: الطهارة والوقت والستر
13. دعاء القنوت والوتر: الصيغ الثابتة
14. دعاء التراويح وقيام الليل
15. دعاء الفرج والكرب والهمّ
16. أدعية التيسير والرزق والتوفيق
17. دعاء قصير جميل: صيغ موجزة جامعة
18. دعاء لنفسي: التحصين والإصلاح الذاتي
19. دعاء الاستغفار: أفضل الصيغ وأوقاتها
20. القرآن الكريم: تطبيقات للقراءة والتلاوة
21. تفسير سورة الفاتحة: المعاني والفضائل
22. أول سورة البقرة: افتتاحية الهداية
23. أسئلة دينية: سهلة وصعبة مع الإجابات
24. دعاء الزواج: أدعية التيسير والقبول
25. صلاة الضحى: فضلها وكيفيتها
26. دعاء للمريض تحبه: صيغ موجزة ومؤثرة
27. بسمِ اللهِ أرقيك: صيغ الرقية والأذكار
28. دعاء السفر القصير: الصيغ المختصرة
29. صلاة الوتر: سنتها ودعاء القنوت
30. أدعية خاصة: اللهم اهدنا فيمن هديت

## 🚨 Common Issues & Solutions

### Issue: Arabic text appears broken

**Solution**: Ensure proper UTF-8 encoding:

```javascript
fs.writeFileSync(outputPath, mdxContent, 'utf-8')
```

### Issue: Diacritics missing in Quran verses

**Solution**: The Arabic prompt specifically instructs GPT to include tashkeel (diacritics) for religious texts.

### Issue: Links not working

**Solution**: Verify the URL structure follows `/ar/blog/{slug}` pattern as per multilingual PRD.

### Issue: Image generation fails

**Solution**: Check OpenAI API quota and image generation model (`gpt-5`).

## 📖 References

- **Multilingual PRD**: `/prd-multilang.md`
- **English Generator**: `generate-en.js`
- **Arabic Prompt**: `prompts/master-prompt-ar.js`
- **Topics**: `data/topics-ar.jsonl`

## 🎉 Next Steps

1. **Test Generation**: Run topic #1 (Salat al-Fajr)
2. **Review Output**: Check MDX file and hero image
3. **Deploy**: Add to production blog
4. **Monitor**: Track SEO performance in Arabic markets

---

**Created**: 2025-11-10
**Version**: 1.0
**Status**: Production Ready ✅
