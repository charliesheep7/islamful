import { Metadata } from 'next'
import Link from '@/components/Link'
import PrayerTimes from '@/components/tools/PrayerTimes'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'
import cities from '@/data/cities'

export const metadata: Metadata = {
  title: 'Prayer Times — Accurate Salah Times for Any City',
  description:
    'Get accurate prayer times for Fajr, Dhuhr, Asr, Maghrib, and Isha for any city worldwide. Supports ISNA, MWL, Umm Al-Qura, and other calculation methods.',
  alternates: buildLanguageAlternates('/prayer-times'),
}

// Group cities by region for display
const regions = [
  {
    name: 'Middle East',
    slugs: [
      'mecca',
      'medina',
      'riyadh',
      'jeddah',
      'dubai',
      'abu-dhabi',
      'doha',
      'kuwait-city',
      'amman',
      'beirut',
      'baghdad',
    ],
  },
  {
    name: 'North Africa',
    slugs: ['cairo', 'alexandria', 'casablanca', 'tunis', 'algiers'],
  },
  {
    name: 'South & Southeast Asia',
    slugs: [
      'jakarta',
      'bali',
      'kuala-lumpur',
      'dhaka',
      'karachi',
      'lahore',
      'islamabad',
      'delhi',
      'mumbai',
      'singapore',
    ],
  },
  { name: 'Turkey', slugs: ['istanbul', 'ankara'] },
  {
    name: 'Europe',
    slugs: [
      'london',
      'paris',
      'berlin',
      'amsterdam',
      'brussels',
      'rome',
      'madrid',
      'vienna',
      'stockholm',
      'oslo',
    ],
  },
  {
    name: 'Americas',
    slugs: ['new-york', 'los-angeles', 'chicago', 'houston', 'toronto'],
  },
  {
    name: 'Africa & Oceania',
    slugs: ['lagos', 'nairobi', 'johannesburg', 'sydney', 'melbourne', 'tokyo'],
  },
]

export default function PrayerTimesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Prayer Times', href: '/prayer-times' }]} />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'Islamful Prayer Times',
          description:
            'Accurate prayer times for any location worldwide with multiple calculation methods.',
          url: 'https://www.islamful.com/prayer-times',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />

      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          Prayer Times
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Accurate salah times for any city worldwide. Search your city or browse by location below.
        </p>
      </div>

      <PrayerTimes lang="en" />

      {/* Popular Cities by Region — crawlable internal links */}
      <section className="mt-16">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
          Prayer Times by City
        </h2>

        <div className="space-y-8">
          {regions.map((region) => (
            <div key={region.name}>
              <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                {region.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {region.slugs.map((slug) => {
                  const city = cities.find((c) => c.slug === slug)
                  if (!city) return null
                  return (
                    <Link
                      key={slug}
                      href={`/prayer-times/${slug}`}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-[var(--color-accent-300)] hover:text-[var(--color-accent-600)] dark:border-gray-800 dark:text-gray-300 dark:hover:border-[var(--color-accent-800)] dark:hover:text-[var(--color-accent-400)]"
                    >
                      {city.name}
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
              name: 'What are the five daily prayers in Islam?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The five daily prayers (salah) are Fajr (dawn), Dhuhr (midday), Asr (afternoon), Maghrib (sunset), and Isha (night). They are one of the Five Pillars of Islam and are obligatory for every adult Muslim.',
              },
            },
            {
              '@type': 'Question',
              name: 'How are prayer times calculated?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Prayer times are determined by the position of the sun relative to your location. Different Islamic organizations use slightly different angles for Fajr and Isha calculations. Islamful supports ISNA, Muslim World League, Umm Al-Qura, and other methods.',
              },
            },
            {
              '@type': 'Question',
              name: 'Why do prayer times vary by location?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Since prayer times are based on the sun's position, they change based on your geographic latitude, longitude, and the time of year. Cities closer to the equator have more consistent prayer times year-round.",
              },
            },
          ],
        }}
      />

      {/* SEO Content */}
      <section className="mt-16">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2>What Are the Five Daily Prayers in Islam?</h2>
          <p>
            The five daily prayers (salah) are one of the Five Pillars of Islam and are obligatory
            for every adult Muslim. They are performed at specific times throughout the day and
            night:
          </p>
          <ul>
            <li>
              <strong>Fajr</strong> — The dawn prayer, performed before sunrise.
            </li>
            <li>
              <strong>Dhuhr</strong> — The midday prayer, performed after the sun passes its zenith.
            </li>
            <li>
              <strong>Asr</strong> — The afternoon prayer, performed in the late afternoon.
            </li>
            <li>
              <strong>Maghrib</strong> — The sunset prayer, performed just after sunset.
            </li>
            <li>
              <strong>Isha</strong> — The night prayer, performed after twilight has disappeared.
            </li>
          </ul>
          <h3>How Are Prayer Times Calculated?</h3>
          <p>
            Prayer times are determined by the position of the sun relative to the observer&apos;s
            location. Different Islamic organizations use slightly different angles for Fajr and
            Isha calculations, which is why we offer multiple calculation methods including ISNA,
            Muslim World League, Umm Al-Qura, and others.
          </p>
          <h3>Why Do Prayer Times Vary by Location?</h3>
          <p>
            Since prayer times are based on the sun&apos;s position, they change based on your
            geographic latitude, longitude, and the time of year. Cities closer to the equator have
            more consistent prayer times throughout the year, while cities at higher latitudes may
            experience significant variations between summer and winter.
          </p>
        </div>
      </section>
    </div>
  )
}
