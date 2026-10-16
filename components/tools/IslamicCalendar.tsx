'use client'

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  CalendarError,
  DEFAULT_CALENDAR,
  MIN_DATE,
  MAX_DATE,
  DAY_MS,
  HIJRI_MONTHS,
  gregorianToHijri,
  hijriToGregorian,
  parseHijriInput,
  moveHijriMonth,
  dateInTimeZone,
  normalizeTimeZone,
  parseGregorian,
  isoDay,
  formatHijri,
  formatGregorian,
  calendarDownload,
  calendarSnapshot,
  KEY_DATES,
  type CalendarSettings,
  type CalendarMethod,
  type HijriDate,
} from '@/data/islamic-calendar'

import { calendarTranslations } from '@/data/locales/calendar'

const copy = {
  ...calendarTranslations,
  en: {
    today: 'Today and tonight',
    daytime: 'Hijri date for this daytime',
    tonight: 'Tonight, after local Maghrib',
    settings: 'Calendar settings',
    method: 'Calculation method',
    umm: 'Umm al-Qura (calculated)',
    civil: 'Tabular Islamic civil',
    adjustment: 'Local date adjustment',
    zero: 'No adjustment',
    zone: 'Time zone for today',
    apply: 'Apply time zone',
    device: 'Use device time zone',
    zoneNote:
      'Time zone changes which Gregorian day is today. It does not change a fixed date conversion.',
    adjusted:
      'A positive adjustment shows a later Hijri date for the same Gregorian day. Use only to match your trusted local calendar.',
    disclaimer:
      'Calculated dates can differ from local moon-sighting announcements. Each grid cell labels the daytime date; its Islamic night begins at the preceding local sunset. This tool does not detect sunset or announce Ramadan or Eid.',
    saved: 'Your method, adjustment and time zone are saved in this browser.',
    unsaved: 'Settings work for this visit, but could not be saved in this browser.',
    converter: 'Convert a date',
    direction: 'Conversion direction',
    gh: 'Gregorian to Hijri',
    hg: 'Hijri to Gregorian',
    gregorian: 'Gregorian date',
    year: 'Hijri year',
    month: 'Hijri month',
    day: 'Hijri day',
    convert: 'Convert date',
    currentH: 'Use today’s Hijri date',
    result: 'Converted date',
    begins: 'Its Islamic night begins at local sunset on',
    range:
      'Supported Gregorian dates: 1 January 1900–31 December 2100. Some months have 29 days; invalid dates are not rolled into the next month.',
    calendar: 'Monthly Hijri calendar',
    previous: 'Previous month',
    next: 'Next month',
    back: 'This month',
    calendarYear: 'Calendar Hijri year',
    calendarMonth: 'Calendar Hijri month',
    legend:
      'Large number: Hijri day. Small number: Gregorian day/month. A dot marks a key date listed below.',
    monthDates: 'Key dates in this month',
    noDates: 'No key dates from this list fall in this month.',
    upcoming: 'Upcoming key dates',
    calculated: 'Calculated daytime dates — confirm local announcements.',
    download: 'Download these dates (.ics)',
    downloadError: 'The calendar could not be downloaded. Please try again.',
    downloaded:
      'Calendar file created. These dates are estimates, not live announcements or automatic reminders.',
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    errors: {
      date: 'Enter a complete, valid date and an adjustment between −2 and +2.',
      range: 'Choose a date within the supported 1900–2100 Gregorian range.',
      hijri:
        'That Hijri date does not exist in the selected method, or is outside the supported range. Check the year, month and day.',
      method:
        'This calendar method is unavailable in your browser. Try the other method or an up-to-date browser.',
      zone: 'Enter a valid IANA time zone, such as Europe/London or Asia/Riyadh.',
    },
  },
  ar: {
    today: 'اليوم وهذه الليلة',
    daytime: 'التاريخ الهجري لنهار اليوم',
    tonight: 'هذه الليلة، بعد المغرب المحلي',
    settings: 'إعدادات التقويم',
    method: 'طريقة الحساب',
    umm: 'أم القرى (محسوب)',
    civil: 'التقويم الهجري المدني الجدولي',
    adjustment: 'تعديل التاريخ المحلي',
    zero: 'دون تعديل',
    zone: 'المنطقة الزمنية لليوم',
    apply: 'تطبيق المنطقة الزمنية',
    device: 'استخدام منطقة الجهاز الزمنية',
    zoneNote: 'تحدّد المنطقة الزمنية اليوم الميلادي الحالي، ولا تغيّر تحويل تاريخ ثابت.',
    adjusted:
      'يعرض التعديل الموجب تاريخًا هجريًا متقدمًا لليوم الميلادي نفسه. استخدمه فقط لمطابقة تقويمك المحلي الموثوق.',
    disclaimer:
      'قد تختلف التواريخ المحسوبة عن إعلانات رؤية الهلال المحلية. تشير كل خانة إلى تاريخ النهار، وتبدأ ليلته الشرعية من غروب الشمس السابق. لا تحدّد الأداة وقت الغروب ولا تعلن دخول رمضان أو العيد.',
    saved: 'تُحفظ طريقة الحساب والتعديل والمنطقة الزمنية في هذا المتصفح.',
    unsaved: 'تعمل الإعدادات لهذه الزيارة، لكن تعذّر حفظها في هذا المتصفح.',
    converter: 'تحويل التاريخ',
    direction: 'اتجاه التحويل',
    gh: 'من الميلادي إلى الهجري',
    hg: 'من الهجري إلى الميلادي',
    gregorian: 'التاريخ الميلادي',
    year: 'السنة الهجرية',
    month: 'الشهر الهجري',
    day: 'اليوم الهجري',
    convert: 'تحويل التاريخ',
    currentH: 'استخدام التاريخ الهجري لليوم',
    result: 'نتيجة التحويل',
    begins: 'تبدأ ليلته الشرعية عند الغروب المحلي في',
    range:
      'النطاق الميلادي المدعوم: ١ يناير ١٩٠٠–٣١ ديسمبر ٢١٠٠. بعض الأشهر ٢٩ يومًا؛ لا تُرحّل التواريخ غير الصحيحة إلى الشهر التالي.',
    calendar: 'التقويم الهجري الشهري',
    previous: 'الشهر السابق',
    next: 'الشهر التالي',
    back: 'هذا الشهر',
    calendarYear: 'السنة الهجرية المعروضة',
    calendarMonth: 'الشهر الهجري المعروض',
    legend:
      'العدد الكبير: اليوم الهجري. الصغير: اليوم والشهر الميلاديان. تشير النقطة إلى تاريخ مهم مذكور أدناه.',
    monthDates: 'تواريخ مهمة في هذا الشهر',
    noDates: 'لا يتضمن هذا الشهر تواريخ من هذه القائمة.',
    upcoming: 'التواريخ المهمة القادمة',
    calculated: 'تواريخ نهارية محسوبة — تحقّق من الإعلانات المحلية.',
    download: 'تنزيل هذه التواريخ (.ics)',
    downloadError: 'تعذّر تنزيل التقويم. حاول مرة أخرى.',
    downloaded: 'تم إنشاء ملف التقويم. هذه تواريخ تقديرية وليست إعلانات مباشرة أو تذكيرات تلقائية.',
    weekdays: ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
    errors: {
      date: 'أدخل تاريخًا كاملًا وصحيحًا وتعديلًا بين −٢ و+٢.',
      range: 'اختر تاريخًا ضمن النطاق الميلادي المدعوم من ١٩٠٠ إلى ٢١٠٠.',
      hijri:
        'هذا التاريخ الهجري غير موجود وفق الطريقة المختارة أو خارج النطاق المدعوم. تحقّق من السنة والشهر واليوم.',
      method: 'طريقة التقويم هذه غير متاحة في متصفحك. جرّب الطريقة الأخرى أو متصفحًا محدّثًا.',
      zone: 'أدخل منطقة زمنية صحيحة، مثل Asia/Riyadh أو Europe/London.',
    },
  },
}
const inputClass =
  'mt-2 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 py-3 text-base text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white'
const buttonClass =
  'rounded-xl bg-emerald-800 px-4 py-3 font-semibold text-white hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:opacity-40'
const secondary =
  'rounded-xl border border-gray-300 px-4 py-3 font-medium hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800'
const panel =
  'rounded-2xl border border-gray-200 bg-white p-5 sm:p-7 dark:border-gray-800 dark:bg-gray-900/40'
const STORAGE_KEY = 'islamful_calendar_v1'

export default function IslamicCalendar({
  lang = 'en',
  initialNow,
  initialSnapshot,
}: {
  lang?: 'en' | 'ar' | 'fr' | 'de'
  initialNow: string
  initialSnapshot: ReturnType<typeof calendarSnapshot>
}) {
  const c = copy[lang]
  const [now, setNow] = useState(initialNow)
  const [settings, setSettings] = useState<CalendarSettings>(DEFAULT_CALENDAR)
  const [timeZone, setTimeZone] = useState('UTC')
  const [zoneInput, setZoneInput] = useState('UTC')
  const [ready, setReady] = useState(false)
  const [storageError, setStorageError] = useState(false)
  const [zoneError, setZoneError] = useState('')
  const [direction, setDirection] = useState('gh')
  const [gInput, setGInput] = useState(initialNow.slice(0, 10))
  const gEdited = useRef(false)
  const [hInput, setHInput] = useState({ year: '', month: '1', day: '' })
  const [result, setResult] = useState<{ iso: string; hijri: HijriDate } | null>(null)
  const [error, setError] = useState('')
  const [month, setMonth] = useState<{ year: number; month: number } | null>(null)
  const [downloadStatus, setDownloadStatus] = useState('')
  const today = dateInTimeZone(now, timeZone)
  const methodName = settings.method === 'islamic-umalqura' ? c.umm : c.civil
  const message = (e: unknown) => c.errors[e instanceof CalendarError ? e.code : 'method']

  useEffect(() => {
    let zone = 'UTC'
    try {
      zone = normalizeTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
    } catch {
      /* UTC remains explicit. */
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        const candidate = { method: data.method, adjustment: data.adjustment }
        gregorianToHijri(initialNow.slice(0, 10), candidate)
        zone = normalizeTimeZone(data.timeZone)
        setSettings(candidate)
      }
    } catch {
      setStorageError(true)
    }
    setTimeZone(zone)
    setZoneInput(zone)
    setReady(true)
  }, [initialNow])
  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...settings, timeZone }))
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }, [settings, timeZone, ready])
  useEffect(() => {
    const update = () => setNow(new Date().toISOString())
    update()
    const timer = window.setInterval(update, 30000)
    window.addEventListener('focus', update)
    document.addEventListener('visibilitychange', update)
    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', update)
      document.removeEventListener('visibilitychange', update)
    }
  }, [])
  useEffect(() => {
    if (!gEdited.current) {
      setGInput(today)
      setResult(null)
    }
  }, [today])

  const snapshot = useMemo(() => {
    // Keep first hydration identical to server HTML even with different browser calendar support.
    if (!ready) return { ...initialSnapshot, ok: true as const, error: null }
    try {
      return { ...calendarSnapshot(today, settings, month), ok: true as const, error: null }
    } catch (e) {
      return { ok: false as const, error: e }
    }
  }, [today, settings, month, ready, initialSnapshot])

  const data = snapshot.ok ? snapshot : null
  const n = (value: number) =>
    new Intl.NumberFormat(lang === 'ar' ? 'ar' : 'en', {
      useGrouping: false,
      numberingSystem: lang === 'ar' ? 'arab' : 'latn',
    }).format(value)
  function changeSettings(next: CalendarSettings) {
    setSettings(next)
    setResult(null)
    setError('')
    setMonth(null)
    setDownloadStatus('')
  }
  function applyZone(zone: string) {
    try {
      const valid = normalizeTimeZone(zone.trim())
      setTimeZone(valid)
      setZoneInput(valid)
      setZoneError('')
      setDownloadStatus('')
    } catch (e) {
      setZoneError(message(e))
    }
  }
  function convert(event: FormEvent) {
    event.preventDefault()
    setResult(null)
    setError('')
    try {
      if (direction === 'gh') setResult({ iso: gInput, hijri: gregorianToHijri(gInput, settings) })
      else {
        const h = parseHijriInput(hInput)
        setResult({ iso: hijriToGregorian(h, settings), hijri: h })
      }
    } catch (e) {
      setError(message(e))
    }
  }
  function selectYear(year: number) {
    if (!data) return
    const low = year === data.min.year ? data.min.month : 1
    const high = year === data.max.year ? data.max.month : 12
    setMonth({ year, month: Math.min(high, Math.max(low, data.selected.month)) })
  }
  function download() {
    if (!data) return
    try {
      const blob = new Blob([calendarDownload(data.upcoming, settings, lang, now)], {
        type: 'text/calendar;charset=utf-8',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `islamful-key-dates-${today}-${lang}.ics`
      a.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setDownloadStatus(c.downloaded)
    } catch {
      setDownloadStatus(c.downloadError)
    }
  }
  const monthEvents = data
    ? data.days.flatMap((day) =>
        day.inRange
          ? KEY_DATES.filter((e) => e.month === day.hijri.month && e.day === day.hijri.day).map(
              (e) => ({ ...e, iso: day.iso })
            )
          : []
      )
    : []
  const blankCount = data?.days[0].weekday || 0
  const cells = data ? [...Array(blankCount).fill(null), ...data.days] : []
  while (cells.length % 7) cells.push(null)

  return (
    <div
      className="space-y-8"
      lang={lang}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      data-testid="islamic-calendar"
    >
      <section
        className="rounded-2xl bg-emerald-950 p-6 text-white sm:p-9"
        aria-labelledby="calendar-today-heading"
      >
        <h2 id="calendar-today-heading" className="text-lg font-semibold">
          {c.today}
        </h2>
        <p className="mt-2 text-sm text-emerald-100">
          <time dateTime={today}>{formatGregorian(today, lang)}</time> ·{' '}
          <span dir="ltr">{timeZone}</span>
        </p>
        {data ? (
          <>
            <p className="mt-6 text-sm text-emerald-100">{c.daytime}</p>
            <p className="mt-2 text-3xl font-bold sm:text-4xl" data-testid="hijri-today">
              {formatHijri(data.h, lang)}
            </p>
            {data.tonight && (
              <p className="mt-5 text-sm leading-relaxed">
                {c.tonight}: <strong>{formatHijri(data.tonight, lang)}</strong>
              </p>
            )}
          </>
        ) : (
          <p className="mt-4" role="alert">
            {message(snapshot.error)}
          </p>
        )}
        <p className="mt-5 text-sm text-emerald-100">
          {methodName} · {c.adjustment}:{' '}
          <span dir="ltr">
            {settings.adjustment > 0 ? '+' : ''}
            {settings.adjustment}
          </span>
        </p>
      </section>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{c.disclaimer}</p>

      <details className={panel}>
        <summary className="cursor-pointer text-lg font-bold">{c.settings}</summary>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            {c.method}
            <select
              aria-label={c.method}
              value={settings.method}
              onChange={(e) =>
                changeSettings({ ...settings, method: e.target.value as CalendarMethod })
              }
              className={inputClass}
            >
              <option value="islamic-umalqura">{c.umm}</option>
              <option value="islamic-civil">{c.civil}</option>
            </select>
          </label>
          <label className="text-sm font-medium">
            {c.adjustment}
            <select
              aria-label={c.adjustment}
              value={settings.adjustment}
              onChange={(e) => changeSettings({ ...settings, adjustment: Number(e.target.value) })}
              className={inputClass}
            >
              {[-2, -1, 0, 1, 2].map((a) => (
                <option key={a} value={a}>
                  {a === 0 ? c.zero : `${a > 0 ? '+' : ''}${a}`}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{c.adjusted}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            applyZone(zoneInput)
          }}
          className="mt-5"
        >
          <label className="block text-sm font-medium">
            {c.zone}
            <input
              value={zoneInput}
              onChange={(e) => setZoneInput(e.target.value)}
              className={inputClass}
              dir="ltr"
              list="calendar-timezones"
            />
          </label>
          <datalist id="calendar-timezones">
            {[
              'UTC',
              'Asia/Riyadh',
              'Asia/Dubai',
              'Asia/Karachi',
              'Asia/Dhaka',
              'Asia/Jakarta',
              'Asia/Kuala_Lumpur',
              'Europe/London',
              'Europe/Paris',
              'America/New_York',
              'America/Los_Angeles',
              'Australia/Sydney',
            ].map((z) => (
              <option key={z} value={z} />
            ))}
          </datalist>
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="submit" className={buttonClass}>
              {c.apply}
            </button>
            <button
              type="button"
              className={secondary}
              onClick={() => applyZone(Intl.DateTimeFormat().resolvedOptions().timeZone)}
            >
              {c.device}
            </button>
          </div>
        </form>
        {zoneError && (
          <p role="alert" className="mt-3 text-red-700 dark:text-red-300">
            {zoneError}
          </p>
        )}
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{c.zoneNote}</p>
        {ready && (
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300" role="status">
            {storageError ? c.unsaved : c.saved}
          </p>
        )}
      </details>

      <section className={panel} aria-labelledby="calendar-converter-heading">
        <h2 id="calendar-converter-heading" className="text-xl font-bold">
          {c.converter}
        </h2>
        <form onSubmit={convert} noValidate className="mt-5 space-y-4">
          <label className="block text-sm font-medium">
            {c.direction}
            <select
              className={inputClass}
              aria-label={c.direction}
              value={direction}
              onChange={(e) => {
                setDirection(e.target.value)
                setResult(null)
                setError('')
              }}
            >
              <option value="gh">{c.gh}</option>
              <option value="hg">{c.hg}</option>
            </select>
          </label>
          {direction === 'gh' ? (
            <label className="block text-sm font-medium">
              {c.gregorian}
              <input
                className={inputClass}
                type="date"
                min={MIN_DATE}
                max={MAX_DATE}
                value={gInput}
                onChange={(e) => {
                  gEdited.current = true
                  setGInput(e.target.value)
                  setResult(null)
                  setError('')
                }}
              />
            </label>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <label className="text-sm font-medium">
                  {c.year}
                  <input
                    type="text"
                    inputMode="numeric"
                    className={inputClass}
                    value={hInput.year}
                    onChange={(e) => {
                      setHInput({ ...hInput, year: e.target.value })
                      setResult(null)
                      setError('')
                    }}
                  />
                </label>
                <label className="text-sm font-medium">
                  {c.month}
                  <select
                    className={inputClass}
                    aria-label={c.month}
                    value={hInput.month}
                    onChange={(e) => {
                      setHInput({ ...hInput, month: e.target.value })
                      setResult(null)
                      setError('')
                    }}
                  >
                    {HIJRI_MONTHS[lang].map((m, i) => (
                      <option key={m} value={i + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium">
                  {c.day}
                  <input
                    type="text"
                    inputMode="numeric"
                    min="1"
                    max="30"
                    className={inputClass}
                    value={hInput.day}
                    onChange={(e) => {
                      setHInput({ ...hInput, day: e.target.value })
                      setResult(null)
                      setError('')
                    }}
                  />
                </label>
              </div>
              {data && (
                <button
                  type="button"
                  className="text-sm underline"
                  onClick={() => {
                    setHInput({
                      year: String(data.h.year),
                      month: String(data.h.month),
                      day: String(data.h.day),
                    })
                    setResult(null)
                    setError('')
                  }}
                >
                  {c.currentH}
                </button>
              )}
            </>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-300">{c.range}</p>
          <button className={buttonClass} type="submit">
            {c.convert}
          </button>
        </form>
        {error && (
          <p role="alert" className="mt-4 text-red-700 dark:text-red-300">
            {error}
          </p>
        )}
        {result && (
          <div
            className="mt-5 rounded-xl bg-emerald-50 p-5 dark:bg-emerald-950/40"
            role="status"
            data-testid="calendar-result"
          >
            <h3 className="font-semibold">{c.result}</h3>
            <p className="mt-3 text-xl font-bold">{formatHijri(result.hijri, lang)}</p>
            <p className="mt-2">
              <time dateTime={result.iso}>{formatGregorian(result.iso, lang)}</time>
            </p>
            <p className="mt-3 text-sm">
              {c.begins} {formatGregorian(isoDay(parseGregorian(result.iso) - DAY_MS), lang)}.
            </p>
            <p className="mt-3 text-xs">
              {methodName} · {c.adjustment}: {settings.adjustment}
            </p>
          </div>
        )}
      </section>

      {data && (
        <>
          <section className={panel} aria-labelledby="calendar-month-heading">
            <h2 id="calendar-month-heading" className="text-xl font-bold">
              {c.calendar}
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <label className="text-sm font-medium">
                {c.calendarYear}
                <select
                  className={inputClass}
                  aria-label={c.calendarYear}
                  value={data.selected.year}
                  onChange={(e) => selectYear(Number(e.target.value))}
                >
                  {Array.from(
                    { length: data.max.year - data.min.year + 1 },
                    (_, i) => data.min.year + i
                  ).map((y) => (
                    <option key={y} value={y}>
                      {n(y)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium">
                {c.calendarMonth}
                <select
                  className={inputClass}
                  aria-label={c.calendarMonth}
                  value={data.selected.month}
                  onChange={(e) => setMonth({ ...data.selected, month: Number(e.target.value) })}
                >
                  {HIJRI_MONTHS[lang].map((m, i) => (
                    <option
                      key={m}
                      value={i + 1}
                      disabled={
                        (data.selected.year === data.min.year && i + 1 < data.min.month) ||
                        (data.selected.year === data.max.year && i + 1 > data.max.month)
                      }
                    >
                      {m}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className={secondary}
                disabled={
                  data.selected.year === data.min.year && data.selected.month === data.min.month
                }
                onClick={() =>
                  setMonth(moveHijriMonth(data.selected.year, data.selected.month, -1))
                }
              >
                {c.previous}
              </button>
              <button type="button" className={secondary} onClick={() => setMonth(null)}>
                {c.back}
              </button>
              <button
                type="button"
                className={secondary}
                disabled={
                  data.selected.year === data.max.year && data.selected.month === data.max.month
                }
                onClick={() => setMonth(moveHijriMonth(data.selected.year, data.selected.month, 1))}
              >
                {c.next}
              </button>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
              {c.legend}
            </p>
            <table
              className="mt-5 w-full table-fixed border-collapse text-center"
              data-testid="hijri-month-grid"
            >
              <caption className="pb-4 font-semibold">
                {HIJRI_MONTHS[lang][data.selected.month - 1]} {n(data.selected.year)}{' '}
                {lang === 'ar' ? 'هـ' : 'AH'}
              </caption>
              <thead>
                <tr>
                  {c.weekdays.map((day) => (
                    <th key={day} scope="col" className="py-2 text-[10px] font-medium sm:text-sm">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: cells.length / 7 }, (_, row) => (
                  <tr key={row}>
                    {cells.slice(row * 7, row * 7 + 7).map((day, col) => {
                      const events = day
                        ? KEY_DATES.filter(
                            (e) => e.month === day.hijri.month && e.day === day.hijri.day
                          )
                        : []
                      return (
                        <td
                          key={col}
                          aria-current={day?.iso === today ? 'date' : undefined}
                          data-date={day?.iso}
                          className={`h-20 border border-gray-200 px-0.5 py-2 align-top dark:border-gray-700 ${day?.iso === today ? 'bg-emerald-100 dark:bg-emerald-950' : ''} ${day && !day.inRange ? 'opacity-35' : ''}`}
                        >
                          {day && (
                            <>
                              <span className="block text-lg font-semibold">
                                {n(day.hijri.day)}
                              </span>
                              <time
                                dateTime={day.iso}
                                className="block text-[10px] text-gray-600 sm:text-xs dark:text-gray-300"
                              >
                                {n(Number(day.iso.slice(8)))}/{n(Number(day.iso.slice(5, 7)))}
                              </time>
                              {events.length > 0 && (
                                <span
                                  className="block text-emerald-700 dark:text-emerald-300"
                                  aria-label={events.map((e) => e[lang]).join(' · ')}
                                >
                                  •
                                </span>
                              )}
                            </>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="mt-6 font-semibold">{c.monthDates}</h3>
            {monthEvents.length ? (
              <ul className="mt-3 space-y-3">
                {monthEvents.map((event) => (
                  <li key={event.id}>
                    <strong>{event[lang]}</strong>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {formatGregorian(event.iso, lang)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{c.noDates}</p>
            )}
          </section>
          <section className={panel} aria-labelledby="calendar-upcoming-heading">
            <h2 id="calendar-upcoming-heading" className="text-xl font-bold">
              {c.upcoming}
            </h2>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{c.calculated}</p>
            <ul className="mt-5 divide-y divide-gray-200 dark:divide-gray-700">
              {data.upcoming.map((event) => (
                <li key={`${event.id}-${event.year}`} className="py-4">
                  <h3 className="font-semibold">{event[lang]}</h3>
                  <p className="mt-1 text-sm">
                    {formatHijri({ year: event.year, month: event.month, day: event.day }, lang)}
                  </p>
                  <time
                    dateTime={event.iso}
                    className="mt-1 block text-sm text-gray-600 dark:text-gray-300"
                  >
                    {formatGregorian(event.iso, lang)}
                  </time>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={`${buttonClass} mt-5`}
              onClick={download}
              disabled={!data.upcoming.length}
            >
              {c.download}
            </button>
            <p role="status" className="mt-3 text-sm">
              {downloadStatus}
            </p>
          </section>
        </>
      )}
    </div>
  )
}
