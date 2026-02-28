'use client'

import { useState, useMemo, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  'Rabi al-Awwal',
  'Rabi al-Thani',
  'Jumada al-Ula',
  'Jumada al-Thani',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhul Qi'dah",
  'Dhul Hijjah',
]

const HIJRI_MONTHS_AR = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الثاني',
  'جمادى الأولى',
  'جمادى الثانية',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
]

// Important Islamic events (month 1-indexed to match API)
const ISLAMIC_EVENTS = [
  { month: 1, day: 1, name: 'Islamic New Year', nameAr: 'رأس السنة الهجرية' },
  { month: 1, day: 10, name: 'Day of Ashura', nameAr: 'يوم عاشوراء', fasting: true },
  { month: 3, day: 12, name: 'Mawlid al-Nabi', nameAr: 'المولد النبوي' },
  { month: 7, day: 27, name: "Isra & Mi'raj", nameAr: 'الإسراء والمعراج' },
  { month: 8, day: 15, name: "Mid-Sha'ban", nameAr: 'ليلة النصف من شعبان' },
  { month: 9, day: 1, name: 'Start of Ramadan', nameAr: 'أول رمضان', fasting: true },
  { month: 9, day: 27, name: 'Laylat al-Qadr (est.)', nameAr: 'ليلة القدر (تقديرية)' },
  { month: 10, day: 1, name: 'Eid al-Fitr', nameAr: 'عيد الفطر' },
  { month: 12, day: 8, name: 'Day of Tarwiyah', nameAr: 'يوم التروية' },
  { month: 12, day: 9, name: 'Day of Arafah', nameAr: 'يوم عرفة', fasting: true },
  { month: 12, day: 10, name: 'Eid al-Adha', nameAr: 'عيد الأضحى' },
]

interface HijriDate {
  day: string
  month: { number: number; en: string; ar: string }
  year: string
  weekday: { en: string; ar: string }
  designation: { abbreviated: string }
}

interface IslamicCalendarProps {
  lang?: string
}

export default function IslamicCalendar({ lang = 'en' }: IslamicCalendarProps) {
  const isRTL = lang === 'ar'
  const [hijriToday, setHijriToday] = useState<HijriDate | null>(null)
  const [loading, setLoading] = useState(true)
  const [gDate, setGDate] = useState(new Date().toISOString().slice(0, 10))
  const [convertedHijri, setConvertedHijri] = useState<HijriDate | null>(null)
  const [converting, setConverting] = useState(false)

  const now = new Date()

  // Fetch today's Hijri date from Aladhan API (same API used for prayer times)
  useEffect(() => {
    const d = now.getDate()
    const m = now.getMonth() + 1
    const y = now.getFullYear()
    fetch(`https://api.aladhan.com/v1/gToH/${d}-${m}-${y}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.data?.hijri) {
          setHijriToday(data.data.hijri)
        }
      })
      .catch(() => {
        // Fallback: show error state
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Convert selected Gregorian date
  const handleConvert = async (dateStr: string) => {
    setGDate(dateStr)
    setConverting(true)
    try {
      const [y, m, d] = dateStr.split('-').map(Number)
      const res = await fetch(`https://api.aladhan.com/v1/gToH/${d}-${m}-${y}`)
      const data = await res.json()
      if (data.data?.hijri) {
        setConvertedHijri(data.data.hijri)
      }
    } catch {
      // Conversion failed
    } finally {
      setConverting(false)
    }
  }

  // Upcoming events based on today's Hijri date
  const upcomingEvents = useMemo(() => {
    if (!hijriToday) return []
    const todayMonth = hijriToday.month.number
    const todayDay = parseInt(hijriToday.day)

    const events = ISLAMIC_EVENTS.map((e) => {
      let monthsAway = e.month - todayMonth
      if (monthsAway < 0 || (monthsAway === 0 && e.day < todayDay)) {
        monthsAway += 12
      }
      return { ...e, monthsAway }
    })
    events.sort((a, b) => a.monthsAway - b.monthsAway || a.day - b.day)
    return events.slice(0, 6)
  }, [hijriToday])

  // Recommended fasting days this Hijri month
  const fastingDays = useMemo(() => {
    if (!hijriToday) return []
    const todayDay = parseInt(hijriToday.day)
    const days: { day: number; label: string; labelAr: string }[] = []

    // White days (13, 14, 15 of each Hijri month)
    ;[13, 14, 15].forEach((d) => {
      if (d >= todayDay) {
        days.push({
          day: d,
          label: `White Day (${d}th)`,
          labelAr: `اليوم الأبيض (${d})`,
        })
      }
    })

    return days
  }, [hijriToday])

  const months = isRTL ? HIJRI_MONTHS_AR : HIJRI_MONTHS

  return (
    <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Today's Hijri date */}
      <div className="mb-8 rounded-2xl bg-gray-900 p-8 text-center text-white sm:p-10 dark:bg-white/[0.06]">
        {loading ? (
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-white/40" />
        ) : hijriToday ? (
          <>
            <p className="text-sm text-white/40">
              {isRTL ? hijriToday.weekday.ar : hijriToday.weekday.en}
            </p>
            <p className="font-arabic mt-2 text-4xl font-bold sm:text-5xl">
              {hijriToday.day} {isRTL ? hijriToday.month.ar : months[hijriToday.month.number - 1]}{' '}
              {hijriToday.year} {hijriToday.designation.abbreviated}
            </p>
            <p className="mt-3 text-sm text-white/40">
              {now.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </>
        ) : (
          <p className="text-white/50">{isRTL ? 'تعذر تحميل التاريخ' : 'Could not load date'}</p>
        )}
      </div>

      {/* Date converter */}
      <div className="mb-8 rounded-2xl bg-white p-6 ring-1 ring-gray-200/60 dark:bg-white/[0.03] dark:ring-white/10">
        <h3
          className={`mb-4 text-sm font-semibold text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
        >
          {isRTL ? 'تحويل التاريخ' : 'Date Converter'}
        </h3>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <input
            type="date"
            value={gDate}
            onChange={(e) => handleConvert(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:focus:border-gray-600"
          />
          {converting ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : convertedHijri ? (
            <p className="font-arabic text-lg font-semibold text-gray-900 dark:text-white">
              {convertedHijri.day}{' '}
              {isRTL ? convertedHijri.month.ar : months[convertedHijri.month.number - 1]}{' '}
              {convertedHijri.year} {convertedHijri.designation.abbreviated}
            </p>
          ) : null}
        </div>
      </div>

      {/* Upcoming events */}
      {upcomingEvents.length > 0 && (
        <div className="mb-8">
          <h3
            className={`mb-4 text-sm font-semibold text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
          >
            {isRTL ? 'المناسبات القادمة' : 'Upcoming Events'}
          </h3>
          <div className="space-y-2">
            {upcomingEvents.map((event, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl bg-white px-5 py-4 ring-1 ring-gray-200/60 dark:bg-white/[0.03] dark:ring-white/10"
              >
                <div>
                  <p
                    className={`font-medium text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
                  >
                    {isRTL ? event.nameAr : event.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {event.day} {isRTL ? HIJRI_MONTHS_AR[event.month - 1] : months[event.month - 1]}
                    {'fasting' in event && event.fasting && (
                      <span className="ml-2 text-[var(--color-primary-500)]">
                        {isRTL ? '· صيام' : '· Fasting'}
                      </span>
                    )}
                  </p>
                </div>
                {event.monthsAway === 0 ? (
                  <span className="rounded-full bg-[var(--color-primary-500)] px-2.5 py-0.5 text-xs font-medium text-white">
                    {isRTL ? 'هذا الشهر' : 'This month'}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">
                    {event.monthsAway === 1
                      ? isRTL
                        ? 'الشهر القادم'
                        : 'Next month'
                      : isRTL
                        ? `بعد ${event.monthsAway} أشهر`
                        : `In ${event.monthsAway} mo`}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended fasting days */}
      {fastingDays.length > 0 && (
        <div>
          <h3
            className={`mb-4 text-sm font-semibold text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
          >
            {isRTL ? 'أيام صيام مستحبة هذا الشهر' : 'Recommended Fasting This Month'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {fastingDays.map((fd) => (
              <div
                key={fd.day}
                className="rounded-xl bg-white px-4 py-3 ring-1 ring-gray-200/60 dark:bg-white/[0.03] dark:ring-white/10"
              >
                <p
                  className={`text-sm font-medium text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
                >
                  {isRTL ? fd.labelAr : fd.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
