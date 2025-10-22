import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import Negotiator from 'negotiator'

// DeenUp supports English (default) and Arabic
const locales = ['en', 'ar'] as const
const defaultLocale = 'en' as const

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  const availableLocales = [...locales]

  for (const lang of languages) {
    const locale = availableLocales.find((l) => lang.startsWith(l))
    if (locale) return locale
  }

  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Determine the current locale
  let currentLocale: (typeof locales)[number] = defaultLocale
  if (pathnameHasLocale) {
    // Extract locale from pathname
    const localeMatch = locales.find(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )
    if (localeMatch) currentLocale = localeMatch
  }

  // Create response
  const response = pathnameHasLocale
    ? NextResponse.next()
    : (() => {
        // Only auto-detect locale for requests without a locale prefix
        const locale = getLocale(request)

        // Don't add locale prefix for default locale (en)
        if (locale === defaultLocale) return NextResponse.next()

        request.nextUrl.pathname = `/${locale}${pathname}`
        return NextResponse.redirect(request.nextUrl)
      })()

  // Add custom header with the detected locale
  response.headers.set('x-locale', currentLocale)

  return response
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files)
    '/((?!api|_next|static|.*\\..*|feed.xml).*)',
  ],
}
