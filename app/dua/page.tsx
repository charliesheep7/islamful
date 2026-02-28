import { Metadata } from 'next'
import DuaCollection from '@/components/tools/DuaCollection'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export const metadata: Metadata = {
  title: 'Dua Collection — Authentic Islamic Duas for Every Occasion',
  description:
    'Browse authentic duas from the Quran and Sunnah for morning, evening, travel, food, sleep, protection, and more. With Arabic text, transliteration, and translation.',
  alternates: buildLanguageAlternates('/dua'),
}

export default function DuaPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Dua Collection', href: '/dua' }]} />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'Islamful Dua Collection',
          description: 'Curated collection of authentic Islamic duas from the Quran and Sunnah.',
          url: 'https://www.islamful.com/dua',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />

      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          Dua Collection
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Authentic supplications from the Quran and Sunnah for every moment of your day.
        </p>
      </div>

      <DuaCollection lang="en" />
    </div>
  )
}
