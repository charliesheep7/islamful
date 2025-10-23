import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import { getSeoBotPosts } from '@/utils/seobot'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  // Localized blog routes for Arabic
  const localizedBlogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/ar/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  // Fetch SEObot posts and add to sitemap (English only)
  const seoBotPosts = await getSeoBotPosts()
  console.log(`[SITEMAP] Fetched ${seoBotPosts.length} SEObot posts`)
  seoBotPosts.forEach((post) => {
    console.log(`[SITEMAP] SEObot post: slug=${post.slug}, draft=${post.draft}, path=${post.path}`)
  })
  const seoBotRoutes = seoBotPosts
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))
  console.log(`[SITEMAP] After draft filter: ${seoBotRoutes.length} SEObot routes`)

  const routes = ['', 'blog', 'ar', 'ar/blog'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes, ...localizedBlogRoutes, ...seoBotRoutes]
}
