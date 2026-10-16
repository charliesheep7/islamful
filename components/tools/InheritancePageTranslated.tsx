import { localizedPath, type Locale } from '@/utils/locale'
import InheritanceCalculator from './InheritanceCalculator'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import CrossToolLinks from '@/components/seo/CrossToolLinks'
import JsonLd from '@/components/seo/JsonLd'
import { inheritancePages } from '@/data/locales/inheritance-page'
export default function InheritancePageTranslated({ lang }: { lang: Locale }) {
  const c = inheritancePages[lang]
  return (
    <div
      className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <Breadcrumbs
        items={[{ name: c.title, href: localizedPath('/inheritance-calculator', lang) }]}
      />
      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{c.title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">{c.intro}</p>
      </div>
      <InheritanceCalculator lang={lang} />
      <section className="mt-16 space-y-6">
        <h2 className="text-2xl font-bold">{c.heading}</h2>
        {c.sections.map(([h, text]) => (
          <div key={h}>
            <h3 className="mb-2 text-xl font-semibold">{h}</h3>
            <p className="leading-relaxed">{text}</p>
          </div>
        ))}
      </section>
      <section className="mt-10 space-y-6">
        {c.questions.map(([q, a]) => (
          <div key={q}>
            <h2 className="mb-2 text-xl font-semibold">{q}</h2>
            <p>{a}</p>
          </div>
        ))}
      </section>
      <nav aria-label={c.sources} className="mt-8">
        <p className="font-semibold">{c.sources}</p>
        <div className="mt-2 flex gap-4">
          {[11, 12, 176].map((ayah) => (
            <a
              className="underline"
              key={ayah}
              href={`${localizedPath('/quran/an-nisaa', lang)}#ayah-${ayah}`}
            >
              4:{ayah}
            </a>
          ))}
        </div>
      </nav>
      <CrossToolLinks currentTool="inheritance-calculator" lang={lang} />
      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: c.title,
          description: c.description,
          url: `https://www.islamful.com${localizedPath('/inheritance-calculator', lang)}`,
          inLanguage: lang,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <JsonLd
        data={{
          '@type': 'FAQPage',
          mainEntity: c.questions.map(([name, text]) => ({
            '@type': 'Question',
            name,
            acceptedAnswer: { '@type': 'Answer', text },
          })),
        }}
      />
    </div>
  )
}
