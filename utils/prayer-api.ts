import { fetchPrayerSchedule, type PrayerSchedule } from './prayer-schedule'

/** Fetch a city-local dated timetable and next day's prayers for the server-rendered page. */
export async function fetchPrayerTimes(
  lat: number,
  lng: number,
  method: number,
  locationName: string,
  timezone: string
): Promise<PrayerSchedule | null> {
  try {
    return await fetchPrayerSchedule(
      { lat, lng, name: locationName, timezone },
      String(method),
      new Date(),
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(15000) }
    )
  } catch {
    return null
  }
}
