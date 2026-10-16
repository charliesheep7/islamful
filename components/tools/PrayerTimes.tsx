'use client'

import { prayerTranslations } from '@/data/locales/prayer'
import { isLocale } from '@/utils/locale'
import { useEffect, useRef, useState } from 'react'
import { Loader2, MapPin } from 'lucide-react'
import PrayerTimesWidget from './PrayerTimesWidget'
import { fetchPrayerSchedule, type PrayerSchedule } from '@/utils/prayer-schedule'
import {
  PRAYER_METHODS,
  ARABIC_PRAYER_METHODS,
  FRENCH_PRAYER_METHODS,
  GERMAN_PRAYER_METHODS,
} from '@/data/prayer-methods'

interface SearchResult {
  schedule: PrayerSchedule
  latitude?: number
  longitude?: number
  timezone: string
  city: string
  country: string
}

function locationMetadata(data: { latitude?: unknown; longitude?: unknown; timezone?: unknown }) {
  const { latitude, longitude, timezone } = data
  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180 ||
    typeof timezone !== 'string'
  )
    throw new Error('Invalid location')
  new Intl.DateTimeFormat('en', { timeZone: timezone }).format()
  return { latitude, longitude, timezone }
}

export default function PrayerTimes({ lang = 'en' }: { lang?: string }) {
  const ar = lang === 'ar'
  const t = (en: string, arabic: string) =>
    ar ? arabic : lang === 'fr' || lang === 'de' ? prayerTranslations[lang][en] || en : en
  const methods = ar
    ? ARABIC_PRAYER_METHODS
    : lang === 'fr'
      ? FRENCH_PRAYER_METHODS
      : lang === 'de'
        ? GERMAN_PRAYER_METHODS
        : PRAYER_METHODS
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [method, setMethod] = useState('3')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const activeRequest = useRef<AbortController | null>(null)
  useEffect(() => () => activeRequest.current?.abort(), [])

  function invalidate() {
    activeRequest.current?.abort()
    activeRequest.current = null
    setResult(null)
    setError(false)
    setLoading(false)
  }
  async function search(useLocation: boolean) {
    if (!useLocation && (!city.trim() || !country.trim())) return
    invalidate()
    const controller = new AbortController()
    activeRequest.current = controller
    const timeout = setTimeout(() => controller.abort(), 15000)
    setLoading(true)
    try {
      let place: { latitude?: number; longitude?: number; timezone: string }
      let cityName = city.trim(),
        countryName = country.trim()
      if (useLocation) {
        // An explicitly requested approximate lookup; no silent page-load geolocation.
        const response = await fetch('https://ipapi.co/json/', { signal: controller.signal })
        if (!response.ok) throw new Error('Location unavailable')
        const geo = await response.json()
        place = locationMetadata(geo)
        if (typeof geo.city !== 'string' || typeof geo.country_name !== 'string')
          throw new Error('Unknown location')
        cityName = geo.city
        countryName = geo.country_name
      } else {
        // Resolve timezone only; city APIs can return placeholder coordinates. Its dated timings are deliberately not used.
        const query = new URLSearchParams({ city: cityName, country: countryName, method })
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?${query}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('City unavailable')
        const json = await response.json()
        if (json.code !== 200 || !json.data?.meta) throw new Error('City unavailable')
        const timezone = json.data.meta.timezone
        if (typeof timezone !== 'string') throw new Error('Unknown timezone')
        new Intl.DateTimeFormat('en', { timeZone: timezone }).format()
        place = { timezone }
      }
      const schedule = await fetchPrayerSchedule(
        {
          ...(place.latitude !== undefined && place.longitude !== undefined
            ? { lat: place.latitude, lng: place.longitude }
            : { city: cityName, country: countryName }),
          timezone: place.timezone,
          name: `${cityName}, ${countryName}`,
        },
        method,
        new Date(),
        { signal: controller.signal }
      )
      if (activeRequest.current !== controller || controller.signal.aborted) return
      setCity(cityName)
      setCountry(countryName)
      setResult({ ...place, city: cityName, country: countryName, schedule })
    } catch {
      if (activeRequest.current === controller) setError(true)
    } finally {
      clearTimeout(timeout)
      if (activeRequest.current === controller) setLoading(false)
    }
  }
  const inputClass =
    'mt-1 w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white'
  return (
    <div className="space-y-6" dir={ar ? 'rtl' : 'ltr'}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          search(false)
        }}
        className="space-y-4"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            {t('City', 'المدينة')}
            <input
              required
              aria-label={t('City', 'المدينة')}
              value={city}
              onChange={(event) => {
                invalidate()
                setCity(event.target.value)
              }}
              className={inputClass}
              autoComplete="address-level2"
            />
          </label>
          <label>
            {t('Country', 'البلد')}
            <input
              required
              aria-label={t('Country', 'البلد')}
              value={country}
              onChange={(event) => {
                invalidate()
                setCountry(event.target.value)
              }}
              className={inputClass}
              autoComplete="country-name"
            />
          </label>
        </div>
        <label className="block">
          {t('Search calculation method', 'طريقة الحساب للبحث')}
          <select
            aria-label={t('Search calculation method', 'طريقة الحساب للبحث')}
            className={inputClass}
            value={method}
            onChange={(event) => {
              invalidate()
              setMethod(event.target.value)
            }}
          >
            {Object.entries(methods).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap gap-4">
          <button
            disabled={loading || !city.trim() || !country.trim()}
            className="rounded-xl bg-green-800 px-5 py-3 font-semibold text-white disabled:opacity-40"
          >
            {t('Show prayer times', 'عرض المواقيت')}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => search(true)}
            className="flex items-center gap-2 text-sm text-green-800 dark:text-green-300"
          >
            <MapPin className="h-4 w-4" />
            {t('Use approximate location', 'استخدم موقعي التقريبي')}
          </button>
        </div>
      </form>
      {loading && (
        <p role="status" className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t('Loading prayer times…', 'جارٍ تحميل المواقيت…')}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-xl border border-red-300 p-4 text-sm">
          {t(
            'Could not load prayer times. Check the city and country or try again. You can also use the city links below.',
            'تعذر تحميل المواقيت. تحقق من المدينة والبلد أو حاول مجددًا. يمكنك استخدام روابط المدن أدناه.'
          )}
        </p>
      )}
      {result && (
        <section aria-label={t('Prayer time results', 'نتائج مواقيت الصلاة')}>
          <h2 className="mb-4 text-xl font-semibold">
            {result.city}, {result.country}
          </h2>
          <PrayerTimesWidget
            key={`${result.latitude}:${result.longitude}:${result.schedule.method}`}
            prayerData={result.schedule}
            cityName={result.city}
            cityCountry={result.country}
            cityMethod={result.schedule.method}
            latitude={result.latitude}
            longitude={result.longitude}
            timezone={result.timezone}
            lang={isLocale(lang) ? lang : 'en'}
          />
        </section>
      )}
      {!result && !loading && !error && (
        <p className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-600 dark:text-gray-300">
          {t(
            'Enter a city and country to see its local timetable.',
            'أدخل المدينة والبلد لعرض المواقيت المحلية.'
          )}
        </p>
      )}
    </div>
  )
}
