'use client'
import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import type { Dictionary } from '@/types/dictionary'

interface FAQProps {
  lang?: string
  dict?: Dictionary
}

const defaultFaqs = [
  {
    question: 'What is Deen Back and who is it for?',
    answer:
      "Deen Back is an Islamic app designed to help Muslims overcome addiction to haram content — including pornography, social media compulsion, and other harmful habits. Whether you are struggling in secret or simply want to build stronger spiritual discipline, Deen Back provides guided tools rooted in the Qur'an and Sunnah.",
  },
  {
    question: 'How does Quran SOS work?',
    answer:
      "When urges arise, open Quran SOS and you will be guided to read a short Qur'an verse, reflect on its meaning, and answer simple prompts designed to slow you down and reset your focus. The experience is gamified to encourage consistency and progress. Each session helps reduce guilt, increase awareness, and strengthen iman over time.",
  },
  {
    question: 'What is the Panic Button (Faith Button)?',
    answer:
      'The Faith Button offers immediate grounding when you feel overwhelmed or tempted. With one tap, access calming dhikr, short guided dua, and reflection prompts designed to interrupt impulses and help you regain clarity and control.',
  },
  {
    question: 'Is my data and activity private?',
    answer:
      'Yes. Your spiritual journey is personal. Deen Back is designed with your privacy in mind — your sessions, streaks, and progress are only visible to you. The Support Group uses respectful, moderated communication without exposing your personal activity.',
  },
  {
    question: 'What subscription plans are available?',
    answer:
      'A Deen Back subscription is required for full access to features and content. Payment is charged to your iTunes Account at confirmation of purchase. Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current billing period. You can manage or cancel your subscription anytime in your iTunes Account Settings.',
  },
]

export default function FAQ({ lang = 'en', dict }: FAQProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const faqItems = dict?.faq?.items || defaultFaqs

  return (
    <section className="bg-white py-20 sm:py-28 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[--color-accent-200] bg-[--color-accent-100] px-4 py-2 dark:border-[--color-accent-800] dark:bg-[--color-accent-900]">
            <HelpCircle className="h-4 w-4 text-[--color-accent-600] dark:text-[--color-accent-400]" />
            <span
              className={`text-sm font-semibold text-[--color-accent-700] dark:text-[--color-accent-300] ${lang === 'ar' ? 'font-arabic' : ''}`}
            >
              {dict?.faq?.badge || 'FAQ'}
            </span>
          </div>
          <h2
            className={`mb-4 text-3xl font-bold text-[--color-text] sm:text-4xl lg:text-5xl dark:text-white ${lang === 'ar' ? 'font-arabic' : ''}`}
          >
            {dict?.faq?.heading || 'Frequently asked questions'}
          </h2>
          <p
            className={`text-lg text-gray-600 dark:text-gray-300 ${lang === 'ar' ? 'font-arabic' : ''}`}
          >
            {dict?.faq?.subtitle || 'Everything you need to know about Deen Back'}
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((faq, index) => {
            const isExpanded = expandedIndex === index

            return (
              <div
                key={index}
                className={`rounded-xl border-2 transition-all duration-300 ${
                  isExpanded
                    ? 'border-[--color-accent-300] bg-[--color-surface] shadow-lg dark:border-[--color-accent-700] dark:bg-gray-800'
                    : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600'
                }`}
              >
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
                >
                  <span
                    className={`pr-4 text-lg font-semibold text-[--color-text] dark:text-white ${lang === 'ar' ? 'font-arabic' : ''}`}
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-6 w-6 flex-shrink-0 text-[--color-accent-600] transition-transform duration-300 dark:text-[--color-accent-400] ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="animate-fade-in px-6 pb-5">
                    <p
                      className={`leading-relaxed text-gray-600 dark:text-gray-300 ${lang === 'ar' ? 'font-arabic' : ''}`}
                    >
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Contact support */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-gradient-to-br from-[--color-surface] to-[--color-bg] p-8 text-center dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
          <p
            className={`mb-4 text-lg text-black dark:text-white ${lang === 'ar' ? 'font-arabic' : ''}`}
          >
            {dict?.faq?.stillHaveQuestions || 'Still have questions?'}
          </p>
          <a
            href="mailto:vip@deenback.com"
            className={`inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent-500)] px-10 py-4 text-xl font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[var(--color-accent-600)] ${lang === 'ar' ? 'font-arabic' : ''}`}
          >
            {dict?.faq?.contactSupport || 'Contact Us'}
          </a>
        </div>
      </div>
    </section>
  )
}
