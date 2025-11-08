interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  faqs: FAQItem[]
}

export default function FAQ({ faqs }: FAQProps) {
  if (!faqs || faqs.length === 0) return null

  return (
    <section className="mt-12 mb-8">
      <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-accent-500 rounded-r border-l-4 bg-gray-50 py-2 pl-4 dark:bg-gray-800/50"
          >
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {faq.question}
            </h3>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">{faq.answer}</p>
          </div>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  )
}
