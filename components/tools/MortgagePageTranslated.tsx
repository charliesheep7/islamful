import { mortgagePages } from '@/data/locales/mortgage-page'
import IslamicMortgageCalculator from './IslamicMortgageCalculator'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import CrossToolLinks from '@/components/seo/CrossToolLinks'
import JsonLd from '@/components/seo/JsonLd'
export default function MortgagePageTranslated({ lang }: { lang: 'fr' | 'de' }) {
  const c = mortgagePages[lang]
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" lang={lang}>
      <Breadcrumbs items={[{ name: c.title, href: `/${lang}/islamic-mortgage` }]} />
      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: c.title,
          description: c.description,
          url: `https://www.islamful.com/${lang}/islamic-mortgage`,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          inLanguage: lang,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <header className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{c.title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">{c.intro}</p>
      </header>
      <IslamicMortgageCalculator lang={lang} />
      <section className="prose dark:prose-invert mt-16 max-w-none">
        <h2>{c.guide}</h2>
        {c.sections.map(([heading, text]) => (
          <section key={heading}>
            <h3>{heading}</h3>
            <p>{text}</p>
          </section>
        ))}
        <h2>{c.faq}</h2>
        {c.questions.map(([question, answer]) => (
          <section key={question}>
            <h3>{question}</h3>
            <p>{answer}</p>
          </section>
        ))}
        <h2>{c.sources}</h2>
        <ul>
          <li>
            <a href="https://www.bankofengland.co.uk/explainers/what-is-islamic-finance">
              Bank of England
            </a>
          </li>
          <li>
            <a href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/sharia-compliant-home-purchase-plans">
              MoneyHelper
            </a>
          </li>
          <li>
            <a href={`/${lang}/quran/al-baqarah#ayah-275`}>2:275–279</a>
          </li>
        </ul>
      </section>
      <JsonLd
        data={{
          '@type': 'FAQPage',
          mainEntity: c.questions.map(([question, answer]) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: { '@type': 'Answer', text: answer },
          })),
        }}
      />
      <CrossToolLinks currentTool="islamic-mortgage" lang={lang} />
    </div>
  )
}
