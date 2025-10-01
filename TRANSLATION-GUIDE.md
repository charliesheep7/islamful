# Translation Quick Reference Guide

> **Quick guide for adding content and translations to VisaCalm**

## 📝 When Adding New UI Text

Edit these **3 files**:
1. `dictionaries/en.json`
2. `dictionaries/es.json`
3. `dictionaries/zh.json`

**Example:** Adding a "Contact" button
```json
// In each dictionary file, add:
"nav": {
  "contact": "Contact"      // en.json
  "contact": "Contacto"     // es.json
  "contact": "联系我们"      // zh.json
}
```

---

## 📄 When Adding New Pages

Create **2 pages**:
- `app/new-page/page.tsx` — English
- `app/[lang]/new-page/page.tsx` — Spanish & Chinese

**Template for localized page:**
```typescript
import { getDictionary } from '../dictionaries'

export function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'zh' }]
}

export default async function Page({ params }: { params: Promise<{ lang: 'es' | 'zh' }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  return <div>{dict.yourSection.text}</div>
}
```

---

## ✍️ When Writing New Blog Posts

### Quick: English only
```
data/blog/my-new-post.mdx
```

### Full: With translations
```
data/blog/
├── my-new-post.mdx              # English
├── mi-nuevo-post.mdx            # Spanish (localized slug!)
└── wo-de-xin-wenzhang.mdx       # Chinese (pinyin slug)
```

**Include in frontmatter:**
```yaml
---
title: "Your Title"
date: "2025-01-15"
lang: es  # Add this for Spanish/Chinese
---
```

---

## 🔗 When Adding Navigation Links

**3 steps:**

1. **Add to navigation** (`data/headerNavLinks.ts`):
```typescript
{ href: '/contact', title: 'Contact' }
```

2. **Add to dictionaries** (see "When Adding New UI Text" above)

3. **Update Header translations** (`components/Header.tsx`):
```typescript
const translations = {
  en: { contact: 'Contact' },
  es: { contact: 'Contacto' },
  zh: { contact: '联系我们' }
}
```

---

## ✅ Pre-Deployment Checklist

- [ ] English content created
- [ ] Localized versions in `app/[lang]/`
- [ ] All 3 dictionaries updated
- [ ] `generateStaticParams()` present
- [ ] Test build: `yarn build`
- [ ] Test all locales: `/`, `/es`, `/zh`

---

## 📁 File Structure Reference

```
app/
├── page.tsx                    # English home
├── blog/                       # English blog
├── contact/                    # English contact
└── [lang]/
    ├── dictionaries.ts         # Dictionary loader
    ├── page.tsx               # ES/ZH home
    ├── blog/                  # ES/ZH blog
    └── contact/               # ES/ZH contact

dictionaries/
├── en.json                    # English UI strings
├── es.json                    # Spanish UI strings
└── zh.json                    # Chinese UI strings

data/blog/
├── post-name.mdx              # English posts
├── nombre-del-post.mdx        # Spanish posts
└── wenzhang-mingcheng.mdx     # Chinese posts
```

---

## 🌍 Translation Tips

**Spanish:**
- Use Mexican/Latin American Spanish
- Formal tone (usted)
- Localize visa terms properly

**Chinese:**
- Use Simplified Chinese
- Keep common English terms: H-1B, USCIS
- Professional terminology

**Both:**
- Localize, don't just translate!
- Research SEO keywords in target language
- Use native speakers for review

---

**📖 Full details:** See [prd-multilang.md](prd-multilang.md) Section 6.4