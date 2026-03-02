'use client'
import Link from '@/components/Link'
import { Clock, ShieldCheck, Repeat, Star } from 'lucide-react'
import type { Dictionary } from '@/types/dictionary'

interface HeroProps {
  lang?: string
  dict?: Dictionary
}

/* ─── Floating preview cards (desktop only) ─── */

function PrayerTimesCard() {
  return (
    <div
      className="animate-float absolute top-14 left-6 hidden rotate-[-5deg] rounded-2xl border border-amber-200/40 px-6 py-5 shadow-lg shadow-black/5 backdrop-blur-xl xl:block dark:border-white/10 dark:bg-white/[0.08]"
      style={{ background: 'linear-gradient(135deg, #fef9c3 0%, #fef3c7 50%, #fffbeb 100%)' }}
    >
      <div className="mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4 text-gray-500" strokeWidth={1.5} />
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Prayer Times</span>
      </div>
      <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex justify-between gap-8">
          <span>Fajr</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">5:12 AM</span>
        </div>
        <div className="flex justify-between gap-8">
          <span>Dhuhr</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">12:30 PM</span>
        </div>
        <div className="flex justify-between gap-8">
          <span>Asr</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">3:45 PM</span>
        </div>
        <div className="flex justify-between gap-8">
          <span>Maghrib</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">6:18 PM</span>
        </div>
      </div>
    </div>
  )
}

function HaramCheckerCard() {
  return (
    <div className="animate-float animation-delay-2000 absolute top-8 right-4 hidden scale-110 rotate-[4deg] rounded-2xl border border-white/30 bg-white/60 px-6 py-5 shadow-lg shadow-black/5 backdrop-blur-xl xl:block dark:border-white/10 dark:bg-white/[0.08]">
      <div className="mb-3 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-gray-500" strokeWidth={1.5} />
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Haram Checker</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 rounded-lg bg-white/50 px-3 py-2 dark:bg-white/[0.06]">
          <span className="text-xs text-gray-500 dark:text-gray-400">Soy Lecithin</span>
          <span className="ml-auto rounded-full bg-green-100/80 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Halal
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white/50 px-3 py-2 dark:bg-white/[0.06]">
          <span className="text-xs text-gray-500 dark:text-gray-400">Gelatin (Pork)</span>
          <span className="ml-auto rounded-full bg-red-100/80 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
            Haram
          </span>
        </div>
      </div>
    </div>
  )
}

function DhikrCard() {
  return (
    <div className="animate-float animation-delay-3000 absolute bottom-36 left-10 hidden scale-95 rotate-[2deg] rounded-2xl border border-white/30 bg-white/60 px-5 py-4 shadow-lg shadow-black/5 backdrop-blur-xl xl:block dark:border-white/10 dark:bg-white/[0.08]">
      <div className="mb-2 flex items-center gap-2">
        <Repeat className="h-4 w-4 text-gray-500" strokeWidth={1.5} />
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Dhikr Counter</span>
      </div>
      <div className="flex items-center justify-center py-1">
        <span className="text-4xl font-light tracking-tight text-gray-700 dark:text-gray-300">
          33
        </span>
      </div>
      <p className="mt-1 text-center text-[10px] text-gray-400 dark:text-gray-500">SubhanAllah</p>
    </div>
  )
}

function NamesCard() {
  return (
    <div
      className="animate-float animation-delay-1000 absolute right-8 bottom-32 hidden scale-105 rotate-[-3deg] rounded-2xl border border-green-200/40 px-6 py-5 shadow-lg shadow-black/5 backdrop-blur-xl xl:block dark:border-white/10 dark:bg-white/[0.08]"
      style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #d1fae5 50%, #ecfdf5 100%)' }}
    >
      <div className="mb-3 flex items-center gap-2">
        <Star className="h-4 w-4 text-gray-500" strokeWidth={1.5} />
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          99 Names of Allah
        </span>
      </div>
      <p className="font-arabic text-2xl text-gray-700 dark:text-gray-300" dir="rtl">
        الرَّحْمَنُ
      </p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Ar-Rahman — The Most Merciful</p>
    </div>
  )
}

/* ─── Hero ─── */

export default function Hero({ lang = 'en', dict }: HeroProps) {
  const isRTL = lang === 'ar'

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32 lg:px-8 lg:pt-36 lg:pb-40">
        {/* Floating cards — desktop only */}
        <PrayerTimesCard />
        <HaramCheckerCard />
        <DhikrCard />
        <NamesCard />

        {/* Center content */}
        <div className="relative z-10 mx-auto max-w-3xl text-center" dir={isRTL ? 'rtl' : 'ltr'}>
          <h1
            className={`text-5xl leading-[1.1] font-bold tracking-tight sm:text-6xl lg:text-7xl ${isRTL ? 'font-arabic' : ''}`}
          >
            <span className="text-gray-900 dark:text-white">
              {dict?.hero?.tagline || 'Everything A Muslim Needs.'}
            </span>
            <br />
            <span className="text-gray-400 dark:text-gray-500">
              {dict?.hero?.tagline2 || 'all in one place'}
            </span>
          </h1>

          <div className="mt-10">
            <Link
              href="#tools"
              className="inline-flex rounded-full bg-[var(--color-accent-500)] px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-[var(--color-accent-600)] hover:shadow-lg"
            >
              {dict?.hero?.exploreCta || 'Explore Tools'}
            </Link>
          </div>
        </div>

        {/* Quranic Quote */}
        <div className="relative z-10 mx-auto mt-20 max-w-2xl border-t border-gray-200 pt-10 text-center dark:border-gray-800">
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
