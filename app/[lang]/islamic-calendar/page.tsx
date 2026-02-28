import { Metadata } from 'next'
import IslamicCalendar from '@/components/tools/IslamicCalendar'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export function generateStaticParams() {
  return [{ lang: 'ar' }]
}

export const metadata: Metadata = {
  title: 'التقويم الهجري — محول التاريخ الهجري والميلادي',
  description:
    'حول بين التاريخ الهجري والميلادي. اعرف التاريخ الهجري اليوم والمناسبات الإسلامية القادمة.',
  alternates: buildLanguageAlternates('/islamic-calendar', { currentLanguage: 'ar' }),
}

export default function IslamicCalendarPageAr() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" dir="rtl">
      <Breadcrumbs items={[{ name: 'التقويم الهجري', href: '/ar/islamic-calendar' }]} />
      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'إسلامفُل - التقويم الهجري',
          description: 'محول التاريخ الهجري والميلادي مع المناسبات الإسلامية.',
          url: 'https://www.islamful.com/ar/islamic-calendar',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          inLanguage: 'ar',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <div className="mb-10 text-center">
        <h1 className="font-arabic mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          التقويم الهجري
        </h1>
        <p className="font-arabic mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          التاريخ الهجري اليوم ومحول التاريخ والمناسبات الإسلامية القادمة.
        </p>
      </div>
      <IslamicCalendar lang="ar" />
    </div>
  )
}
