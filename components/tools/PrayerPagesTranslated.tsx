import CityPrayerGuide from '@/components/tools/CityPrayerGuide'
import Link from 'next/link'
import type { Metadata } from 'next'
import PrayerTimes from './PrayerTimes'
import PrayerTimesWidget from './PrayerTimesWidget'
import JsonLd from '@/components/seo/JsonLd'
import CrossToolLinks from '@/components/seo/CrossToolLinks'
import cities, { regions, getRelatedCities, type City } from '@/data/cities'
import { prayerPageCopy } from '@/data/locales/prayer'
import { cityLabel, countryLabel } from '@/utils/city-label'
import { fetchPrayerTimes } from '@/utils/prayer-api'
import {
  formatGregorian,
  formatHijri,
  gregorianToHijri,
  DEFAULT_CALENDAR,
} from '@/data/islamic-calendar'
import { FRENCH_PRAYER_METHODS, GERMAN_PRAYER_METHODS } from '@/data/prayer-methods'
type Language = 'fr' | 'de'
const base = 'https://www.islamful.com'
export function translatedPrayerMetadata(lang: Language, city?: City): Metadata {
  const t = prayerPageCopy[lang],
    path = `/prayer-times${city ? `/${city.slug}` : ''}`
  const title = city ? `${t.cityTitle(cityLabel(city, lang))} ${t.today}` : t.title
  const description = city
    ? `${t.cityTitle(cityLabel(city, lang))}, ${countryLabel(city, lang)}. ${t.description}`
    : t.description
  return {
    title,
    description,
    alternates: {
      canonical: `${base}/${lang}${path}`,
      languages: Object.fromEntries(
        ['en', 'ar', 'fr', 'de'].map((l) => [l, `${base}${l === 'en' ? '' : `/${l}`}${path}`])
      ),
    },
    openGraph: { title, description, url: `${base}/${lang}${path}`, locale: lang, type: 'website' },
  }
}
function Explanations({ lang }: { lang: Language }) {
  const t = prayerPageCopy[lang]
  return (
    <section className="mt-12 space-y-6">
      <JsonLd
        data={{
          '@type': 'FAQPage',
          mainEntity: t.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }}
      />
      {t.faqs.map((f) => (
        <div key={f.question}>
          <h2 className="mb-3 text-xl font-semibold">{f.question}</h2>
          <p className="leading-relaxed">{f.answer}</p>
        </div>
      ))}
    </section>
  )
}
export function PrayerIndexTranslated({ lang }: { lang: Language }) {
  const t = prayerPageCopy[lang]
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6" lang={lang}>
      <nav className="mb-6 text-sm">
        <Link href={`/${lang}`}>{t.home}</Link> / {t.title}
      </nav>
      <header className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{t.title}</h1>
        <p className="text-lg">{t.intro}</p>
      </header>
      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: `Islamful — ${t.title}`,
          description: t.description,
          url: `${base}/${lang}/prayer-times`,
          inLanguage: lang,
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <PrayerTimes lang={lang} />
      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">{t.cities}</h2>
        <div className="space-y-6">
          {regions.map((region) => (
            <div key={region.name}>
              <h3 className="mb-3 font-semibold">
                {t.regions[region.name as keyof typeof t.regions] || region.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {region.slugs.map((slug) => {
                  const city = cities.find((c) => c.slug === slug)
                  return city ? (
                    <Link
                      key={slug}
                      href={`/${lang}/prayer-times/${slug}`}
                      className="rounded-lg border px-3 py-2 text-sm"
                    >
                      {cityLabel(city, lang)}
                    </Link>
                  ) : null
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Explanations lang={lang} />
      <CrossToolLinks currentTool="prayer-times" lang={lang} />
    </div>
  )
}
export async function PrayerCityTranslated({ lang, city }: { lang: Language; city: City }) {
  const t = prayerPageCopy[lang],
    name = cityLabel(city, lang),
    country = countryLabel(city, lang)
  const data = await fetchPrayerTimes(
    city.lat,
    city.lng,
    city.method,
    `${name}, ${country}`,
    city.timezone
  )
  const methods = lang === 'fr' ? FRENCH_PRAYER_METHODS : GERMAN_PRAYER_METHODS
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6" lang={lang}>
      <nav className="mb-6 text-sm">
        <Link href={`/${lang}/prayer-times`}>{t.title}</Link> / {name}
      </nav>
      <h1 className="mb-4 text-3xl font-bold">{t.cityTitle(name)}</h1>
      {data && (
        <p className="mb-6 text-sm">
          {formatGregorian(data.dateISO, lang)} ·{' '}
          {formatHijri(gregorianToHijri(data.dateISO, DEFAULT_CALENDAR), lang)}
        </p>
      )}
      <JsonLd
        data={{
          '@type': 'WebPage',
          name: t.cityTitle(name),
          description: t.description,
          url: `${base}/${lang}/prayer-times/${city.slug}`,
          inLanguage: lang,
          about: { '@type': 'City', name, containedInPlace: { '@type': 'Country', name: country } },
        }}
      />
      <PrayerTimesWidget
        latitude={city.lat}
        longitude={city.lng}
        timezone={city.timezone}
        lang={lang}
        prayerData={data}
        cityName={name}
        cityCountry={country}
        cityMethod={String(city.method)}
      />
      <CityPrayerGuide city={city} lang={lang} />
      <Link href={`/${lang}/ramadan-calendar/${city.slug}`} className="mt-6 inline-block underline">
        {t.ramadan(name)}
      </Link>
      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">{t.otherCities}</h2>
        <div className="flex flex-wrap gap-2">
          {getRelatedCities(city.slug).map((c) => (
            <Link
              key={c.slug}
              className="rounded-lg border px-3 py-2 text-sm"
              href={`/${lang}/prayer-times/${c.slug}`}
            >
              {cityLabel(c, lang)}
            </Link>
          ))}
        </div>
        <Link className="mt-4 inline-block underline" href={`/${lang}/prayer-times`}>
          {t.allCities}
        </Link>
      </section>
      <section className="mt-12 space-y-3">
        <h2 className="text-xl font-semibold">{t.about(name)}</h2>
        <p>{t.calculation}</p>
        <p>
          {t.coordinates}:{' '}
          <bdi>
            {city.lat.toFixed(4)}°, {city.lng.toFixed(4)}°
          </bdi>
          . {t.method}: {methods[String(city.method)]}.
        </p>
      </section>
      <Explanations lang={lang} />
      <CrossToolLinks currentTool="prayer-times" lang={lang} />
    </div>
  )
}
