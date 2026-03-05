import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import tools from '@/data/tools'
import cities from '@/data/cities'

// Sitemap segments: static, tools, cities, blog
// Next.js generates a sitemap index at /sitemap.xml referencing each segment
const STATIC = 0
const TOOLS = 1
const CITIES = 2
const BLOG = 3

export async function generateSitemaps() {
  return [{ id: STATIC }, { id: TOOLS }, { id: CITIES }, { id: BLOG }]
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const siteUrl = siteMetadata.siteUrl
  const today = new Date().toISOString().split('T')[0]

  switch (id) {
    case STATIC: {
      // Static pages rarely change — omit lastModified so Google doesn't lose trust
      const enRoutes = ['', 'blog', 'mission', 'quran', 'support', 'privacy', 'terms'].map(
        (route) => ({
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
        })
      )

      const arRoutes = ['', 'blog', 'mission', 'quran', 'support', 'privacy', 'terms'].map(
        (route) => ({
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
        })
      )

      return [...enRoutes, ...arRoutes]
    }

    case TOOLS: {
      // Tool hub pages — omit lastModified (hub content is stable)
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

      return [...enTools, ...arTools]
    }

    case CITIES: {
      // City prayer pages — lastmod today is legitimate (prayer times change daily)
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

      return [...enCities, ...arCities]
    }

    case BLOG: {
      // Blog posts — use actual content dates
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

      return [...enBlogs, ...arBlogs]
    }

    default:
      return []
  }
}
