import type { PrayerTimesData } from '@/components/tools/PrayerTimes'

/** Fetch prayer times from Aladhan API (server-side) */
export async function fetchPrayerTimes(
  lat: number,
  lng: number,
  method: number,
  locationName: string
): Promise<PrayerTimesData | null> {
  try {
    const d = new Date()
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dateStr = `${dd}-${mm}-${d.getFullYear()}`

    const res = await fetch(
      `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=${method}`,
      { next: { revalidate: 3600 } } // ISR: revalidate every hour
    )

    if (!res.ok) return null

    const json = await res.json()
    if (json.code !== 200) return null

    const timings = json.data.timings as Record<string, string>
    const date = json.data.date as Record<string, unknown>
    const hijri = date.hijri as Record<string, unknown>
    const hijriDay = (hijri.day as string) || ''
    const hijriMonth = (hijri.month as Record<string, string>)?.en || ''
    const hijriYear = (hijri.year as string) || ''

    return {
      date: (date.readable as string) || '',
      hijriDate: `${hijriDay} ${hijriMonth} ${hijriYear}`,
      location: locationName,
      prayers: [
        { name: 'Fajr', nameAr: 'الفجر', time: timings.Fajr },
        { name: 'Sunrise', nameAr: 'الشروق', time: timings.Sunrise },
        { name: 'Dhuhr', nameAr: 'الظهر', time: timings.Dhuhr },
        { name: 'Asr', nameAr: 'العصر', time: timings.Asr },
        { name: 'Maghrib', nameAr: 'المغرب', time: timings.Maghrib },
        { name: 'Isha', nameAr: 'العشاء', time: timings.Isha },
      ],
    }
  } catch {
    return null
  }
}
