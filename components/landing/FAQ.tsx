'use client'
import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import type { Dictionary } from '@/types/dictionary'

interface FAQProps {
  lang?: string
  dict?: Dictionary
}

const faqs = [
  {
    question: "How can I trust the Islamic accuracy of DeenUp's guidance?",
    answer:
      "DeenUp does not rely on AI to generate Islamic rulings. Instead, we use AI as a powerful search tool to help you find authentic guidance directly from the Holy Quran and authentic Hadith. Every answer includes proper citations and references to original sources, allowing you to verify the information yourself. Our AI helps you access the wisdom of the Quran more efficiently, but the guidance comes from Allah's words, not artificial intelligence.",
  },
  {
    question: 'Is DeenUp suitable for new Muslims and reverts?',
    answer:
      'Absolutely! DeenUp is designed for Muslims at all stages of their faith journey. New Muslims and reverts particularly benefit from our 24/7 AI companion that can answer questions anytime, without judgment. The Daily Good Deen checklist helps establish foundational habits, and the community letter feature connects you with supportive brothers and sisters worldwide.',
  },
  {
    question: 'How does the anonymous letter feature work?',
    answer:
      'The letter feature allows you to write and receive anonymous messages to help Muslim brothers and sisters globally. You can share encouragement, ask for advice, or offer support—all while maintaining privacy. This feature is inspired by Quran 4:114, encouraging charity, goodness, and making peace between people. Every letter is moderated to ensure it aligns with Islamic values.',
  },
  {
    question: 'Can I customize the Daily Good Deen checklist?',
    answer:
      'Yes! While DeenUp provides a default checklist based on essential Islamic practices, you can customize it to match your personal spiritual goals and daily routine. Track prayers, Quran reading, dhikr, charity, and other acts of worship that are meaningful to your faith journey.',
  },
  {
    question: 'What languages does DeenUp support?',
    answer:
      'DeenUp currently supports English and Arabic, with the interface automatically switching to right-to-left (RTL) layout for Arabic. We chose these languages to serve both English-speaking Muslims globally and Arabic-speaking Muslims in the Middle East and North Africa. More languages may be added based on community needs.',
  },
]

export default function FAQ({ lang = 'en', dict }: FAQProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const faqItems = dict?.faq?.items || faqs

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
            {dict?.faq?.subtitle || 'Everything you need to know about DeenUp'}
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

        {/* Additional help */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-gradient-to-br from-[--color-surface] to-[--color-bg] p-8 text-center dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
          <p
            className={`mb-4 text-lg text-gray-600 dark:text-gray-300 ${lang === 'ar' ? 'font-arabic' : ''}`}
          >
            {dict?.faq?.stillHaveQuestions || 'Still have questions?'}
          </p>
          <a
            href="mailto:support@deenup.app"
            className={`inline-flex items-center gap-2 rounded-lg bg-[--color-accent-600] px-6 py-3 font-semibold text-white shadow-[--color-accent-500]/30 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[--color-accent-700] ${lang === 'ar' ? 'font-arabic' : ''}`}
          >
            {dict?.faq?.contactSupport || 'Contact Support'}
          </a>
        </div>
      </div>
    </section>
  )
}
