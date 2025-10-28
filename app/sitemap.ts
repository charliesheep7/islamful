import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import { getSeoBotPosts } from '@/utils/seobot'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = siteMetadata.siteUrl

  // English blog routes - exclude Arabic posts
  const blogRoutes = allBlogs
    .filter((post) => !post.draft && (post.lang === 'en' || !post.lang))
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  // Arabic blog routes - only include posts that exist in Arabic
  const localizedBlogRoutes = allBlogs
    .filter((post) => !post.draft && post.lang === 'ar')
    .map((post) => ({
      url: `${siteUrl}/ar/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  // Fetch SEObot posts and add to sitemap (English only, no Arabic versions)
  const seoBotPosts = await getSeoBotPosts()
  const seoBotRoutes = seoBotPosts
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  // Include canonical URLs for both English and Arabic main routes
  // Both languages are canonical (independent content strategy)
  const routes = ['', 'blog', 'privacy', 'terms'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  // Add Arabic route equivalents (all are canonical)
  const arabicRoutes = ['', 'blog', 'privacy', 'terms'].map((route) => ({
    url: `${siteUrl}/ar${route === '' ? '' : `/${route}`}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...arabicRoutes, ...blogRoutes, ...localizedBlogRoutes, ...seoBotRoutes]
}
