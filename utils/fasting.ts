import type { City } from '@/data/cities'
import {
  DAY_MS,
  DEFAULT_CALENDAR,
  gregorianToHijri,
  hijriMonthDays,
  isoDay,
  parseGregorian,
  type CalendarSettings,
} from '@/data/islamic-calendar'
import { localDateISO } from './prayer-schedule'
import { zonedTime } from './night-times'
import { PRAYER_METHODS } from '@/data/prayer-methods'

export type FastingRow = { date: string; fajr: number | null; maghrib: number | null }
export type FastingTable = {
  rows: FastingRow[]
  timezone: string
  method: string
  city: string
  preparedAt: string
  missingMonths: string[]
}
export function dateRange(start: string, length: number) {
  const first = parseGregorian(start)
  if (!Number.isInteger(length) || length < 1 || length > 31) throw new Error('Invalid range')
  return Array.from({ length }, (_, i) => {
    const iso = isoDay(first + i * DAY_MS)
    parseGregorian(iso)
    return iso
  })
}
export function ramadanDates(year: number, settings: CalendarSettings = DEFAULT_CALENDAR) {
  return hijriMonthDays(year, 9, settings).map((day) => {
    if (!day.inRange) throw new Error('Out of range')
    return day.iso
  })
}
export function nextRamadanYear(today: string) {
  const h = gregorianToHijri(today)
  return h.year + (h.month > 9 ? 1 : 0)
}
export function ramadanProgress(dates: string[], today: string) {
  if (![29, 30].includes(dates.length)) throw new Error('Invalid Ramadan length')
  const expected = dateRange(dates[0], dates.length)
  if (dates.some((date, i) => date !== expected[i])) throw new Error('Invalid Ramadan dates')
  const offset = (parseGregorian(today) - parseGregorian(dates[0])) / DAY_MS
  const common = { start: dates[0], end: dates.at(-1)!, total: dates.length, today }
  if (offset < 0) return { ...common, kind: 'before' as const, daysUntil: -offset }
  if (offset < dates.length) return { ...common, kind: 'during' as const, day: offset + 1 }
  return { ...common, kind: 'after' as const }
}
const timePattern = /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:00(?:Z|[+-]\d{2}:\d{2})$/
function validTime(raw: unknown, date: string, zone: string) {
  if (typeof raw !== 'string' || !timePattern.test(raw) || raw.slice(0, 10) !== date) return null
  const value = Date.parse(raw)
  if (!Number.isFinite(value) || localDateISO(zone, new Date(value)) !== date) return null
  const clock = new Intl.DateTimeFormat('en-GB', {
    timeZone: zone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(value)
  return clock === raw.slice(11, 16) ? value : null
}
export function parseFastingMonth(
  payload: unknown,
  month: string,
  timezone: string,
  method: string
): Map<string, FastingRow> {
  const p = payload as {
    code?: number
    data?: Array<{
      date?: { gregorian?: { date?: string } }
      meta?: { timezone?: string; method?: { id?: number } }
      timings?: Record<string, unknown>
    }>
  }
  if (p?.code !== 200 || !Array.isArray(p.data)) throw new Error('Invalid calendar')
  const rows = new Map<string, FastingRow>()
  for (const day of p.data) {
    const raw = day.date?.gregorian?.date
    if (typeof raw !== 'string' || !/^\d{2}-\d{2}-\d{4}$/.test(raw)) throw new Error('Invalid date')
    const [d, m, y] = raw.split('-'),
      date = `${y}-${m}-${d}`
    parseGregorian(date)
    if (
      date.slice(0, 7) !== month ||
      rows.has(date) ||
      day.meta?.timezone !== timezone ||
      day.meta?.method?.id !== Number(method)
    )
      throw new Error('Mismatched calendar')
    let fajr = validTime(day.timings?.Fajr, date, timezone),
      maghrib = validTime(day.timings?.Maghrib, date, timezone)
    if (fajr !== null && maghrib !== null && maghrib <= fajr) {
      fajr = null
      maghrib = null
    }
    rows.set(date, { date, fajr, maghrib })
  }
  return rows
}
export async function fetchFastingTable(
  city: City,
  method: string,
  dates: string[],
  options: RequestInit & { next?: { revalidate: number } } = {}
): Promise<FastingTable> {
  if (
    !Object.hasOwn(PRAYER_METHODS, method) ||
    !dates.length ||
    dates.length > 31 ||
    new Set(dates).size !== dates.length
  )
    throw new Error('Invalid timetable request')
  dates.forEach(parseGregorian)
  const months = [...new Set(dates.map((d) => d.slice(0, 7)))]
  if (months.length > 2) throw new Error('Range must span at most two months')
  const responses = await Promise.allSettled(
    months.map(async (month) => {
      const [year, m] = month.split('-')
      const query = new URLSearchParams({
        latitude: String(city.lat),
        longitude: String(city.lng),
        method,
        timezonestring: city.timezone,
        iso8601: 'true',
      })
      const response = await fetch(
        `https://api.aladhan.com/v1/calendar/${year}/${Number(m)}?${query}`,
        options
      )
      if (!response.ok) throw new Error('Timetable unavailable')
      return parseFastingMonth(await response.json(), month, city.timezone, method)
    })
  )
  if (options.signal?.aborted) throw new Error('Cancelled')
  const maps = responses.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []))
  const rows = dates.map(
    (date) => maps.map((m) => m.get(date)).find(Boolean) || { date, fajr: null, maghrib: null }
  )
  if (!rows.some((r) => r.fajr !== null && r.maghrib !== null))
    throw new Error('No fasting times available')
  return {
    rows,
    timezone: city.timezone,
    method,
    city: city.slug,
    preparedAt: new Date().toISOString(),
    missingMonths: months.filter((_, i) => responses[i].status === 'rejected'),
  }
}
export function manualFasting(
  date: string,
  fajr: string,
  maghrib: string,
  timezone: string
): FastingRow {
  parseGregorian(date)
  const row = {
    date,
    fajr: zonedTime(date, fajr, timezone),
    maghrib: zonedTime(date, maghrib, timezone),
  }
  if (row.maghrib <= row.fajr) throw new Error('Maghrib must follow Fajr')
  return row
}
export function fastingPhase(row: FastingRow, timezone: string, now: number) {
  if (
    row.date !== localDateISO(timezone, new Date(now)) ||
    row.fajr === null ||
    row.maghrib === null
  )
    return null
  if (now < row.fajr) return { kind: 'fajr' as const, remaining: row.fajr - now }
  if (now < row.maghrib) return { kind: 'maghrib' as const, remaining: row.maghrib - now }
  return { kind: 'ended' as const, remaining: 0 }
}
export function fastingClock(value: number | null, timezone: string) {
  return value === null
    ? '—'
    : new Intl.DateTimeFormat('en-GB', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }).format(value)
}
export function fastingCsv(table: FastingTable, label: string, basis: string, lang: 'en' | 'ar') {
  const field = (s: string) => `"${s.replace(/"/g, '""')}"`
  const headings =
    lang === 'ar'
      ? [
          'التاريخ',
          'الفجر',
          'المغرب',
          'المنطقة الزمنية',
          'المدينة',
          'طريقة الحساب',
          'أساس التواريخ',
          'الحالة',
          'وقت إعداد الجدول',
        ]
      : [
          'Date',
          'Fajr',
          'Maghrib',
          'Time zone',
          'City',
          'Calculation method',
          'Date basis',
          'Status',
          'Prepared at',
        ]
  return (
    '\uFEFF' +
    [
      headings,
      ...table.rows.map((row) => [
        row.date,
        fastingClock(row.fajr, table.timezone),
        fastingClock(row.maghrib, table.timezone),
        table.timezone,
        label,
        table.method,
        basis,
        row.fajr === null || row.maghrib === null
          ? lang === 'ar'
            ? 'غير مكتمل'
            : 'Incomplete'
          : lang === 'ar'
            ? 'راجع الجدول المحلي'
            : 'Check local timetable',
        table.preparedAt,
      ]),
    ]
      .map((row) => row.map(field).join(','))
      .join('\r\n') +
    '\r\n'
  )
}
