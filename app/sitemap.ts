import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import tools from '@/data/tools'
import cities from '@/data/cities'

// Force static generation at build time so ContentLayer data (allBlogs) is available
export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = siteMetadata.siteUrl
  const today = new Date().toISOString().split('T')[0]

  // Static pages
  const enRoutes = ['', 'blog', 'mission', 'quran', 'support', 'privacy', 'terms'].map((route) => ({
    url: `${siteUrl}/${route}`,
    changeFrequency: (route === '' || route === 'blog' ? 'weekly' : 'monthly') as
      | 'weekly'
      | 'monthly',
    priority:
      route === ''
        ? 1.0
        : route === 'blog'
          ? 0.8
          : route === 'mission' || route === 'quran'
            ? 0.7
            : 0.3,
  }))

  const arRoutes = ['', 'blog', 'mission', 'quran', 'support', 'privacy', 'terms'].map((route) => ({
    url: `${siteUrl}/ar${route === '' ? '' : `/${route}`}`,
    changeFrequency: (route === '' || route === 'blog' ? 'weekly' : 'monthly') as
      | 'weekly'
      | 'monthly',
    priority:
      route === ''
        ? 0.9
        : route === 'blog'
          ? 0.7
          : route === 'mission' || route === 'quran'
            ? 0.6
            : 0.2,
  }))

  // Tool pages
  const liveTools = tools.filter((tool) => tool.status === 'live')
  const enTools = liveTools.map((tool) => ({
    url: `${siteUrl}/${tool.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))
  const arTools = liveTools.map((tool) => ({
    url: `${siteUrl}/ar/${tool.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // City prayer pages
  const enCities = cities.map((city) => ({
    url: `${siteUrl}/prayer-times/${city.slug}`,
    lastModified: today,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))
  const arCities = cities.map((city) => ({
    url: `${siteUrl}/ar/prayer-times/${city.slug}`,
    lastModified: today,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // Blog posts
  const enBlogs = allBlogs
    .filter((post) => !post.draft && (post.lang === 'en' || !post.lang))
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  const arBlogs = allBlogs
    .filter((post) => !post.draft && post.lang === 'ar')
    .map((post) => ({
      url: `${siteUrl}/ar/${post.path}`,
      lastModified: post.lastmod || post.date,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  return [
    ...enRoutes,
    ...arRoutes,
    ...enTools,
    ...arTools,
    ...enCities,
    ...arCities,
    ...enBlogs,
    ...arBlogs,
  ]
}
