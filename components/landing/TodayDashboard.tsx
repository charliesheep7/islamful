'use client'

import { dashboardTranslations } from '@/data/locales/dashboard'
import type { Locale } from '@/utils/locale'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, BookOpen, Compass, Moon, Sun, CalendarDays, Calculator } from 'lucide-react'
import { cityLabel, countryLabel } from '@/utils/city-label'
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
  lang: Locale
  initialDate: TodayDate
}) {
  const t = (en: string, arabic: string) =>
    lang === 'ar'
      ? arabic
      : lang === 'fr' || lang === 'de'
        ? dashboardTranslations[lang][en] || en
        : en
  const ar = lang === 'ar',
    prefix = lang === 'en' ? '' : `/${lang}`
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
    <section aria-labelledby="today-heading" className="pb-10 sm:pb-16" dir={ar ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
        <header className="border-b border-emerald-950/10 pt-10 pb-8 text-center sm:pt-14 sm:pb-10 dark:border-white/10">
          <h1
            id="today-heading"
            className={`mx-auto max-w-4xl text-[2.75rem] leading-[1.12] font-normal tracking-[-0.035em] text-emerald-950 sm:text-7xl lg:text-[5.5rem] dark:text-stone-100 ${ar ? 'font-arabic leading-[1.5] tracking-normal' : ''}`}
          >
            <span className="block">{t('Every tool', 'كل أدوات المسلم،')}</span>{' '}
            <span className={`block text-emerald-800 dark:text-emerald-300 ${ar ? '' : 'italic'}`}>
              {t('a Muslim needs.', 'في مكان واحد.')}
            </span>
          </h1>
          <Link
            href="#tools"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-emerald-900 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 sm:mt-10 dark:bg-emerald-200 dark:text-emerald-950 dark:hover:bg-emerald-100"
          >
            {t('Explore tools', 'اكتشف الأدوات')}
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 rtl:-scale-x-100"
              strokeWidth={1.5}
            />
          </Link>
          <Image
            src="/static/images/islamful-home-hero-v1.webp"
            alt={t(
              'A Quran on a wooden stand, prayer beads, a compass and a prayer rug in a sunlit courtyard',
              'مصحف على حامل خشبي ومسبحة وبوصلة وسجادة صلاة في فناء مشمس'
            )}
            width={1600}
            height={667}
            sizes="(max-width: 1024px) 100vw, 976px"
            priority
            className="mt-10 h-auto w-full rounded-3xl sm:mt-12"
          />
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className={`${panel} lg:col-span-2`}>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">{t('Your prayers today', 'صلاتك اليوم')}</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {t(
                    'Choose your city and your locally approved calculation method.',
                    'اختر مدينتك وطريقة الحساب المعتمدة محليًا.'
                  )}
                </p>
              </div>
              <Link className="text-sm underline" href={`${prefix}/prayer-times`}>
                {t('All prayer times', 'كل مواقيت الصلاة')}
              </Link>
            </div>
            <div className="mb-5 flex flex-wrap items-end gap-3">
              <label className="min-w-0 flex-1">
                <span className="mb-1 block text-sm">{t('Filter cities', 'ابحث في المدن')}</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('City or country', 'مدينة أو دولة')}
                  className="w-full rounded-xl border border-gray-300 bg-transparent p-3"
                />
              </label>
              <label className="min-w-0 flex-1">
                <span className="mb-1 block text-sm">{t('Prayer city', 'مدينة الصلاة')}</span>
                <select
                  aria-label={t('Prayer city', 'مدينة الصلاة')}
                  value={city?.slug || ''}
                  onChange={(e) => {
                    const c = cities.find((c) => c.slug === e.target.value)
                    save(c ? { version: 1, city: c.slug, method: String(c.method) } : null)
                  }}
                  className="w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 dark:bg-gray-900 dark:text-white"
                >
                  <option value="">{t('Choose a city', 'اختر مدينة')}</option>
                  {city && !matches.includes(city) && (
                    <option value={city.slug}>{cityLabel(city, lang)}</option>
                  )}
                  {matches.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {`${cityLabel(c, lang)}, ${countryLabel(c, lang)}`}
                    </option>
                  ))}
                </select>
              </label>
              {city && (
                <button onClick={() => save(null)} className="py-3 text-sm underline">
                  {t('Forget city', 'نسيان المدينة')}
                </button>
              )}
            </div>
            {!matches.length && (
              <p className="mb-3 text-sm">
                {t(
                  'No matching city here. Use the full prayer times search.',
                  'لا توجد مدينة مطابقة هنا. استخدم البحث الكامل في مواقيت الصلاة.'
                )}
              </p>
            )}
            {city && choice ? (
              <PrayerTimesWidget
                key={city.slug}
                prayerData={null}
                cityName={cityLabel(city, lang)}
                cityCountry={countryLabel(city, lang)}
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
                {t(
                  'Choose a city for today’s timetable and next prayer. Your location is not detected automatically.',
                  'اختر مدينة لعرض مواقيت اليوم والصلاة القادمة. لا نحدد موقعك تلقائيًا.'
                )}
              </p>
            )}
            <noscript>
              <p className="mt-3">
                {t(
                  'Enable JavaScript to personalize this page, or open your city timetable from Prayer Times.',
                  'فعّل JavaScript لتخصيص هذه الصفحة، أو افتح جدول مدينتك من صفحة مواقيت الصلاة.'
                )}
              </p>
            </noscript>
            {!storageAvailable && (
              <p role="status" className="mt-3 text-sm">
                {t(
                  'Local storage is unavailable. You can use this page, but choices may not be saved.',
                  'التخزين المحلي غير متاح. يمكنك استخدام الصفحة، لكن قد لا تُحفظ اختياراتك.'
                )}
              </p>
            )}
          </div>

          <div className={panel}>
            <BookOpen className="mb-3 h-6 w-6 text-emerald-700" aria-hidden="true" />
            <h2 className="text-2xl font-bold">{t('A moment with the Quran', 'وقت مع القرآن')}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {t(
                'Read, listen and save your place for next time.',
                'اقرأ واستمع واحفظ موضعك للعودة إليه.'
              )}
            </p>
            <Link
              className={`${action} mt-5`}
              href={chapter && place ? quranPath(chapter, lang, place.ayah) : `${prefix}/quran`}
              data-testid="quran-resume"
            >
              {chapter && place
                ? ar
                  ? `تابع ${chapter.nameAr} · الآية ${place.ayah}`
                  : lang === 'fr'
                    ? `Reprendre ${chapter.name} · verset ${place.ayah}`
                    : lang === 'de'
                      ? `${chapter.name} fortsetzen · Vers ${place.ayah}`
                      : `Resume ${chapter.name} · verse ${place.ayah}`
                : t('Open the Quran', 'افتح القرآن')}
            </Link>
            <div className="mt-4 flex flex-wrap gap-2">
              {[1, 18, 36, 67].map((n) => (
                <Link className={smallLink} key={n} href={quranPath(chapters[n - 1], lang)}>
                  {ar ? chapters[n - 1].nameAr : chapters[n - 1].name}
                </Link>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              {t(
                'The place you explicitly save in the reader appears here on this browser.',
                'يظهر هنا الموضع الذي تحفظه في القارئ على هذا المتصفح.'
              )}
            </p>
          </div>
          <div className={panel}>
            <Sun className="mb-3 h-6 w-6 text-amber-600" aria-hidden="true" />
            <h2 className="text-2xl font-bold">{t('Your daily adhkar', 'أذكارك اليومية')}</h2>
            <div className="mt-4 space-y-3">
              {routines.map((id) => (
                <Link
                  key={id}
                  href={`${prefix}/adhkar/${id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <span className="font-semibold">
                    {id === 'morning'
                      ? t('Morning adhkar', 'أذكار الصباح')
                      : t('Evening adhkar', 'أذكار المساء')}
                  </span>
                  <span className="text-sm" data-testid={`progress-${id}`}>
                    {progress[id] === null ? (
                      t('Open', 'افتح')
                    ) : (
                      <>
                        <bdi dir="ltr">
                          {progress[id]} / {targets[id].length}
                        </bdi>{' '}
                        {t('cards', 'بطاقة')}
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
              {t('Adhkar after prayer', 'أذكار بعد الصلاة')} →
            </Link>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              {t(
                'Cards you marked complete, for this device’s local day. These counts do not record prayer completion.',
                'البطاقات التي سجلتها مكتملة، لليوم المحلي على جهازك. لا يُستنتج أداء الصلاة من هذه الأعداد.'
              )}
            </p>
          </div>
          <div className={panel} data-testid="today-calendar">
            <CalendarDays className="mb-3 h-6 w-6 text-emerald-700" aria-hidden="true" />
            <h2 className="text-2xl font-bold">{t('The Islamic date', 'التاريخ الإسلامي')}</h2>
            {date ? (
              <>
                <p className="mt-4 text-xl font-semibold">{date.hijri}</p>
                <p className="mt-1 text-sm">{date.gregorian}</p>
                <p className="mt-3 text-sm">
                  {t('After Maghrib: ', 'بعد المغرب: ')}
                  {date.tonight}
                </p>
              </>
            ) : (
              <p role="status" className="mt-4">
                {t(
                  'This browser could not calculate the date with these settings.',
                  'تعذر حساب التاريخ بهذه الإعدادات في متصفحك.'
                )}
              </p>
            )}
            <p className="mt-3 text-xs break-words text-gray-500 dark:text-gray-400">
              {!now ? t('Reference date · UTC', 'تاريخ مرجعي · UTC') : zone} ·{' '}
              {calendar.method === 'islamic-civil'
                ? t('Tabular Hijri', 'التقويم الهجري الحسابي')
                : t('Umm al-Qura', 'أم القرى')}
              {calendar.adjustment !== 0
                ? ` · ${t('Adjustment', 'التعديل')} ${calendar.adjustment > 0 ? '+' : ''}${calendar.adjustment}`
                : ''}
            </p>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              {t(
                'A calculated date; local moon sighting can differ. The time zone follows your chosen prayer city, or your calendar setting when no city is selected.',
                'تاريخ محسوب؛ قد تختلف رؤية الهلال محليًا. تتبع المنطقة الزمنية مدينة الصلاة المختارة، أو إعداد التقويم إن لم تختر مدينة.'
              )}
            </p>
            <Link
              className="mt-4 inline-block text-sm underline"
              href={`${prefix}/islamic-calendar`}
            >
              {t('Open calendar & settings', 'افتح التقويم والإعدادات')} →
            </Link>
          </div>
          <div className={panel}>
            <h2 className="text-2xl font-bold">{t('Keep these close', 'في متناول يدك')}</h2>
            <div className="mt-4 space-y-3">
              {[
                {
                  href: 'qibla-finder',
                  title: t('Find the Qibla', 'اتجاه القبلة'),
                  desc: t(
                    'Get a direction from a location you choose.',
                    'حدد الاتجاه من موقع تختاره.'
                  ),
                  Icon: Compass,
                },
                {
                  href: 'last-third-of-night',
                  title: t('Plan your night', 'خطط لليلتك'),
                  desc: t(
                    'Last third of the night, midnight and Fajr.',
                    'الثلث الأخير ومنتصف الليل والفجر.'
                  ),
                  Icon: Moon,
                },
                {
                  href: 'fasting-times',
                  title: t('Suhoor and iftar', 'السحور والإفطار'),
                  desc: t(
                    'Fasting times and a Ramadan calendar for your city.',
                    'مواقيت الصيام وتقويم رمضان لمدينتك.'
                  ),
                  Icon: Moon,
                },
                {
                  href: 'zakat-calculator',
                  title: t('Calculate your zakat', 'احسب زكاتك'),
                  desc: t('Nisab, money, gold and silver.', 'النصاب والمال والذهب والفضة.'),
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
          {t(
            'Bookmark this page in your browser to return each day. Saved progress stays on this browser.',
            'احفظ هذه الصفحة في مفضلة متصفحك للعودة إليها كل يوم. بيانات تقدمك محفوظة على هذا المتصفح فقط.'
          )}{' '}
          <a className="underline" href="#tools">
            {t('Explore all tools', 'استكشف كل الأدوات')} ↓
          </a>
        </p>
      </div>
    </section>
  )
}
