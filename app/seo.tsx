import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

const normalizePath = (path?: string) => {
  if (!path || path === '/') {
    return '/'
  }
  return path.startsWith('/') ? path : `/${path}`
}

interface LanguageAlternatesOptions {
  includeArabic?: boolean
  includeEnglish?: boolean
  xDefault?: 'en' | 'ar' | string
  englishPath?: string
  arabicPath?: string
  canonical?: string
  currentLanguage?: 'en' | 'ar'
}

export function buildLanguageAlternates(
  path: string,
  {
    includeArabic = true,
    includeEnglish = true,
    xDefault,
    englishPath,
    arabicPath,
    canonical,
    currentLanguage = 'en',
  }: LanguageAlternatesOptions = {}
): Metadata['alternates'] {
  const normalizedEnglish = normalizePath(englishPath ?? path)
  const derivedArabic = normalizedEnglish === '/' ? '/ar' : `/ar${normalizedEnglish}`
  const normalizedArabic = normalizePath(arabicPath ?? derivedArabic)
  const normalizedCanonical = canonical
    ? normalizePath(canonical)
    : currentLanguage === 'ar'
      ? normalizedArabic
      : normalizedEnglish

  // CRITICAL FIX: Use absolute URLs for canonical and hreflang
  // Relative URLs cause "Duplicate canonical" errors in Google Search Console
  // because www.deenback.com and deenback.com resolve relative URLs differently
  const baseUrl = siteMetadata.siteUrl
  const absoluteEnglish = `${baseUrl}${normalizedEnglish}`
  const absoluteArabic = `${baseUrl}${normalizedArabic}`
  const absoluteCanonical = `${baseUrl}${normalizedCanonical}`

  const languages: Record<string, string> = {}

  // Only add x-default for English pages (default locale)
  // Arabic pages should not have x-default to avoid canonical conflicts
  if (currentLanguage === 'en') {
    if (xDefault === 'ar') {
      languages['x-default'] = absoluteArabic
    } else if (xDefault && xDefault !== 'en') {
      languages['x-default'] = `${baseUrl}${normalizePath(xDefault)}`
    } else {
      languages['x-default'] = absoluteEnglish
    }
  }

  if (includeEnglish) {
    languages.en = absoluteEnglish
  }
  if (includeArabic) {
    languages.ar = absoluteArabic
  }

  return {
    canonical: absoluteCanonical,
    languages,
  }
}

export function genPageMetadata({ title, description, image, ...rest }: PageSEOProps): Metadata {
  // Let buildLanguageAlternates handle x-default logic based on currentLanguage
  // Don't automatically add x-default here to avoid conflicts
  return {
    title,
    description: description || siteMetadata.description,
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      url: './',
      siteName: siteMetadata.title,
      images: image ? [image] : [siteMetadata.socialBanner],
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: 'summary_large_image',
      images: image ? [image] : [siteMetadata.socialBanner],
    },
    ...rest,
  }
}
