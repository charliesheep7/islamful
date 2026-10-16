import cities from '@/data/cities'
import { PRAYER_METHODS } from '@/data/prayer-methods'
import {
  DEFAULT_CALENDAR,
  dateInTimeZone,
  formatGregorian,
  formatHijri,
  gregorianToHijri,
  normalizeTimeZone,
  type CalendarSettings,
} from '@/data/islamic-calendar'
import { followingDate } from '@/utils/prayer-schedule'

export const TODAY_KEY = 'islamful.today.v1'
export const CALENDAR_KEY = 'islamful_calendar_v1'
export type TodayChoice = { version: 1; city: string; method: string }
export type TodayCalendar = CalendarSettings & { timeZone: string }
export function todayChoice(raw: string | null): TodayChoice | null {
  try {
    const v = JSON.parse(raw || 'null')
    if (
      v?.version !== 1 ||
      !cities.some((c) => c.slug === v.city) ||
      typeof v.method !== 'string' ||
      !Object.hasOwn(PRAYER_METHODS, v.method)
    )
      return null
    return { version: 1, city: v.city, method: v.method }
  } catch {
    return null
  }
}
export function todayCalendar(raw: string | null, deviceZone: string): TodayCalendar {
  let timeZone = 'UTC'
  try {
    timeZone = normalizeTimeZone(deviceZone)
  } catch {
    /* UTC is the explicit fallback. */
  }
  const fallback = { ...DEFAULT_CALENDAR, timeZone }
  try {
    const v = JSON.parse(raw || 'null')
    if (
      !v ||
      !['islamic-umalqura', 'islamic-civil'].includes(v.method) ||
      !Number.isInteger(v.adjustment) ||
      Math.abs(v.adjustment) > 2 ||
      typeof v.timeZone !== 'string'
    )
      return fallback
    // Preserve a valid selected method even if this browser cannot calculate it.
    return { method: v.method, adjustment: v.adjustment, timeZone: normalizeTimeZone(v.timeZone) }
  } catch {
    return fallback
  }
}
export function todayDate(now: string, calendar: TodayCalendar, lang: 'en' | 'ar' | 'fr' | 'de') {
  const iso = dateInTimeZone(now, calendar.timeZone)
  return {
    iso,
    gregorian: formatGregorian(iso, lang),
    hijri: formatHijri(gregorianToHijri(iso, calendar), lang),
    tonight: formatHijri(gregorianToHijri(followingDate(iso), calendar), lang),
  }
}
export type TodayDate = ReturnType<typeof todayDate>
