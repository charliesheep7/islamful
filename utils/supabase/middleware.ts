import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { authConfig } from './config'

export async function refreshAuth(request: NextRequest, headers: Headers) {
  let response = NextResponse.next({ request: { headers } })
  const config = authConfig()
  if (!config) return response
  const supabase = createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookies) {
        cookies.forEach(({ name, value }) => request.cookies.set(name, value))
        headers.set('cookie', request.cookies.toString())
        response = NextResponse.next({ request: { headers } })
        cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        response.headers.set('Cache-Control', 'private, no-store')
      },
    },
  })
  // Anonymous public pages do not need an Auth round trip.
  if (request.cookies.getAll().some(({ name }) => name.startsWith('sb-'))) {
    await supabase.auth.getUser()
  }
  return response
}
