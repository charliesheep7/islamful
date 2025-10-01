import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  // Localized blog routes for ES and ZH
  const localizedBlogRoutes = allBlogs
    .filter((post) => !post.draft)
    .flatMap((post) => [
      { url: `${siteUrl}/es/${post.path}`, lastModified: post.lastmod || post.date },
      { url: `${siteUrl}/zh/${post.path}`, lastModified: post.lastmod || post.date },
    ])

  const routes = ['', 'blog', 'es', 'es/blog', 'zh', 'zh/blog'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes, ...localizedBlogRoutes]
}
