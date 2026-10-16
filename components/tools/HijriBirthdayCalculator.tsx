'use client'

import { useRef, useState } from 'react'
import { birthdayCopy } from '@/data/locales/birthday'
import { isLocale } from '@/utils/locale'
import { HIJRI_MONTHS as LOCALIZED_MONTHS } from '@/data/islamic-calendar'
import { Loader2, Cake, Calendar, Star } from 'lucide-react'

interface HijriDate {
  day: string
  month: { number: number; en: string; ar: string }
  year: string
  weekday: { en: string; ar: string }
}

interface Result {
  birthHijri: HijriDate
  todayHijri: HijriDate
  islamicAge: number
  nextBirthdayHijri: { day: number; month: number; year: number }
  nextBirthdayGregorian: string | null
}

interface HijriBirthdayCalculatorProps {
  lang?: string
}

export default function HijriBirthdayCalculator({ lang = 'en' }: HijriBirthdayCalculatorProps) {
  const locale = isLocale(lang) ? lang : 'en'
  const t = birthdayCopy[locale]
  const isRTL = locale === 'ar'
  const requestId = useRef(0)
  const [birthDate, setBirthDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  const now = new Date()
  const maxDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  async function calculate() {
    const parsed = new Date(`${birthDate}T00:00:00Z`)
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(birthDate) ||
      !Number.isFinite(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== birthDate ||
      birthDate > maxDate
    ) {
      setError(t.invalid)
      setResult(null)
      return
    }
    const request = ++requestId.current
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const [year, month, day] = birthDate.split('-').map(Number)
      const today = new Date()
      const todayD = today.getDate()
      const todayM = today.getMonth() + 1
      const todayY = today.getFullYear()

      const [birthRes, todayRes] = await Promise.all([
        fetch(`https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`).then((r) => r.json()),
        fetch(`https://api.aladhan.com/v1/gToH/${todayD}-${todayM}-${todayY}`).then((r) =>
          r.json()
        ),
      ])

      if (birthRes.code !== 200 || todayRes.code !== 200) {
        throw new Error('Failed to convert dates')
      }

      const birthHijri: HijriDate = birthRes.data.hijri
      const todayHijri: HijriDate = todayRes.data.hijri

      const birthHijriYear = parseInt(birthHijri.year)
      const birthHijriMonth = birthHijri.month.number
      const birthHijriDay = parseInt(birthHijri.day)

      const todayHijriYear = parseInt(todayHijri.year)
      const todayHijriMonth = todayHijri.month.number
      const todayHijriDay = parseInt(todayHijri.day)

      // Islamic age in Hijri years
      let islamicAge = todayHijriYear - birthHijriYear
      if (
        todayHijriMonth < birthHijriMonth ||
        (todayHijriMonth === birthHijriMonth && todayHijriDay < birthHijriDay)
      ) {
        islamicAge--
      }

      // Next Hijri birthday
      let nextBirthdayYear = todayHijriYear
      const birthdayPassedThisYear =
        todayHijriMonth > birthHijriMonth ||
        (todayHijriMonth === birthHijriMonth && todayHijriDay >= birthHijriDay)
      if (birthdayPassedThisYear) {
        nextBirthdayYear = todayHijriYear + 1
      }

      const nextBirthdayHijri = {
        day: birthHijriDay,
        month: birthHijriMonth,
        year: nextBirthdayYear,
      }

      // Convert next Hijri birthday back to Gregorian
      let nextBirthdayGregorian: string | null = null
      try {
        const nextRes = await fetch(
          `https://api.aladhan.com/v1/hToG/${birthHijriDay}-${birthHijriMonth}-${nextBirthdayYear}`
        ).then((r) => r.json())
        if (nextRes.code === 200) {
          nextBirthdayGregorian = nextRes.data.gregorian.date // DD-MM-YYYY
        }
      } catch {
        // non-critical
      }

      if (request !== requestId.current) return
      setResult({
        birthHijri,
        todayHijri,
        islamicAge,
        nextBirthdayHijri,
        nextBirthdayGregorian,
      })
    } catch {
      if (request === requestId.current) setError(t.error)
    } finally {
      if (request === requestId.current) setLoading(false)
    }
  }

  function formatGregorianDate(ddmmyyyy: string) {
    const [d, m, y] = ddmmyyyy.split('-')
    const date = new Date(`${y}-${m}-${d}`)
    return date.toLocaleDateString(locale, {
      calendar: 'gregory',
      timeZone: 'UTC',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  function hijriMonthName(monthNum: number) {
    return LOCALIZED_MONTHS[locale][monthNum - 1]
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} lang={locale} data-testid="hijri-birthday">
      {/* Input */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <label
          htmlFor="birthdate"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {t.label}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="birthdate"
            type="date"
            value={birthDate}
            max={maxDate}
            onChange={(e) => {
              requestId.current++
              setBirthDate(e.target.value)
              setResult(null)
              setError(null)
              setLoading(false)
            }}
            className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={calculate}
            disabled={!birthDate || loading}
            className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 aria-hidden="true" className="inline h-5 w-5 animate-spin" />
                <span className="sr-only">{t.loading}</span>
              </>
            ) : (
              t.calculate
            )}
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-500">{t.note}</p>
      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
        >
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div aria-live="polite" data-testid="birthday-result" className="mt-6 space-y-4">
          {/* Hijri Birthday */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-900/20">
            <div className="mb-1 flex items-center gap-2">
              <Cake className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                {t.birth}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {result.birthHijri.day} {hijriMonthName(result.birthHijri.month.number)}{' '}
              {result.birthHijri.year} {t.era}
            </p>
          </div>

          {/* Islamic Age */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="mb-1 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                {t.age}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {result.islamicAge}{' '}
              <span className="text-lg font-normal text-gray-600 dark:text-gray-300">
                {t.years}
              </span>
            </p>
          </div>

          {/* Next Hijri Birthday */}
          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-900/20">
            <div className="mb-1 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                {t.next}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {result.nextBirthdayHijri.day} {hijriMonthName(result.nextBirthdayHijri.month)}{' '}
              {result.nextBirthdayHijri.year} {t.era}
            </p>
            {result.nextBirthdayGregorian && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {lang === 'ar' ? '= ' : '= '}
                {formatGregorianDate(result.nextBirthdayGregorian)}
              </p>
            )}
          </div>

          {/* Today's Hijri for reference */}
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            {t.today}: {result.todayHijri.day} {hijriMonthName(result.todayHijri.month.number)}{' '}
            {result.todayHijri.year} {t.era}
          </p>
        </div>
      )}
    </div>
  )
}
