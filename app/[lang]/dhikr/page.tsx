import { AdhkarNav } from '@/components/adhkar/AdhkarPages'
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
      <AdhkarNav lang="ar" />
      <DhikrCounter lang="ar" />
      <section className="mt-12 space-y-4 leading-relaxed">
        <h2 className="text-xl font-semibold">صيغتان مأثورتان بعد الصلاة</h2>
        <p>
          ورد التسبيح ثلاثًا وثلاثين والتحميد ثلاثًا وثلاثين والتكبير أربعًا وثلاثين في{' '}
          <a className="underline" href="https://sunnah.com/muslim:596a">
            صحيح مسلم ٥٩٦ أ
          </a>
          ، وورد ثلاث وثلاثون من كل منها مع التهليل تمام المائة في{' '}
          <a className="underline" href="https://sunnah.com/muslim:597a">
            صحيح مسلم ٥٩٧ أ
          </a>
          . اختر إحدى الصيغتين؛ لكل منهما عدادات مستقلة، ولا يفترض العداد أي صلاة أديتها.
        </p>
        <noscript>
          <p>فعّل جافاسكربت لاستخدام العداد. تبقى النصوص والمصادر متاحة للقراءة.</p>
        </noscript>
      </section>
    </div>
  )
}
