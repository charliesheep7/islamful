'use client'
import { Download, Smartphone } from 'lucide-react'
import type { Dictionary } from '@/types/dictionary'

interface CTAProps {
  lang?: string
  dict?: Dictionary
}

export default function CTA({ lang = 'en', dict }: CTAProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[--color-bg] via-white to-[--color-surface] py-20 sm:py-28 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="animate-blob absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[--color-accent-500] mix-blend-multiply blur-3xl filter" />
        <div className="animate-blob animation-delay-2000 absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-[--color-accent-400] mix-blend-multiply blur-3xl filter" />
        <div className="animate-blob animation-delay-4000 absolute bottom-1/4 left-1/2 h-96 w-96 rounded-full bg-[--color-accent-600] mix-blend-multiply blur-3xl filter" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[--color-accent-200] bg-[--color-accent-100] px-4 py-2 dark:border-[--color-accent-800] dark:bg-[--color-accent-900]">
          <Smartphone className="h-4 w-4 text-[--color-accent-600] dark:text-[--color-accent-400]" />
          <span
            className={`text-sm font-semibold text-[--color-accent-700] dark:text-[--color-accent-300] ${lang === 'ar' ? 'font-arabic' : ''}`}
          >
            {dict?.cta?.badge || 'Coming Soon to iOS & Android'}
          </span>
        </div>

        <h2
          className={`mb-6 text-4xl leading-tight font-bold text-[--color-text] sm:text-5xl lg:text-6xl dark:text-white ${lang === 'ar' ? 'font-arabic' : ''}`}
        >
          {dict?.cta?.heading || 'Start strengthening your Deen today'}
        </h2>

        <p
          className={`mx-auto mb-10 max-w-2xl text-xl text-gray-600 dark:text-gray-300 ${lang === 'ar' ? 'font-arabic' : ''}`}
        >
          {dict?.cta?.subtitle ||
            'Join our WhatsApp community and be the first to know when DeenUp launches'}
        </p>

        <a
          href="https://chat.whatsapp.com/Ea023Ghn0PJ27Ijs6Fp?mode=wwt"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-3 rounded-2xl bg-[var(--color-accent-500)] px-10 py-5 text-xl font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[var(--color-accent-600)] ${lang === 'ar' ? 'font-arabic' : ''}`}
        >
          {dict?.cta?.joinWaitlist || 'Join Waitlist'}
        </a>

        <p
          className={`mt-6 text-sm text-gray-500 dark:text-gray-400 ${lang === 'ar' ? 'font-arabic' : ''}`}
        >
          {dict?.cta?.comingSoonText || 'Join our community on WhatsApp'}
        </p>
      </div>
    </section>
  )
}
