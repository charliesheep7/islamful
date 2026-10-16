'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import cities from '@/data/cities'
import { PRAYER_METHODS, ARABIC_PRAYER_METHODS } from '@/data/prayer-methods'
import { parseHijriInput, type CalendarMethod } from '@/data/islamic-calendar'
import { TODAY_KEY, todayChoice } from '@/utils/today'
import { localDateISO } from '@/utils/prayer-schedule'
import {
  dateRange,
  ramadanDates,
  ramadanProgress,
  fetchFastingTable,
  manualFasting,
  fastingPhase,
  fastingClock,
  fastingCsv,
  type FastingTable,
} from '@/utils/fasting'
const KEY = 'islamful.fasting.settings.v1'
const field =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white'
export default function FastingPlanner({
  lang,
  ramadan,
  initialCity = '',
  initialToday,
  initialYear,
  initialDates,
  initialTable,
}: {
  lang: 'en' | 'ar'
  ramadan: boolean
  initialCity?: string
  initialToday: string
  initialYear: number
  initialDates: string[]
  initialTable: FastingTable | null
}) {
  const ar = lang === 'ar',
    t = (en: string, arabic: string) => (ar ? arabic : en)
  const initial = cities.find((c) => c.slug === initialCity)
  const [citySlug, setCity] = useState(initialCity),
    [method, setMethod] = useState(String(initial?.method || 15)),
    [mode, setMode] = useState('city')
  const [date, setDate] = useState(initialToday),
    [zone, setZone] = useState(initial?.timezone || 'UTC'),
    [fajr, setFajr] = useState(''),
    [maghrib, setMaghrib] = useState('')
  const [year, setYear] = useState(String(initialYear)),
    [basis, setBasis] = useState('calculated'),
    [calendarMethod, setCalendarMethod] = useState<CalendarMethod>('islamic-umalqura'),
    [adjustment, setAdjustment] = useState(0),
    [start, setStart] = useState(initialDates[0]),
    [length, setLength] = useState(String(initialDates.length))
  const [table, setTable] = useState(initialTable),
    [displayBasis, setDisplayBasis] = useState(
      ramadan
        ? `${t('Estimated Ramadan', 'رمضان تقديري')} ${initialYear} · ${t('Umm al-Qura · adjustment 0', 'أم القرى · التعديل 0')}`
        : t('Selected date', 'التاريخ المختار')
    ),
    [displayLabel, setDisplayLabel] = useState(initial ? (ar ? initial.nameAr : initial.name) : '')
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(false),
    [storage, setStorage] = useState(true),
    [now, setNow] = useState<number | null>(null),
    [edited, setEdited] = useState(false)
  const request = useRef<AbortController | null>(null),
    generation = useRef(0)
  const city = cities.find((c) => c.slug === citySlug),
    methods = ar ? ARABIC_PRAYER_METHODS : PRAYER_METHODS
  const ramadanSelection = useMemo(() => {
    if (!ramadan) return null
    try {
      if (basis === 'local') {
        if (!['29', '30'].includes(length)) return null
        return { dates: dateRange(start, Number(length)), year: null }
      }
      const selectedYear = parseHijriInput({ year, month: '9', day: '1' }).year
      return {
        dates: ramadanDates(selectedYear, { method: calendarMethod, adjustment }),
        year: selectedYear,
      }
    } catch {
      return null
    }
  }, [ramadan, basis, start, length, year, calendarMethod, adjustment])
  const previewZone = city?.timezone || 'UTC'
  const previewToday = now === null ? initialToday : localDateISO(previewZone, new Date(now))
  const progress = ramadanSelection ? ramadanProgress(ramadanSelection.dates, previewToday) : null
  const ramadanBasis =
    basis === 'local'
      ? t('Your entered dates — confirm locally', 'تواريخ أدخلتها — تحقّق منها محليًا')
      : `${t('Estimated Ramadan', 'رمضان تقديري')} ${ramadanSelection?.year ?? ''} · ${calendarMethod === 'islamic-civil' ? t('Tabular Hijri', 'هجري حسابي') : t('Umm al-Qura', 'أم القرى')} · ${t('adjustment', 'التعديل')} ${adjustment}`
  useEffect(() => {
    if (!initialCity) {
      try {
        const saved =
          todayChoice(localStorage.getItem(KEY)) || todayChoice(localStorage.getItem(TODAY_KEY))
        const found = cities.find((c) => c.slug === saved?.city)
        if (found && saved) {
          setCity(found.slug)
          setMethod(saved.method)
          setZone(found.timezone)
          setDate(localDateISO(found.timezone))
        }
      } catch {
        setStorage(false)
      }
    }
    const tick = () => setNow(Date.now())
    tick()
    const timer = setInterval(tick, 1000)
    return () => {
      clearInterval(timer)
      request.current?.abort()
    }
  }, [initialCity])
  function invalidate() {
    generation.current++
    request.current?.abort()
    request.current = null
    setTable(null)
    setBusy(false)
    setError(false)
    setEdited(true)
  }
  function changeCity(value: string) {
    invalidate()
    setCity(value)
    const c = cities.find((c) => c.slug === value)
    if (c) {
      setMethod(String(c.method))
      setZone(c.timezone)
      setDate(localDateISO(c.timezone))
    }
  }
  async function calculate(event: React.FormEvent) {
    event.preventDefault()
    invalidate()
    const version = generation.current
    const controller = new AbortController()
    request.current = controller
    setBusy(true)
    const timeout = setTimeout(() => controller.abort(), 20000)
    try {
      let dates = [date],
        label = '',
        description = t('Selected date', 'التاريخ المختار'),
        result: FastingTable
      if (ramadan) {
        if (!ramadanSelection) throw new Error('Invalid Ramadan dates')
        dates = ramadanSelection.dates
        description =
          basis === 'local'
            ? t(
                'Locally entered Ramadan dates — confirm the final day',
                'تواريخ رمضان المدخلة محليًا — تحقّق من اليوم الأخير'
              )
            : ramadanBasis
      }
      if (mode === 'manual' && !ramadan) {
        const row = manualFasting(date, fajr, maghrib, zone)
        result = {
          rows: [row],
          timezone: zone,
          method: 'manual',
          city: 'manual',
          preparedAt: new Date().toISOString(),
          missingMonths: [],
        }
        label = t('Your local timetable', 'جدولك المحلي')
        description = t('Manually entered times', 'مواقيت مدخلة يدويًا')
      } else {
        if (!city) throw new Error('Choose city')
        result = await fetchFastingTable(city, method, dates, { signal: controller.signal })
        label = ar ? city.nameAr : city.name
      }
      if (version !== generation.current || controller.signal.aborted) return
      setTable(result)
      setDisplayLabel(label)
      setDisplayBasis(description)
      setEdited(false)
      if (city && mode === 'city')
        try {
          localStorage.setItem(KEY, JSON.stringify({ version: 1, city: city.slug, method }))
          setStorage(true)
        } catch {
          setStorage(false)
        }
    } catch {
      if (version === generation.current) setError(true)
    } finally {
      clearTimeout(timeout)
      if (version === generation.current) {
        setBusy(false)
        request.current = null
      }
    }
  }
  const today = table && now !== null ? localDateISO(table.timezone, new Date(now)) : null
  const todayRow = table?.rows.find((r) => r.date === today),
    phase = todayRow && now !== null ? fastingPhase(todayRow, table!.timezone, now) : null
  const timeLeft = phase ? Math.max(0, Math.floor(phase.remaining / 1000)) : 0
  const clock = [Math.floor(timeLeft / 3600), Math.floor(timeLeft / 60) % 60, timeLeft % 60]
    .map((v) => String(v).padStart(2, '0'))
    .join(':')
  function download() {
    if (!table) return
    const url = URL.createObjectURL(
      new Blob([fastingCsv(table, displayLabel, displayBasis, lang)], {
        type: 'text/csv;charset=utf-8',
      })
    )
    const a = document.createElement('a')
    a.href = url
    a.download = `islamful-${ramadan ? 'ramadan' : 'fasting'}-${table.city}-${table.rows[0].date}.csv`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <div className="space-y-6">
      {ramadan && (
        <section
          data-testid="ramadan-progress"
          data-state={progress?.kind || 'invalid'}
          data-version="ramadan-progress-v1"
          className="rounded-2xl bg-emerald-950 p-6 text-white sm:p-8"
          aria-live="polite"
          aria-atomic="true"
        >
          {progress ? (
            <>
              <p className="text-sm text-emerald-100">{ramadanBasis}</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                {progress.kind === 'before'
                  ? t(
                      `${progress.daysUntil} ${progress.daysUntil === 1 ? 'day' : 'days'} until the first fast`,
                      `الأيام حتى أول يوم صيام: ${progress.daysUntil.toLocaleString('ar', { numberingSystem: 'arab' })}`
                    )
                  : progress.kind === 'during'
                    ? t(
                        `Fasting day ${progress.day} of ${progress.total}`,
                        `يوم الصيام ${progress.day.toLocaleString('ar', { numberingSystem: 'arab' })} من ${progress.total.toLocaleString('ar', { numberingSystem: 'arab' })}`
                      )
                    : t('The selected Ramadan dates have passed', 'انتهت تواريخ رمضان المختارة')}
              </h2>
              <p className="mt-3 text-sm text-emerald-100">
                {city
                  ? ar
                    ? city.nameAr
                    : city.name
                  : t('Choose your city below', 'اختر مدينتك أدناه')}{' '}
                · <bdi>{previewZone}</bdi> · {t('As of', 'بتاريخ')} <bdi>{progress.today}</bdi>
              </p>
              <dl className="mt-6 grid gap-4 border-t border-white/20 pt-5 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-emerald-100">
                    {t('First fasting day', 'أول يوم صيام')}
                  </dt>
                  <dd className="mt-1 font-semibold">
                    <bdi>{progress.start}</bdi>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-emerald-100">
                    {t('Planned final fasting day', 'آخر يوم صيام حسب الخطة')}
                  </dt>
                  <dd className="mt-1 font-semibold">
                    <bdi>{progress.end}</bdi>
                  </dd>
                </div>
              </dl>
              <p className="mt-5 text-sm text-emerald-100">
                {t(
                  'Day numbers follow the fasting dates in your selected city. Confirm the first and final days locally.',
                  'تتبع أرقام الأيام تواريخ الصيام في مدينتك المختارة. تحقّق من أول يوم وآخر يوم محليًا.'
                )}
              </p>
            </>
          ) : (
            <p>
              {t(
                'Enter a valid year or local start date below to see the countdown.',
                'أدخل سنة صحيحة أو تاريخ بداية محليًا صحيحًا أدناه لعرض العد التنازلي.'
              )}
            </p>
          )}
        </section>
      )}
      <form
        onSubmit={calculate}
        className="space-y-5 rounded-2xl border border-gray-200 p-5 sm:p-7 dark:border-gray-700 print:hidden"
        aria-busy={busy}
      >
        {!ramadan && (
          <label className="block">
            {t('Timetable source', 'مصدر المواقيت')}
            <select
              className={field}
              aria-label={t('Timetable source', 'مصدر المواقيت')}
              value={mode}
              onChange={(e) => {
                invalidate()
                setMode(e.target.value)
              }}
            >
              <option value="city">{t('Calculated city timetable', 'جدول المدينة المحسوب')}</option>
              <option value="manual">{t('Enter my local timetable', 'إدخال جدولي المحلي')}</option>
            </select>
          </label>
        )}
        {mode === 'city' || ramadan ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              {t('City', 'المدينة')}
              <select
                className={field}
                aria-label={t('City', 'المدينة')}
                value={citySlug}
                onChange={(e) => changeCity(e.target.value)}
                required
              >
                <option value="">{t('Choose a city', 'اختر مدينة')}</option>
                {cities.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {ar ? `${c.nameAr}، ${c.countryAr}` : `${c.name}, ${c.country}`}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t('Prayer calculation method', 'طريقة حساب الصلاة')}
              <select
                aria-label={t('Prayer calculation method', 'طريقة حساب الصلاة')}
                className={field}
                value={method}
                onChange={(e) => {
                  invalidate()
                  setMethod(e.target.value)
                }}
              >
                {Object.entries(methods).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <label>
              {t('Timezone (IANA)', 'المنطقة الزمنية (IANA)')}
              <input
                className={field}
                value={zone}
                onChange={(e) => {
                  invalidate()
                  setZone(e.target.value)
                }}
                required
                placeholder="Europe/London"
              />
            </label>
            <label>
              {t('Fajr (24-hour)', 'الفجر (24 ساعة)')}
              <input
                className={field}
                type="time"
                value={fajr}
                onChange={(e) => {
                  invalidate()
                  setFajr(e.target.value)
                }}
                required
              />
            </label>
            <label>
              {t('Maghrib (24-hour)', 'المغرب (24 ساعة)')}
              <input
                className={field}
                type="time"
                value={maghrib}
                onChange={(e) => {
                  invalidate()
                  setMaghrib(e.target.value)
                }}
                required
              />
            </label>
          </div>
        )}
        {!ramadan ? (
          <div className="flex flex-wrap items-end gap-3">
            <label className="min-w-0 flex-1">
              {t('Date', 'التاريخ')}
              <input
                className={field}
                type="date"
                min="1900-01-01"
                max="2100-12-31"
                value={date}
                onChange={(e) => {
                  invalidate()
                  setDate(e.target.value)
                }}
                required
              />
            </label>
            <button
              type="button"
              className="rounded-xl border px-4 py-3"
              onClick={() => {
                invalidate()
                try {
                  setDate(localDateISO(mode === 'city' ? city?.timezone || 'UTC' : zone))
                } catch {
                  setError(true)
                }
              }}
            >
              {t('Use today', 'استخدم تاريخ اليوم')}
            </button>
          </div>
        ) : (
          <>
            <label className="block">
              {t('Ramadan date basis', 'أساس تواريخ رمضان')}
              <select
                className={field}
                aria-label={t('Ramadan date basis', 'أساس تواريخ رمضان')}
                value={basis}
                onChange={(e) => {
                  invalidate()
                  setBasis(e.target.value)
                }}
              >
                <option value="calculated">{t('Calculated estimate', 'تقدير حسابي')}</option>
                <option value="local">
                  {t('Enter local Ramadan dates', 'إدخال تواريخ رمضان المحلية')}
                </option>
              </select>
            </label>
            {basis === 'calculated' ? (
              <div className="grid gap-4 sm:grid-cols-3">
                <label>
                  {t('Hijri year', 'السنة الهجرية')}
                  <input
                    className={field}
                    inputMode="numeric"
                    value={year}
                    onChange={(e) => {
                      invalidate()
                      setYear(e.target.value)
                    }}
                    required
                  />
                </label>
                <label>
                  {t('Calendar method', 'طريقة التقويم')}
                  <select
                    className={field}
                    aria-label={t('Calendar method', 'طريقة التقويم')}
                    value={calendarMethod}
                    onChange={(e) => {
                      invalidate()
                      setCalendarMethod(e.target.value as CalendarMethod)
                    }}
                  >
                    <option value="islamic-umalqura">{t('Umm al-Qura', 'أم القرى')}</option>
                    <option value="islamic-civil">
                      {t('Tabular Hijri', 'التقويم الهجري الحسابي')}
                    </option>
                  </select>
                </label>
                <label>
                  {t('Hijri day adjustment', 'تعديل اليوم الهجري')}
                  <select
                    className={field}
                    aria-label={t('Hijri day adjustment', 'تعديل اليوم الهجري')}
                    value={adjustment}
                    onChange={(e) => {
                      invalidate()
                      setAdjustment(Number(e.target.value))
                    }}
                  >
                    {[-2, -1, 0, 1, 2].map((v) => (
                      <option key={v} value={v}>
                        {v > 0 ? '+' : ''}
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  {t('First fasting day', 'أول يوم صيام')}
                  <input
                    type="date"
                    className={field}
                    min="1900-01-01"
                    max="2100-12-01"
                    value={start}
                    onChange={(e) => {
                      invalidate()
                      setStart(e.target.value)
                    }}
                    required
                  />
                </label>
                <label>
                  {t('Number of days', 'عدد الأيام')}
                  <select
                    className={field}
                    aria-label={t('Number of days', 'عدد الأيام')}
                    value={length}
                    onChange={(e) => {
                      invalidate()
                      setLength(e.target.value)
                    }}
                  >
                    <option value="29">29</option>
                    <option value="30">30</option>
                  </select>
                </label>
              </div>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t(
                'Calculated dates are planning estimates. Follow your local Ramadan/Eid announcement, including whether there is a 30th fasting day.',
                'التواريخ المحسوبة تقديرات للتخطيط. اتبع الإعلان المحلي لرمضان والعيد، بما فيه ثبوت اليوم الثلاثين للصيام.'
              )}
            </p>
          </>
        )}
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-emerald-800 px-5 py-3 font-semibold text-white disabled:opacity-60"
        >
          {busy ? t('Loading timetable…', 'جارٍ تحميل الجدول…') : t('Show timetable', 'عرض الجدول')}
        </button>
        <p className="text-xs text-gray-600 dark:text-gray-300">
          {t(
            'Your city and method are saved on this browser after a successful calculation. No location detection or fasting record.',
            'تُحفظ المدينة وطريقة الصلاة في هذا المتصفح بعد حساب ناجح. لا نحدد موقعك ولا نسجل صيامك.'
          )}
        </p>
        {!storage && (
          <p role="status" className="text-sm">
            {t(
              'Browser storage is unavailable; the timetable still works.',
              'تخزين المتصفح غير متاح؛ يظل الجدول قابلًا للاستخدام.'
            )}
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-red-700 dark:text-red-300">
            {t(
              'Could not create this timetable. Check the city, dates and times, then try again. Use your local mosque timetable if the service is unavailable or a local time is ambiguous.',
              'تعذر إنشاء الجدول. راجع المدينة والتواريخ والمواقيت ثم أعد المحاولة. استخدم جدول مسجدك إذا تعذرت الخدمة أو كان التوقيت المحلي ملتبسًا.'
            )}
          </p>
        )}
        <noscript>
          <p>
            {t(
              'Enable JavaScript to change the timetable. City links below open a server-rendered Ramadan schedule.',
              'فعّل JavaScript لتغيير الجدول. تفتح روابط المدن أدناه جدول رمضان المعروض من الخادم.'
            )}
          </p>
        </noscript>
      </form>
      {table ? (
        <section data-testid="fasting-result" className="space-y-4">
          <h2 className="text-2xl font-bold">{displayLabel}</h2>
          <p className="text-sm">
            {displayBasis} · <bdi>{table.timezone}</bdi>
          </p>
          <p className="text-sm">
            {t('Displayed method: ', 'الطريقة المعروضة: ')}
            {table.method === 'manual'
              ? t('Local manual times', 'مواقيت محلية يدوية')
              : methods[table.method]}
          </p>
          {phase && (
            <div
              className="rounded-xl bg-emerald-800 p-5 text-white"
              data-testid="fasting-countdown"
            >
              <p>
                {phase.kind === 'fajr'
                  ? t(
                      'Until Fajr — today’s fasting window begins',
                      'حتى الفجر — بداية وقت الصيام اليوم'
                    )
                  : phase.kind === 'maghrib'
                    ? t('Until Maghrib — today’s iftar time', 'حتى المغرب — وقت الإفطار اليوم')
                    : t(
                        'Today’s displayed Maghrib time has passed',
                        'مضى وقت المغرب المعروض لليوم'
                      )}
              </p>
              {phase.kind !== 'ended' && (
                <p dir="ltr" className="mt-2 font-mono text-3xl">
                  {clock}
                </p>
              )}
            </div>
          )}
          {!phase && (
            <p className="text-sm">
              {t(
                'Countdown is available only for today in this timezone when both times are present.',
                'يظهر العد التنازلي لليوم فقط في هذه المنطقة الزمنية عند توفر الوقتين.'
              )}
            </p>
          )}
          {table.rows.some((r) => r.fajr === null || r.maghrib === null) && (
            <p role="status" className="rounded-xl border border-amber-400 p-3 text-sm">
              {t(
                'Some times are unavailable. A dash is not a fasting time; check a trusted local timetable.',
                'بعض المواقيت غير متاحة. الشرطة ليست موعدًا للصيام؛ راجع جدولًا محليًا موثوقًا.'
              )}
            </p>
          )}
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-start text-sm">
              <caption className="p-3 text-start">
                {t(
                  'Fajr to Maghrib · 24-hour times in the displayed timezone',
                  'من الفجر إلى المغرب · بنظام 24 ساعة في المنطقة المعروضة'
                )}
              </caption>
              <thead>
                <tr>
                  {[
                    t('Date', 'التاريخ'),
                    t('Fajr / suhoor ends', 'الفجر / نهاية السحور'),
                    t('Maghrib / iftar', 'المغرب / الإفطار'),
                    t('Duration', 'المدة'),
                  ].map((h) => (
                    <th key={h} scope="col" className="p-3 text-start">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr
                    key={row.date}
                    className={`border-t border-gray-100 dark:border-gray-800 ${row.date === today ? 'bg-emerald-50 dark:bg-emerald-950' : ''}`}
                  >
                    <th scope="row" className="p-3 text-start font-normal">
                      <bdi dir="ltr">{row.date}</bdi>
                    </th>
                    <td className="p-3">
                      <bdi dir="ltr">{fastingClock(row.fajr, table.timezone)}</bdi>
                    </td>
                    <td className="p-3">
                      <bdi dir="ltr">{fastingClock(row.maghrib, table.timezone)}</bdi>
                    </td>
                    <td className="p-3">
                      <bdi dir="ltr">
                        {row.fajr !== null && row.maghrib !== null
                          ? `${Math.floor((row.maghrib - row.fajr) / 3600000)}${ar ? 'س' : 'h'} ${Math.round(((row.maghrib - row.fajr) % 3600000) / 60000)}${ar ? 'د' : 'm'}`
                          : '—'}
                      </bdi>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            {table.method === 'manual'
              ? t('Entered at', 'وقت الإدخال')
              : t('Timetable prepared at (Aladhan data)', 'وقت إعداد الجدول (بيانات الأذان)')}
            : <bdi>{table.preparedAt}</bdi>
          </p>
          <div className="flex flex-wrap gap-3 print:hidden">
            <button onClick={download} className="rounded-xl border px-4 py-3">
              {t('Download CSV', 'تنزيل CSV')}
            </button>
            <button onClick={() => window.print()} className="rounded-xl border px-4 py-3">
              {t('Print timetable', 'طباعة الجدول')}
            </button>
          </div>
        </section>
      ) : (
        !busy && (
          <p role="status">
            {edited
              ? t(
                  'Choose your settings and show the updated timetable.',
                  'اختر الإعدادات واعرض الجدول المحدث.'
                )
              : t(
                  initialCity
                    ? 'City times are temporarily unavailable. Try showing the timetable again or use a trusted local schedule.'
                    : 'Choose a city and show its timetable. Your location is not assumed.',
                  initialCity
                    ? 'مواقيت المدينة غير متاحة مؤقتًا. حاول عرض الجدول مجددًا أو استخدم جدولًا محليًا موثوقًا.'
                    : 'اختر مدينة واعرض جدولها. لا نفترض موقعك.'
                )}
          </p>
        )
      )}
      {ramadan && !table && !edited && (
        <details className="rounded-xl border p-4">
          <summary className="cursor-pointer font-semibold">
            {t('Estimated Ramadan dates (Umm al-Qura)', 'تواريخ رمضان التقديرية (أم القرى)')}{' '}
            {initialYear}
          </summary>
          <ol className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {initialDates.map((d, i) => (
              <li key={d}>
                <bdi dir="ltr">
                  {i + 1} · {d}
                </bdi>
              </li>
            ))}
          </ol>
        </details>
      )}
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {t(
          'A timetable does not determine whether you should fast. Follow qualified guidance for your circumstances and the locally observed days.',
          'الجدول لا يحدد وجوب الصيام عليك أو ملاءمته لحالتك. اتبع التوجيه المؤهل لحالتك والأيام المعتمدة محليًا.'
        )}{' '}
        <Link className="underline" href={`${ar ? '/ar' : ''}/prayer-times`}>
          {t('Full prayer times', 'مواقيت الصلاة كاملة')}
        </Link>
      </p>
    </div>
  )
}
