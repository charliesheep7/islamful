import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import Negotiator from 'negotiator'

const locales = ['en', 'es', 'zh'] as const
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

  // If locale is already in path, don't redirect - let user's choice persist
  if (pathnameHasLocale) return

  // Only auto-detect locale for requests without a locale prefix
  // This allows users to manually switch languages without being redirected back
  const locale = getLocale(request)

  // Don't add locale prefix for default locale (en)
  if (locale === defaultLocale) return

  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files)
    '/((?!api|_next|static|.*\\..*|feed.xml).*)',
  ],
}
