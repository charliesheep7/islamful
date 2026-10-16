import { notFound } from 'next/navigation'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
import SectionContainer from '@/components/SectionContainer'
import { supportPages } from '@/data/locales/information'
export function generateStaticParams() {
  return ['ar', 'fr', 'de'].map((lang) => ({ lang }))
}
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  const c = supportPages[lang]
  return genPageMetadata({
    title: c.title,
    description: c.description,
    alternates: buildLanguageAlternates('/support', { currentLanguage: lang }),
  })
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  const c = supportPages[lang]
  return (
    <SectionContainer>
      <div className="prose dark:prose-invert max-w-none py-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <h1>{c.title}</h1>
        <p>{c.intro}</p>
        <h2>{c.heading}</h2>
        <ul>
          {c.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </SectionContainer>
  )
}
