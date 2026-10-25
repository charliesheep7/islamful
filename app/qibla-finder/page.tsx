import { Metadata } from 'next'
import QiblaFinder from '@/components/tools/QiblaFinder'
import QiblaGuide from '@/components/tools/QiblaGuide'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'
import CrossToolLinks from '@/components/seo/CrossToolLinks'

export const metadata: Metadata = {
  title: { absolute: 'Qibla Finder — Online Qibla Compass | Islamful' },
  description:
    'Find the Qibla direction from your location or coordinates. Free online tool, no app download. Live compass on supported phones; IP location is approximate.',
  alternates: buildLanguageAlternates('/qibla-finder'),
  openGraph: {
    title: 'Qibla Finder — Qibla Direction & Compass | Islamful',
    description:
      'Find the Qibla bearing from your location, with a live compass on supported devices. IP-based location results are approximate. Free, no app required.',
    url: 'https://www.islamful.com/qibla-finder',
    siteName: 'Islamful',
    images: ['/static/images/og-image.png'],
    type: 'website',
  },
  twitter: {
    title: 'Qibla Finder — Qibla Direction & Compass | Islamful',
    description:
      'Find the Qibla bearing from your location, with a live compass on supported devices. IP-based location results are approximate. Free, no app required.',
    card: 'summary_large_image',
    images: ['/static/images/og-image.png'],
  },
}

export default function QiblaFinderPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Qibla Finder', href: '/qibla-finder' }]} />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'Islamful Qibla Finder',
          description:
            'Calculate the Qibla bearing from your location or coordinates, with a live compass on supported devices.',
          url: 'https://www.islamful.com/qibla-finder',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          inLanguage: 'en',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />

      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          Qibla Finder
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Find the Qibla direction from your location, with a bearing and a live compass on
          supported devices.
        </p>
      </div>

      <QiblaFinder lang="en" />

      <QiblaGuide lang="en" />

      <CrossToolLinks currentTool="qibla-finder" />
    </div>
  )
}
