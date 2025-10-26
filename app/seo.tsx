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

  if (xDefault === 'ar') {
    languages['x-default'] = normalizedArabic
  } else if (xDefault && xDefault !== 'en') {
    languages['x-default'] = normalizePath(xDefault)
  } else {
    languages['x-default'] = normalizedEnglish
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
  // If alternates.languages is provided, automatically add x-default pointing to English version
  const alternates = rest.alternates
  if (alternates?.languages && !alternates.languages['x-default']) {
    alternates.languages = {
      'x-default': alternates.languages.en || '/',
      ...alternates.languages,
    }
  }

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
