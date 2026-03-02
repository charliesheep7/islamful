import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from '@/components/Link'
import PrayerTimesWidget from '@/components/tools/PrayerTimesWidget'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import cities, { getCityBySlug, getRelatedCities } from '@/data/cities'
import { fetchPrayerTimes } from '@/utils/prayer-api'
import { buildLanguageAlternates } from 'app/seo'
import siteMetadata from '@/data/siteMetadata'
import { PRAYER_METHODS } from '@/components/tools/PrayerTimes'
import type { PrayerTimesData } from '@/components/tools/PrayerTimes'
import CrossToolLinks from '@/components/seo/CrossToolLinks'

interface Props {
  params: Promise<{ lang: string; city: string }>
}

export function generateStaticParams() {
  return cities.map((city) => ({ lang: 'ar', city: city.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) return {}

  const title = `مواقيت الصلاة في ${city.nameAr} اليوم`
  const description = `أوقات الصلاة اليوم في ${city.nameAr}، ${city.countryAr}. الفجر والظهر والعصر والمغرب والعشاء مع عداد تنازلي للصلاة القادمة.`

  return {
    title,
    description,
    alternates: buildLanguageAlternates(`/prayer-times/${city.slug}`, {
      currentLanguage: 'ar',
    }),
    openGraph: {
      title,
      description,
      url: `${siteMetadata.siteUrl}/ar/prayer-times/${city.slug}`,
      siteName: siteMetadata.title,
      images: [siteMetadata.socialBanner],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [siteMetadata.socialBanner],
    },
  }
}

export default async function CityPrayerTimesPageAr({ params }: Props) {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) notFound()

  const siteUrl = siteMetadata.siteUrl

  const prayerData: PrayerTimesData | null = await fetchPrayerTimes(
    city.lat,
    city.lng,
    city.method,
    `${city.nameAr}، ${city.countryAr}`
  )

  const relatedCities = getRelatedCities(city.slug)

  const methodName = PRAYER_METHODS[String(city.method)] || 'قياسية'

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6" dir="rtl">
      <Breadcrumbs
        items={[
          { name: 'مواقيت الصلاة', href: '/ar/prayer-times' },
          { name: city.nameAr, href: `/ar/prayer-times/${city.slug}` },
        ]}
      />

      <JsonLd
        data={{
          '@type': 'WebPage',
          name: `مواقيت الصلاة في ${city.nameAr} اليوم`,
          description: `أوقات الصلاة اليوم في ${city.nameAr}، ${city.countryAr}`,
          url: `${siteUrl}/ar/prayer-times/${city.slug}`,
          inLanguage: 'ar',
          dateModified: new Date().toISOString().split('T')[0],
          isPartOf: {
            '@type': 'WebApplication',
            name: 'إسلامفُل - مواقيت الصلاة',
            url: `${siteUrl}/ar/prayer-times`,
          },
          about: {
            '@type': 'City',
            name: city.nameAr,
            containedInPlace: { '@type': 'Country', name: city.countryAr },
          },
        }}
      />

      {/* Hero */}
      <div className="mt-4 mb-8">
        <h1 className="font-arabic text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
          مواقيت الصلاة في {city.nameAr}
        </h1>
        {prayerData && (
          <div className="mt-2 flex items-center gap-3">
            <span className="text-sm text-[var(--color-cream-600)] dark:text-gray-400">
              {prayerData.date}
            </span>
            <span className="text-[var(--color-cream-400)]">·</span>
            <span className="font-arabic text-sm text-[var(--color-cream-600)] dark:text-gray-400">
              {prayerData.hijriDate}
            </span>
          </div>
        )}
      </div>

      <PrayerTimesWidget
        prayerData={prayerData}
        cityName={city.nameAr}
        cityCountry={city.countryAr}
        cityMethod={String(city.method)}
      />

      {/* Related cities */}
      <section className="mt-14">
        <h2 className="font-arabic mb-4 text-sm font-semibold tracking-wide text-[var(--color-cream-600)] uppercase dark:text-gray-400">
          مدن أخرى
        </h2>
        <div className="flex flex-wrap gap-2">
          {relatedCities.map((c) => (
            <Link
              key={c.slug}
              href={`/ar/prayer-times/${c.slug}`}
              className="rounded-lg border border-[var(--color-cream-300)] px-3 py-1.5 text-sm text-gray-700 transition hover:border-[var(--color-primary-400)] hover:text-[var(--color-primary-600)] dark:border-gray-800 dark:text-gray-300"
            >
              {c.nameAr}
            </Link>
          ))}
        </div>
        <div className="mt-4">
          <Link
            href="/ar/prayer-times"
            className="text-sm text-[var(--color-primary-600)] hover:underline dark:text-[var(--color-primary-400)]"
          >
            ← عرض جميع المدن
          </Link>
        </div>
      </section>

      {/* SEO content */}
      <section className="mt-14 border-t border-[var(--color-cream-300)] pt-10 dark:border-gray-800">
        <div className="prose prose-sm prose-gray dark:prose-invert max-w-none text-[var(--color-cream-600)]">
          <p>
            تُحسب مواقيت الصلاة في {city.nameAr} بناءً على إحداثيات المدينة (خط العرض{' '}
            {Math.abs(city.lat).toFixed(4)}° {city.lat >= 0 ? 'شمالاً' : 'جنوباً'}، خط الطول{' '}
            {Math.abs(city.lng).toFixed(4)}° {city.lng >= 0 ? 'شرقاً' : 'غرباً'}) باستخدام طريقة
            حساب {methodName}. تتغير الأوقات يومياً حسب موقع الشمس بالنسبة لمدينة {city.nameAr}،{' '}
            {city.countryAr}.
          </p>
          <p>
            تشمل الصلوات الخمس المفروضة: الفجر (قبل شروق الشمس)، والظهر (بعد زوال الشمس)، والعصر
            (بعد الظهر)، والمغرب (بعد غروب الشمس مباشرة)، والعشاء (بعد اختفاء الشفق). يتم تحديث
            الأوقات يومياً مع عداد تنازلي للصلاة القادمة.
          </p>
        </div>
      </section>

      <CrossToolLinks currentTool="prayer-times" lang="ar" />
    </div>
  )
}
