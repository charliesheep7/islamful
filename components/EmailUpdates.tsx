'use client'
import { useState, type FormEvent } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { engagementLocale, publicPath } from '@/utils/engagement'
import { engagementCopy } from '@/data/engagement-copy'
export default function EmailUpdates() {
  const pathname = usePathname() || '/'
  const locale = engagementLocale(pathname)
  const t = engagementCopy[locale]
  const [state, setState] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === 'pending') return
    const data = new FormData(event.currentTarget)
    setState('pending')
    try {
      const result = await fetch('/api/engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'subscribe',
          email: data.get('email'),
          consent: data.get('consent') === 'on',
          website: data.get('website'),
          path: publicPath(pathname) || '/',
          locale,
        }),
      })
      if (!result.ok) throw new Error('Subscription failed')
      setState('success')
    } catch {
      setState('error')
    }
  }
  if (pathname.startsWith('/updates/')) return null
  return (
    <section
      aria-label={t.title}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className="mx-auto my-8 max-w-2xl rounded-2xl border border-green-900/10 bg-green-50/60 p-6 dark:border-gray-700 dark:bg-gray-800/40"
    >
      <h2 className="text-xl font-semibold">{t.title}</h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t.description}</p>
      {state === 'success' ? (
        <p role="status" className="mt-4 font-medium">
          {t.success}
        </p>
      ) : (
        <form onSubmit={subscribe} className="mt-4 space-y-3">
          <label className="block text-sm">
            {t.email}
            <input
              name="email"
              type="email"
              autoComplete="email"
              dir="ltr"
              maxLength={254}
              required
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </label>
          <div hidden aria-hidden="true">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" name="consent" required className="mt-1" />
            {t.consent}
          </label>
          <button
            disabled={state === 'pending'}
            className="min-h-11 rounded-xl bg-[#327952] px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
            {state === 'pending' ? t.pending : t.join}
          </button>
          {state === 'error' && (
            <p role="alert" className="text-sm text-red-700 dark:text-red-300">
              {t.error}
            </p>
          )}
        </form>
      )}
      <Link
        href={locale === 'en' ? '/privacy' : `/${locale}/privacy`}
        className="mt-3 inline-block text-xs underline"
      >
        {t.privacy}
      </Link>
    </section>
  )
}
