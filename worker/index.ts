/**
 * Runs in front of the static export (./out) and does what the export can't:
 * the browser-language redirect the middleware did, the Supabase sign-in
 * callback, the unsubscribe form and the engagement endpoint. Everything else
 * is served from the static assets. See run_worker_first in wrangler.jsonc.
 */
import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import { authConfig } from '../utils/supabase/config'
import { isLocale, localizedPath } from '../utils/locale'
import { safeReturnPath } from '../utils/auth'
import {
  engagementLocales,
  publicContentId,
  publicPath,
  shareChannels,
  shareEvents,
} from '../utils/engagement'

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> }
}

const locales = ['en', 'ar', 'fr', 'de'] as const

/** The Accept-Language tags in preference order, as the negotiator package returns them. */
function preferredLanguages(header: string | null): string[] {
  if (!header) return ['*']
  return header
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(';')
      const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='))
      return { tag: tag.trim(), q: q ? Number(q.slice(2)) : 1, index }
    })
    .filter(({ tag, q }) => tag && q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index)
    .map(({ tag }) => tag)
}

/** The middleware's matcher: '/((?!api|_next|static|.*\\..*|feed.xml).*)'. */
function middlewareApplies(pathname: string): boolean {
  const rest = pathname.slice(1)
  return !/^(?:api|_next|static|feed\.xml)/.test(rest) && !rest.includes('.')
}

/** Unprefixed pages open in the browser's language (English is the default). */
function languageRedirect(request: Request, url: URL): Response | null {
  const { pathname } = url
  if (!middlewareApplies(pathname)) return null
  if (pathname.startsWith('/auth/') || pathname.startsWith('/updates/')) return null
  if (locales.some((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`)) return null
  const detected =
    preferredLanguages(request.headers.get('accept-language'))
      .map((lang) => locales.find((l) => lang.startsWith(l)))
      .find(Boolean) ?? 'en'
  if (detected === 'en') return null
  const target = new URL(url)
  target.pathname = `/${detected}${pathname === '/' ? '' : pathname}`
  return new Response(null, {
    status: 307,
    headers: { Location: target.toString(), 'x-locale': detected },
  })
}

function redirect(location: URL | string, setCookies: string[] = [], status = 307) {
  const headers = new Headers({
    Location: location.toString(),
    'Cache-Control': 'private, no-store',
  })
  setCookies.forEach((cookie) => headers.append('Set-Cookie', cookie))
  return new Response(null, { status, headers })
}

/** Supabase email links land here: exchange the code for a session cookie. */
async function authCallback(request: Request, url: URL): Promise<Response> {
  const params = url.searchParams
  const requested = params.get('lang') || 'en'
  const locale = isLocale(requested) ? requested : 'en'
  const login = localizedPath('/login', locale)
  const next = safeReturnPath(params.get('next'), localizedPath('/', locale))
  const destination = params.get('recovery') === '1' ? `${login}?mode=update` : next
  const setCookies: string[] = []
  const config = authConfig()
  const code = params.get('code')
  if (config && code && !params.has('error')) {
    const supabase = createServerClient(config.url, config.key, {
      cookies: {
        getAll: () =>
          parseCookieHeader(request.headers.get('cookie') ?? '').map(({ name, value }) => ({
            name,
            value: value ?? '',
          })),
        setAll: (cookies) =>
          cookies.forEach(({ name, value, options }) =>
            setCookies.push(serializeCookieHeader(name, value, options))
          ),
      },
    })
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return redirect(new URL(destination, url), setCookies)
  }
  return redirect(
    new URL(`${login}?error=callback&next=${encodeURIComponent(next)}`, url),
    setCookies
  )
}

const validToken = (token: unknown): token is string =>
  typeof token === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)

/** The unsubscribe page's form posts here; the page reads ?done / ?error. */
async function unsubscribe(request: Request): Promise<Response> {
  const form = await request.formData()
  const token = form.get('token')
  const locale = form.get('locale')
  const lang = engagementLocales.includes(locale as (typeof engagementLocales)[number])
    ? String(locale)
    : 'en'
  const page = new URL('/updates/unsubscribe', request.url)
  if (!validToken(token)) return redirect(`${page}?lang=${lang}`, [], 303)
  const config = authConfig()
  let ok = false
  if (config) {
    try {
      const response = await fetch(`${config.url}/functions/v1/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: config.key,
          Origin: 'https://www.islamful.com',
        },
        body: JSON.stringify({ token }),
        signal: AbortSignal.timeout(15000),
      })
      ok = response.ok
    } catch {
      /* Keep the confirmation page available for retry. */
    }
  }
  return redirect(
    ok ? `${page}?lang=${lang}&done=1` : `${page}?lang=${lang}&error=1&token=${token}`,
    [],
    303
  )
}

const reply = (status: number, ok = false) =>
  Response.json({ ok }, { status, headers: { 'Cache-Control': 'no-store' } })

/** Share events and update sign-ups, validated here and stored by the Supabase function. */
async function engagement(request: Request, url: URL): Promise<Response> {
  if (request.method !== 'POST') return new Response(null, { status: 405 })
  if (request.headers.get('origin') !== url.origin) return reply(403)
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply(415)
  const raw = await request.text()
  if (raw.length > 2048) return reply(413)
  let input
  try {
    input = JSON.parse(raw)
  } catch {
    return reply(400)
  }
  if (!input || typeof input !== 'object') return reply(400)
  const path = publicPath(input.path)
  if (!path || !engagementLocales.includes(input.locale)) return reply(400)
  if (input.kind === 'subscribe') {
    if (input.website) return reply(200, true) // Honeypot: do not store automated submissions.
    if (
      input.consent !== true ||
      typeof input.email !== 'string' ||
      input.email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())
    )
      return reply(400)
  } else if (
    input.kind !== 'share' ||
    (input.contentId != null && !publicContentId(path, input.contentId)) ||
    !shareEvents.includes(input.event) ||
    !shareChannels.includes(input.channel) ||
    typeof input.id !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.id)
  )
    return reply(400)
  const config = authConfig()
  if (!config) return reply(503)
  try {
    const response = await fetch(`${config.url}/functions/v1/engagement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: config.key, Origin: url.origin },
      body: raw,
      signal: AbortSignal.timeout(15000),
    })
    return reply(response.status, response.ok)
  } catch {
    return reply(503)
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (url.pathname === '/api/engagement') return engagement(request, url)
    if (url.pathname === '/auth/callback') return authCallback(request, url)
    if (url.pathname === '/updates/unsubscribe' && request.method === 'POST')
      return unsubscribe(request)
    return languageRedirect(request, url) ?? env.ASSETS.fetch(request)
  },
}
