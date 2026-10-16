export const engagementLocales = ['en', 'ar', 'fr', 'de'] as const
export type EngagementLocale = (typeof engagementLocales)[number]
export function engagementLocale(path: string): EngagementLocale {
  const segment = path.split('/')[1]
  return engagementLocales.find((locale) => locale === segment) || 'en'
}
export const shareEvents = [
  'share_arrival',
  'share_open',
  'share_click',
  'share_copy',
  'share_native_complete',
  'share_native_cancel',
  'share_error',
] as const
export const shareChannels = [
  'menu',
  'copy',
  'native',
  'WhatsApp',
  'Facebook',
  'X',
  'Telegram',
  'Reddit',
] as const
export type ShareEvent = (typeof shareEvents)[number]
export type ShareChannel = (typeof shareChannels)[number]
export function publicPath(value: unknown): string | null {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return null
  const path = value.split(/[?#]/)[0]
  if (
    path.length > 500 ||
    Array.from(path).some((char) => char.charCodeAt(0) <= 32 || char === '\\') ||
    /(?:^|\/)(?:auth|login|api|updates)(?:\/|$)/.test(path)
  )
    return null
  return path
}
// Only IDs from the public, fixed catalog may enter analytics or shared links.
export function publicContentId(pathname: string, value: unknown): string | null {
  if (typeof value !== 'string') return null
  const path = publicPath(pathname)?.replace(/^\/(en|ar|fr|de)(?=\/)/, '')
  if (path === '/names-of-allah' && /^name-([1-9]|[1-9][0-9])$/.test(value)) return value
  if (path === '/dua' && /^dua-([1-9]|[1-6][0-9]|7[0-7])$/.test(value)) return value
  return null
}
export function trackShare(
  event: ShareEvent,
  channel: ShareChannel,
  pathname: string,
  contentId?: string
) {
  const path = publicPath(pathname)
  if (!path || typeof window === 'undefined' || navigator.doNotTrack === '1') return
  // No email, account identifier, calculator values, query strings, or persistent visitor ID.
  void fetch('/api/engagement', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      kind: 'share',
      id: crypto.randomUUID(),
      event,
      channel,
      path,
      locale: engagementLocale(path),
      contentId: publicContentId(path, contentId),
    }),
  }).catch(() => {}) // Analytics must never interrupt sharing.
}
