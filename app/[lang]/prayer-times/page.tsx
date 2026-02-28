import { Metadata } from 'next'
import PrayerTimes from '@/components/tools/PrayerTimes'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export function generateStaticParams() {
  return [{ lang: 'ar' }]
}

export const metadata: Metadata = {
  title: 'مواقيت الصلاة — أوقات صلاة دقيقة لأي مدينة',
  description:
    'احصل على مواقيت صلاة دقيقة للفجر والظهر والعصر والمغرب والعشاء لأي مدينة حول العالم. يدعم طرق حساب متعددة.',
  alternates: buildLanguageAlternates('/prayer-times', { currentLanguage: 'ar' }),
}

export default async function PrayerTimesPageAr() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" dir="rtl">
      <Breadcrumbs items={[{ name: 'مواقيت الصلاة', href: '/ar/prayer-times' }]} />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'إسلامفُل - مواقيت الصلاة',
          description: 'مواقيت صلاة دقيقة لأي موقع حول العالم مع طرق حساب متعددة.',
          url: 'https://www.islamful.com/ar/prayer-times',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          inLanguage: 'ar',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        }}
      />

      <div className="mb-10 text-center">
        <h1 className="font-arabic mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          مواقيت الصلاة
        </h1>
        <p className="font-arabic mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          أوقات صلاة دقيقة لأي مدينة حول العالم. اختر طريقة الحساب المناسبة ولا تفوّت صلاة أبداً.
        </p>
      </div>

      <PrayerTimes lang="ar" />
    </div>
  )
}
