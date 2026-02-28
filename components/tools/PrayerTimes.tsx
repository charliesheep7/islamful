'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { MapPin, Loader2, ChevronDown, Search } from 'lucide-react'

export interface PrayerTime {
  name: string
  nameAr: string
  time: string
}

export interface PrayerTimesData {
  date: string
  hijriDate: string
  location: string
  prayers: PrayerTime[]
}

interface PrayerTimesProps {
  lang?: string
  initialData?: PrayerTimesData | null
  initialCity?: string
  initialCountry?: string
  initialMethod?: string
}

export const PRAYER_METHODS: Record<string, string> = {
  '2': 'ISNA (North America)',
  '3': 'Muslim World League',
  '4': 'Umm Al-Qura (Saudi Arabia)',
  '5': 'Egyptian General Authority',
  '1': 'University of Islamic Sciences, Karachi',
  '8': 'Gulf Region',
  '9': 'Kuwait',
  '10': 'Qatar',
  '13': 'Turkey (Diyanet)',
  '15': 'Moonsighting Committee Worldwide',
}

function todayDate(): string {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}-${mm}-${d.getFullYear()}`
}

export function parsePrayerResponse(
  apiData: Record<string, unknown>,
  location: string
): PrayerTimesData {
  const timings = apiData.timings as Record<string, string>
  const date = apiData.date as Record<string, unknown>
  const hijri = date.hijri as Record<string, unknown>
  const hijriDay = (hijri.day as string) || ''
  const hijriMonth = (hijri.month as Record<string, string>)?.en || ''
  const hijriYear = (hijri.year as string) || ''

  return {
    date: (date.readable as string) || '',
    hijriDate: `${hijriDay} ${hijriMonth} ${hijriYear}`,
    location,
    prayers: [
      { name: 'Fajr', nameAr: 'الفجر', time: timings.Fajr },
      { name: 'Sunrise', nameAr: 'الشروق', time: timings.Sunrise },
      { name: 'Dhuhr', nameAr: 'الظهر', time: timings.Dhuhr },
      { name: 'Asr', nameAr: 'العصر', time: timings.Asr },
      { name: 'Maghrib', nameAr: 'المغرب', time: timings.Maghrib },
      { name: 'Isha', nameAr: 'العشاء', time: timings.Isha },
    ],
  }
}

function parseTime(timeStr: string): Date {
  const [h, m] = timeStr.split(':').map(Number)
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d
}

function getUpcomingIndex(prayers: PrayerTime[]): number {
  const now = new Date()
  // Skip Sunrise (index 1) — not a salah
  const salahs = [0, 2, 3, 4, 5]
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

export function to12h(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

export default function PrayerTimes({
  lang = 'en',
  initialData = null,
  initialCity = '',
  initialCountry = '',
  initialMethod = '2',
}: PrayerTimesProps) {
  const isRTL = lang === 'ar'
  const [data, setData] = useState<PrayerTimesData | null>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [city, setCity] = useState(initialCity)
  const [country, setCountry] = useState(initialCountry)
  const [method, setMethod] = useState(initialMethod)
  const [showMethod, setShowMethod] = useState(false)
  const [countdown, setCountdown] = useState('')
  const [upcomingIdx, setUpcomingIdx] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!data) return
    const update = () => {
      const idx = getUpcomingIndex(data.prayers)
      setUpcomingIdx(idx)
      const prayerDate = parseTime(data.prayers[idx].time)
      const now = new Date()
      let diff = prayerDate.getTime() - now.getTime()
      if (diff < 0) diff += 24 * 60 * 60 * 1000
      setCountdown(formatCountdown(diff))
    }
    update()
    timerRef.current = setInterval(update, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [data])

  const fetchByCity = useCallback(async () => {
    if (!city || !country) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity/${todayDate()}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`,
        { redirect: 'follow' }
      )
      const json = await res.json()
      if (json.code !== 200) throw new Error(json.data || 'Failed to fetch prayer times')
      setData(parsePrayerResponse(json.data, `${city}, ${country}`))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prayer times')
    } finally {
      setLoading(false)
    }
  }, [city, country, method])

  // Fetch prayer times using lat/lng
  const fetchByCoords = useCallback(
    async (latitude: number, longitude: number, locationName: string) => {
      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${todayDate()}?latitude=${latitude}&longitude=${longitude}&method=${method}`,
        { redirect: 'follow' }
      )
      const json = await res.json()
      if (json.code !== 200) throw new Error('Failed to fetch prayer times')
      setData(parsePrayerResponse(json.data, locationName))
    },
    [method]
  )

  // IP-based geolocation fallback (no permissions needed)
  const fetchByIP = useCallback(async () => {
    const res = await fetch('https://ipapi.co/json/')
    const geo = await res.json()
    if (geo.latitude && geo.longitude && geo.city) {
      const locationName = `${geo.city}, ${geo.country_name}`
      setCity(geo.city)
      setCountry(geo.country_name)
      await fetchByCoords(geo.latitude, geo.longitude, locationName)
      return true
    }
    return false
  }, [fetchByCoords])

  const fetchByLocation = useCallback(async () => {
    setLoading(true)
    setError(null)

    // Try browser geolocation first (more accurate)
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            enableHighAccuracy: false,
            maximumAge: 300000,
          })
        })
        const { latitude, longitude } = position.coords
        let locationName = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
        try {
          const geoRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          const geoJson = await geoRes.json()
          if (geoJson.city && geoJson.countryName) {
            locationName = `${geoJson.city}, ${geoJson.countryName}`
            setCity(geoJson.city)
            setCountry(geoJson.countryName)
          }
        } catch {
          /* coords fine */
        }
        await fetchByCoords(latitude, longitude, locationName)
        setLoading(false)
        return
      } catch {
        // Browser geolocation failed — fall through to IP
      }
    }

    // Fallback: IP-based geolocation (city-level accuracy, no permissions)
    try {
      const success = await fetchByIP()
      if (!success) {
        setError(isRTL ? 'تعذر تحديد موقعك.' : 'Could not detect your location.')
      }
    } catch {
      setError(
        isRTL ? 'تعذر تحديد موقعك.' : 'Could not detect your location. Enter your city manually.'
      )
    }
    setLoading(false)
  }, [fetchByCoords, fetchByIP, isRTL])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchByCity()
  }

  return (
    <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Search */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--color-cream-500)]" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={isRTL ? 'المدينة' : 'City'}
              className="w-full rounded-xl border border-[var(--color-cream-400)] bg-white py-3 pr-4 pl-9 text-sm text-gray-900 placeholder-[var(--color-cream-500)] transition outline-none focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder={isRTL ? 'البلد' : 'Country'}
            className="min-w-0 flex-1 rounded-xl border border-[var(--color-cream-400)] bg-white px-4 py-3 text-sm text-gray-900 placeholder-[var(--color-cream-500)] transition outline-none focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading || !city || !country}
            className="rounded-xl bg-[var(--color-primary-600)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-700)] disabled:opacity-40"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isRTL ? 'بحث' : 'Go'}
          </button>
        </div>

        <div className="mt-2.5 flex items-center justify-between">
          <button
            type="button"
            onClick={fetchByLocation}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-[var(--color-primary-600)] transition hover:text-[var(--color-primary-700)] disabled:opacity-40 dark:text-[var(--color-primary-400)]"
          >
            <MapPin className="h-3.5 w-3.5" />
            {isRTL ? 'استخدم موقعي' : 'Use my location'}
          </button>
          <button
            type="button"
            onClick={() => setShowMethod(!showMethod)}
            className="flex items-center gap-1 text-xs text-[var(--color-cream-600)] transition hover:text-gray-700 dark:text-gray-400"
          >
            {isRTL ? 'طريقة الحساب' : 'Calculation method'}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${showMethod ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {showMethod && (
          <select
            value={method}
            onChange={(e) => {
              setMethod(e.target.value)
            }}
            className="mt-2.5 w-full rounded-xl border border-[var(--color-cream-400)] bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[var(--color-primary-500)] dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            {Object.entries(PRAYER_METHODS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        )}
      </form>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Prayer display */}
      {data && upcomingIdx !== null && (
        <div>
          {/* Location + countdown */}
          <div className="mb-5 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[var(--color-primary-500)]" />
                <span
                  className={`text-sm font-semibold text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
                >
                  {data.location}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[var(--color-cream-600)] dark:text-gray-400">
                {data.date} · <span className="font-arabic">{data.hijriDate}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--color-cream-600)] dark:text-gray-400">
                {isRTL ? 'الوقت المتبقي على' : 'Next:'}{' '}
                <span className="font-medium text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]">
                  {isRTL ? data.prayers[upcomingIdx].nameAr : data.prayers[upcomingIdx].name}
                </span>
              </p>
              <p className="font-mono text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                {countdown}
              </p>
            </div>
          </div>

          {/* Prayer grid */}
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            {data.prayers.map((prayer, i) => {
              const isUpcoming = i === upcomingIdx
              const isPast = i < upcomingIdx && i !== 1 // sunrise always dim

              return (
                <div
                  key={prayer.name}
                  className={`flex flex-col items-center rounded-2xl px-2 py-5 text-center transition-all ${
                    isUpcoming
                      ? 'bg-[var(--color-primary-700)] text-white shadow-md'
                      : isPast || i === 1
                        ? 'bg-[var(--color-cream-200)] dark:bg-gray-900/50'
                        : 'bg-[var(--color-cream-50)] dark:bg-gray-800/60'
                  }`}
                >
                  <p
                    className={`text-xs font-medium tracking-wide ${isUpcoming ? 'text-green-200' : 'text-[var(--color-cream-600)]'}`}
                  >
                    {isUpcoming ? (isRTL ? 'التالية' : 'Next') : '\u00A0'}
                  </p>
                  <p
                    className={`mt-1 text-sm font-bold ${isUpcoming ? 'text-white' : isPast || i === 1 ? 'text-[var(--color-cream-500)]' : 'text-gray-900 dark:text-white'}`}
                  >
                    {isRTL ? prayer.nameAr : prayer.name}
                  </p>
                  {!isRTL && (
                    <p
                      className={`font-arabic text-xs ${isUpcoming ? 'text-green-200' : 'text-[var(--color-cream-500)]'}`}
                    >
                      {prayer.nameAr}
                    </p>
                  )}
                  <p
                    className={`mt-3 font-mono text-base font-bold ${isUpcoming ? 'text-white' : isPast || i === 1 ? 'text-[var(--color-cream-500)]' : 'text-gray-900 dark:text-white'}`}
                  >
                    {to12h(prayer.time)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!data && !loading && !error && (
        <div className="rounded-2xl border border-dashed border-[var(--color-cream-400)] bg-[var(--color-cream-50)] px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-800/30">
          <p className="text-sm text-[var(--color-cream-600)] dark:text-gray-400">
            {isRTL ? 'أدخل مدينتك أو استخدم موقعك' : 'Search your city or use your location'}
          </p>
        </div>
      )}

      {loading && !data && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary-500)]" />
        </div>
      )}
    </div>
  )
}
