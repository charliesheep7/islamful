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
import { PRAYER_METHODS } from '@/data/prayer-methods'
import type { PrayerSchedule } from '@/utils/prayer-schedule'
import CrossToolLinks from '@/components/seo/CrossToolLinks'

export const revalidate = 3600

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

  const title = `Prayer Times in ${city.name} Today | Islamful`
  const description = `Accurate prayer times for ${city.name}, ${city.country}. Live Fajr, Dhuhr, Asr, Maghrib & Isha times with countdown. Updated daily.`

  return {
    title: { absolute: title },
    description,
    alternates: buildLanguageAlternates(`/prayer-times/${city.slug}`),
    openGraph: {
      title,
      description,
      url: `${siteMetadata.siteUrl}/prayer-times/${city.slug}`,
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

export default async function CityPrayerTimesPage({ params }: Props) {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) notFound()

  const siteUrl = siteMetadata.siteUrl

  const prayerData: PrayerSchedule | null = await fetchPrayerTimes(
    city.lat,
    city.lng,
    city.method,
    `${city.name}, ${city.country}`,
    city.timezone
  )

  const relatedCities = getRelatedCities(city.slug)

  const methodName = PRAYER_METHODS[String(city.method)] || 'standard'

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
          description: `Accurate prayer times for ${city.name}, ${city.country}`,
          url: `${siteUrl}/prayer-times/${city.slug}`,
          inLanguage: 'en',
          dateModified: new Date().toISOString().split('T')[0],
          isPartOf: {
            '@type': 'WebApplication',
            name: 'Islamful Prayer Times',
            url: `${siteUrl}/prayer-times`,
          },
          about: {
            '@type': 'City',
            name: city.name,
            containedInPlace: { '@type': 'Country', name: city.country },
          },
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
        latitude={city.lat}
        longitude={city.lng}
        timezone={city.timezone}
        prayerData={prayerData}
        cityName={city.name}
        cityCountry={city.country}
        cityMethod={String(city.method)}
      />

      <Link className="mt-6 inline-block underline" href={`/ramadan-calendar/${city.slug}`}>
        Ramadan calendar and fasting times in {city.name}
      </Link>

      {/* Related cities */}
      <section className="mt-14">
        <h2 className="mb-4 text-sm font-semibold tracking-wide text-[var(--color-cream-600)] uppercase dark:text-gray-400">
          Other Cities
        </h2>
        <div className="flex flex-wrap gap-2">
          {relatedCities.map((c) => (
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

      {/* SEO content */}
      <section className="mt-14 border-t border-[var(--color-cream-300)] pt-10 dark:border-gray-800">
        <div className="prose prose-sm prose-gray dark:prose-invert max-w-none text-[var(--color-cream-600)]">
          <p>
            Prayer times in {city.name} are calculated using the city&apos;s geographic coordinates
            ({Math.abs(city.lat).toFixed(4)}°{city.lat >= 0 ? 'N' : 'S'},{' '}
            {Math.abs(city.lng).toFixed(4)}°{city.lng >= 0 ? 'E' : 'W'}) with the {methodName}{' '}
            calculation method. Each prayer time is determined by the sun&apos;s position relative
            to {city.name}, {city.country}, and updates automatically every day.
          </p>
          <p>
            The five daily prayers — Fajr (dawn), Dhuhr (midday), Asr (afternoon), Maghrib (sunset),
            and Isha (night) — are obligatory for every Muslim. Sunrise is also shown to mark the
            end of the Fajr prayer window. A live countdown helps you stay on track for the next
            prayer.
          </p>
        </div>
      </section>

      <CrossToolLinks currentTool="prayer-times" />
    </div>
  )
}
