import { translatedContentPaths } from '@/data/locales/routes'
import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import tools from '@/data/tools'
import games from '@/data/games'
import cities from '@/data/cities'
import { chapters, quranPath } from '@/data/quran'
import { routines } from '@/data/adhkar'

// Force static generation at build time so ContentLayer data (allBlogs) is available
export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = siteMetadata.siteUrl

  // Static pages
  const enRoutes = ['', 'blog', 'games', 'mission', 'support', 'privacy', 'terms'].map((route) => ({
    url: `${siteUrl}/${route}`,
    changeFrequency: (route === '' || route === 'blog' ? 'weekly' : 'monthly') as
      | 'weekly'
      | 'monthly',
    priority: route === '' ? 1.0 : route === 'blog' ? 0.8 : route === 'mission' ? 0.7 : 0.3,
  }))

  const arRoutes = ['', 'blog', 'games', 'mission', 'support', 'privacy', 'terms'].map((route) => ({
    url: `${siteUrl}/ar${route === '' ? '' : `/${route}`}`,
    changeFrequency: (route === '' || route === 'blog' ? 'weekly' : 'monthly') as
      | 'weekly'
      | 'monthly',
    priority: route === '' ? 0.9 : route === 'blog' ? 0.7 : route === 'mission' ? 0.6 : 0.2,
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

  // Game pages
  const enGames = games.map((game) => ({
    url: `${siteUrl}/games/${game.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))
  const arGames = games.map((game) => ({
    url: `${siteUrl}/ar/games/${game.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Last significant template/content revision; do not advance on unrelated builds.
  const discoveryRevision = '2026-10-25'

  // City prayer pages
  const enCities = cities.map((city) => ({
    url: `${siteUrl}/prayer-times/${city.slug}`,
    lastModified: discoveryRevision,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))
  const arCities = cities.map((city) => ({
    url: `${siteUrl}/ar/prayer-times/${city.slug}`,
    lastModified: discoveryRevision,
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

  const translatedPages = ['fr', 'de'].flatMap((lang) =>
    translatedContentPaths
      .filter((path) => !path.startsWith('/adhkar/'))
      .map((path) => ({
        url: `${siteUrl}/${lang}${path === '/' ? '' : path}`,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
  )
  const translatedCities = ['fr', 'de'].flatMap((lang) =>
    cities.map((city) => ({
      url: `${siteUrl}/${lang}/prayer-times/${city.slug}`,
      lastModified: discoveryRevision,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))
  )

  const quranPages = ['en', 'ar', 'fr', 'de'].flatMap((lang) =>
    chapters.map((chapter) => ({
      url: `${siteUrl}${quranPath(chapter, lang)}`,
      lastModified: discoveryRevision,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${siteUrl}${quranPath(chapter, 'en')}`,
          ar: `${siteUrl}${quranPath(chapter, 'ar')}`,
          fr: `${siteUrl}${quranPath(chapter, 'fr')}`,
          de: `${siteUrl}${quranPath(chapter, 'de')}`,
        },
      },
    }))
  )

  const adhkarPages = ['en', 'ar', 'fr', 'de'].flatMap((lang) =>
    routines.map((r) => ({
      url: `${siteUrl}${lang === 'en' ? '' : `/${lang}`}/adhkar/${r.id}`,
      lastModified: discoveryRevision,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${siteUrl}/adhkar/${r.id}`,
          ar: `${siteUrl}/ar/adhkar/${r.id}`,
          fr: `${siteUrl}/fr/adhkar/${r.id}`,
          de: `${siteUrl}/de/adhkar/${r.id}`,
        },
      },
    }))
  )

  const ramadanCities = ['en', 'ar', 'fr', 'de'].flatMap((lang) =>
    cities.map((city) => ({
      url: `${siteUrl}${lang === 'en' ? '' : `/${lang}`}/ramadan-calendar/${city.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${siteUrl}/ramadan-calendar/${city.slug}`,
          ar: `${siteUrl}/ar/ramadan-calendar/${city.slug}`,
          fr: `${siteUrl}/fr/ramadan-calendar/${city.slug}`,
          de: `${siteUrl}/de/ramadan-calendar/${city.slug}`,
        },
      },
    }))
  )

  const translatedBlogs = allBlogs
    .filter((p) => !p.draft && ['fr', 'de'].includes(p.lang))
    .map((p) => ({
      url: `${siteUrl}/${p.lang}/${p.path}`,
      lastModified: p.lastmod || p.date,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  return [
    ...translatedBlogs,
    ...translatedPages,
    ...translatedCities,
    ...ramadanCities,
    ...adhkarPages,
    ...quranPages,
    ...enRoutes,
    ...arRoutes,
    ...enTools,
    ...arTools,
    ...enGames,
    ...arGames,
    ...enCities,
    ...arCities,
    ...enBlogs,
    ...arBlogs,
  ]
}
