'use client'
import Link from '@/components/Link'
import type { Dictionary } from '@/types/dictionary'

interface CTAProps {
  lang?: string
  dict?: Dictionary
}

export default function CTA({ lang = 'en', dict }: CTAProps) {
  const isRTL = lang === 'ar'

  return (
    <section className="border-t border-gray-200 bg-[--color-bg] py-16 sm:py-24 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          className={`mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white ${isRTL ? 'font-arabic' : ''}`}
        >
          {dict?.cta?.heading || 'Start Using Islamful Today'}
        </h2>

        <p
          className={`mx-auto mb-8 max-w-xl text-lg text-gray-600 dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}
        >
          {dict?.cta?.subtitle ||
            'Free Islamic tools built for your daily worship. No sign-up required.'}
        </p>

        <Link
          href="#tools"
          className="inline-flex rounded-lg bg-[var(--color-accent-500)] px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[var(--color-accent-600)]"
        >
          {dict?.cta?.exploreCta || 'Explore All Tools'}
        </Link>
      </div>
    </section>
  )
}
