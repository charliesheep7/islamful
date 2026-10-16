// Only local paths can be used after authentication. Reject browser-normalized escapes.
export function safeReturnPath(value: string | null | undefined, fallback = '/') {
  // eslint-disable-next-line no-control-regex
  if (!value || !value.startsWith('/') || /[\\\x00-\x20]/.test(value)) return fallback
  try {
    const url = new URL(value, 'https://islamful.invalid')
    if (
      url.origin !== 'https://islamful.invalid' ||
      /^\/(?:ar\/|en\/|fr\/|de\/)?(?:login|auth)(?:\/|$)/.test(url.pathname)
    )
      return fallback
    return url.pathname + url.search + url.hash
  } catch {
    return fallback
  }
}
