import { Metadata } from 'next'
import MuslimBabyNames from '@/components/tools/MuslimBabyNames'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export const metadata: Metadata = {
  title: 'Muslim Baby Names — 265+ Islamic Names with Meanings',
  description:
    'Browse 265+ Islamic baby names with Arabic script, meanings, and origins. Filter by gender (boy/girl), category (Quranic, Prophet, Companion), and origin (Arabic, Persian, Urdu).',
  alternates: buildLanguageAlternates('/muslim-names'),
}

export default function MuslimNamesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Muslim Baby Names', href: '/muslim-names' }]} />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'Islamful Muslim Baby Names',
          description:
            'Search 265+ Islamic baby names with Arabic script, meanings, origins, and categories.',
          url: 'https://www.islamful.com/muslim-names',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />

      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          Muslim Baby Names
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          265+ Islamic names with Arabic script, meanings, and origins. Filter by gender, category,
          and language origin to find the perfect name.
        </p>
      </div>

      <MuslimBabyNames lang="en" />
    </div>
  )
}
