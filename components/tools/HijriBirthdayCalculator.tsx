'use client'

import { useState } from 'react'
import { Loader2, Cake, Calendar, Star } from 'lucide-react'

const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  'Rabi al-Awwal',
  'Rabi al-Thani',
  'Jumada al-Ula',
  'Jumada al-Thani',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhul Qi'dah",
  'Dhul Hijjah',
]

const HIJRI_MONTHS_AR = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الثاني',
  'جمادى الأولى',
  'جمادى الثانية',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
]

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
  const isRTL = lang === 'ar'
  const [birthDate, setBirthDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  const maxDate = new Date().toISOString().slice(0, 10)

  async function calculate() {
    if (!birthDate) return
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

      setResult({
        birthHijri,
        todayHijri,
        islamicAge,
        nextBirthdayHijri,
        nextBirthdayGregorian,
      })
    } catch {
      setError(
        lang === 'ar'
          ? 'حدث خطأ أثناء تحويل التاريخ. يرجى المحاولة مرة أخرى.'
          : 'Could not convert the date. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  function formatGregorianDate(ddmmyyyy: string) {
    const [d, m, y] = ddmmyyyy.split('-')
    const date = new Date(`${y}-${m}-${d}`)
    return date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  function hijriMonthName(monthNum: number) {
    return lang === 'ar' ? HIJRI_MONTHS_AR[monthNum - 1] : HIJRI_MONTHS[monthNum - 1]
  }

  return (
    <div className={isRTL ? 'rtl' : ''}>
      {/* Input */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <label
          htmlFor="birthdate"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {lang === 'ar' ? 'تاريخ ميلادك (الميلادي)' : 'Your Gregorian Date of Birth'}
        </label>
        <div className="flex gap-3">
          <input
            id="birthdate"
            type="date"
            value={birthDate}
            max={maxDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={calculate}
            disabled={!birthDate || loading}
            className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : lang === 'ar' ? (
              'احسب'
            ) : (
              'Calculate'
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* Hijri Birthday */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-900/20">
            <div className="mb-1 flex items-center gap-2">
              <Cake className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                {lang === 'ar' ? 'تاريخ ميلادك الهجري' : 'Your Hijri Birthday'}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {result.birthHijri.day} {hijriMonthName(result.birthHijri.month.number)}{' '}
              {result.birthHijri.year} AH
            </p>
            {lang === 'ar' && (
              <p className="mt-1 text-lg text-gray-600 dark:text-gray-300" dir="rtl">
                {result.birthHijri.day} {result.birthHijri.month.ar} {result.birthHijri.year} هـ
              </p>
            )}
          </div>

          {/* Islamic Age */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="mb-1 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                {lang === 'ar' ? 'عمرك الهجري' : 'Your Islamic Age'}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {result.islamicAge}{' '}
              <span className="text-lg font-normal text-gray-600 dark:text-gray-300">
                {lang === 'ar' ? 'سنة هجرية' : 'Hijri years'}
              </span>
            </p>
          </div>

          {/* Next Hijri Birthday */}
          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-900/20">
            <div className="mb-1 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                {lang === 'ar' ? 'عيد ميلادك الهجري القادم' : 'Next Hijri Birthday'}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {result.nextBirthdayHijri.day} {hijriMonthName(result.nextBirthdayHijri.month)}{' '}
              {result.nextBirthdayHijri.year} AH
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
            {lang === 'ar'
              ? `اليوم الهجري: ${result.todayHijri.day} ${result.todayHijri.month.ar} ${result.todayHijri.year} هـ`
              : `Today: ${result.todayHijri.day} ${result.todayHijri.month.en} ${result.todayHijri.year} AH`}
          </p>
        </div>
      )}
    </div>
  )
}
