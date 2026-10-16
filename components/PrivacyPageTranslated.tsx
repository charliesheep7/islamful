import Link from 'next/link'
import SectionContainer from '@/components/SectionContainer'
import { privacyPages } from '@/data/locales/privacy'

export default function PrivacyPageTranslated({ lang }: { lang: 'fr' | 'de' }) {
  const c = privacyPages[lang]
  return (
    <SectionContainer>
      <div className="prose dark:prose-invert max-w-none py-8" dir="ltr">
        <h1>{c.title}</h1>
        <p>
          <strong>{c.updated}</strong>
        </p>
        <p>{c.intro}</p>
        <p>
          <strong>{c.agreement}</strong>
        </p>
        {c.blocks.map(([type, text], index) => {
          if (type === 'li') {
            if (c.blocks[index - 1]?.[0] === 'li') return null
            const items: string[] = []
            for (let i = index; i < c.blocks.length && c.blocks[i][0] === 'li'; i++) {
              items.push(c.blocks[i][1])
            }
            return (
              <ul key={index}>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )
          }
          if (type === 'support')
            return (
              <p key={index}>
                <Link href={`/${lang}/support`}>{text}</Link>
              </p>
            )
          if (type === 'h2') return <h2 key={index}>{text}</h2>
          if (type === 'h3') return <h3 key={index}>{text}</h3>
          return <p key={index}>{text}</p>
        })}
      </div>
    </SectionContainer>
  )
}
