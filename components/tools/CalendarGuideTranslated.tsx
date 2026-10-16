import JsonLd from '@/components/seo/JsonLd'
import { calendarGuides } from '@/data/locales/calendar-guide'
const sources = [
  'https://unicode-org.github.io/icu/userguide/format_parse/datetime/',
  'https://sunnah.com/bukhari:1909',
  'https://sunnah.com/bukhari:2017',
  'https://sunnah.com/tirmidhi:761',
  'https://sunnah.com/muslim:1141a',
]
export default function CalendarGuideTranslated({ lang }: { lang: 'fr' | 'de' }) {
  const c = calendarGuides[lang]
  return (
    <section
      className="mt-12 space-y-7 border-t border-gray-200 pt-9 dark:border-gray-800"
      lang={lang}
    >
      <h2 className="text-2xl font-bold">{c.title}</h2>
      <p className="leading-relaxed text-gray-600 dark:text-gray-300">{c.intro}</p>
      {c.questions.map(([question, answer]) => (
        <div key={question}>
          <h3 className="text-lg font-semibold">{question}</h3>
          <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-300">{answer}</p>
        </div>
      ))}
      <div className="rounded-xl bg-gray-50 p-5 text-sm dark:bg-gray-900">
        <h3 className="font-semibold">{c.methodTitle}</h3>
        <p className="mt-3 leading-relaxed">{c.method}</p>
        <ul className="mt-4 space-y-2">
          {sources.map((href, i) => (
            <li key={href}>
              <a className="underline" href={href}>
                {c.sources[i]}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p>
        <a className="underline" href={`/${lang}/prayer-times`}>
          {c.prayer}
        </a>{' '}
        ·{' '}
        <a className="underline" href={`/${lang}/last-third-of-night`}>
          {c.night}
        </a>
      </p>
      <JsonLd
        data={{
          '@type': 'FAQPage',
          inLanguage: lang,
          mainEntity: c.questions.map(([name, text]) => ({
            '@type': 'Question',
            name,
            acceptedAnswer: { '@type': 'Answer', text },
          })),
        }}
      />
    </section>
  )
}
