import { Metadata } from 'next'
import QuranAnswers from '@/components/tools/QuranAnswers'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'
import CrossToolLinks from '@/components/seo/CrossToolLinks'

export const metadata: Metadata = {
  title: 'Quran Answers — Ask a Question, Get a Quran Verse',
  description:
    'Ask any question and receive a beautiful, meaningful Quran verse as your answer. Share your Quran answer card with friends and family.',
  alternates: buildLanguageAlternates('/answers'),
}

export default function QuranAnswersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Quran Answers', href: '/answers' }]} />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'Quran Answers',
          description:
            'Ask any question and receive a beautiful Quran verse as your answer. Generate shareable cards with Quran verses.',
          url: 'https://www.islamful.com/answers',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          inLanguage: 'en',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        }}
      />

      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          Quran Answers
        </h1>
        <p className="font-arabic mb-4 text-sm text-gray-400 dark:text-gray-500">فأل القرآن</p>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Ask what is in your heart. The Quran will speak.
        </p>
      </div>

      <QuranAnswers lang="en" standalone />

      <JsonLd
        data={{
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is Quran Answers?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Quran Answers pairs your question with a meaningful verse from the Quran. Every verse is authentic and sourced directly from the Holy Quran.',
              },
            },
            {
              '@type': 'Question',
              name: 'Is this fortune telling?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "No. This is not fortune telling. It surfaces authentic Quran verses as reminders of Allah's guidance. Every ayah is universally relevant.",
              },
            },
            {
              '@type': 'Question',
              name: 'Can I share my Quran answer?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes! Save or share the verse card directly to WhatsApp, Instagram, X, and more.',
              },
            },
          ],
        }}
      />

      {/* SEO Content Below Fold */}
      <section className="mt-16 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          The Quran Speaks to Every Heart
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p>
            Every verse of the Quran carries wisdom that transcends time and circumstance. Whatever
            weighs on your mind — ask, and let the words of Allah bring you clarity.
          </p>
          <p>
            This is not fortune telling. The Quran&apos;s beauty is that its verses are universally
            meaningful. Every ayah can speak to your situation, because Allah&apos;s words were
            meant for all of humanity, across all times.
          </p>
        </div>
      </section>

      <CrossToolLinks currentTool="answers" />
    </div>
  )
}
