'use client'
import Image from 'next/image'
import { ShieldCheck } from 'lucide-react'
import type { Dictionary } from '@/types/dictionary'

interface HeroProps {
  lang?: string
  dict?: Dictionary
}

export default function Hero({ lang = 'en', dict }: HeroProps) {
  const isRTL = lang === 'ar'
  const appStoreUrl = 'https://apps.apple.com/tn/app/deen-back-daily-dua-dhikr/id6755876142'

  return (
    <section className="relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[--color-bg] via-[#F6F3EC] to-[--color-surface] opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(217,119,87,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(217,119,87,0.05),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32 lg:px-8">
        {/* Two-column layout: Text left, Image right */}
        <div
          className={`animate-fade-in grid items-center gap-12 lg:grid-cols-2 lg:gap-16 ${isRTL ? 'lg:flex-row-reverse' : ''}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Left Column: Text Content */}
          <div className={`space-y-6 ${isRTL ? 'text-right lg:order-2' : 'text-left lg:order-1'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[--color-accent-200] bg-[--color-surface] px-4 py-2 shadow-sm dark:border-[--color-accent-900] dark:bg-gray-800">
              <ShieldCheck className="h-4 w-4 text-[--color-accent-600]" />
              <span
                className={`text-sm font-medium text-[--color-text] dark:text-gray-200 ${isRTL ? 'font-arabic' : ''}`}
              >
                {dict?.hero?.badge || 'Islamic Recovery & Discipline'}
              </span>
            </div>

            {/* Main tagline */}
            <h1
              className={`text-4xl leading-tight font-bold tracking-tight text-[--color-text] sm:text-5xl lg:text-6xl dark:text-white ${isRTL ? 'font-arabic' : ''}`}
            >
              {dict?.hero?.tagline || 'Overcome Your Nafs. Return to Allah.'}
            </h1>

            {/* Question/Heading */}
            <h2
              className={`text-xl leading-relaxed font-semibold text-[--color-accent-700] sm:text-2xl dark:text-[--color-accent-400] ${isRTL ? 'font-arabic' : ''}`}
            >
              {dict?.hero?.question || 'Struggling with haram habits? You are not alone.'}
            </h2>

            {/* Subtitle */}
            <p
              className={`text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}
            >
              {dict?.hero?.subtitle ||
                "Deen Back helps Muslims overcome addiction to haram content through discipline, Qur'an learning, and daily remembrance. Not just fearing Allah — but loving Him, trusting His forgiveness, and learning to overcome your Nafs with intention."}
            </p>

            {/* CTA — App Store download */}
            <div className="flex flex-col items-start gap-3 pt-4">
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
                  style={{ width: 'auto', height: '56px' }}
                />
              </a>
              <p
                className={`text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}
              >
                {dict?.hero?.appStatus || 'Available now on the App Store'}
              </p>
            </div>
          </div>

          {/* Right Column: Hero Image */}
          <div className={`relative ${isRTL ? 'lg:order-1' : 'lg:order-2'}`}>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/static/images/hero.webp"
                alt="Deen Back App – Overcome Your Nafs"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              />
            </div>
          </div>
        </div>

        {/* Quranic Quote — about the Nafs */}
        <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-[--color-accent-200] bg-white/50 px-6 py-8 shadow-sm dark:border-[--color-accent-900] dark:bg-gray-800/50">
          <p
            className="font-arabic mb-4 text-2xl leading-relaxed text-[--color-text] sm:text-3xl dark:text-white"
            dir="rtl"
            lang="ar"
          >
            إِنَّ النَّفْسَ لَأَمَّارَةٌ بِالسُّوءِ إِلَّا مَا رَحِمَ رَبِّي
          </p>
          <p className="mb-3 text-base text-gray-600 italic sm:text-lg dark:text-gray-300">
            "Indeed, the soul is a persistent enjoiner of evil — except those upon whom my Lord has
            mercy."
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">— Qur'an 12:53</p>
          <p className="mt-2 text-xs text-gray-400 italic dark:text-gray-500">
            Inna an-nafsa la-ammāratun bis-sū'i illā mā raḥima rabbī
          </p>
        </div>
      </div>

      {/* Decorative bottom line */}
      <div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700" />
    </section>
  )
}
