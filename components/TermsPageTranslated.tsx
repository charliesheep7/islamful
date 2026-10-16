import Link from 'next/link'
import SectionContainer from '@/components/SectionContainer'
import { termsPages } from '@/data/locales/terms'

export default function TermsPageTranslated({ lang }: { lang: 'fr' | 'de' }) {
  const c = termsPages[lang]
  return (
    <SectionContainer>
      <div className="prose dark:prose-invert max-w-none py-8" dir="ltr">
        <h1>{c.title}</h1>
        <p>
          <strong>{c.updated}</strong>
        </p>
        <p>{c.intro}</p>
        {c.sections.map(([title, blocks], sectionIndex) => (
          <section key={title}>
            <h2>{title}</h2>
            {blocks.map((block, index) => {
              if (typeof block !== 'string')
                return (
                  <ul key={index}>
                    {block.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )
              if (sectionIndex === 20)
                return (
                  <p key={index}>
                    <Link href={`/${lang}/support`}>{block}</Link>
                  </p>
                )
              if (sectionIndex === 8)
                return (
                  <p key={index}>
                    <Link href={`/${lang}/privacy`}>{block}</Link>
                  </p>
                )
              return <p key={index}>{block}</p>
            })}
          </section>
        ))}
      </div>
    </SectionContainer>
  )
}
