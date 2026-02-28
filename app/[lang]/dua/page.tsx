import { Metadata } from 'next'
import DuaCollection from '@/components/tools/DuaCollection'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export function generateStaticParams() {
  return [{ lang: 'ar' }]
}

export const metadata: Metadata = {
  title: 'مجموعة الأدعية — أدعية إسلامية صحيحة لكل مناسبة',
  description: 'تصفح أدعية صحيحة من القرآن والسنة للصباح والمساء والسفر والطعام والنوم وغيرها.',
  alternates: buildLanguageAlternates('/dua', { currentLanguage: 'ar' }),
}

export default function DuaPageAr() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" dir="rtl">
      <Breadcrumbs items={[{ name: 'مجموعة الأدعية', href: '/ar/dua' }]} />
      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'إسلامفُل - مجموعة الأدعية',
          description: 'مجموعة أدعية إسلامية صحيحة من القرآن والسنة.',
          url: 'https://www.islamful.com/ar/dua',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          inLanguage: 'ar',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <div className="mb-10 text-center">
        <h1 className="font-arabic mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          مجموعة الأدعية
        </h1>
        <p className="font-arabic mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          أدعية صحيحة من القرآن والسنة لكل لحظة في يومك.
        </p>
      </div>
      <DuaCollection lang="ar" />
    </div>
  )
}
