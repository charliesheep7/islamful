export function canonicalShareUrl(origin: string, pathname: string) {
  // Share the public page only, never location, calculator inputs, or auth tokens.
  const path = pathname.split(/[?#]/)[0].replace(/^\/en(?=\/|$)/, '') || '/'
  return new URL(path.startsWith('/') && !path.startsWith('//') ? path : '/', origin).toString()
}
export function shareLinks(url: string, title: string) {
  const forChannel = (channel: string) => encodeURIComponent(attributedShareUrl(url, channel)),
    text = encodeURIComponent(title)
  return {
    WhatsApp: `https://wa.me/?text=${encodeURIComponent(`${title}\n${attributedShareUrl(url, 'WhatsApp')}`)}`,
    Facebook: `https://www.facebook.com/sharer/sharer.php?u=${forChannel('Facebook')}`,
    X: `https://twitter.com/intent/tweet?url=${forChannel('X')}&text=${text}`,
    Telegram: `https://t.me/share/url?url=${forChannel('Telegram')}&text=${text}`,
    Reddit: `https://www.reddit.com/submit?url=${forChannel('Reddit')}&title=${text}`,
  }
}

export function attributedShareUrl(url: string, channel: string) {
  const result = new URL(url)
  result.searchParams.set('shared', channel)
  return result.toString()
}
