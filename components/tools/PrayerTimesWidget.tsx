'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, RefreshCw } from 'lucide-react'
import { to12h, parsePrayerResponse, PRAYER_METHODS } from './PrayerTimes'
import type { PrayerTimesData, PrayerTime } from './PrayerTimes'

interface Props {
  prayerData: PrayerTimesData | null
  cityName: string
  cityCountry: string
  cityMethod: string
}

function parseTime(timeStr: string): Date {
  const [h, m] = timeStr.split(':').map(Number)
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d
}

function getUpcomingIndex(prayers: PrayerTime[]): number {
  const now = new Date()
  const salahs = [0, 2, 3, 4, 5] // skip Sunrise
  for (const i of salahs) {
    if (parseTime(prayers[i].time) > now) return i
  }
  return 0
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00'
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
}

function todayDate(): string {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}-${mm}-${d.getFullYear()}`
}

export default function PrayerTimesWidget({
  prayerData,
  cityName,
  cityCountry,
  cityMethod,
}: Props) {
  const [data, setData] = useState<PrayerTimesData | null>(prayerData)
  const [countdown, setCountdown] = useState('')
  const [upcomingIdx, setUpcomingIdx] = useState<number | null>(null)
  const [method, setMethod] = useState(cityMethod)
  const [showMethodPicker, setShowMethodPicker] = useState(false)
  const [reloading, setReloading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Countdown tick
  useEffect(() => {
    if (!data) return
    const update = () => {
      const idx = getUpcomingIndex(data.prayers)
      setUpcomingIdx(idx)
      const next = parseTime(data.prayers[idx].time)
      const now = new Date()
      let diff = next.getTime() - now.getTime()
      if (diff < 0) diff += 24 * 60 * 60 * 1000
      setCountdown(formatCountdown(diff))
    }
    update()
    timerRef.current = setInterval(update, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [data])

  // Refetch when method changes
  const refetch = async (newMethod: string) => {
    setReloading(true)
    try {
      const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity/${todayDate()}?city=${encodeURIComponent(cityName)}&country=${encodeURIComponent(cityCountry)}&method=${newMethod}`,
        { redirect: 'follow' }
      )
      const json = await res.json()
      if (json.code === 200) {
        setData(parsePrayerResponse(json.data, `${cityName}, ${cityCountry}`))
      }
    } catch {
      /* keep existing data */
    }
    setReloading(false)
  }

  const handleMethodChange = (newMethod: string) => {
    setMethod(newMethod)
    setShowMethodPicker(false)
    refetch(newMethod)
  }

  if (!data || upcomingIdx === null) return null

  const nextPrayer = data.prayers[upcomingIdx]

  return (
    <div>
      {/* Next prayer banner */}
      <div className="mb-5 flex items-center justify-between rounded-2xl bg-[var(--color-primary-700)] px-5 py-4 text-white">
        <div>
          <p className="text-xs font-medium tracking-widest text-green-200 uppercase">
            Next Prayer
          </p>
          <p className="mt-0.5 text-xl font-bold">{nextPrayer.name}</p>
          <p className="font-arabic text-sm text-green-200">{nextPrayer.nameAr}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl font-bold tracking-tight tabular-nums">{countdown}</p>
          <p className="mt-0.5 text-sm text-green-200">{to12h(nextPrayer.time)}</p>
        </div>
      </div>

      {/* Prayer cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
        {data.prayers.map((prayer, i) => {
          const isNext = i === upcomingIdx
          const isDim = i < upcomingIdx || i === 1 // past or sunrise

          return (
            <div
              key={prayer.name}
              className={`flex flex-col items-center rounded-2xl px-2 py-5 text-center ${
                isNext
                  ? 'bg-[var(--color-primary-100)] ring-2 ring-[var(--color-primary-400)] dark:bg-[var(--color-primary-900)]/40'
                  : isDim
                    ? 'bg-[var(--color-cream-200)] dark:bg-gray-900/40'
                    : 'bg-[var(--color-cream-50)] dark:bg-gray-800/50'
              }`}
            >
              <p
                className={`text-sm font-bold ${
                  isNext
                    ? 'text-[var(--color-primary-700)] dark:text-[var(--color-primary-300)]'
                    : isDim
                      ? 'text-[var(--color-cream-500)]'
                      : 'text-gray-900 dark:text-white'
                }`}
              >
                {prayer.name}
              </p>
              <p
                className={`font-arabic text-xs ${isDim && !isNext ? 'text-[var(--color-cream-500)]' : 'text-[var(--color-cream-600)]'}`}
              >
                {prayer.nameAr}
              </p>
              <p
                className={`mt-3 font-mono text-base font-bold ${
                  isNext
                    ? 'text-[var(--color-primary-700)] dark:text-[var(--color-primary-300)]'
                    : isDim
                      ? 'text-[var(--color-cream-500)]'
                      : 'text-gray-900 dark:text-white'
                }`}
              >
                {to12h(prayer.time)}
              </p>
            </div>
          )
        })}
      </div>

      {/* Method picker */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-cream-600)] dark:text-gray-400">
          <MapPin className="h-3.5 w-3.5" />
          {cityName}, {cityCountry}
        </div>
        <button
          onClick={() => setShowMethodPicker(!showMethodPicker)}
          disabled={reloading}
          className="flex items-center gap-1.5 text-xs text-[var(--color-cream-600)] transition hover:text-gray-700 disabled:opacity-50 dark:text-gray-400"
        >
          {reloading && <RefreshCw className="h-3 w-3 animate-spin" />}
          {PRAYER_METHODS[method] || 'Calculation method'}
        </button>
      </div>

      {showMethodPicker && (
        <div className="mt-2 rounded-xl border border-[var(--color-cream-300)] bg-white p-1 shadow-md dark:border-gray-700 dark:bg-gray-900">
          {Object.entries(PRAYER_METHODS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleMethodChange(key)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-[var(--color-cream-100)] dark:hover:bg-gray-800 ${
                method === key
                  ? 'font-semibold text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
