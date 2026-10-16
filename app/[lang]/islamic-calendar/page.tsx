import { calendarSnapshot, DEFAULT_CALENDAR } from '@/data/islamic-calendar'
import { notFound } from 'next/navigation'
import { calendarPages } from '@/data/locales/calendar'
import { Metadata } from 'next'
import IslamicCalendar from '@/components/tools/IslamicCalendar'
import CalendarGuide from '@/components/tools/CalendarGuide'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export function generateStaticParams() {
  return ['ar', 'fr', 'de'].map((lang) => ({ lang }))
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  return {
    ...calendarPages[lang],
    alternates: buildLanguageAlternates('/islamic-calendar', { currentLanguage: lang }),
  }
}
export default async function IslamicCalendarPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  const c = calendarPages[lang]
  const initialNow = new Date().toISOString()
  const initialSnapshot = calendarSnapshot(initialNow.slice(0, 10), DEFAULT_CALENDAR)
  return (
    <div
      className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <Breadcrumbs items={[{ name: c.title, href: `/${lang}/islamic-calendar` }]} />
      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: c.title,
          description: c.description,
          url: `https://www.islamful.com/${lang}/islamic-calendar`,
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          inLanguage: lang,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <div className="mb-10 text-center">
        <h1 className="font-arabic mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          {c.title}
        </h1>
        <p className="font-arabic mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          {c.description}
        </p>
      </div>
      <IslamicCalendar lang={lang} initialNow={initialNow} initialSnapshot={initialSnapshot} />
      <CalendarGuide lang={lang} />
    </div>
  )
}
