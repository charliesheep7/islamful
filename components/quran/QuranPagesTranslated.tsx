import Link from 'next/link'
import { notFound } from 'next/navigation'
import { chapters, quranPath } from '@/data/quran'
import { quranPages } from '@/data/locales/quran-pages'
import { chapterMeanings } from '@/data/locales/quran-chapters'
import corpus from '@/data/quran/corpus.json'
import french from '@/data/quran/translations/fr.json'
import german from '@/data/quran/translations/de.json'
import { buildLanguageAlternates } from 'app/seo'
import JsonLd from '@/components/seo/JsonLd'
import QuranIndex from './QuranIndex'
import QuranReader from './QuranReader'
import QuranSources from './QuranSources'
export function translatedQuranMetadata(lang: 'fr' | 'de', slug?: string) {
  const c = chapters.find((c) => c.slug === slug),
    t = quranPages[lang]
  if (slug && !c) notFound()
  return {
    title: c ? `${t.surah} ${c.name} — ${t.suffix}` : t.metadataTitle,
    description: c ? t.chapterDescription(c.name, c.count) : t.description,
    alternates: buildLanguageAlternates(c ? `/quran/${c.slug}` : '/quran', {
      currentLanguage: lang,
    }),
  }
}
export default function QuranPagesTranslated({
  lang,
  slug,
  fontClass,
}: {
  lang: 'fr' | 'de'
  slug?: string
  fontClass: string
}) {
  const c = chapters.find((c) => c.slug === slug),
    t = quranPages[lang]
  if (slug && !c) notFound()
  const content = c ? corpus.chapters[c.number - 1] : null,
    translation = lang === 'fr' ? french : german
  const verses =
    c && content
      ? content.verses.map((v, i) => ({ ...v, ...translation.chapters[c.number - 1][i] }))
      : []
  return (
    <div
      className={`mx-auto ${c ? 'max-w-4xl' : 'max-w-6xl'} px-4 py-10 sm:px-6 ${fontClass}`}
      lang={lang}
    >
      <nav aria-label={t.breadcrumb} className="mb-6 flex flex-wrap gap-2 text-sm text-gray-500">
        <Link href={`/${lang}`}>{t.home}</Link>
        <span>/</span>
        {c ? (
          <>
            <Link href={`/${lang}/quran`}>{t.quran}</Link>
            <span>/</span>
            <span aria-current="page">{c.name}</span>
          </>
        ) : (
          <span aria-current="page">{t.quran}</span>
        )}
      </nav>
      {c && content ? (
        <>
          <header className="mb-8 space-y-4 text-center">
            <p className="text-sm text-gray-500">
              {t.surah} {c.number} · {c.count} {t.verses}
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">
              {t.surah} {c.name}
            </h1>
            <p lang="ar" dir="rtl" className="quran-text text-3xl leading-loose">
              سورة {c.nameAr}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              {chapterMeanings[lang][c.number - 1]}. {t.chapterIntro}
            </p>
          </header>
          <noscript>
            <p className="mb-5 rounded-xl border p-4">{t.noScript}</p>
          </noscript>
          <QuranReader
            key={`${lang}-${c.number}`}
            chapter={c}
            verses={verses}
            bismillah={content.bismillah}
            lang={lang}
          />
          <nav
            aria-label={t.adjacent}
            className="flex flex-wrap justify-between gap-4 border-t pt-6"
          >
            {c.number > 1 ? (
              <Link className="underline" href={quranPath(chapters[c.number - 2], lang)}>
                {t.previous} {chapters[c.number - 2].name}
              </Link>
            ) : (
              <span />
            )}
            {c.number < 114 && (
              <Link className="underline" href={quranPath(chapters[c.number], lang)}>
                {t.next} {chapters[c.number].name}
              </Link>
            )}
          </nav>
          <JsonLd
            data={{
              '@type': 'WebPage',
              name: `${t.surah} ${c.name}`,
              url: `https://www.islamful.com${quranPath(c, lang)}`,
              inLanguage: lang,
              mainEntity: {
                '@type': 'Chapter',
                name: `سورة ${c.nameAr}`,
                position: c.number,
                inLanguage: 'ar',
                isPartOf: { '@type': 'Book', name: 'القرآن الكريم' },
              },
            }}
          />
        </>
      ) : (
        <>
          <header className="mb-8 space-y-3">
            <h1 className="text-3xl font-bold sm:text-4xl">{t.title}</h1>
            <p className="max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              {t.intro}
            </p>
          </header>
          <QuranIndex lang={lang} />
          <JsonLd
            data={{
              '@type': 'CollectionPage',
              name: t.title,
              url: `https://www.islamful.com/${lang}/quran`,
              inLanguage: lang,
              mainEntity: {
                '@type': 'ItemList',
                numberOfItems: 114,
                itemListElement: chapters.map((c) => ({
                  '@type': 'ListItem',
                  position: c.number,
                  name: c.name,
                  url: `https://www.islamful.com${quranPath(c, lang)}`,
                })),
              },
            }}
          />
        </>
      )}
      <QuranSources lang={lang} />
    </div>
  )
}
