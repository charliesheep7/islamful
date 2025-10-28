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

  const languages: Record<string, string> = {}

  // Only add x-default for English pages (default locale)
  // Arabic pages should not have x-default to avoid canonical conflicts
  if (currentLanguage === 'en') {
    if (xDefault === 'ar') {
      languages['x-default'] = normalizedArabic
    } else if (xDefault && xDefault !== 'en') {
      languages['x-default'] = normalizePath(xDefault)
    } else {
      languages['x-default'] = normalizedEnglish
    }
  }

  if (includeEnglish) {
    languages.en = normalizedEnglish
  }
  if (includeArabic) {
    languages.ar = normalizedArabic
  }

  return {
    canonical: normalizedCanonical,
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
