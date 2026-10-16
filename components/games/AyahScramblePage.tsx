import AyahScramble from './AyahScramble'
import QuranSources from '@/components/quran/QuranSources'
import { chapters } from '@/data/quran'
import corpus from '@/data/quran/corpus.json'
import french from '@/data/quran/translations/fr.json'
import german from '@/data/quran/translations/de.json'
import { scrambleReferences } from '@/data/locales/scramble-game'
import type { Locale } from '@/utils/locale'

export default function AyahScramblePage({ lang = 'en' }: { lang?: Locale }) {
  const translation = lang === 'fr' ? french : lang === 'de' ? german : null
  const bank = scrambleReferences.map(([surah, start, end]) => {
    const verses = corpus.chapters[surah - 1].verses.slice(start - 1, end)
    const texts = verses.map((v) =>
      lang === 'ar'
        ? v.arabic
        : translation
          ? translation.chapters[surah - 1][v.number - 1].translation
          : v.translation
    )
    return {
      surah: lang === 'ar' ? chapters[surah - 1].nameAr : chapters[surah - 1].name,
      reference: `${surah}:${start}${end === start ? '' : `-${end}`}`,
      texts,
      words: texts.flatMap((text) => text.split(/\s+/)),
      footnotes: translation
        ? verses.map((v) => translation.chapters[surah - 1][v.number - 1].footnotes).filter(Boolean)
        : [],
    }
  })
  return (
    <>
      <AyahScramble bank={bank} lang={lang} />
      <QuranSources lang={lang} />
    </>
  )
}
