export const supportedLocales = ['en', 'ar', 'fr', 'de'] as const
export type Locale = (typeof supportedLocales)[number]
export function isLocale(value: string): value is Locale {
  return supportedLocales.includes(value as Locale)
}
export function localeFromPath(pathname: string): Locale {
  const segment = pathname.split('/')[1]
  return isLocale(segment) ? segment : 'en'
}
export function localizedPath(path: string, locale: Locale): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path
  const clean = path.replace(/^\/(en|ar|fr|de)(?=\/|[?#]|$)/, '') || '/'
  // Service endpoints and email-preference links keep their own routing.
  if (/^\/(auth|api|updates)(?:\/|[?#]|$)/.test(clean)) return clean
  return locale === 'en' ? clean : `/${locale}${clean === '/' ? '' : clean}`
}
