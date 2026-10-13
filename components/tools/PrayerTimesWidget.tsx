'use client'

import { useEffect, useState } from 'react'
import { MapPin, RefreshCw } from 'lucide-react'
import { PRAYER_METHODS } from './PrayerTimes'
import {
  fetchPrayerSchedule,
  localDateISO,
  upcomingPrayer,
  type PrayerSchedule,
} from '@/utils/prayer-schedule'

interface Props {
  prayerData: PrayerSchedule | null
  cityName: string
  cityCountry: string
  cityMethod: string
  latitude: number
  longitude: number
  timezone: string
  lang?: 'en' | 'ar'
}
const arabicMethods: Record<string, string> = {
  '1': 'جامعة العلوم الإسلامية، كراتشي',
  '2': 'الجمعية الإسلامية لأمريكا الشمالية',
  '3': 'رابطة العالم الإسلامي',
  '4': 'أم القرى',
  '5': 'الهيئة المصرية العامة للمساحة',
  '8': 'منطقة الخليج',
  '9': 'الكويت',
  '10': 'قطر',
  '13': 'رئاسة الشؤون الدينية التركية',
  '15': 'لجنة رؤية الهلال العالمية',
}
function countdown(milliseconds: number) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000))
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map((value) => String(value).padStart(2, '0'))
    .join(':')
}

export default function PrayerTimesWidget({
  prayerData,
  cityName,
  cityCountry,
  cityMethod,
  latitude,
  longitude,
  timezone,
  lang = 'en',
}: Props) {
  const ar = lang === 'ar'
  const [data, setData] = useState(prayerData)
  const [now, setNow] = useState<number | null>(null)
  const [requestedMethod, setRequestedMethod] = useState(cityMethod)
  const [retry, setRetry] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const day = now === null ? null : localDateISO(timezone, new Date(now))

  useEffect(() => {
    const tick = () => setNow(Date.now())
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!day) return
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    let active = true
    setLoading(true)
    setError(false)
    fetchPrayerSchedule(
      { lat: latitude, lng: longitude, timezone, name: `${cityName}, ${cityCountry}` },
      requestedMethod,
      new Date(),
      { signal: controller.signal }
    )
      .then((result) => {
        if (active) setData(result)
      })
      .catch(() => {
        if (active) setError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
        clearTimeout(timeout)
      })
    return () => {
      active = false
      controller.abort()
      clearTimeout(timeout)
    }
  }, [day, requestedMethod, retry, latitude, longitude, timezone, cityName, cityCountry])

  const stale = !!data && day !== null && data.dateISO !== day
  const next = data && now !== null ? upcomingPrayer(data, now) : null
  const methods = ar ? arabicMethods : PRAYER_METHODS

  return (
    <div aria-busy={loading}>
      {(error || !data || stale) && (
        <div role="status" className="mb-4 rounded-xl border border-amber-300 p-4 text-sm">
          <p>
            {loading
              ? ar
                ? 'جارٍ تحديث المواقيت…'
                : 'Updating prayer times…'
              : ar
                ? 'تعذر تحديث المواقيت. راجع التاريخ المعروض أو جدول المسجد المحلي.'
                : 'Could not update prayer times. Check the displayed date or your local mosque timetable.'}
          </p>
          {!loading && (
            <button onClick={() => setRetry((n) => n + 1)} className="mt-2 underline">
              {ar ? 'حاول مجددًا' : 'Try again'}
            </button>
          )}
        </div>
      )}
      {data && (
        <>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
            {data.dateISO} · {timezone} · {ar ? 'بتنسيق 24 ساعة' : '24-hour local time'}
          </p>
          {next && now !== null && (
            <div className="mb-5 flex items-center justify-between rounded-2xl bg-[var(--color-primary-700)] px-5 py-4 text-white">
              <div>
                <p className="text-xs text-green-200">{ar ? 'الصلاة القادمة' : 'Next Prayer'}</p>
                <p className="mt-1 text-xl font-bold">{ar ? next.nameAr : next.name}</p>
                {localDateISO(timezone, new Date(next.at!)) !== data.dateISO && (
                  <p className="text-sm">{ar ? 'غدًا' : 'Tomorrow'}</p>
                )}
              </div>
              <div className="text-end">
                <p className="font-mono text-3xl font-bold tabular-nums" dir="ltr">
                  {countdown(next.at! - now)}
                </p>
                <p className="mt-1 text-sm" dir="ltr">
                  {next.time}
                </p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            {data.prayers.map((prayer) => {
              const isNext = next?.at === prayer.at && prayer.at !== null
              return (
                <div
                  key={prayer.name}
                  className={`rounded-2xl px-2 py-5 text-center ${isNext ? 'bg-[var(--color-primary-100)] ring-2 ring-[var(--color-primary-400)] dark:bg-gray-800' : 'bg-[var(--color-cream-50)] dark:bg-gray-900'}`}
                >
                  <p className="text-sm font-bold">{ar ? prayer.nameAr : prayer.name}</p>
                  {!ar && (
                    <p className="font-arabic text-xs text-gray-600 dark:text-gray-300">
                      {prayer.nameAr}
                    </p>
                  )}
                  <p className="mt-3 font-mono text-base font-bold" dir="ltr">
                    {prayer.time}
                  </p>
                </div>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-gray-600 dark:text-gray-300">
            {ar ? 'طريقة الحساب المعروضة: ' : 'Displayed calculation method: '}
            {methods[data.method] || data.method}
          </p>
          {(!data.tomorrow.length || data.prayers.some((prayer) => prayer.at === null)) && (
            <p className="mt-2 text-sm" role="status">
              {ar
                ? 'بعض المواقيت غير متاحة. تحقق من الجدول المحلي؛ لا نقدر المواقيت المفقودة.'
                : 'Some times are unavailable. Check a local timetable; missing times are not estimated here.'}
            </p>
          )}
        </>
      )}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <p className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
          <MapPin className="h-3.5 w-3.5" />
          {cityName}, {cityCountry}
        </p>
        <label className="text-sm">
          <span className="mb-1 block">{ar ? 'طريقة الحساب' : 'Calculation method'}</span>
          <select
            aria-label={ar ? 'طريقة الحساب' : 'Calculation method'}
            value={requestedMethod}
            onChange={(event) => setRequestedMethod(event.target.value)}
            className="max-w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 dark:bg-gray-900 dark:text-white"
          >
            {Object.entries(methods).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        {loading && <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />}
      </div>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        {ar
          ? 'هذه أوقات محسوبة لبداية الصلاة، وليست أوقات الإقامة. قد تختلف طرق حساب الفجر والعشاء، خاصة في خطوط العرض العليا؛ اتبع إرشادات مسجدك المحلي.'
          : 'Calculated prayer start times, not mosque congregation times. Fajr and Isha methods can differ, especially at high latitudes; follow your local mosque’s guidance.'}
      </p>
    </div>
  )
}
