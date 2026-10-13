import { calendarSnapshot, DEFAULT_CALENDAR } from '@/data/islamic-calendar'
import { Metadata } from 'next'
import IslamicCalendar from '@/components/tools/IslamicCalendar'
import CalendarGuide from '@/components/tools/CalendarGuide'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Islamic Calendar — Hijri to Gregorian Date Converter',
  description:
    "Convert between Hijri and Gregorian dates. View today's Islamic date and upcoming events like Ramadan, Eid al-Fitr, and Eid al-Adha.",
  alternates: buildLanguageAlternates('/islamic-calendar'),
}

export default function IslamicCalendarPage() {
  const initialNow = new Date().toISOString()
  const initialSnapshot = calendarSnapshot(initialNow.slice(0, 10), DEFAULT_CALENDAR)
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Islamic Calendar', href: '/islamic-calendar' }]} />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'Islamful Islamic Calendar',
          description: 'Hijri to Gregorian date converter with Islamic events.',
          url: 'https://www.islamful.com/islamic-calendar',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />

      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          Islamic Calendar
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Today&apos;s Hijri date, date converter, and upcoming Islamic events.
        </p>
      </div>

      <IslamicCalendar lang="en" initialNow={initialNow} initialSnapshot={initialSnapshot} />
      <CalendarGuide lang="en" />
    </div>
  )
}
