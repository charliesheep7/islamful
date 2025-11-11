# RTL Fixes for PostLayout.tsx

## Changes Needed (5 locations)

### **Change 1: Add lang detection** (Line 35)

```typescript
// BEFORE:
const { filePath, path, slug, date, title, tags, faqs, summary } = content

// AFTER:
const { filePath, path, slug, date, title, tags, faqs, summary, lang } = content
const isArabic = lang === 'ar'
```

---

### **Change 2: Localize "Published on"** (Line 47)

```typescript
// BEFORE:
<dt className="sr-only">Published on</dt>

// AFTER:
<dt className="sr-only">{isArabic ? 'نُشر في' : 'Published on'}</dt>
```

And update date formatting (Line 50):

```typescript
// BEFORE:
{
  new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)
}

// AFTER:
{
  new Date(date).toLocaleDateString(isArabic ? 'ar-SA' : siteMetadata.locale, postDateTemplate)
}
```

---

### **Change 3: Fix author section RTL** (Lines 62-66)

```typescript
// BEFORE:
<dt className="sr-only">Authors</dt>
<dd>
  <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-y-8 xl:space-x-0">
    {authorDetails.map((author) => (
      <li className="flex items-center space-x-3 text-left" key={author.name}>

// AFTER:
<dt className="sr-only">{isArabic ? 'المؤلفون' : 'Authors'}</dt>
<dd>
  <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 sm:rtl:space-x-reverse xl:block xl:space-y-8 xl:space-x-0">
    {authorDetails.map((author) => (
      <li
        className="flex items-center space-x-3 rtl:space-x-reverse text-start"
        key={author.name}
      >
```

Also update Name/Role labels (Lines 77-78):

```typescript
// BEFORE:
<dt className="sr-only">Name</dt>
...
<dt className="sr-only">Role</dt>

// AFTER:
<dt className="sr-only">{isArabic ? 'الاسم' : 'Name'}</dt>
...
<dt className="sr-only">{isArabic ? 'الدور' : 'Role'}</dt>
```

---

### **Change 4: Localize "Discuss on X"** (Line 101-103)

```typescript
// BEFORE:
<Link href={discussUrl(path)} rel="nofollow">
  Discuss on X
</Link>

// AFTER:
<Link href={discussUrl(path)} rel="nofollow">
  {isArabic ? 'ناقش على X' : 'Discuss on X'}
</Link>
```

---

### **Change 5: Fix navigation (prev/next swap + arrows)** (Lines 116-148)

```typescript
// BEFORE:
{(next || prev) && (
  <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
    {prev && prev.path && (
      <div>
        <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
          Previous Article
        </h2>
        <div className="text-accent-600 hover:text-accent-700 dark:hover:text-accent-400">
          <Link href={`/${prev.path}`}>{prev.title}</Link>
        </div>
      </div>
    )}
    {next && next.path && (
      <div>
        <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
          Next Article
        </h2>
        <div className="text-accent-600 hover:text-accent-700 dark:hover:text-accent-400">
          <Link href={`/${next.path}`}>{next.title}</Link>
        </div>
      </div>
    )}
  </div>
)}

// AFTER (swap prev/next for Arabic):
{(next || prev) && (
  <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
    {(isArabic ? next : prev) && (isArabic ? next : prev).path && (
      <div>
        <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
          {isArabic ? 'المقال التالي' : 'Previous Article'}
        </h2>
        <div className="text-accent-600 hover:text-accent-700 dark:hover:text-accent-400">
          <Link href={`/${(isArabic ? next : prev).path}`}>
            {(isArabic ? next : prev).title}
          </Link>
        </div>
      </div>
    )}
    {(isArabic ? prev : next) && (isArabic ? prev : next).path && (
      <div>
        <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
          {isArabic ? 'المقال السابق' : 'Next Article'}
        </h2>
        <div className="text-accent-600 hover:text-accent-700 dark:hover:text-accent-400">
          <Link href={`/${(isArabic ? prev : next).path}`}>
            {(isArabic ? prev : next).title}
          </Link>
        </div>
      </div>
    )}
  </div>
)}
```

And update "Back to blog" arrow (Line 142-148):

```typescript
// BEFORE:
<Link
  href={`/${basePath}`}
  className="text-accent-600 hover:text-accent-700 dark:hover:text-accent-400"
  aria-label="Back to the blog"
>
  &larr; Back to the blog
</Link>

// AFTER:
<Link
  href={`/${basePath}`}
  className="text-accent-600 hover:text-accent-700 dark:hover:text-accent-400"
  aria-label={isArabic ? 'العودة إلى المدونة' : 'Back to the blog'}
>
  {isArabic ? 'العودة إلى المدونة →' : '← Back to the blog'}
</Link>
```

---

## Testing After Changes

1. **Build:**

   ```bash
   npm run build
   ```

2. **Start dev server:**

   ```bash
   npm run dev
   ```

3. **Test Arabic page:**

   ```
   http://localhost:3000/ar/blog/salat-al-fajr-kayfa-uwazib
   ```

4. **Verify:**
   - ✅ Text flows right-to-left
   - ✅ Author avatar on RIGHT side
   - ✅ Spacing between elements reversed
   - ✅ Navigation: "التالي" (next) appears first
   - ✅ Arrow points RIGHT: "العودة →"
   - ✅ Date formatted in Arabic locale

---

## Summary

**Total Changes:** 5 locations in `PostLayout.tsx`
**Time Required:** ~10 minutes
**No Tailwind config changes needed** (Tailwind v4 has built-in RTL)
