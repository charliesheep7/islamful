import { Metadata } from 'next'
import NamesOfAllah from '@/components/tools/NamesOfAllah'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export function generateStaticParams() {
  return [{ lang: 'ar' }]
}

export const metadata: Metadata = {
  title: 'أسماء الله الحسنى — ٩٩ اسمًا مع المعاني',
  description: 'تعلّم واحفظ أسماء الله الحسنى التسعة والتسعين مع المعاني والنطق.',
  alternates: buildLanguageAlternates('/names-of-allah', { currentLanguage: 'ar' }),
}

export default function NamesOfAllahPageAr() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" dir="rtl">
      <Breadcrumbs items={[{ name: 'أسماء الله الحسنى', href: '/ar/names-of-allah' }]} />
      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'إسلامفُل - أسماء الله الحسنى',
          description: 'تصفح أسماء الله الحسنى التسعة والتسعين مع المعاني.',
          url: 'https://www.islamful.com/ar/names-of-allah',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          inLanguage: 'ar',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <div className="mb-10 text-center">
        <h1 className="font-arabic mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          أسماء الله الحسنى
        </h1>
        <p className="font-arabic mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          الأسماء الحسنى — تعلّم وتأمّل واذكر.
        </p>
      </div>
      <NamesOfAllah lang="ar" />
    </div>
  )
}
