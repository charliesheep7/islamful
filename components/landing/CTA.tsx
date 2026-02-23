'use client'
import type { Dictionary } from '@/types/dictionary'

interface CTAProps {
  lang?: string
  dict?: Dictionary
}

export default function CTA({ lang = 'en', dict }: CTAProps) {
  const appStoreUrl = 'https://apps.apple.com/tn/app/deen-back-daily-dua-dhikr/id6755876142'

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[--color-bg] via-white to-[--color-surface] py-20 sm:py-28 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Subtle animated background blobs */}
      <div className="absolute inset-0 opacity-20">
        <div className="animate-blob absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[--color-accent-500] mix-blend-multiply blur-3xl filter" />
        <div className="animate-blob animation-delay-2000 absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-[--color-accent-400] mix-blend-multiply blur-3xl filter" />
        <div className="animate-blob animation-delay-4000 absolute bottom-1/4 left-1/2 h-96 w-96 rounded-full bg-[--color-accent-600] mix-blend-multiply blur-3xl filter" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[--color-accent-200] bg-[--color-accent-100] px-4 py-2 dark:border-[--color-accent-800] dark:bg-[--color-accent-900]">
          <span
            className={`text-sm font-semibold text-[--color-accent-700] dark:text-[--color-accent-300] ${lang === 'ar' ? 'font-arabic' : ''}`}
          >
            {dict?.cta?.badge || 'Available on the App Store'}
          </span>
        </div>

        <h2
          className={`mb-6 text-4xl leading-tight font-bold text-[--color-text] sm:text-5xl lg:text-6xl dark:text-white ${lang === 'ar' ? 'font-arabic' : ''}`}
        >
          {dict?.cta?.heading || 'Start your journey back to Allah today'}
        </h2>

        <p
          className={`mx-auto mb-10 max-w-2xl text-xl text-gray-600 dark:text-gray-300 ${lang === 'ar' ? 'font-arabic' : ''}`}
        >
          {dict?.cta?.subtitle ||
            'Download Deen Back and turn every moment of struggle into a step closer to Allah.'}
        </p>

        {/* App Store badge CTA */}
        <div className="flex flex-col items-center gap-4">
          <a
            href={appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-200 hover:scale-105"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/static/images/apple-app-store-badge.svg"
              alt="Download on the App Store"
              style={{ width: 'auto', height: '64px' }}
            />
          </a>

          <p
            className={`text-sm text-gray-500 dark:text-gray-400 ${lang === 'ar' ? 'font-arabic' : ''}`}
          >
            {dict?.cta?.comingSoonText ||
              'Free to download. Subscription required for full access.'}
          </p>
        </div>
      </div>
    </section>
  )
}
