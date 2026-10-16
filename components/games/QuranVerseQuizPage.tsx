import QuranVerseQuiz from './QuranVerseQuiz'
import QuranSources from '@/components/quran/QuranSources'
import { chapters } from '@/data/quran'
import corpus from '@/data/quran/corpus.json'
import french from '@/data/quran/translations/fr.json'
import german from '@/data/quran/translations/de.json'
import { quranQuizReferences } from '@/data/locales/quran-quiz'
import type { Locale } from '@/utils/locale'

export default function QuranVerseQuizPage({ lang = 'en' }: { lang?: Locale }) {
  const translation = lang === 'fr' ? french : lang === 'de' ? german : null
  const name = (number: number) =>
    lang === 'ar' ? chapters[number - 1].nameAr : chapters[number - 1].name
  const questions = quranQuizReferences.map(([surah, start, end, options]) => ({
    surah: name(surah),
    reference: `${surah}:${start}${end === start ? '' : `-${end}`}`,
    options: options.map(name),
    verses: corpus.chapters[surah - 1].verses.slice(start - 1, end).map((v) => ({
      text:
        lang === 'ar'
          ? v.arabic
          : translation
            ? translation.chapters[surah - 1][v.number - 1].translation
            : v.translation,
      footnotes: translation ? translation.chapters[surah - 1][v.number - 1].footnotes : '',
    })),
  }))
  return (
    <>
      <QuranVerseQuiz bank={questions} lang={lang} />
      <QuranSources lang={lang} />
    </>
  )
}
