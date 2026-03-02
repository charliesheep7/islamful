import { Metadata } from 'next'
import Link from '@/components/Link'
import PrayerTimes from '@/components/tools/PrayerTimes'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'
import cities, { regions } from '@/data/cities'
import CrossToolLinks from '@/components/seo/CrossToolLinks'

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

      {/* City links by region */}
      <section className="mt-16">
        <h2 className="font-arabic mb-8 text-2xl font-bold text-gray-900 dark:text-white">
          مواقيت الصلاة حسب المدينة
        </h2>

        <div className="space-y-8">
          {regions.map((region) => (
            <div key={region.name}>
              <h3 className="font-arabic mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                {region.nameAr}
              </h3>
              <div className="flex flex-wrap gap-2">
                {region.slugs.map((slug) => {
                  const city = cities.find((c) => c.slug === slug)
                  if (!city) return null
                  return (
                    <Link
                      key={slug}
                      href={`/ar/prayer-times/${slug}`}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-[var(--color-accent-300)] hover:text-[var(--color-accent-600)] dark:border-gray-800 dark:text-gray-300 dark:hover:border-[var(--color-accent-800)] dark:hover:text-[var(--color-accent-400)]"
                    >
                      {city.nameAr}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <JsonLd
        data={{
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'ما هي الصلوات الخمس في الإسلام؟',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'الصلوات الخمس المفروضة هي: الفجر (قبل شروق الشمس)، والظهر (بعد زوال الشمس)، والعصر (بعد الظهر)، والمغرب (بعد غروب الشمس)، والعشاء (بعد اختفاء الشفق). وهي من أركان الإسلام الخمسة وواجبة على كل مسلم بالغ.',
              },
            },
            {
              '@type': 'Question',
              name: 'كيف تُحسب مواقيت الصلاة؟',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'تُحدد مواقيت الصلاة بناءً على موقع الشمس بالنسبة لموقعك الجغرافي. تستخدم هيئات إسلامية مختلفة زوايا مختلفة لحساب الفجر والعشاء. يدعم إسلامفُل طرق حساب متعددة منها رابطة العالم الإسلامي وأم القرى وISNA وغيرها.',
              },
            },
            {
              '@type': 'Question',
              name: 'لماذا تختلف مواقيت الصلاة من مكان لآخر؟',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'بما أن مواقيت الصلاة تعتمد على موقع الشمس، فإنها تتغير حسب خط العرض وخط الطول والوقت من السنة. المدن القريبة من خط الاستواء تكون أوقات صلاتها أكثر ثباتاً على مدار العام.',
              },
            },
          ],
        }}
      />

      {/* SEO Content */}
      <section className="mt-16">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2 className="font-arabic">ما هي الصلوات الخمس في الإسلام؟</h2>
          <p className="font-arabic">
            الصلوات الخمس هي من أركان الإسلام الخمسة وواجبة على كل مسلم بالغ. تُؤدى في أوقات محددة
            على مدار اليوم والليلة:
          </p>
          <ul className="font-arabic">
            <li>
              <strong>الفجر</strong> — صلاة الفجر، تُؤدى قبل شروق الشمس.
            </li>
            <li>
              <strong>الظهر</strong> — صلاة الظهر، تُؤدى بعد زوال الشمس.
            </li>
            <li>
              <strong>العصر</strong> — صلاة العصر، تُؤدى في وقت ما بعد الظهر.
            </li>
            <li>
              <strong>المغرب</strong> — صلاة المغرب، تُؤدى بعد غروب الشمس مباشرة.
            </li>
            <li>
              <strong>العشاء</strong> — صلاة العشاء، تُؤدى بعد اختفاء الشفق الأحمر.
            </li>
          </ul>
          <h3 className="font-arabic">كيف تُحسب مواقيت الصلاة؟</h3>
          <p className="font-arabic">
            تُحدد مواقيت الصلاة بناءً على موقع الشمس بالنسبة لموقع المصلي الجغرافي. تستخدم هيئات
            إسلامية مختلفة زوايا مختلفة لحساب صلاتي الفجر والعشاء، ولهذا نوفر طرق حساب متعددة منها
            رابطة العالم الإسلامي وأم القرى وISNA وغيرها.
          </p>
          <h3 className="font-arabic">لماذا تختلف مواقيت الصلاة من مكان لآخر؟</h3>
          <p className="font-arabic">
            بما أن مواقيت الصلاة تعتمد على موقع الشمس، فإنها تتغير حسب خط العرض وخط الطول والوقت من
            السنة. المدن القريبة من خط الاستواء تكون أوقات صلاتها أكثر ثباتاً على مدار العام، بينما
            المدن في خطوط العرض العليا قد تشهد تغيرات كبيرة بين الصيف والشتاء.
          </p>
        </div>
      </section>

      <CrossToolLinks currentTool="prayer-times" lang="ar" />
    </div>
  )
}
