import { Metadata } from 'next'
import ZakatCalculator from '@/components/tools/ZakatCalculator'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export function generateStaticParams() {
  return [{ lang: 'ar' }]
}

export const metadata: Metadata = {
  title: 'حاسبة الزكاة — احسب زكاتك بدقة',
  description: 'احسب زكاتك بدقة بناءً على النقد والذهب والفضة والاستثمارات والديون.',
  alternates: buildLanguageAlternates('/zakat-calculator', { currentLanguage: 'ar' }),
}

export default function ZakatCalculatorPageAr() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" dir="rtl">
      <Breadcrumbs items={[{ name: 'حاسبة الزكاة', href: '/ar/zakat-calculator' }]} />
      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'إسلامفُل - حاسبة الزكاة',
          description: 'احسب زكاتك السنوية بناءً على ثروتك.',
          url: 'https://www.islamful.com/ar/zakat-calculator',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          inLanguage: 'ar',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <div className="mb-10 text-center">
        <h1 className="font-arabic mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          حاسبة الزكاة
        </h1>
        <p className="font-arabic mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          احسب زكاتك بدقة. أدخل أصولك أدناه.
        </p>
      </div>
      <ZakatCalculator lang="ar" />
    </div>
  )
}
