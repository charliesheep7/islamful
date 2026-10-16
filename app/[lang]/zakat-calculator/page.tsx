import { zakatGuideCopy } from '@/data/locales/zakat-guide'
import { Metadata } from 'next'
import ZakatCalculator from '@/components/tools/ZakatCalculator'
import ZakatGuide from '@/components/tools/ZakatGuide'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export function generateStaticParams() {
  return ['ar', 'fr', 'de'].map((lang) => ({ lang }))
}

const arabicMetadata: Metadata = {
  title: 'حاسبة الزكاة — احسب زكاتك بدقة',
  description:
    'قدّر زكاة النقد والذهب والفضة والاستثمارات المؤهلة. اختر النصاب والأسعار وحالة الحول، واطّلع على الحساب ونزّل ملخصك.',
  alternates: buildLanguageAlternates('/zakat-calculator', { currentLanguage: 'ar' }),
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (lang !== 'fr' && lang !== 'de') return arabicMetadata
  const copy = zakatGuideCopy[lang]
  return {
    title: copy.title,
    description: copy.description,
    alternates: buildLanguageAlternates('/zakat-calculator', { currentLanguage: lang }),
  }
}

export default async function ZakatCalculatorPageAr({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (lang === 'fr' || lang === 'de') {
    const copy = zakatGuideCopy[lang]
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" lang={lang}>
        <Breadcrumbs items={[{ name: copy.title, href: `/${lang}/zakat-calculator` }]} />
        <JsonLd
          data={{
            '@type': 'WebApplication',
            name: copy.title,
            description: copy.description,
            url: `https://www.islamful.com/${lang}/zakat-calculator`,
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            inLanguage: lang,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }}
        />
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">{copy.title}</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            {copy.description}
          </p>
        </div>
        <ZakatCalculator lang={lang} initialDate={new Date().toISOString().slice(0, 10)} />
        <ZakatGuide lang={lang} />
      </div>
    )
  }

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
          قدّر زكاة مدخراتك وذهبك وأموالك المؤهلة. اختر النصاب واطّلع على تفاصيل الحساب.
        </p>
      </div>
      <ZakatCalculator lang="ar" initialDate={new Date().toISOString().slice(0, 10)} />
      <ZakatGuide lang="ar" />
    </div>
  )
}
