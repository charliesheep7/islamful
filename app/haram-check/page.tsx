import { Metadata } from 'next'
import HaramChecker from '@/components/tools/HaramChecker'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export const metadata: Metadata = {
  title: 'Is This Haram? — Halal & Haram Checker',
  description:
    'Check whether food, ingredients, or everyday items are halal or haram according to Islamic guidelines. Free halal checker with scholarly references.',
  alternates: buildLanguageAlternates('/haram-check'),
}

export default function HaramCheckPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Haram Check', href: '/haram-check' }]} />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'Islamful Haram Checker',
          description:
            'Check whether food, ingredients, or products are halal, haram, or doubtful according to Islamic guidelines.',
          url: 'https://www.islamful.com/haram-check',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        }}
      />

      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          Is This Haram?
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Search for food, ingredients, or products to find out whether they are halal, haram, or
          doubtful according to Islamic guidelines.
        </p>
      </div>

      <HaramChecker lang="en" />

      <JsonLd
        data={{
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What makes something haram in Islam?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The primary sources for determining halal and haram are the Quran, the Sunnah (teachings of Prophet Muhammad), and scholarly consensus (Ijma). The Quran explicitly prohibits certain foods like pork, intoxicants, and blood.',
              },
            },
            {
              '@type': 'Question',
              name: 'What does mashbooh (doubtful) mean?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Mashbooh (doubtful/questionable) refers to items where the ruling is unclear or where scholars have differing opinions. The Prophet Muhammad (peace be upon him) advised: "Leave that which makes you doubt for that which does not make you doubt."',
              },
            },
            {
              '@type': 'Question',
              name: 'What common ingredients should Muslims watch for?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Common ingredients to check include gelatin, glycerin, L-cysteine (E920), carmine (E120), and animal-derived emulsifiers. Always look for halal certification or verify the source of these ingredients.',
              },
            },
          ],
        }}
      />

      {/* SEO Content Below Fold */}
      <section className="mt-16 space-y-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Understanding Halal and Haram in Islam
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p>
            In Islam, <strong>halal</strong> (permissible) and <strong>haram</strong> (prohibited)
            are fundamental concepts that guide a Muslim&apos;s daily choices — from food and drink
            to financial transactions and lifestyle decisions.
          </p>
          <h3>What Makes Something Haram?</h3>
          <p>The primary sources for determining halal and haram are:</p>
          <ul>
            <li>
              <strong>The Quran</strong> — Allah&apos;s direct revelation, which explicitly
              prohibits certain foods like pork (2:173), intoxicants (5:90), and blood.
            </li>
            <li>
              <strong>The Sunnah</strong> — The teachings and practices of Prophet Muhammad (peace
              be upon him), which provide additional guidance on permissible and prohibited items.
            </li>
            <li>
              <strong>Scholarly consensus (Ijma)</strong> — Agreed-upon rulings by qualified Islamic
              scholars.
            </li>
          </ul>
          <h3>What Does &ldquo;Mashbooh&rdquo; Mean?</h3>
          <p>
            <strong>Mashbooh</strong> (doubtful/questionable) refers to items where the ruling is
            unclear or where scholars have differing opinions. The Prophet Muhammad (peace be upon
            him) advised: &ldquo;Leave that which makes you doubt for that which does not make you
            doubt.&rdquo; (Tirmidhi)
          </p>
          <h3>Common Ingredients to Watch For</h3>
          <p>
            Many processed foods contain ingredients that may be derived from haram sources. Some
            common ones to check include: gelatin, glycerin, L-cysteine (E920), carmine (E120), and
            animal-derived emulsifiers. Always look for halal certification or verify the source of
            these ingredients.
          </p>
        </div>
      </section>
    </div>
  )
}
