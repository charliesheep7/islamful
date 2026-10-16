import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import Negotiator from 'negotiator'
import { refreshAuth } from '@/utils/supabase/middleware'

// English is the default; all supported locales use explicit route prefixes.
const locales = ['en', 'ar', 'fr', 'de'] as const
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/auth/') || pathname.startsWith('/updates/')) {
    const headers = new Headers(request.headers)
    const lang = request.nextUrl.searchParams.get('lang')
    headers.set('x-locale', locales.includes(lang as (typeof locales)[number]) ? lang! : 'en')
    headers.set('x-pathname', pathname)
    const response = NextResponse.next({ request: { headers } })
    response.headers.set('Referrer-Policy', 'no-referrer')
    response.headers.set('Cache-Control', 'no-store')
    return response
  }
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

  // Pass locale information down to the app via custom request headers
  requestHeaders.set('x-locale', currentLocale)
  requestHeaders.set('x-pathname', pathname)
  const response = await refreshAuth(request, requestHeaders)
  response.headers.set('x-locale', currentLocale)
  response.headers.set('x-pathname', pathname)

  return response
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files)
    '/((?!api|_next|static|.*\\..*|feed.xml).*)',
  ],
}
