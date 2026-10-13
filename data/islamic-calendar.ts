export type CalendarMethod = 'islamic-umalqura' | 'islamic-civil'
export type CalendarSettings = { method: CalendarMethod; adjustment: number }
export type HijriDate = { year: number; month: number; day: number }
export const MIN_DATE = '1900-01-01'
export const MAX_DATE = '2100-12-31'
export const DAY_MS = 86400000
export const DEFAULT_CALENDAR: CalendarSettings = { method: 'islamic-umalqura', adjustment: 0 }
export const HIJRI_MONTHS = {
  en: [
    'Muharram',
    'Safar',
    'Rabi al-Awwal',
    'Rabi al-Thani',
    'Jumada al-Ula',
    'Jumada al-Thani',
    'Rajab',
    'Sha’ban',
    'Ramadan',
    'Shawwal',
    'Dhul Qi’dah',
    'Dhul Hijjah',
  ],
  ar: [
    'محرم',
    'صفر',
    'ربيع الأول',
    'ربيع الآخر',
    'جمادى الأولى',
    'جمادى الآخرة',
    'رجب',
    'شعبان',
    'رمضان',
    'شوال',
    'ذو القعدة',
    'ذو الحجة',
  ],
}

export class CalendarError extends Error {
  constructor(public code: 'date' | 'range' | 'hijri' | 'method' | 'zone') {
    super(code)
  }
}

const formatters = new Map<CalendarMethod, Intl.DateTimeFormat>()
function formatter(method: CalendarMethod) {
  if (!['islamic-umalqura', 'islamic-civil'].includes(method)) throw new CalendarError('method')
  let f = formatters.get(method)
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      calendar: method,
      numberingSystem: 'latn',
      timeZone: 'UTC',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })
    if (f.resolvedOptions().calendar !== method) throw new CalendarError('method')
    formatters.set(method, f)
  }
  return f
}

function validateSettings(settings: CalendarSettings) {
  if (!Number.isInteger(settings.adjustment) || Math.abs(settings.adjustment) > 2)
    throw new CalendarError('date')
  formatter(settings.method)
}

export function parseGregorian(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) throw new CalendarError('date')
  const date = new Date(`${iso}T00:00:00Z`)
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== iso)
    throw new CalendarError('date')
  if (iso < MIN_DATE || iso > MAX_DATE) throw new CalendarError('range')
  return date.getTime()
}

export function isoDay(epoch: number) {
  return new Date(epoch).toISOString().slice(0, 10)
}

function rawHijri(epoch: number, method: CalendarMethod): HijriDate {
  const parts = formatter(method).formatToParts(new Date(epoch))
  const part = (name: string) => Number(parts.find((p) => p.type === name)?.value)
  const result = { year: part('year'), month: part('month'), day: part('day') }
  if (!Object.values(result).every(Number.isInteger)) throw new CalendarError('method')
  return result
}

export function gregorianToHijri(iso: string, settings: CalendarSettings = DEFAULT_CALENDAR) {
  validateSettings(settings)
  return rawHijri(parseGregorian(iso) + settings.adjustment * DAY_MS, settings.method)
}

function validateHijri(h: HijriDate) {
  if (
    !Object.values(h).every(Number.isInteger) ||
    h.year < 1300 ||
    h.year > 1600 ||
    h.month < 1 ||
    h.month > 12 ||
    h.day < 1 ||
    h.day > 30
  )
    throw new CalendarError('hijri')
}
const ordinal = (h: HijriDate) => h.year * 372 + h.month * 31 + h.day

// Search calendar days, not elapsed local time. Padding permits partial edge months.
function rawGregorian(h: HijriDate, settings: CalendarSettings) {
  validateSettings(settings)
  validateHijri(h)
  let low = Date.UTC(1898, 0, 1) / DAY_MS
  let high = Date.UTC(2103, 0, 1) / DAY_MS
  const target = ordinal(h)
  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if (ordinal(rawHijri(mid * DAY_MS, settings.method)) < target) low = mid + 1
    else high = mid
  }
  if (ordinal(rawHijri(low * DAY_MS, settings.method)) !== target) throw new CalendarError('hijri')
  return (low - settings.adjustment) * DAY_MS
}

export function hijriToGregorian(h: HijriDate, settings: CalendarSettings = DEFAULT_CALENDAR) {
  const iso = isoDay(rawGregorian(h, settings))
  parseGregorian(iso)
  return iso
}

export function parseHijriInput(fields: { year: string; month: string; day: string }): HijriDate {
  const number = (value: string) => {
    const digits = value
      .trim()
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x660))
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x6f0))
    if (!/^\d+$/.test(digits)) throw new CalendarError('hijri')
    return Number(digits)
  }
  const result = { year: number(fields.year), month: number(fields.month), day: number(fields.day) }
  validateHijri(result)
  return result
}

export function moveHijriMonth(year: number, month: number, delta: number) {
  const total = year * 12 + month - 1 + delta
  return { year: Math.floor(total / 12), month: (((total % 12) + 12) % 12) + 1 }
}

export function hijriMonthDays(
  year: number,
  month: number,
  settings: CalendarSettings = DEFAULT_CALENDAR
) {
  const start = rawGregorian({ year, month, day: 1 }, settings)
  const next = moveHijriMonth(year, month, 1)
  const end = rawGregorian({ ...next, day: 1 }, settings)
  const length = (end - start) / DAY_MS
  if (length !== 29 && length !== 30) throw new CalendarError('method')
  return Array.from({ length }, (_, i) => {
    const iso = isoDay(start + i * DAY_MS)
    return {
      hijri: { year, month, day: i + 1 },
      iso,
      weekday: (new Date(start + i * DAY_MS).getUTCDay() + 6) % 7,
      inRange: iso >= MIN_DATE && iso <= MAX_DATE,
    }
  })
}

export function normalizeTimeZone(zone: string) {
  try {
    return new Intl.DateTimeFormat('en', { timeZone: zone }).resolvedOptions().timeZone
  } catch {
    throw new CalendarError('zone')
  }
}

export function dateInTimeZone(now: string, timeZone: string) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      calendar: 'gregory',
      numberingSystem: 'latn',
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date(now))
    const p = (name: string) => parts.find((part) => part.type === name)!.value
    return `${p('year')}-${p('month')}-${p('day')}`
  } catch {
    throw new CalendarError('zone')
  }
}

export function formatHijri(h: HijriDate, lang: 'en' | 'ar') {
  const n = new Intl.NumberFormat(lang === 'ar' ? 'ar' : 'en', {
    useGrouping: false,
    numberingSystem: lang === 'ar' ? 'arab' : 'latn',
  })
  return `${n.format(h.day)} ${HIJRI_MONTHS[lang][h.month - 1]} ${n.format(h.year)} ${lang === 'ar' ? 'هـ' : 'AH'}`
}

export function formatGregorian(iso: string, lang: 'en' | 'ar') {
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : 'en-GB', {
    calendar: 'gregory',
    numberingSystem: lang === 'ar' ? 'arab' : 'latn',
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${iso}T12:00:00Z`))
}

export const KEY_DATES = [
  { id: 'new-year', month: 1, day: 1, en: 'Start of the Hijri year', ar: 'بداية السنة الهجرية' },
  { id: 'ashura', month: 1, day: 10, en: 'Ashura', ar: 'عاشوراء' },
  { id: 'ramadan', month: 9, day: 1, en: 'Start of Ramadan', ar: 'بداية رمضان' },
  {
    id: 'last-ten',
    month: 9,
    day: 21,
    en: 'Last ten nights of Ramadan begin the previous evening',
    ar: 'تبدأ ليالي العشر الأواخر من رمضان من المساء السابق',
  },
  { id: 'eid-fitr', month: 10, day: 1, en: 'Eid al-Fitr', ar: 'عيد الفطر' },
  { id: 'arafah', month: 12, day: 9, en: 'Day of Arafah', ar: 'يوم عرفة' },
  { id: 'eid-adha', month: 12, day: 10, en: 'Eid al-Adha', ar: 'عيد الأضحى' },
  { id: 'tashriq-1', month: 12, day: 11, en: 'First day of Tashriq', ar: 'أول أيام التشريق' },
  { id: 'tashriq-2', month: 12, day: 12, en: 'Second day of Tashriq', ar: 'ثاني أيام التشريق' },
  { id: 'tashriq-3', month: 12, day: 13, en: 'Third day of Tashriq', ar: 'ثالث أيام التشريق' },
]

export function upcomingKeyDates(today: string, settings: CalendarSettings) {
  const h = gregorianToHijri(today, settings)
  return [h.year, h.year + 1]
    .flatMap((year) =>
      KEY_DATES.flatMap((event) => {
        try {
          const iso = hijriToGregorian({ year, month: event.month, day: event.day }, settings)
          return iso >= today ? [{ ...event, year, iso }] : []
        } catch (error) {
          if (error instanceof CalendarError && error.code === 'range') return []
          throw error
        }
      })
    )
    .sort((a, b) => a.iso.localeCompare(b.iso))
    .slice(0, 8)
}

export function calendarSnapshot(
  today: string,
  settings: CalendarSettings,
  month?: { year: number; month: number } | null
) {
  const h = gregorianToHijri(today, settings)
  const selected = month || { year: h.year, month: h.month }
  const tomorrow = isoDay(parseGregorian(today) + DAY_MS)
  return {
    h,
    selected,
    days: hijriMonthDays(selected.year, selected.month, settings),
    tonight: tomorrow <= MAX_DATE ? gregorianToHijri(tomorrow, settings) : null,
    min: gregorianToHijri(MIN_DATE, settings),
    max: gregorianToHijri(MAX_DATE, settings),
    upcoming: upcomingKeyDates(today, settings),
  }
}

function foldIcs(line: string) {
  let result = '',
    current = '',
    bytes = 0
  for (const char of line) {
    const size = new TextEncoder().encode(char).length
    if (bytes + size > 74) {
      result += current + '\r\n'
      current = ' '
      bytes = 1
    }
    current += char
    bytes += size
  }
  return result + current
}
const escapeIcs = (text: string) =>
  text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')

export function calendarDownload(
  events: ReturnType<typeof upcomingKeyDates>,
  settings: CalendarSettings,
  lang: 'en' | 'ar',
  now: string
) {
  const stamp = new Date(now)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z')
  const methodName =
    settings.method === 'islamic-umalqura'
      ? lang === 'ar'
        ? 'أم القرى المحسوب'
        : 'calculated Umm al-Qura'
      : lang === 'ar'
        ? 'التقويم الهجري المدني الجدولي'
        : 'tabular Islamic civil'
  const description =
    lang === 'ar'
      ? `تاريخ محسوب وفق ${methodName} مع تعديل ${settings.adjustment} يوم. يبدأ الليل الشرعي من غروب الشمس السابق. تحقّق من إعلان الجهة المحلية الموثوقة.`
      : `Calculated with ${methodName}, adjustment ${settings.adjustment} day(s). The religious night starts at the preceding local sunset. Confirm local announcements.`
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Islamful//Islamic Calendar//EN',
    'CALSCALE:GREGORIAN',
    ...events.flatMap((event) => [
      'BEGIN:VEVENT',
      `UID:${event.id}-${event.year}-${settings.method}-${settings.adjustment}@islamful.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${event.iso.replace(/-/g, '')}`,
      `DTEND;VALUE=DATE:${isoDay(parseGregorian(event.iso) + DAY_MS).replace(/-/g, '')}`,
      `SUMMARY:${escapeIcs(event[lang])}`,
      `DESCRIPTION:${escapeIcs(description)}`,
      'TRANSP:TRANSPARENT',
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ]
  return lines.map(foldIcs).join('\r\n') + '\r\n'
}
