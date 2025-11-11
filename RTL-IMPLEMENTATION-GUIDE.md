# RTL (Right-to-Left) Implementation Guide for DeenUp

## Problem Statement

The generated Arabic blog posts in `/data/blog/ar/` are not displaying with proper RTL layout because:

1. ✅ **HTML `dir="rtl"`** is set correctly at the root layout
2. ❌ **Component-level classes** use LTR-specific utilities (`space-x`, `text-left`, `ml-`, `mr-`, etc.)
3. ❌ **Prose** and layout components don't adapt to RTL
4. ❌ **Navigation** (prev/next) doesn't flip for Arabic

## Solution: Multi-Layer RTL Support

### Layer 1: Root Layout (✅ Already Done)

Per your multilingual PRD, the root layout already handles this:

```typescript
// app/layout.tsx (ALREADY CORRECT)
const locale = (headersList.get('x-locale') as 'en' | 'ar') || 'en'

<html
  lang={locale}
  dir={locale === 'ar' ? 'rtl' : 'ltr'}  // ✅ Correct
>
```

### Layer 2: Component-Level CSS (❌ Needs Fix)

Replace directional utilities with **logical properties**:

| ❌ LTR-Specific | ✅ RTL-Compatible                |
| --------------- | -------------------------------- |
| `ml-4`          | `ms-4` (margin-inline-start)     |
| `mr-4`          | `me-4` (margin-inline-end)       |
| `pl-4`          | `ps-4` (padding-inline-start)    |
| `pr-4`          | `pe-4` (padding-inline-end)      |
| `text-left`     | `text-start`                     |
| `text-right`    | `text-end`                       |
| `space-x-4`     | `space-x-4 rtl:space-x-reverse`  |
| `border-l`      | `border-s` (border-inline-start) |
| `border-r`      | `border-e` (border-inline-end)   |

### Layer 3: Tailwind Configuration

Ensure Tailwind CSS supports logical properties. Add to `tailwind.config.ts`:

```typescript
// tailwind.config.ts
module.exports = {
  // ... existing config
  plugins: [
    // ... existing plugins
    require('@tailwindcss/typography'),
    // Enable RTL support
    function ({ addVariant }) {
      addVariant('rtl', '[dir="rtl"] &')
      addVariant('ltr', '[dir="ltr"] &')
    },
  ],
}
```

### Layer 4: PostLayout Component Updates

**Current Issues in PostLayout.tsx:**

Line 64: `sm:space-x-12` → needs `rtl:space-x-reverse`
Line 66: `space-x-3` → needs `rtl:space-x-reverse`
Line 66: `text-left` → should be `text-start`

**Updated PostLayout.tsx with RTL Support:**

```typescript
// layouts/PostLayout.tsx
export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags, faqs, summary, lang } = content
  const basePath = path.split('/')[0]
  const isArabic = lang === 'ar'

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">
                    {isArabic ? 'نُشر في' : 'Published on'}
                  </dt>
                  <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(
                        isArabic ? 'ar-SA' : siteMetadata.locale,
                        postDateTemplate
                      )}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0 dark:divide-gray-700">
            <dl className="pt-6 pb-10 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
              <dt className="sr-only">{isArabic ? 'المؤلفون' : 'Authors'}</dt>
              <dd>
                {/* ✅ FIXED: Added rtl:space-x-reverse */}
                <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 sm:rtl:space-x-reverse xl:block xl:space-y-8 xl:space-x-0">
                  {authorDetails.map((author) => (
                    {/* ✅ FIXED: space-x-3 → space-x-3 rtl:space-x-reverse, text-left → text-start */}
                    <li className="flex items-center space-x-3 rtl:space-x-reverse text-start" key={author.name}>
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={42}
                          height={42}
                          alt={author.name}
                          className="h-12 w-12 rounded-full"
                        />
                      )}
                      <dl className="text-sm leading-5 font-medium">
                        <dt className="sr-only">{isArabic ? 'الاسم' : 'Name'}</dt>
                        <dd className="text-gray-900 dark:text-gray-100">{author.name}</dd>
                        {(author.occupation || author.company) && (
                          <>
                            <dt className="sr-only">{isArabic ? 'الدور' : 'Role'}</dt>
                            <dd className="text-gray-500 dark:text-gray-400">
                              {[author.occupation, author.company].filter(Boolean).join(' • ')}
                            </dd>
                          </>
                        )}
                      </dl>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
            <div className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
              {/* ✅ Prose already handles RTL via Tailwind */}
              <div className="prose dark:prose-invert max-w-none pt-10 pb-8">
                <Share title={title} slug={slug} summary={summary} />
                <BasmalahIntro />
                {children}
                {faqs && <FAQ faqs={faqs} />}
              </div>
              <div className="pt-6 pb-6 text-sm text-gray-700 dark:text-gray-300">
                <Link href={discussUrl(path)} rel="nofollow">
                  {isArabic ? 'ناقش على X' : 'Discuss on X'}
                </Link>
              </div>
              {siteMetadata.comments && (
                <div
                  className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300"
                  id="comment"
                >
                  <Comments slug={slug} />
                </div>
              )}
            </div>
            <footer>
              <div className="divide-gray-200 text-sm leading-5 font-medium xl:col-start-1 xl:row-start-2 xl:divide-y dark:divide-gray-700">
                {(next || prev) && (
                  <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                    {/* ✅ FIXED: Swap prev/next for RTL */}
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
              </div>
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${basePath}`}
                  className="text-accent-600 hover:text-accent-700 dark:hover:text-accent-400"
                  aria-label={isArabic ? 'العودة إلى المدونة' : 'Back to the blog'}
                >
                  {isArabic ? '→ العودة إلى المدونة' : '← Back to the blog'}
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
```

### Layer 5: Prose Typography (@tailwindcss/typography)

The `prose` class automatically handles RTL when `dir="rtl"` is set on `<html>`. No changes needed, but verify configuration:

```typescript
// tailwind.config.ts
module.exports = {
  plugins: [
    require('@tailwindcss/typography')({
      modifiers: [],
    }),
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            // RTL-specific overrides if needed
            '[dir="rtl"] &': {
              // Custom RTL styles
            },
          },
        },
      },
    },
  },
}
```

### Layer 6: MDX Components (Iframes, Images)

Ensure MDX components respect RTL:

```typescript
// components/MDXComponents.tsx
const MDXComponents = {
  Image: ({ src, alt, ...props }) => (
    <Image
      src={src}
      alt={alt}
      {...props}
      className={`${props.className || ''} mx-auto`} // ✅ Centered, works in RTL
    />
  ),
  iframe: ({ src, title, ...props }) => (
    <div className="my-6 mx-auto max-w-3xl"> {/* ✅ Centered container */}
      <iframe
        src={src}
        title={title}
        {...props}
        className="w-full"
      />
    </div>
  ),
}
```

## Implementation Checklist

- [ ] **Update Tailwind Config** - Add RTL variants
- [ ] **Update PostLayout.tsx** - Replace LTR-specific classes
- [ ] **Update MDX Components** - Ensure centering works in RTL
- [ ] **Test Arabic Blog Post** - Verify layout mirrors correctly
- [ ] **Check Navigation** - Prev/Next swap for Arabic
- [ ] **Verify Prose** - Arabic text flows right-to-left
- [ ] **Test on Mobile** - RTL should work on all breakpoints

## Testing Steps

1. **Build and Run:**

   ```bash
   npm run build
   npm run dev
   ```

2. **Navigate to Arabic Post:**

   ```
   http://localhost:3000/ar/blog/salat-al-fajr-kayfa-uwazib
   ```

3. **Verify RTL Elements:**
   - ✅ Text flows right-to-left
   - ✅ Author info aligned to right
   - ✅ Spacing reversed (margin-start, not margin-left)
   - ✅ Prev/Next navigation swapped
   - ✅ "Back to blog" arrow points right (→ not ←)
   - ✅ Images centered
   - ✅ YouTube iframe centered

4. **Browser DevTools Check:**
   ```html
   <html lang="ar" dir="rtl">
     <!-- Should see dir="rtl" on HTML element -->
   </html>
   ```

## Quick Fix Summary

**3 Files to Update:**

1. **tailwind.config.ts** - Add RTL variants
2. **layouts/PostLayout.tsx** - Replace 5 lines with RTL-compatible classes
3. **components/MDXComponents.tsx** - Ensure iframes/images centered

**Estimated Time:** 15 minutes
**Impact:** Full native RTL support for Arabic blog posts

---

**Reference:**

- [Tailwind RTL Support](https://tailwindcss.com/docs/hover-focus-and-other-states#rtl-support)
- [Next.js i18n](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [MDN: dir attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir)
