import { allBlogs } from 'contentlayer/generated'
import { buildLanguageAlternates } from 'app/seo'
import { supportedLocales, type Locale } from './locale'

// Translated archives can have fewer pages than the English archive.
// Advertise only counterparts that exist; a language's homepage is not an equivalent archive.
export function blogArchiveAlternates(page: number, currentLanguage: Locale) {
  const path = page <= 1 ? '/blog' : `/blog/page/${page}`
  const alternates = buildLanguageAlternates(path, { currentLanguage })
  const available = new Set(
    supportedLocales.filter((locale) => {
      const count = allBlogs.filter((post) => !post.draft && (post.lang || 'en') === locale).length
      return page <= Math.ceil(count / 5)
    })
  )
  return {
    ...alternates,
    languages: Object.fromEntries(
      Object.entries(alternates?.languages || {}).filter(([locale]) =>
        available.has((locale === 'x-default' ? 'en' : locale) as Locale)
      )
    ),
  }
}
