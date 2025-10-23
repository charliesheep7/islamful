'use client'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import type { Dictionary } from '@/types/dictionary'

interface HeroProps {
  lang?: string
  dict?: Dictionary
}

export default function Hero({ lang = 'en', dict }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[--color-bg] via-[#F6F3EC] to-[--color-surface] opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(217,119,87,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(217,119,87,0.05),transparent_50%)]" />

      <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32 lg:px-8">
        <div className="animate-fade-in space-y-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[--color-accent-200] bg-[--color-surface] px-4 py-2 shadow-sm dark:border-[--color-accent-900] dark:bg-gray-800">
            <Sparkles className="h-4 w-4 text-[--color-accent-600]" />
            <span
              className={`text-sm font-medium text-[--color-text] dark:text-gray-200 ${lang === 'ar' ? 'font-arabic' : ''}`}
            >
              {dict?.hero?.badge || 'Your Islamic Companion'}
            </span>
          </div>

          {/* Main tagline */}
          <h1
            className={`text-5xl leading-tight font-bold tracking-tight text-[--color-text] sm:text-6xl lg:text-7xl dark:text-white ${lang === 'ar' ? 'font-arabic' : ''}`}
          >
            {dict?.hero?.tagline || 'DeenUp'}
          </h1>

          {/* Subtitle */}
          <p
            className={`mx-auto max-w-3xl text-xl leading-relaxed text-gray-600 sm:text-2xl dark:text-gray-300 ${lang === 'ar' ? 'font-arabic' : ''}`}
          >
            {dict?.hero?.subtitle ||
              'Strengthen your Deen with AI-powered guidance, daily habit tracking, and a global Muslim community'}
          </p>

          {/* Quranic Quote */}
          <div className="mx-auto max-w-4xl rounded-2xl border border-[--color-accent-200] bg-white/50 px-6 py-8 shadow-sm dark:border-[--color-accent-900] dark:bg-gray-800/50">
            <p
              className="font-arabic mb-4 text-2xl leading-relaxed text-[--color-text] sm:text-3xl dark:text-white"
              dir="rtl"
              lang="ar"
            >
              لَا خَيْرَ فِي كَثِيرٍ مِن نَّجْوَاهُمْ إِلَّا مَنْ أَمَرَ بِصَدَقَةٍ أَوْ مَعْرُوفٍ
              أَوْ إِصْلَاحٍ بَيْنَ النَّاسِ…
            </p>
            <p className="mb-3 text-base text-gray-600 italic sm:text-lg dark:text-gray-300">
              "No good is in much of their private talk—except those who encourage charity,
              goodness, or making peace between people; and whoever does so seeking Allah's
              pleasure, We will grant a great reward."
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">— Qur'an 4:114</p>
            <p className="mt-2 text-xs text-gray-400 italic dark:text-gray-500">
              Lā khayra fī kathīrin min najwāhum illā man amara biṣ-ṣadaqati aw maʿrūfin aw iṣlāḥin
              bayna an-nās…
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <div className="group relative">
              <button
                disabled
                className={`inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-gray-300 px-8 py-4 text-lg font-semibold text-gray-900 shadow-lg dark:bg-gray-700 dark:text-gray-200 ${lang === 'ar' ? 'font-arabic' : ''}`}
              >
                {dict?.hero?.ctaPrimary || 'Download App'}
              </button>
              <span
                className={`absolute -top-8 left-1/2 -translate-x-1/2 rounded-full border border-[--color-accent-200] bg-white px-3 py-1 text-xs font-medium whitespace-nowrap text-[--color-accent-600] dark:border-[--color-accent-900] dark:bg-gray-800 dark:text-[--color-accent-400] ${lang === 'ar' ? 'font-arabic' : ''}`}
              >
                {dict?.hero?.comingSoon || 'Coming Soon'}
              </span>
            </div>
            <a
              href="#features"
              className={`inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-[--color-text] transition-all duration-300 hover:border-[--color-accent-300] hover:bg-[--color-surface] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-[--color-accent-700] dark:hover:bg-gray-700 ${lang === 'ar' ? 'font-arabic' : ''}`}
            >
              {dict?.hero?.ctaSecondary || 'Learn More'}
            </a>
          </div>

          {/* Trust signal */}
          <p
            className={`pt-4 text-sm text-gray-500 dark:text-gray-400 ${lang === 'ar' ? 'font-arabic' : ''}`}
          >
            {dict?.hero?.appStatus || 'Coming Soon to iOS and Android'}
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700" />
    </section>
  )
}
