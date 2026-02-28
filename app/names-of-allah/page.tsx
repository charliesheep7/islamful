import { Metadata } from 'next'
import NamesOfAllah from '@/components/tools/NamesOfAllah'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export const metadata: Metadata = {
  title: '99 Names of Allah — Asma ul Husna with Meanings',
  description:
    'Learn and memorize the 99 beautiful names of Allah (Asma ul Husna) with Arabic text, transliteration, and English meanings.',
  alternates: buildLanguageAlternates('/names-of-allah'),
}

export default function NamesOfAllahPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: '99 Names of Allah', href: '/names-of-allah' }]} />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'Islamful — 99 Names of Allah',
          description: 'Browse all 99 beautiful names of Allah with meanings and transliteration.',
          url: 'https://www.islamful.com/names-of-allah',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />

      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          99 Names of Allah
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          The beautiful names of Allah — learn, reflect, and remember.
        </p>
      </div>

      <NamesOfAllah lang="en" />
    </div>
  )
}
