'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Dictionary } from '@/types/dictionary'
import JsonLd from '@/components/seo/JsonLd'

interface FAQProps {
  lang?: string
  dict?: Dictionary
}

const defaultFaqs = [
  {
    question: 'What is Islamful?',
    answer:
      'Islamful is an all-in-one Islamic tools platform — prayer times, halal/haram checker, Quran, dua, dhikr, and more. All free on the web.',
  },
  {
    question: 'How accurate are the prayer times?',
    answer:
      'Powered by the Aladhan API with multiple calculation methods (ISNA, MWL, Umm Al-Qura, etc). Choose the method used by your local mosque.',
  },
  {
    question: 'How does the Haram Checker work?',
    answer:
      'Search for food items, ingredients, or products to get halal/haram rulings with scholarly references and explanations.',
  },
  {
    question: 'Is Islamful free?',
    answer:
      'Yes. All core tools are completely free. We believe every Muslim should have easy access to essential Islamic tools.',
  },
  {
    question: 'What tools are coming next?',
    answer:
      'Quran reader, dua collection, dhikr counter, 99 Names of Allah, Islamic calendar, and zakat calculator.',
  },
]

export default function FAQ({ lang = 'en', dict }: FAQProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const faqItems = dict?.faq?.items || defaultFaqs
  const isRTL = lang === 'ar'

  return (
    <section className="bg-white py-16 sm:py-24 dark:bg-gray-950">
      <JsonLd
        data={{
          '@type': 'FAQPage',
          mainEntity: faqItems.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2
            className={`mb-3 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white ${isRTL ? 'font-arabic' : ''}`}
          >
            {dict?.faq?.heading || 'Frequently Asked Questions'}
          </h2>
          <p className={`text-gray-600 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
            {dict?.faq?.subtitle || 'Everything you need to know about Islamful'}
          </p>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-800" role="list">
          {faqItems.map((faq, index) => {
            const isExpanded = expandedIndex === index
            const answerId = `faq-answer-${index}`

            return (
              <div key={index} role="listitem">
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  aria-expanded={isExpanded}
                  aria-controls={answerId}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span
                    className={`text-base font-medium text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={answerId}
                  role="region"
                  hidden={!isExpanded}
                  className={isExpanded ? 'pb-5' : ''}
                >
                  {isExpanded && (
                    <p
                      className={`leading-relaxed text-gray-600 dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}
                    >
                      {faq.answer}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Contact */}
        <div className="mt-10 text-center">
          <p className={`mb-3 text-gray-600 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
            {dict?.faq?.stillHaveQuestions || 'Still have questions?'}
          </p>
          <a
            href="mailto:hello@islamful.com"
            className="font-medium text-[var(--color-accent-600)] hover:text-[var(--color-accent-700)] dark:text-[var(--color-accent-400)]"
          >
            {dict?.faq?.contactSupport || 'Contact Us'} &rarr;
          </a>
        </div>
      </div>
    </section>
  )
}
