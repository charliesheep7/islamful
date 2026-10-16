'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Check, Copy, Share2 } from 'lucide-react'
import {
  engagementLocale,
  publicContentId,
  trackShare,
  type ShareChannel,
} from '@/utils/engagement'
import { engagementCopy } from '@/data/engagement-copy'
import siteMetadata from '@/data/siteMetadata'
import { canonicalShareUrl, shareLinks, attributedShareUrl } from '@/utils/sharing'

interface ShareProps {
  title: string
  slug?: string
  summary?: string
  tool?: boolean
  anchor?: string
  sharePath?: string
}
export default function Share({ title, summary, tool = false, anchor, sharePath }: ShareProps) {
  const currentPath = usePathname() || '/'
  const pathname = sharePath || currentPath
  const locale = engagementLocale(pathname)
  const ar = locale === 'ar'
  const t = engagementCopy[locale]
  const [status, setStatus] = useState('')
  const [manualCopy, setManualCopy] = useState(false)
  const [native, setNative] = useState(false)
  const [pageTitle, setPageTitle] = useState(title)
  const canonical = canonicalShareUrl(siteMetadata.siteUrl, pathname)
  // Only explicit public content IDs are shareable; never copy the current private hash.
  const contentId = publicContentId(pathname, anchor)
  const url = contentId ? `${canonical}#${contentId}` : canonical
  useEffect(() => {
    setNative(typeof navigator.share === 'function')
    setStatus('')
    setManualCopy(false)
    setPageTitle(tool ? document.querySelector('h1')?.textContent?.trim() || title : title)
  }, [pathname, title, tool])
  useEffect(() => {
    if (!status) return
    const timer = setTimeout(() => setStatus(''), 4000)
    return () => clearTimeout(timer)
  }, [status])
  async function copy() {
    try {
      await navigator.clipboard.writeText(attributedShareUrl(url, 'copy'))
      setManualCopy(false)
      setStatus(t.copied)
      trackShare('share_copy', 'copy', pathname, contentId || undefined)
    } catch {
      setManualCopy(true)
      setStatus(t.manual)
      trackShare('share_error', 'copy', pathname, contentId || undefined)
    }
  }
  async function nativeShare() {
    trackShare('share_click', 'native', pathname, contentId || undefined)
    try {
      await navigator.share({
        title: pageTitle,
        text: summary || pageTitle,
        url: attributedShareUrl(url, 'native'),
      })
      trackShare('share_native_complete', 'native', pathname, contentId || undefined)
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        trackShare('share_native_cancel', 'native', pathname, contentId || undefined)
      } else {
        trackShare('share_error', 'native', pathname, contentId || undefined)
        setStatus(t.failed)
      }
    }
  }
  const button =
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-green-900/15 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-green-700 hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800'
  if (tool && pageTitle === '404') return null
  return (
    <section
      aria-label={t.sharePage}
      dir={ar ? 'rtl' : 'ltr'}
      className="not-prose my-6 rounded-2xl border border-green-900/10 bg-green-50/60 p-4 sm:p-5 dark:border-gray-700 dark:bg-gray-800/40"
    >
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-900 dark:text-green-200">
        <Share2 size={17} aria-hidden="true" />
        {t.benefit}
      </p>
      <div className="flex flex-wrap gap-2">
        {native && (
          <button type="button" onClick={nativeShare} className={button}>
            <Share2 size={16} aria-hidden="true" />
            {t.share}
          </button>
        )}
        {Object.entries(shareLinks(url, summary ? `${pageTitle}\n${summary}` : pageTitle)).map(
          ([name, href]) => (
            <a
              key={name}
              href={href}
              onClick={() =>
                trackShare('share_click', name as ShareChannel, pathname, contentId || undefined)
              }
              target="_blank"
              rel="noopener noreferrer"
              className={button}
              aria-label={`${t.shareOn} ${name}`}
            >
              {name}
            </a>
          )
        )}
        <button type="button" onClick={copy} className={button}>
          {status === t.copied ? (
            <Check size={16} aria-hidden="true" />
          ) : (
            <Copy size={16} aria-hidden="true" />
          )}
          {t.copy}
        </button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className={status ? 'mt-3 text-sm text-green-900 dark:text-green-200' : 'sr-only'}
      >
        {status}
      </p>
      {manualCopy && (
        <input
          aria-label={t.pageLink}
          readOnly
          value={attributedShareUrl(url, 'copy')}
          onFocus={(e) => e.target.select()}
          dir="ltr"
          className="mt-3 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900"
        />
      )}
    </section>
  )
}
