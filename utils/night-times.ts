import { followingDate, localDateISO } from './prayer-schedule'

export function nightTimes(maghrib: number, fajr: number) {
  const duration = fajr - maghrib
  if (!Number.isFinite(duration) || duration <= 0 || duration > 24 * 3600000) {
    throw new Error('Invalid night interval')
  }
  return {
    maghrib,
    fajr,
    midpoint: maghrib + duration / 2,
    lastThird: maghrib + (duration * 2) / 3,
  }
}

/** Resolve a wall-clock input in its IANA zone. Reject missing/ambiguous DST times. */
export function zonedTime(date: string, time: string, timezone: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))
    throw new Error('Invalid date or time')
  const wall = Date.parse(`${date}T${time}:00Z`)
  if (!Number.isFinite(wall) || new Date(wall).toISOString().slice(0, 10) !== date)
    throw new Error('Invalid date')
  const format = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
  const offsets = new Set<number>()
  for (const hours of [-36, 0, 36]) {
    const instant = new Date(wall + hours * 3600000)
    const local = `${localDateISO(timezone, instant)}T${format.format(instant)}:00Z`
    offsets.add(Date.parse(local) - instant.getTime())
  }
  const matches = [...offsets]
    .map((offset) => wall - offset)
    .filter(
      (instant) =>
        localDateISO(timezone, new Date(instant)) === date &&
        format.format(new Date(instant)) === time
    )
  if (matches.length !== 1) throw new Error('Ambiguous or nonexistent local time')
  return matches[0]
}
export function manualNight(date: string, maghrib: string, fajr: string, timezone: string) {
  return nightTimes(
    zonedTime(date, maghrib, timezone),
    zonedTime(followingDate(date), fajr, timezone)
  )
}

export function nightCalendar(start: number, end: number, now = Date.now()): string {
  const stamp = (epoch: number) =>
    new Date(epoch)
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}Z$/, 'Z')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Islamful//Night Planner//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:night-${Math.round(start)}@islamful.com`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    'SUMMARY:Last third of the night',
    'DESCRIPTION:Calculated from Maghrib to the following Fajr. Confirm your local timetable.',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n')
}
