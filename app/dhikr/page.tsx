import Link from 'next/link'
import { AdhkarNav } from '@/components/adhkar/AdhkarPages'
import { Metadata } from 'next'
import DhikrCounter from '@/components/tools/DhikrCounter'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export const metadata: Metadata = {
  title: 'Dhikr Counter — Digital Tasbeeh for Daily Remembrance',
  description:
    'Free digital tasbeeh counter for your daily dhikr. Track SubhanAllah, Alhamdulillah, and Allahu Akbar after every prayer.',
  alternates: buildLanguageAlternates('/dhikr'),
}

export default function DhikrPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Dhikr Counter', href: '/dhikr' }]} />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'Islamful Dhikr Counter',
          description: 'Digital tasbeeh counter for daily dhikr and remembrance of Allah.',
          url: 'https://www.islamful.com/dhikr',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />

      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          Dhikr Counter
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Tap to count your daily adhkar after every prayer.
        </p>
      </div>

      <AdhkarNav lang="en" />
      <DhikrCounter lang="en" />

      <section className="prose dark:prose-invert mt-12 max-w-none">
        <h2>Two narrated ways to count after prayer</h2>
        <p>
          Sahih Muslim records both 33 tasbih, 33 tahmid and 34 takbir (
          <a href="https://sunnah.com/muslim:596a">596a</a>), and 33 of each followed by the tahlil
          that completes one hundred (<a href="https://sunnah.com/muslim:597a">597a</a>). Choose
          either option above. The counter saves each option separately and never assumes which
          prayer you have performed.
        </p>
        <p>
          For Arabic texts, meanings and other remembrance after salah, open the{' '}
          <Link href="/adhkar/after-prayer">after-prayer routine</Link>. Morning and evening
          collections have their own sources and counts.
        </p>
        <noscript>
          <p>Enable JavaScript to use the counter. The phrases and sources remain readable.</p>
        </noscript>
      </section>
    </div>
  )
}
