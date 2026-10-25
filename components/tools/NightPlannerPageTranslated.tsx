import RelatedReading from '@/components/seo/RelatedReading'
import Link from 'next/link'
import NightPlanner from './NightPlanner'
import CrossToolLinks from '@/components/seo/CrossToolLinks'
import { nightPages } from '@/data/locales/night'
const sources = [
  'https://www.aliftaa.jo/QuestionPrintEn.aspx?QuestionId=1047',
  'https://sunnah.com/bukhari:1145',
  'https://islamqa.org/hanafi/qibla-hanafi/36297/',
  'https://aladhan.com/prayer-times-api',
]
export default function NightPlannerPageTranslated({ lang }: { lang: 'fr' | 'de' }) {
  const c = nightPages[lang]
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold sm:text-4xl">{c.title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">{c.description}</p>
      </header>
      <NightPlanner lang={lang} />
      <section className="prose dark:prose-invert max-w-none">
        <h2>{c.calculationTitle}</h2>
        <p>{c.calculation}</p>
        <p>{c.example}</p>
        <h2>{c.tahajjudTitle}</h2>
        <p>{c.tahajjud}</p>
        <h2>{c.sourcesTitle}</h2>
        <p>{c.limits}</p>
        <ul>
          {sources.map((href, i) => (
            <li key={href}>
              <a href={href}>{c.sources[i]}</a>
            </li>
          ))}
        </ul>
        <Link href={`/${lang}/prayer-times`}>{c.prayer}</Link>
      </section>
      <RelatedReading path="/last-third-of-night" lang={lang} />
      <CrossToolLinks currentTool="last-third-of-night" lang={lang} />
    </div>
  )
}
