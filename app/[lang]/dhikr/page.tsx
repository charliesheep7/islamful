import { Metadata } from 'next'
import DhikrCounter from '@/components/tools/DhikrCounter'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export function generateStaticParams() {
  return [{ lang: 'ar' }]
}

export const metadata: Metadata = {
  title: 'عداد الأذكار — تسبيح رقمي يومي',
  description:
    'عداد تسبيح رقمي مجاني لأذكارك اليومية. تتبّع سبحان الله والحمد لله والله أكبر بعد كل صلاة.',
  alternates: buildLanguageAlternates('/dhikr', { currentLanguage: 'ar' }),
}

export default function DhikrPageAr() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" dir="rtl">
      <Breadcrumbs items={[{ name: 'عداد الأذكار', href: '/ar/dhikr' }]} />
      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'إسلامفُل - عداد الأذكار',
          description: 'عداد تسبيح رقمي لأذكارك اليومية.',
          url: 'https://www.islamful.com/ar/dhikr',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          inLanguage: 'ar',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <div className="mb-10 text-center">
        <h1 className="font-arabic mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          عداد الأذكار
        </h1>
        <p className="font-arabic mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          اضغط لعد أذكارك اليومية بعد كل صلاة.
        </p>
      </div>
      <DhikrCounter lang="ar" />
    </div>
  )
}
