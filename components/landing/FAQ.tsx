import type { Dictionary } from '@/types/dictionary'
import JsonLd from '@/components/seo/JsonLd'

export default function FAQ({ lang = 'en', dict }: { lang?: string; dict: Dictionary }) {
  const faqItems = dict.faq.items
  return (
    <section
      className="bg-white py-12 sm:py-20 dark:bg-gray-950"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <JsonLd
        data={{
          '@type': 'FAQPage',
          mainEntity: faqItems.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="mb-8 text-3xl font-bold">{dict.faq.heading}</h2>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {faqItems.map((faq) => (
            <details key={faq.question} className="py-5">
              <summary className="cursor-pointer text-base font-semibold">{faq.question}</summary>
              <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300">{faq.answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-8">
          {dict.faq.stillHaveQuestions}{' '}
          <a className="underline" href="mailto:hello@infinique.org">
            {dict.faq.contactSupport}
          </a>
        </p>
      </div>
    </section>
  )
}
