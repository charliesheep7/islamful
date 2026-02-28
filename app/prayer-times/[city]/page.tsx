import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from '@/components/Link'
import PrayerTimesWidget from '@/components/tools/PrayerTimesWidget'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import cities, { getCityBySlug } from '@/data/cities'
import { fetchPrayerTimes } from '@/utils/prayer-api'
import type { PrayerTimesData } from '@/components/tools/PrayerTimes'

interface Props {
  params: Promise<{ city: string }>
}

export async function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) return {}

  const title = `Prayer Times in ${city.name} Today — Fajr, Dhuhr, Asr, Maghrib, Isha`
  const description = `Today's prayer times in ${city.name}, ${city.country}. Fajr ${city.name}, Dhuhr ${city.name}, Asr, Maghrib, and Isha. Updated daily with countdown to next salah.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.islamful.com/prayer-times/${city.slug}`,
      languages: {
        en: `https://www.islamful.com/prayer-times/${city.slug}`,
        ar: `https://www.islamful.com/ar/prayer-times/${city.slug}`,
        'x-default': `https://www.islamful.com/prayer-times/${city.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://www.islamful.com/prayer-times/${city.slug}`,
    },
  }
}

export default async function CityPrayerTimesPage({ params }: Props) {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) notFound()

  const prayerData: PrayerTimesData | null = await fetchPrayerTimes(
    city.lat,
    city.lng,
    city.method,
    `${city.name}, ${city.country}`
  )

  const otherCities = cities.filter((c) => c.slug !== city.slug).slice(0, 16)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { name: 'Prayer Times', href: '/prayer-times' },
          { name: city.name, href: `/prayer-times/${city.slug}` },
        ]}
      />

      <JsonLd
        data={{
          '@type': 'WebPage',
          name: `Prayer Times in ${city.name} Today`,
          description: `Today's prayer times for ${city.name}, ${city.country}`,
          url: `https://www.islamful.com/prayer-times/${city.slug}`,
        }}
      />

      {/* Hero: city + dates */}
      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
          Prayer Times in {city.name}
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

      {/* The main widget — interactive, with countdown */}
      <PrayerTimesWidget
        prayerData={prayerData}
        cityName={city.name}
        cityCountry={city.country}
        cityMethod={String(city.method)}
      />

      {/* Other cities — quick nav */}
      <section className="mt-14">
        <h2 className="mb-4 text-sm font-semibold tracking-wide text-[var(--color-cream-600)] uppercase dark:text-gray-400">
          Other Cities
        </h2>
        <div className="flex flex-wrap gap-2">
          {otherCities.map((c) => (
            <Link
              key={c.slug}
              href={`/prayer-times/${c.slug}`}
              className="rounded-lg border border-[var(--color-cream-300)] px-3 py-1.5 text-sm text-gray-700 transition hover:border-[var(--color-primary-400)] hover:text-[var(--color-primary-600)] dark:border-gray-800 dark:text-gray-300"
            >
              {c.name}
            </Link>
          ))}
        </div>
        <div className="mt-4">
          <Link
            href="/prayer-times"
            className="text-sm text-[var(--color-primary-600)] hover:underline dark:text-[var(--color-primary-400)]"
          >
            View all cities →
          </Link>
        </div>
      </section>

      {/* SEO text — minimal, below fold, for Google not users */}
      <section className="mt-14 border-t border-[var(--color-cream-300)] pt-10 dark:border-gray-800">
        <div className="prose prose-sm prose-gray dark:prose-invert max-w-none text-[var(--color-cream-600)]">
          <p>
            Prayer times in {city.name} are calculated based on the city&apos;s coordinates (
            {city.lat.toFixed(4)}°N, {city.lng.toFixed(4)}°E) using the{' '}
            {city.method === 4
              ? 'Umm Al-Qura'
              : city.method === 3
                ? 'Muslim World League'
                : city.method === 13
                  ? 'Diyanet (Turkey)'
                  : city.method === 2
                    ? 'ISNA'
                    : 'standard'}{' '}
            calculation method. Times update daily and reflect the sun&apos;s position relative to{' '}
            {city.name}, {city.country}.
          </p>
        </div>
      </section>
    </div>
  )
}
