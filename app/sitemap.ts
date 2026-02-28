import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import tools from '@/data/tools'
import cities from '@/data/cities'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = siteMetadata.siteUrl
  const today = new Date().toISOString().split('T')[0]

  // Static pages (English)
  const staticRoutes = ['', 'blog', 'about', 'privacy', 'terms'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: '2025-02-01',
    changeFrequency: (route === '' || route === 'blog' ? 'weekly' : 'monthly') as
      | 'weekly'
      | 'monthly',
    priority: route === '' ? 1.0 : route === 'blog' ? 0.8 : 0.3,
  }))

  // Static pages (Arabic)
  const arabicStaticRoutes = ['', 'blog', 'about', 'privacy', 'terms'].map((route) => ({
    url: `${siteUrl}/ar${route === '' ? '' : `/${route}`}`,
    lastModified: '2025-02-01',
    changeFrequency: (route === '' || route === 'blog' ? 'weekly' : 'monthly') as
      | 'weekly'
      | 'monthly',
    priority: route === '' ? 0.9 : route === 'blog' ? 0.7 : 0.2,
  }))

  // Tool pages (English)
  const toolRoutes = tools
    .filter((tool) => tool.status === 'live')
    .map((tool) => ({
      url: `${siteUrl}/${tool.slug}`,
      lastModified: today,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))

  // Tool pages (Arabic)
  const arabicToolRoutes = tools
    .filter((tool) => tool.status === 'live')
    .map((tool) => ({
      url: `${siteUrl}/ar/${tool.slug}`,
      lastModified: today,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

  // English blog routes
  const blogRoutes = allBlogs
    .filter((post) => !post.draft && (post.lang === 'en' || !post.lang))
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  // Arabic blog routes
  const localizedBlogRoutes = allBlogs
    .filter((post) => !post.draft && post.lang === 'ar')
    .map((post) => ({
      url: `${siteUrl}/ar/${post.path}`,
      lastModified: post.lastmod || post.date,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  // Prayer times city pages — English (pSEO)
  const cityRoutes = cities.map((city) => ({
    url: `${siteUrl}/prayer-times/${city.slug}`,
    lastModified: today,
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }))

  // Prayer times city pages — Arabic (pSEO)
  const arabicCityRoutes = cities.map((city) => ({
    url: `${siteUrl}/ar/prayer-times/${city.slug}`,
    lastModified: today,
    changeFrequency: 'daily' as const,
    priority: 0.5,
  }))

  return [
    ...staticRoutes,
    ...arabicStaticRoutes,
    ...toolRoutes,
    ...arabicToolRoutes,
    ...cityRoutes,
    ...arabicCityRoutes,
    ...blogRoutes,
    ...localizedBlogRoutes,
  ]
}
