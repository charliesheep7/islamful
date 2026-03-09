'use client'

import Link from '@/components/Link'
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react'
import type { Dictionary } from '@/types/dictionary'

interface FeaturedToolProps {
  lang?: string
  dict?: Dictionary
}

export default function FeaturedTool({ lang = 'en' }: FeaturedToolProps) {
  const isRTL = lang === 'ar'

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link href="/answers" className="group block no-underline">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--color-primary-200)]/50 bg-gradient-to-br from-[var(--color-primary-50)] via-white to-[var(--color-primary-50)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-8 dark:border-[var(--color-primary-900)]/50 dark:from-[var(--color-primary-950)]/20 dark:via-gray-900 dark:to-[var(--color-primary-950)]/20">
            {/* Decorative glow */}
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[var(--color-primary-200)]/20 blur-3xl dark:bg-[var(--color-primary-500)]/10" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[var(--color-primary-200)]/20 blur-3xl dark:bg-[var(--color-primary-500)]/10" />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              {/* Icon */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary-500)] shadow-[var(--color-primary-500)]/20 shadow-lg">
                <BookOpen className="h-7 w-7 text-white" strokeWidth={1.5} />
              </div>

              {/* Text */}
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex items-center gap-1 rounded-full bg-[var(--color-primary-100)] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[var(--color-primary-700)] uppercase dark:bg-[var(--color-primary-900)]/50 dark:text-[var(--color-primary-300)]">
                    <Sparkles className="h-3 w-3" />
                    {isRTL ? 'جديد' : 'New'}
                  </span>
                </div>
                <h3
                  className={`text-xl font-bold text-gray-900 sm:text-2xl dark:text-white ${isRTL ? 'font-arabic' : ''}`}
                >
                  {isRTL ? 'إجابات القرآن' : 'Quran Answers'}
                </h3>
                <p
                  className={`mt-1 text-sm text-gray-600 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}
                >
                  {isRTL
                    ? 'اسأل ما في قلبك. القرآن سيتحدث.'
                    : 'Ask what is in your heart. The Quran will speak.'}
                </p>
              </div>

              {/* Arrow */}
              <div
                className={`flex items-center text-[var(--color-primary-500)] transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`}
              >
                <ArrowRight className="h-6 w-6" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}
