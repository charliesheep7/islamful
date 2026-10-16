import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { authConfig } from '@/utils/supabase/config'
import { isLocale, localizedPath } from '@/utils/locale'
import { safeReturnPath } from '@/utils/auth'

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const requestedLocale = params.get('lang') || 'en'
  const locale = isLocale(requestedLocale) ? requestedLocale : 'en'
  const login = localizedPath('/login', locale)
  const next = safeReturnPath(params.get('next'), localizedPath('/', locale))
  const destination = params.get('recovery') === '1' ? `${login}?mode=update` : next
  const response = NextResponse.redirect(new URL(destination, request.url))
  response.headers.set('Cache-Control', 'private, no-store')
  const config = authConfig()
  const code = params.get('code')
  if (config && code && !params.has('error')) {
    const supabase = createServerClient(config.url, config.key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) =>
          cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
      },
    })
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return response
  }
  const failure = NextResponse.redirect(
    new URL(`${login}?error=callback&next=${encodeURIComponent(next)}`, request.url)
  )
  failure.headers.set('Cache-Control', 'private, no-store')
  response.cookies.getAll().forEach((cookie) => failure.cookies.set(cookie))
  return failure
}
