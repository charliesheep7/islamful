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

      <DhikrCounter lang="en" />

      <section className="mt-16">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2>What Is Dhikr?</h2>
          <p>
            Dhikr (remembrance of Allah) is one of the most beloved acts of worship in Islam. The
            Prophet Muhammad (peace be upon him) taught us to say SubhanAllah 33 times,
            Alhamdulillah 33 times, and Allahu Akbar 34 times after every obligatory prayer.
          </p>
          <h3>Benefits of Regular Dhikr</h3>
          <p>
            The Quran says: &ldquo;Verily, in the remembrance of Allah do hearts find rest&rdquo;
            (13:28). Regular dhikr brings peace of mind, increases faith, and earns immense reward.
            The Prophet (peace be upon him) said that these words are &ldquo;dearer to me than
            everything the sun has risen upon.&rdquo;
          </p>
        </div>
      </section>
    </div>
  )
}
