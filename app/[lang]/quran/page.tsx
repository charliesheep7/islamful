import { Metadata } from 'next'
import QuranReader from '@/components/tools/QuranReader'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export function generateStaticParams() {
  return [{ lang: 'ar' }]
}

export const metadata: Metadata = {
  title: 'القرآن الكريم — اقرأ القرآن مع الترجمة',
  description:
    'اقرأ القرآن الكريم كاملاً مع النص العربي والترجمة. تصفح جميع السور الـ 114 مع البحث.',
  alternates: buildLanguageAlternates('/quran', { currentLanguage: 'ar' }),
}

export default function QuranPageAr() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" dir="rtl">
      <Breadcrumbs items={[{ name: 'القرآن الكريم', href: '/ar/quran' }]} />
      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'إسلامفُل - القرآن الكريم',
          description: 'اقرأ القرآن الكريم مع النص العربي والترجمة.',
          url: 'https://www.islamful.com/ar/quran',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          inLanguage: 'ar',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <div className="mb-10 text-center">
        <h1 className="font-arabic mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          القرآن الكريم
        </h1>
        <p className="font-arabic mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          اقرأ وابحث وتأمل في كلام الله.
        </p>
      </div>
      <QuranReader lang="ar" />
    </div>
  )
}
