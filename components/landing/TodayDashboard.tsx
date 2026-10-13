'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Compass, Moon, Sun, CalendarDays, Calculator } from 'lucide-react'
import cities from '@/data/cities'
import { chapters, quranPath } from '@/data/quran'
import { routineEntries } from '@/data/adhkar'
import { useReaderData } from '@/components/quran/useReaderData'
import PrayerTimesWidget from '@/components/tools/PrayerTimesWidget'
import { localDay, parseProgress, summary } from '@/utils/adhkar-progress'
import {
  TODAY_KEY,
  CALENDAR_KEY,
  todayChoice,
  todayCalendar,
  todayDate,
  type TodayChoice,
  type TodayCalendar,
  type TodayDate,
} from '@/utils/today'

const routines = ['morning', 'evening'] as const
const targets = Object.fromEntries(
  routines.map((id) => [id, routineEntries(id).map(({ id, target }) => ({ id, target }))])
)
const panel =
  'rounded-3xl border border-gray-200 bg-white p-5 sm:p-7 dark:border-gray-800 dark:bg-gray-900'
const action =
  'inline-flex items-center justify-center rounded-xl bg-emerald-800 px-4 py-3 font-semibold text-white hover:bg-emerald-900'
const smallLink =
  'rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'

export default function TodayDashboard({
  lang,
  initialDate,
}: {
  lang: 'en' | 'ar'
  initialDate: TodayDate
}) {
  const ar = lang === 'ar',
    prefix = ar ? '/ar' : ''
  const [choice, setChoice] = useState<TodayChoice | null>(null)
  const [calendar, setCalendar] = useState<TodayCalendar>({
    method: 'islamic-umalqura',
    adjustment: 0,
    timeZone: 'UTC',
  })
  const [now, setNow] = useState<string | null>(null)
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [search, setSearch] = useState('')
  const [progress, setProgress] = useState<Record<string, number | null>>({
    morning: null,
    evening: null,
  })
  const reader = useReaderData(lang)
  const city = cities.find((c) => c.slug === choice?.city)

  useEffect(() => {
    const read = (readChoice = false) => {
      const date = new Date()
      setNow(date.toISOString())
      let zone = 'UTC'
      try {
        zone = Intl.DateTimeFormat().resolvedOptions().timeZone
      } catch {
        /* UTC label remains visible. */
      }
      try {
        if (readChoice) setChoice(todayChoice(localStorage.getItem(TODAY_KEY)))
        setCalendar(todayCalendar(localStorage.getItem(CALENDAR_KEY), zone))
        setProgress(
          Object.fromEntries(
            routines.map((id) => [
              id,
              summary(
                parseProgress(
                  localStorage.getItem(`islamful.adhkar.v1.${id}.daily`),
                  targets[id],
                  localDay(date)
                ),
                targets[id]
              ).done,
            ])
          )
        )
        // A failed write stays visible until the next explicit successful save.
      } catch {
        setStorageAvailable(false)
        setCalendar(todayCalendar(null, zone))
        setProgress({ morning: null, evening: null })
      }
    }
    read(true)
    const refresh = () => read()
    const sync = (event: StorageEvent) => {
      if (event.key === null || event.key === TODAY_KEY) read(true)
      else if (event.key === CALENDAR_KEY || event.key?.startsWith('islamful.adhkar.v1.')) read()
    }
    const timer = setInterval(refresh, 30000)
    window.addEventListener('storage', sync)
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      clearInterval(timer)
      window.removeEventListener('storage', sync)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  function save(next: TodayChoice | null) {
    setChoice(next)
    try {
      if (next) localStorage.setItem(TODAY_KEY, JSON.stringify(next))
      else localStorage.removeItem(TODAY_KEY)
      setStorageAvailable(true)
    } catch {
      setStorageAvailable(false)
    }
  }
  const zone = city?.timezone || calendar.timeZone
  let date: TodayDate | null = initialDate
  if (now) {
    try {
      date = todayDate(now, { ...calendar, timeZone: zone }, lang)
    } catch {
      date = null
    }
  }
  const place = reader.data.place
  const chapter = place ? chapters[place.surah - 1] : null
  const matches = cities.filter((c) =>
    `${c.name} ${c.nameAr} ${c.country} ${c.countryAr}`
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  )

  return (
    <section
      aria-labelledby="today-heading"
      className="bg-gradient-to-b from-emerald-50/70 to-transparent py-10 sm:py-16 dark:from-emerald-950/30"
      dir={ar ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold tracking-wide text-emerald-800 dark:text-emerald-300">
            {ar ? 'إسلامفُل · أدوات ليومك' : 'ISLAMFUL · TOOLS FOR YOUR DAY'}
          </p>
          <h1 id="today-heading" className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {ar ? 'ماذا تحتاج اليوم؟' : 'What do you need today?'}
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            {ar
              ? 'مواقيت صلاتك، وردك من القرآن، وأذكارك اليومية — في مكان واحد، دون حساب.'
              : 'Your prayer times, Quran reading and daily remembrance — together, without an account.'}
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className={`${panel} lg:col-span-2`}>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">{ar ? 'صلاتك اليوم' : 'Your prayers today'}</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {ar
                    ? 'اختر مدينتك وطريقة الحساب المعتمدة محليًا.'
                    : 'Choose your city and your locally approved calculation method.'}
                </p>
              </div>
              <Link className="text-sm underline" href={`${prefix}/prayer-times`}>
                {ar ? 'كل مواقيت الصلاة' : 'All prayer times'}
              </Link>
            </div>
            <div className="mb-5 flex flex-wrap items-end gap-3">
              <label className="min-w-0 flex-1">
                <span className="mb-1 block text-sm">{ar ? 'ابحث في المدن' : 'Filter cities'}</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={ar ? 'مدينة أو دولة' : 'City or country'}
                  className="w-full rounded-xl border border-gray-300 bg-transparent p-3"
                />
              </label>
              <label className="min-w-0 flex-1">
                <span className="mb-1 block text-sm">{ar ? 'مدينة الصلاة' : 'Prayer city'}</span>
                <select
                  aria-label={ar ? 'مدينة الصلاة' : 'Prayer city'}
                  value={city?.slug || ''}
                  onChange={(e) => {
                    const c = cities.find((c) => c.slug === e.target.value)
                    save(c ? { version: 1, city: c.slug, method: String(c.method) } : null)
                  }}
                  className="w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 dark:bg-gray-900 dark:text-white"
                >
                  <option value="">{ar ? 'اختر مدينة' : 'Choose a city'}</option>
                  {city && !matches.includes(city) && (
                    <option value={city.slug}>{ar ? city.nameAr : city.name}</option>
                  )}
                  {matches.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {ar ? `${c.nameAr}، ${c.countryAr}` : `${c.name}, ${c.country}`}
                    </option>
                  ))}
                </select>
              </label>
              {city && (
                <button onClick={() => save(null)} className="py-3 text-sm underline">
                  {ar ? 'نسيان المدينة' : 'Forget city'}
                </button>
              )}
            </div>
            {!matches.length && (
              <p className="mb-3 text-sm">
                {ar
                  ? 'لا توجد مدينة مطابقة هنا. استخدم البحث الكامل في مواقيت الصلاة.'
                  : 'No matching city here. Use the full prayer times search.'}
              </p>
            )}
            {city && choice ? (
              <PrayerTimesWidget
                key={city.slug}
                prayerData={null}
                cityName={ar ? city.nameAr : city.name}
                cityCountry={ar ? city.countryAr : city.country}
                cityMethod={choice.method}
                latitude={city.lat}
                longitude={city.lng}
                timezone={city.timezone}
                lang={lang}
                onMethodChange={(method) => save({ ...choice, method })}
                showFasting
              />
            ) : (
              <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100">
                {ar
                  ? 'اختر مدينة لعرض مواقيت اليوم والصلاة القادمة. لا نحدد موقعك تلقائيًا.'
                  : 'Choose a city for today’s timetable and next prayer. Your location is not detected automatically.'}
              </p>
            )}
            <noscript>
              <p className="mt-3">
                {ar
                  ? 'فعّل JavaScript لتخصيص هذه الصفحة، أو افتح جدول مدينتك من صفحة مواقيت الصلاة.'
                  : 'Enable JavaScript to personalize this page, or open your city timetable from Prayer Times.'}
              </p>
            </noscript>
            {!storageAvailable && (
              <p role="status" className="mt-3 text-sm">
                {ar
                  ? 'التخزين المحلي غير متاح. يمكنك استخدام الصفحة، لكن قد لا تُحفظ اختياراتك.'
                  : 'Local storage is unavailable. You can use this page, but choices may not be saved.'}
              </p>
            )}
          </div>

          <div className={panel}>
            <BookOpen className="mb-3 h-6 w-6 text-emerald-700" aria-hidden="true" />
            <h2 className="text-2xl font-bold">
              {ar ? 'وقت مع القرآن' : 'A moment with the Quran'}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {ar
                ? 'اقرأ واستمع واحفظ موضعك للعودة إليه.'
                : 'Read, listen and save your place for next time.'}
            </p>
            <Link
              className={`${action} mt-5`}
              href={chapter && place ? quranPath(chapter, lang, place.ayah) : `${prefix}/quran`}
              data-testid="quran-resume"
            >
              {chapter && place
                ? ar
                  ? `تابع ${chapter.nameAr} · الآية ${place.ayah}`
                  : `Resume ${chapter.name} · verse ${place.ayah}`
                : ar
                  ? 'افتح القرآن'
                  : 'Open the Quran'}
            </Link>
            <div className="mt-4 flex flex-wrap gap-2">
              {[1, 18, 36, 67].map((n) => (
                <Link className={smallLink} key={n} href={quranPath(chapters[n - 1], lang)}>
                  {ar ? chapters[n - 1].nameAr : chapters[n - 1].name}
                </Link>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              {ar
                ? 'يظهر هنا الموضع الذي تحفظه في القارئ على هذا المتصفح.'
                : 'The place you explicitly save in the reader appears here on this browser.'}
            </p>
          </div>
          <div className={panel}>
            <Sun className="mb-3 h-6 w-6 text-amber-600" aria-hidden="true" />
            <h2 className="text-2xl font-bold">{ar ? 'أذكارك اليومية' : 'Your daily adhkar'}</h2>
            <div className="mt-4 space-y-3">
              {routines.map((id) => (
                <Link
                  key={id}
                  href={`${prefix}/adhkar/${id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <span className="font-semibold">
                    {id === 'morning'
                      ? ar
                        ? 'أذكار الصباح'
                        : 'Morning adhkar'
                      : ar
                        ? 'أذكار المساء'
                        : 'Evening adhkar'}
                  </span>
                  <span className="text-sm" data-testid={`progress-${id}`}>
                    {progress[id] === null ? (
                      ar ? (
                        'افتح'
                      ) : (
                        'Open'
                      )
                    ) : (
                      <>
                        <bdi dir="ltr">
                          {progress[id]} / {targets[id].length}
                        </bdi>{' '}
                        {ar ? 'بطاقة' : 'cards'}
                      </>
                    )}
                  </span>
                </Link>
              ))}
            </div>
            <Link
              className="mt-4 inline-block text-sm underline"
              href={`${prefix}/adhkar/after-prayer`}
            >
              {ar ? 'أذكار بعد الصلاة' : 'Adhkar after prayer'} →
            </Link>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              {ar
                ? 'البطاقات التي سجلتها مكتملة، لليوم المحلي على جهازك. لا يُستنتج أداء الصلاة من هذه الأعداد.'
                : 'Cards you marked complete, for this device’s local day. These counts do not record prayer completion.'}
            </p>
          </div>
          <div className={panel} data-testid="today-calendar">
            <CalendarDays className="mb-3 h-6 w-6 text-emerald-700" aria-hidden="true" />
            <h2 className="text-2xl font-bold">{ar ? 'التاريخ الإسلامي' : 'The Islamic date'}</h2>
            {date ? (
              <>
                <p className="mt-4 text-xl font-semibold">{date.hijri}</p>
                <p className="mt-1 text-sm">{date.gregorian}</p>
                <p className="mt-3 text-sm">
                  {ar ? 'بعد المغرب: ' : 'After Maghrib: '}
                  {date.tonight}
                </p>
              </>
            ) : (
              <p role="status" className="mt-4">
                {ar
                  ? 'تعذر حساب التاريخ بهذه الإعدادات في متصفحك.'
                  : 'This browser could not calculate the date with these settings.'}
              </p>
            )}
            <p className="mt-3 text-xs break-words text-gray-500 dark:text-gray-400">
              {!now ? (ar ? 'تاريخ مرجعي · UTC' : 'Reference date · UTC') : zone} ·{' '}
              {calendar.method === 'islamic-civil'
                ? ar
                  ? 'التقويم الهجري الحسابي'
                  : 'Tabular Hijri'
                : ar
                  ? 'أم القرى'
                  : 'Umm al-Qura'}
              {calendar.adjustment !== 0
                ? ` · ${ar ? 'التعديل' : 'Adjustment'} ${calendar.adjustment > 0 ? '+' : ''}${calendar.adjustment}`
                : ''}
            </p>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              {ar
                ? 'تاريخ محسوب؛ قد تختلف رؤية الهلال محليًا. تتبع المنطقة الزمنية مدينة الصلاة المختارة، أو إعداد التقويم إن لم تختر مدينة.'
                : 'A calculated date; local moon sighting can differ. The time zone follows your chosen prayer city, or your calendar setting when no city is selected.'}
            </p>
            <Link
              className="mt-4 inline-block text-sm underline"
              href={`${prefix}/islamic-calendar`}
            >
              {ar ? 'افتح التقويم والإعدادات' : 'Open calendar & settings'} →
            </Link>
          </div>
          <div className={panel}>
            <h2 className="text-2xl font-bold">{ar ? 'في متناول يدك' : 'Keep these close'}</h2>
            <div className="mt-4 space-y-3">
              {[
                {
                  href: 'qibla-finder',
                  title: ar ? 'اتجاه القبلة' : 'Find the Qibla',
                  desc: ar
                    ? 'حدد الاتجاه من موقع تختاره.'
                    : 'Get a direction from a location you choose.',
                  Icon: Compass,
                },
                {
                  href: 'last-third-of-night',
                  title: ar ? 'خطط لليلتك' : 'Plan your night',
                  desc: ar
                    ? 'الثلث الأخير ومنتصف الليل والفجر.'
                    : 'Last third of the night, midnight and Fajr.',
                  Icon: Moon,
                },
                {
                  href: 'fasting-times',
                  title: ar ? 'السحور والإفطار' : 'Suhoor and iftar',
                  desc: ar
                    ? 'مواقيت الصيام وتقويم رمضان لمدينتك.'
                    : 'Fasting times and a Ramadan calendar for your city.',
                  Icon: Moon,
                },
                {
                  href: 'zakat-calculator',
                  title: ar ? 'احسب زكاتك' : 'Calculate your zakat',
                  desc: ar ? 'النصاب والمال والذهب والفضة.' : 'Nisab, money, gold and silver.',
                  Icon: Calculator,
                },
              ].map(({ href, title, desc, Icon }) => (
                <Link
                  key={href}
                  href={`${prefix}/${href}`}
                  className="flex gap-3 rounded-xl border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          {ar
            ? 'احفظ هذه الصفحة في مفضلة متصفحك للعودة إليها كل يوم. بيانات تقدمك محفوظة على هذا المتصفح فقط.'
            : 'Bookmark this page in your browser to return each day. Saved progress stays on this browser.'}{' '}
          <a className="underline" href="#tools">
            {ar ? 'استكشف كل الأدوات' : 'Explore all tools'} ↓
          </a>
        </p>
      </div>
    </section>
  )
}
