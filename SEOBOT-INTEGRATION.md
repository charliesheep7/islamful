# SEObot Integration Guide

This document explains how SEObot is integrated into the DeenUp blog.

**Last Updated:** October 23, 2025  
**Status:** ✅ Fully Working (Images, Videos, Keywords)

## Overview

SEObot posts are seamlessly integrated with your existing ContentLayer MDX blog posts. Users cannot tell the difference between SEObot-generated posts and your manually written posts.

### ✅ What's Working

- ✅ Featured images display correctly
- ✅ YouTube video embeds work
- ✅ Meta descriptions from SEObot
- ✅ Meta keywords from SEObot
- ✅ OpenGraph and Twitter Card metadata
- ✅ Seamless mixing with ContentLayer posts

## Setup

### 1. Environment Variables

The SEObot API key is stored in `.env.local`:

```bash
SEOBOT_API_KEY=b86ca3b4-c410-43c9-a111-f2005039d8e3
```

**Note**: `.env.local` is gitignored and should never be committed to version control.

### 2. Package Installation

The `seobot` npm package has been installed:

```bash
npm install seobot --force
```

## How It Works

### Architecture

1. **Utility Functions** (`utils/seobot.ts`)
   - `getSeoBotPosts()`: Fetches all posts from SEObot API
   - `getSeoBotPostBySlug(slug)`: Fetches a single post by slug
   - `normalizeSeoBotPost()`: Converts SEObot posts to match ContentLayer structure
   - `mergePosts()`: Merges and sorts ContentLayer + SEObot posts by date

2. **Blog Listing** (`app/blog/page.tsx` & `app/blog/page/[page]/page.tsx`)
   - Fetches both ContentLayer and SEObot posts
   - Merges them together
   - Sorts by date (newest first)
   - Displays them in the same list

3. **Individual Post Pages** (`app/blog/[...slug]/page.tsx`)
   - Checks ContentLayer first for a matching slug
   - If not found, checks SEObot
   - Renders ContentLayer posts with MDX
   - Renders SEObot posts as HTML

4. **Sitemap** (`app/sitemap.ts`)
   - Includes both ContentLayer and SEObot posts
   - Ensures all posts are indexed by search engines

### Post Normalization

SEObot posts are normalized to match ContentLayer's Blog structure:

```typescript
{
  title: string
  date: string
  slug: string
  summary: string
  tags: string[]
  lang: 'en'
  draft: boolean
  authors: ['default']
  layout: 'PostLayout'
  readingTime: { text, minutes, time, words }
  structuredData: { ... }
  isSeoBotPost: true // Flag to identify source
}
```

## Features

### ✅ Seamless Integration

- SEObot posts appear alongside ContentLayer posts
- No visual distinction for users
- Same layouts and styling
- Featured images automatically displayed
- YouTube videos and iframes work correctly

### ✅ SEO Optimized

- **Meta Description**: Pulled from `post.metaDescription`
- **Meta Keywords**: Pulled from `post.metaKeywords`
- **OpenGraph Images**: SEObot featured images included
- **Twitter Cards**: Full metadata support
- All posts included in sitemap
- Structured data (JSON-LD)

### ✅ Language Support

- SEObot posts are English-only
- Only appear in `/blog` (not `/ar/blog`)

### ✅ Pagination

- SEObot posts are included in pagination
- Total page count includes both sources

### ✅ Media Support

- Featured images from SEObot CDN
- YouTube video embeds via iframe
- Responsive image sizing
- SEObot scripts and tracking enabled

## Technical Implementation Details

### Content Security Policy (CSP)

Updated `next.config.js` to allow:

- **YouTube embeds**: `youtube.com`, `www.youtube.com`, `youtube-nocookie.com`
- **SEObot scripts**: `app.seobotai.com`
- **SEObot images**: Already allowed via `img-src *`

```javascript
frame-src giscus.app youtube.com www.youtube.com youtube-nocookie.com www.youtube-nocookie.com
script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is app.seobotai.com
```

### Image Optimization

Added SEObot CDN to Next.js image domains:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'assets.seobotai.com',
    },
  ],
}
```

### Metadata Implementation

**File**: `app/blog/[...slug]/page.tsx`

```typescript
// Extract keywords from SEObot posts
const keywords = (post as any).metaKeywords

return {
  title: post.title,
  description: post.summary,
  keywords: keywords || undefined, // ← SEObot keywords added
  // ... rest of metadata
}
```

### Featured Image Display

**File**: `app/blog/[...slug]/page.tsx` (lines 159-167)

```tsx
{isSeoBotPost ? (
  <>
    {seoBotPost.images && seoBotPost.images[0] && (
      <div className="mb-8">
        <img
          src={seoBotPost.images[0]}
          alt={seoBotPost.title}
          className="w-full h-auto rounded-lg"
        />
      </div>
    )}
    <div
      className="prose dark:prose-dark max-w-none"
      dangerouslySetInnerHTML={{ __html: seoBotPost.body.raw }}
    />
  </>
) : (
  // ContentLayer MDX rendering
)}
```

## Example Metadata Output

For the SEObot post "7 Daily Islamic Habits That Transform Your Faith":

```html
<meta
  name="description"
  content="Incorporate seven simple daily habits to strengthen your connection with Allah and enhance your Islamic faith amidst a busy lifestyle."
/>
<meta
  name="keywords"
  content="Islamic habits, daily prayers, Quran reflection, dhikr, acts of kindness, Islamic learning, gratitude, good character"
/>
<meta
  property="og:image"
  content="https://assets.seobotai.com/cdn-cgi/image/quality=75,w=1536,h=1024/deenup.app/68f9b8e99cea6427b3f57703-1761199572523.jpg"
/>
```

## Limitations

1. **Static Generation**: SEObot posts are fetched at runtime, so they require dynamic rendering
2. **No MDX**: SEObot posts render as HTML, not MDX (no interactive components)
3. **English Only**: Currently configured for English posts only
4. **No Static Params**: SEObot posts don't generate static params (may affect build time)

## Testing

To test the integration:

1. **Start Development Server**:

   ```bash
   npm run dev
   ```

2. **Check Blog Listing**: Visit `http://localhost:3000/blog`
   - You should see both your MDX posts and SEObot posts mixed together

3. **Check Individual Posts**: Click on any post
   - ContentLayer posts should render with full MDX support
   - SEObot posts should render as HTML with the same layout

4. **Check Sitemap**: Visit `http://localhost:3000/sitemap.xml`
   - All posts should be included

## Monitoring

SEObot API errors are logged to the console. Check your server logs for:

```
Error fetching SEObot posts: [error details]
Error fetching SEObot post with slug [slug]: [error details]
```

## Troubleshooting

### Posts Not Showing Up

1. Check if `.env.local` exists and has the correct API key
2. Check server logs for API errors
3. Verify your SEObot account has published posts
4. Check that posts are not marked as drafts

### Build Errors

If you get build errors:

1. Ensure `seobot` package is installed: `npm list seobot`
2. Check that `.env.local` exists (even for build)
3. Try `npm run build` to see detailed errors

### API Rate Limits

If you hit API rate limits:

1. Reduce the frequency of fetching posts
2. Implement caching (consider using Next.js ISR)
3. Contact SEObot support for higher limits

## Future Enhancements

Potential improvements:

1. **Caching**: Implement ISR (Incremental Static Regeneration) to cache SEObot posts
2. **Arabic Support**: Fetch Arabic translations from SEObot if available
3. **Image Optimization**: Process SEObot images through Next.js Image component
4. **Search Integration**: Include SEObot posts in local search index
5. **Tag Aggregation**: Include SEObot post tags in tag counts

## What's Next?

### Test the Integration

Visit: http://localhost:3000/blog/daily-islamic-habits-transform-faith

**What You'll See:**

- ✅ Featured image at the top
- ✅ YouTube video embedded in content
- ✅ Full HTML content rendered
- ✅ Meta description in page source
- ✅ Meta keywords in page source

### Add More SEObot Posts

- Log into app.seobotai.com
- Create/publish more posts with your API key
- They'll appear automatically in your blog

### Production Deployment

When deploying to production, ensure:

1. **Environment Variable**: Set `SEOBOT_API_KEY` in your hosting provider
2. **CSP Headers**: The updated CSP in `next.config.js` will apply automatically
3. **Image Domains**: SEObot CDN is already configured
4. **Dynamic Routes**: SEObot posts fetch at runtime, so use `dynamic` rendering

## Support

For issues with:

- **SEObot API**: Contact SEObot support at app.seobotai.com
- **Integration Code**: Check this documentation or the code comments in `utils/seobot.ts`

---

## Changelog

### October 23, 2025 - Media & Metadata Updates

**Fixed:**

- ✅ YouTube video embeds now display correctly (CSP updated)
- ✅ Featured images from SEObot CDN now show (image domains added)
- ✅ Meta keywords now included in page metadata
- ✅ Meta descriptions properly rendered

**Files Changed:**

- `next.config.js` - Added YouTube and SEObot to CSP, added image domains
- `app/blog/[...slug]/page.tsx` - Added featured image display, keywords metadata
- `utils/seobot.ts` - Added `metaKeywords` field to interface

**Testing Confirmed:**

- Page renders with featured image: ✅
- YouTube iframe loads and plays: ✅
- Meta tags in HTML source: ✅
- OpenGraph image in social cards: ✅

---

**Status**: ✅ Fully Working! (Images, Videos, Keywords)  
**Last Updated**: October 23, 2025  
**Dev Server**: http://localhost:3000
