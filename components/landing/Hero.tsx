'use client'
import Link from '@/components/Link'
import type { Dictionary } from '@/types/dictionary'

interface HeroProps {
  lang?: string
  dict?: Dictionary
}

export default function Hero({ lang = 'en', dict }: HeroProps) {
  const isRTL = lang === 'ar'

  return (
    <section className="relative bg-gradient-to-b from-[--color-bg] to-white dark:from-gray-950 dark:to-gray-900">
      <div className="mx-auto max-w-4xl px-4 pt-16 pb-20 text-center sm:px-6 sm:pt-24 sm:pb-28 lg:px-8">
        <div dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Main tagline */}
          <h1
            className={`text-4xl leading-tight font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white ${isRTL ? 'font-arabic' : ''}`}
          >
            {dict?.hero?.tagline || 'Everything a Muslim Needs. Every Day.'}
          </h1>

          {/* Subtitle */}
          <p
            className={`mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}
          >
            {dict?.hero?.subtitle ||
              'Prayer times, halal checker, Quran, dua, dhikr, and more — all in one place. Islamful is your complete Islamic companion on the web.'}
          </p>

          {/* CTA */}
          <div className="mt-8">
            <Link
              href="#tools"
              className="inline-flex rounded-lg bg-[var(--color-accent-500)] px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[var(--color-accent-600)]"
            >
              {dict?.hero?.exploreCta || 'Explore Tools'}
            </Link>
          </div>
        </div>

        {/* Quranic Quote */}
        <div className="mx-auto mt-14 max-w-2xl border-t border-gray-200 pt-10 dark:border-gray-800">
          <p
            className="font-arabic mb-3 text-2xl leading-relaxed text-gray-900 dark:text-white"
            dir="rtl"
            lang="ar"
          >
            وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ
          </p>
          <p className="text-base text-gray-500 italic dark:text-gray-400">
            &ldquo;And I did not create the jinn and mankind except to worship Me.&rdquo;
          </p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">— Quran 51:56</p>
        </div>
      </div>
    </section>
  )
}
