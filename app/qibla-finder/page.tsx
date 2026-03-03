import { Metadata } from 'next'
import QiblaFinder from '@/components/tools/QiblaFinder'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'
import CrossToolLinks from '@/components/seo/CrossToolLinks'

export const metadata: Metadata = {
  title: 'Qibla Finder — Accurate Qibla Direction Tool | Islamful',
  description:
    'Find the exact Qibla direction from your location. Live compass on mobile, bearing angle on desktop. Free Qibla finder with distance to Kaaba.',
  alternates: buildLanguageAlternates('/qibla-finder'),
  openGraph: {
    title: 'Qibla Finder — Accurate Qibla Direction Tool | Islamful',
    description:
      'Find the exact Qibla direction from your location. Live compass on mobile, bearing angle on desktop. Free, no app required.',
    url: 'https://www.islamful.com/qibla-finder',
    siteName: 'Islamful',
    images: ['/static/images/og-image.png'],
    type: 'website',
  },
  twitter: {
    title: 'Qibla Finder — Accurate Qibla Direction Tool | Islamful',
    description:
      'Find the exact Qibla direction from your location. Live compass on mobile, bearing angle on desktop. Free, no app required.',
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
            'Find the exact Qibla direction from anywhere in the world with live compass.',
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
          Find the exact direction to face for prayer from anywhere in the world.
        </p>
      </div>

      <QiblaFinder lang="en" />

      {/* FAQPage JSON-LD */}
      <JsonLd
        data={{
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is the Qibla?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The Qibla is the direction that Muslims face during prayer (salah). It points toward the Kaaba in Masjid al-Haram in Makkah, Saudi Arabia.',
              },
            },
            {
              '@type': 'Question',
              name: 'How is the Qibla direction calculated?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The Qibla direction is calculated using the great circle bearing formula from spherical trigonometry. It finds the shortest path on Earth between your location and the Kaaba (21.4225°N, 39.8262°E).',
              },
            },
            {
              '@type': 'Question',
              name: 'Do I need a physical compass?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'On mobile devices with a built-in compass, this tool provides a live compass that points toward the Qibla. On desktop, it shows the bearing angle so you can use a physical compass or simply know the direction.',
              },
            },
          ],
        }}
      />

      {/* SEO content section */}
      <section className="mt-16 space-y-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What Is the Qibla?</h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p>
            The Qibla (Arabic: قِبْلَة) is the direction that Muslims around the world face when
            performing their daily prayers (salah). It points toward the Kaaba, the sacred cubic
            structure located at the center of Masjid al-Haram in Makkah, Saudi Arabia. Facing the
            Qibla is a fundamental requirement for the validity of prayer in Islam, and it serves as
            a powerful symbol of the unity of the Muslim ummah — no matter where they are on Earth,
            all Muslims turn toward the same point in worship.
          </p>

          <h3>The History of the Qibla</h3>
          <p>
            In the early years of Islam, Muslims initially prayed facing Jerusalem (Bayt al-Maqdis),
            which was the Qibla for approximately 16 to 17 months after the Prophet Muhammad (peace
            be upon him) migrated to Madinah. The Prophet (peace be upon him) longed to face the
            Kaaba, the house built by Prophet Ibrahim (Abraham) and his son Ismail (peace be upon
            them both). Allah then revealed the command to change the Qibla direction in Surah
            Al-Baqarah:
          </p>
          <blockquote>
            &ldquo;We have certainly seen the turning of your face toward the heaven, and We will
            surely turn you to a qiblah with which you will be pleased. So turn your face toward
            al-Masjid al-Haram. And wherever you are, turn your faces toward it.&rdquo; — Quran
            2:144
          </blockquote>
          <p>
            This change of Qibla from Jerusalem to Makkah was a defining moment in Islamic history.
            It established the Kaaba as the spiritual center for Muslims and distinguished the
            Muslim identity. The event is commemorated to this day, and the mosque in Madinah where
            the revelation occurred is known as Masjid al-Qiblatain (the Mosque of the Two Qiblas).
          </p>

          <h3>How Is the Qibla Direction Calculated?</h3>
          <p>
            The Qibla direction is calculated using the great circle bearing formula from spherical
            trigonometry. Unlike a straight line on a flat map, the great circle method finds the
            shortest path across the curved surface of the Earth between your location and the Kaaba
            at coordinates 21.4225&deg;N, 39.8262&deg;E. The formula uses the latitudes and
            longitudes of both points to determine the initial bearing you should face.
          </p>
          <p>
            This is the most accurate method for determining the Qibla, especially for locations far
            from Makkah. For example, Muslims in North America typically face northeast (not east or
            southeast as a flat map might suggest), because the great circle route to Makkah arcs
            northward across the Atlantic. Similarly, Muslims in Japan face west-northwest, and
            Muslims in Australia face northwest.
          </p>

          <h3>Tips for Finding the Qibla Without a Compass</h3>
          <p>
            There are several traditional and practical methods for determining the Qibla direction:
          </p>
          <ul>
            <li>
              <strong>The Sun:</strong> In many locations, you can use the position of the sun at
              specific times to determine the approximate Qibla. Twice a year (around May 28 and
              July 16), the sun is directly above the Kaaba at solar noon, meaning your shadow will
              point exactly away from the Qibla at that moment.
            </li>
            <li>
              <strong>Stars:</strong> The North Star (Polaris) indicates north, from which you can
              estimate the Qibla based on your geographic location.
            </li>
            <li>
              <strong>Mosque orientation:</strong> If you are near a mosque, the mihrab (prayer
              niche) always faces the Qibla direction.
            </li>
            <li>
              <strong>Ask locals:</strong> In Muslim-majority areas, local residents will know the
              general Qibla direction.
            </li>
            <li>
              <strong>This tool:</strong> Use our Qibla Finder on your mobile phone for a live
              compass that rotates in real time, or on desktop to see the exact bearing angle.
            </li>
          </ul>

          <h3>Why Accurate Qibla Direction Matters</h3>
          <p>
            While scholars agree that a reasonable effort to face the Qibla is sufficient —
            especially when the exact direction is difficult to determine — using precise tools
            ensures you are facing as close to the correct direction as possible. The great circle
            method used by this tool provides accuracy within a fraction of a degree, which is
            significantly more precise than estimating by looking at a flat map or relying on
            general knowledge of where Makkah lies relative to your country.
          </p>
          <p>
            For Muslims living in regions where the Qibla direction is not commonly known or where
            it might be counterintuitive (such as the Americas, East Asia, or the Pacific), having a
            reliable digital tool is invaluable. Our Qibla Finder works entirely in your browser,
            requires no app installation, and provides instant results with both the bearing angle
            and a live compass direction on supported mobile devices.
          </p>
        </div>
      </section>

      <CrossToolLinks currentTool="qibla-finder" />
    </div>
  )
}
