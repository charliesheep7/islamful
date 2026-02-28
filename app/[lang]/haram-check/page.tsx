import { Metadata } from 'next'
import HaramChecker from '@/components/tools/HaramChecker'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export function generateStaticParams() {
  return [{ lang: 'ar' }]
}

export const metadata: Metadata = {
  title: 'هل هذا حرام؟ — فحص الحلال والحرام',
  description:
    'تحقق مما إذا كانت الأطعمة أو المكونات أو المنتجات حلالاً أم حراماً وفقاً للإرشادات الإسلامية. فحص مجاني مع مراجع علمية.',
  alternates: buildLanguageAlternates('/haram-check', { currentLanguage: 'ar' }),
}

export default async function HaramCheckPageAr() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" dir="rtl">
      <Breadcrumbs items={[{ name: 'هل هذا حرام؟', href: '/ar/haram-check' }]} />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'إسلامفُل - فحص الحرام',
          description:
            'تحقق مما إذا كانت الأطعمة أو المكونات أو المنتجات حلالاً أم حراماً وفقاً للإرشادات الإسلامية.',
          url: 'https://www.islamful.com/ar/haram-check',
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
          هل هذا حرام؟
        </h1>
        <p className="font-arabic mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          ابحث عن الأطعمة أو المكونات أو المنتجات لمعرفة ما إذا كانت حلالاً أم حراماً أم مشبوهة
          وفقاً للإرشادات الإسلامية.
        </p>
      </div>

      <HaramChecker lang="ar" />
    </div>
  )
}
