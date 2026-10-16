import QuranAnswers from './QuranAnswers'
import QuranSources from '@/components/quran/QuranSources'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import CrossToolLinks from '@/components/seo/CrossToolLinks'
import JsonLd from '@/components/seo/JsonLd'
import { answersCopy } from '@/data/locales/answers'
import { answerReferences } from '@/data/quran/answer-references'
import { chapters } from '@/data/quran'
import corpus from '@/data/quran/corpus.json'
import french from '@/data/quran/translations/fr.json'
import german from '@/data/quran/translations/de.json'
import { localizedPath, type Locale } from '@/utils/locale'

export default function QuranAnswersPage({ lang = 'en' }: { lang?: Locale }) {
  const c = answersCopy[lang]
  const translation = lang === 'fr' ? french : lang === 'de' ? german : null
  const bank = answerReferences.map(([surah, start, end]) => ({
    reference: `${surah}:${start}${end === start ? '' : `–${end}`}`,
    href: `${localizedPath(`/quran/${chapters[surah - 1].slug}`, lang)}#ayah-${start}`,
    verses: corpus.chapters[surah - 1].verses.slice(start - 1, end).map((v) => ({
      arabic: v.arabic,
      translation:
        lang === 'ar'
          ? ''
          : translation
            ? translation.chapters[surah - 1][v.number - 1].translation
            : v.translation,
      footnotes: translation ? translation.chapters[surah - 1][v.number - 1].footnotes : '',
    })),
  }))
  const credit = translation
    ? `${translation.publisher} · QuranEnc.com · v${translation.version} · ${translation.updated}`
    : lang === 'ar'
      ? ''
      : corpus.translationCredit + ' · CC BY-ND 4.0'
  const notices = [
    corpus.arabicNotice,
    translation?.notice || (lang === 'ar' ? '' : corpus.translationLicense),
  ]
    .filter(Boolean)
    .join('\n\n')
  return (
    <div
      className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <Breadcrumbs items={[{ name: c.title, href: localizedPath('/answers', lang) }]} />
      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{c.title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">{c.intro}</p>
      </div>
      <QuranAnswers lang={lang} bank={bank} credit={credit} notices={notices} />
      <section className="mt-12 space-y-6">
        {c.questions.map(([q, a]) => (
          <div key={q}>
            <h2 className="mb-2 text-xl font-semibold">{q}</h2>
            <p>{a}</p>
          </div>
        ))}
      </section>
      <QuranSources lang={lang} />
      <CrossToolLinks currentTool="answers" lang={lang} />
      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: c.title,
          description: c.description,
          url: `https://www.islamful.com${localizedPath('/answers', lang)}`,
          inLanguage: lang,
          applicationCategory: 'LifestyleApplication',
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
