'use client'

import { useEffect, useRef, useState } from 'react'
import cities from '@/data/cities'
import { PRAYER_METHODS, ARABIC_PRAYER_METHODS } from '@/data/prayer-methods'
import { fetchPrayerSchedule, localDateISO, type PrayerSchedule } from '@/utils/prayer-schedule'
import { manualNight, nightCalendar, nightTimes, zonedTime } from '@/utils/night-times'

type Result = ReturnType<typeof nightTimes> & {
  timezone: string
  date: string
  label: string
  schedule?: PrayerSchedule
}
const field =
  'mt-1 block w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white'

export default function NightPlanner({ lang = 'en' }: { lang?: 'en' | 'ar' }) {
  const ar = lang === 'ar'
  const t = (en: string, arabic: string) => (ar ? arabic : en)
  const [citySlug, setCitySlug] = useState('london')
  const city = cities.find((item) => item.slug === citySlug) || cities[0]
  const [method, setMethod] = useState('15')
  const [mode, setMode] = useState('city')
  const [date, setDate] = useState('')
  const [zone, setZone] = useState('Europe/London')
  const [maghrib, setMaghrib] = useState('')
  const [fajr, setFajr] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  const [now, setNow] = useState<number | null>(null)
  const request = useRef<AbortController | null>(null)

  useEffect(() => {
    let selected = cities.find((item) => item.slug === 'london')!
    try {
      const saved = JSON.parse(localStorage.getItem('islamful-night-settings') || 'null')
      const found = cities.find((item) => item.slug === saved?.city)
      if (found) {
        selected = found
        setCitySlug(found.slug)
        setZone(found.timezone)
        setMethod(PRAYER_METHODS[saved.method] ? saved.method : String(found.method))
      }
    } catch {
      /* Storage may be unavailable. */
    }
    setDate(localDateISO(selected.timezone))
    setNow(Date.now())
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => {
      clearInterval(timer)
      request.current?.abort()
    }
  }, [])

  function invalidate() {
    request.current?.abort()
    request.current = null
    setResult(null)
    setError(false)
    setBusy(false)
  }
  async function calculate(event: React.FormEvent) {
    event.preventDefault()
    invalidate()
    const controller = new AbortController()
    request.current = controller
    const timeout = setTimeout(() => controller.abort(), 15000)
    setBusy(true)
    try {
      let next: Result
      if (mode === 'manual') {
        next = {
          ...manualNight(date, maghrib, fajr, zone),
          timezone: zone,
          date,
          label: t('Your entered timetable', 'المواقيت التي أدخلتها'),
        }
      } else {
        const schedule = await fetchPrayerSchedule(
          { lat: city.lat, lng: city.lng, timezone: city.timezone, name: city.name },
          method,
          new Date(zonedTime(date, '12:00', city.timezone)),
          { signal: controller.signal }
        )
        const start = schedule.prayers.find((prayer) => prayer.name === 'Maghrib')?.at
        const end = schedule.tomorrow.find((prayer) => prayer.name === 'Fajr')?.at
        if (start == null || end == null) throw new Error('Missing night boundaries')
        next = {
          ...nightTimes(start, end),
          timezone: city.timezone,
          date,
          label: `${ar ? city.nameAr : city.name} · ${(ar ? ARABIC_PRAYER_METHODS : PRAYER_METHODS)[method]}`,
          schedule,
        }
        try {
          localStorage.setItem(
            'islamful-night-settings',
            JSON.stringify({ city: city.slug, method })
          )
        } catch {
          /* optional preference */
        }
      }
      if (request.current === controller && !controller.signal.aborted) setResult(next)
    } catch {
      if (request.current === controller) setError(true)
    } finally {
      clearTimeout(timeout)
      if (request.current === controller) setBusy(false)
    }
  }
  function download() {
    if (!result) return
    const url = URL.createObjectURL(
      new Blob([nightCalendar(result.lastThird, result.fajr)], {
        type: 'text/calendar;charset=utf-8',
      })
    )
    const link = document.createElement('a')
    link.href = url
    link.download = `islamful-night-${result.date}.ics`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  const format = (instant: number) =>
    result
      ? new Intl.DateTimeFormat(ar ? 'ar' : 'en-GB', {
          timeZone: result.timezone,
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hourCycle: 'h23',
        }).format(instant)
      : ''
  const nextPrayer =
    result?.schedule && now !== null
      ? [...result.schedule.prayers, ...result.schedule.tomorrow]
          .filter(
            (prayer) =>
              prayer.name !== 'Sunrise' &&
              prayer.at !== null &&
              prayer.at > now &&
              prayer.at <= result.fajr
          )
          .sort((a, b) => a.at! - b.at!)[0]
      : null
  const remaining =
    result && now !== null ? Math.max(0, Math.ceil((result.lastThird - now) / 60000)) : 0

  return (
    <div className="space-y-8" dir={ar ? 'rtl' : 'ltr'}>
      <form
        onSubmit={calculate}
        className="space-y-5 rounded-2xl border border-gray-200 p-5 sm:p-7 dark:border-gray-700"
      >
        <label className="block font-medium">
          {t('Use a city or your own timetable', 'اختر مدينة أو أدخل المواقيت بنفسك')}
          <select
            aria-label={t('Input method', 'طريقة الإدخال')}
            className={field}
            value={mode}
            onChange={(e) => {
              invalidate()
              setMode(e.target.value)
            }}
          >
            <option value="city">{t('City prayer times', 'مواقيت مدينة')}</option>
            <option value="manual">{t('Enter Maghrib and Fajr', 'إدخال المغرب والفجر')}</option>
          </select>
        </label>
        {mode === 'city' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              {t('City', 'المدينة')}
              <select
                aria-label={t('City', 'المدينة')}
                className={field}
                value={citySlug}
                onChange={(e) => {
                  invalidate()
                  const selected = cities.find((item) => item.slug === e.target.value)!
                  setCitySlug(selected.slug)
                  setMethod(String(selected.method))
                  setZone(selected.timezone)
                  setDate(localDateISO(selected.timezone))
                }}
              >
                {cities.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {ar ? `${item.nameAr}، ${item.countryAr}` : `${item.name}, ${item.country}`}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t('Calculation method', 'طريقة الحساب')}
              <select
                aria-label={t('Calculation method', 'طريقة الحساب')}
                className={field}
                value={method}
                onChange={(e) => {
                  invalidate()
                  setMethod(e.target.value)
                }}
              >
                {Object.entries(ar ? ARABIC_PRAYER_METHODS : PRAYER_METHODS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : (
          <>
            <label className="block">
              {t('Time zone (for example Europe/London)', 'المنطقة الزمنية (مثل Europe/London)')}
              <input
                aria-label={t('Time zone', 'المنطقة الزمنية')}
                required
                className={field}
                value={zone}
                onChange={(e) => {
                  invalidate()
                  setZone(e.target.value)
                }}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                {t('Maghrib on the selected date', 'المغرب في التاريخ المحدد')}
                <input
                  aria-label={t('Maghrib', 'المغرب')}
                  required
                  type="time"
                  className={field}
                  value={maghrib}
                  onChange={(e) => {
                    invalidate()
                    setMaghrib(e.target.value)
                  }}
                />
              </label>
              <label>
                {t('Fajr the following morning', 'الفجر في صباح اليوم التالي')}
                <input
                  aria-label={t('Next morning Fajr', 'فجر اليوم التالي')}
                  required
                  type="time"
                  className={field}
                  value={fajr}
                  onChange={(e) => {
                    invalidate()
                    setFajr(e.target.value)
                  }}
                />
              </label>
            </div>
          </>
        )}
        <label className="block">
          {t('Night beginning on', 'الليلة التي تبدأ في')}
          <input
            aria-label={t('Night beginning on', 'الليلة التي تبدأ في')}
            required
            type="date"
            className={field}
            value={date}
            onChange={(e) => {
              invalidate()
              setDate(e.target.value)
            }}
          />
        </label>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t(
            'The selected evening’s Maghrib to the next morning’s Fajr. After midnight, choose yesterday for the night still in progress.',
            'من مغرب التاريخ المحدد إلى فجر اليوم التالي. بعد منتصف الليل، اختر تاريخ الأمس لليلة التي لم تنتهِ بعد.'
          )}
        </p>
        <button
          disabled={busy}
          className="rounded-xl bg-green-800 px-6 py-3 font-semibold text-white disabled:opacity-50"
        >
          {busy ? t('Calculating…', 'جارٍ الحساب…') : t('Calculate my night', 'احسب مواقيت ليلتي')}
        </button>
        {error && (
          <p role="alert" className="text-sm text-red-700 dark:text-red-300">
            {t(
              'We could not calculate this night. Check the date, time zone and both times, or try manual entry if city times are unavailable. Clock-change times that are missing or ambiguous cannot be used.',
              'تعذر حساب هذه الليلة. تحقق من التاريخ والمنطقة الزمنية والمواقيت، أو أدخلها يدويًا إذا تعذر جلبها. لا يمكن استخدام وقت مفقود أو ملتبس عند تغيير الساعة.'
            )}
          </p>
        )}
      </form>
      {result && (
        <section
          aria-label={t('Your night results', 'نتائج ليلتك')}
          className="space-y-5 rounded-2xl bg-green-50 p-5 sm:p-7 dark:bg-gray-900"
        >
          <h2 className="text-2xl font-bold">{t('Your night at a glance', 'مواقيت ليلتك')}</h2>
          <p>
            {result.label} · {result.timezone}
          </p>
          <dl className="grid gap-5 sm:grid-cols-2">
            {[
              [t('Maghrib', 'المغرب'), result.maghrib],
              [t('Islamic midnight (night midpoint)', 'منتصف الليل الشرعي'), result.midpoint],
              [t('Last third begins', 'بداية الثلث الأخير'), result.lastThird],
              [t('Fajr — night ends', 'الفجر — نهاية الليل'), result.fajr],
            ].map(([label, value]) => (
              <div key={String(label)}>
                <dt className="text-sm text-gray-600 dark:text-gray-300">{label}</dt>
                <dd className="mt-1 text-xl font-semibold">{format(Number(value))}</dd>
              </div>
            ))}
          </dl>
          {now !== null && (
            <p className="font-medium">
              {now >= result.fajr
                ? t(
                    'This night has ended. Choose another date above.',
                    'انتهت هذه الليلة. اختر تاريخًا آخر أعلاه.'
                  )
                : now >= result.lastThird
                  ? t('The last third is now in progress.', 'نحن الآن في الثلث الأخير من الليل.')
                  : t(
                      `${Math.floor(remaining / 60)}h ${remaining % 60}m until the last third`,
                      `${Math.floor(remaining / 60)} ساعة و${remaining % 60} دقيقة حتى الثلث الأخير`
                    )}
            </p>
          )}
          {nextPrayer && (
            <p>
              {t('Next prayer', 'الصلاة القادمة')}: {ar ? nextPrayer.nameAr : nextPrayer.name} ·{' '}
              {format(nextPrayer.at!)}
            </p>
          )}
          <button
            onClick={download}
            className="rounded-lg border border-green-800 px-4 py-2 font-medium"
          >
            {t('Download calendar event', 'تنزيل حدث للتقويم')}
          </button>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            {t(
              'The calendar event covers this one last-third window. It does not set an alarm or repeat on later nights.',
              'يشمل الحدث الثلث الأخير لهذه الليلة فقط. لا يضبط منبهًا ولا يتكرر في الليالي التالية.'
            )}
          </p>
        </section>
      )}
    </div>
  )
}
