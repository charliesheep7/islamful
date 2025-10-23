import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import { getSeoBotPosts } from '@/utils/seobot'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = siteMetadata.siteUrl

  // English blog routes - exclude Arabic (.ar) posts
  const blogRoutes = allBlogs
    .filter((post) => !post.draft && post.lang !== 'ar')
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  // Arabic blog routes - only include Arabic posts, strip .ar suffix from path
  const localizedBlogRoutes = allBlogs
    .filter((post) => !post.draft && post.lang === 'ar')
    .map((post) => ({
      url: `${siteUrl}/ar/${post.path.replace(/\.ar$/, '')}`,
      lastModified: post.lastmod || post.date,
    }))

  // Fetch SEObot posts and add to sitemap (English only)
  const seoBotPosts = await getSeoBotPosts()
  const seoBotRoutes = seoBotPosts
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  const routes = ['', 'blog', 'ar', 'ar/blog'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes, ...localizedBlogRoutes, ...seoBotRoutes]
}
