import { Metadata } from 'next'
import QuranReader from '@/components/tools/QuranReader'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export const metadata: Metadata = {
  title: 'Quran — Read the Holy Quran with Translation',
  description:
    'Read the Holy Quran online with Arabic text and English translation. Browse all 114 surahs with search.',
  alternates: buildLanguageAlternates('/quran'),
}

export default function QuranPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Quran', href: '/quran' }]} />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'Islamful Quran Reader',
          description: 'Read the Holy Quran with Arabic text and English translation.',
          url: 'https://www.islamful.com/quran',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />

      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          The Holy Quran
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Read, search, and reflect on the words of Allah.
        </p>
      </div>

      <QuranReader lang="en" />
    </div>
  )
}
