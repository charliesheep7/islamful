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
  const requestHeaders = new Headers(request.headers)

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
  } else {
    // Only auto-detect locale for requests without a locale prefix
    const detectedLocale = getLocale(request)

    if (detectedLocale !== defaultLocale) {
      request.nextUrl.pathname = `/${detectedLocale}${pathname}`
      const redirectResponse = NextResponse.redirect(request.nextUrl)
      redirectResponse.headers.set('x-locale', detectedLocale)
      return redirectResponse
    }

    currentLocale = detectedLocale
  }

  // Pass locale information down to the app via a custom request header
  requestHeaders.set('x-locale', currentLocale)
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set('x-locale', currentLocale)

  return response
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files)
    '/((?!api|_next|static|.*\\..*|feed.xml).*)',
  ],
}
