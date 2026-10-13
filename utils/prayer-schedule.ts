import type { PrayerTimesData, PrayerTime } from '@/components/tools/PrayerTimes'

export interface ScheduledPrayer extends PrayerTime {
  at: number | null
}
export interface PrayerSchedule extends PrayerTimesData {
  dateISO: string
  timezone: string
  method: string
  prayers: ScheduledPrayer[]
  tomorrow: ScheduledPrayer[]
}
export interface PrayerLocation {
  lat: number
  lng: number
  timezone: string
  name: string
}

export function localDateISO(timezone: string, now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const value = (type: string) => parts.find((p) => p.type === type)!.value
  return `${value('year')}-${value('month')}-${value('day')}`
}
export function followingDate(dateISO: string): string {
  const date = new Date(`${dateISO}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + 1)
  return date.toISOString().slice(0, 10)
}
const names = [
  ['Fajr', 'الفجر'],
  ['Sunrise', 'الشروق'],
  ['Dhuhr', 'الظهر'],
  ['Asr', 'العصر'],
  ['Maghrib', 'المغرب'],
  ['Isha', 'العشاء'],
]

export function scheduledPrayers(timings: Record<string, string>): ScheduledPrayer[] {
  return names.map(([name, nameAr]) => {
    const value = timings[name]
    // Require an explicit date and UTC offset; never interpret a city's clock as the visitor's.
    const valid =
      typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/.test(value)
    const epoch = valid ? Date.parse(value) : NaN
    return {
      name,
      nameAr,
      time: Number.isFinite(epoch) ? value.slice(11, 16) : '—',
      at: Number.isFinite(epoch) ? epoch : null,
    }
  })
}
export function upcomingPrayer(schedule: PrayerSchedule, now: number): ScheduledPrayer | null {
  if (localDateISO(schedule.timezone, new Date(now)) !== schedule.dateISO) return null
  return (
    [...schedule.prayers, ...schedule.tomorrow]
      .filter((p) => p.name !== 'Sunrise' && p.at !== null && p.at > now)
      .sort((a, b) => a.at! - b.at!)[0] || null
  )
}

/** Two real local calendar dates, so tomorrow's Fajr includes its actual seasonal/DST change. */
export async function fetchPrayerSchedule(
  location: PrayerLocation,
  method: string,
  now = new Date(),
  options: RequestInit = {}
): Promise<PrayerSchedule> {
  const dateISO = localDateISO(location.timezone, now)
  const dates = [dateISO, followingDate(dateISO)]
  const requests = await Promise.allSettled(
    dates.map(async (date) => {
      const [year, month, day] = date.split('-')
      const query = new URLSearchParams({
        latitude: String(location.lat),
        longitude: String(location.lng),
        method,
        timezonestring: location.timezone,
        iso8601: 'true',
      })
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?${query}`,
        options
      )
      if (!response.ok) throw new Error('Prayer service unavailable')
      const result = await response.json()
      if (
        result.code !== 200 ||
        !result.data?.timings ||
        result.data?.date?.gregorian?.date !== `${day}-${month}-${year}` ||
        result.data?.meta?.timezone !== location.timezone
      )
        throw new Error('Unexpected prayer timetable')
      return result.data
    })
  )
  const today = requests[0]
  if (today.status !== 'fulfilled') throw today.reason
  const data = today.value
  const hijri = data.date.hijri
  return {
    date: data.date.readable,
    dateISO,
    timezone: location.timezone,
    method,
    hijriDate: `${hijri.day} ${hijri.month.en} ${hijri.year}`,
    location: location.name,
    prayers: scheduledPrayers(data.timings),
    tomorrow: requests[1].status === 'fulfilled' ? scheduledPrayers(requests[1].value.timings) : [],
  }
}
