import QuranPagesTranslated, { translatedQuranMetadata } from './QuranPagesTranslated'
import Link from 'next/link'
import { Noto_Naskh_Arabic } from 'next/font/google'
import { notFound } from 'next/navigation'
import { buildLanguageAlternates } from 'app/seo'
import { chapters, quranPath } from '@/data/quran'
import corpus from '@/data/quran/corpus.json'
import JsonLd from '@/components/seo/JsonLd'
import QuranIndex from './QuranIndex'
import QuranReader from './QuranReader'
import QuranSources from './QuranSources'
const naskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: '400',
  display: 'swap',
  variable: '--font-quran',
})
export function quranMetadata(lang: 'en' | 'ar' | 'fr' | 'de', slug?: string) {
  if (lang === 'fr' || lang === 'de') return translatedQuranMetadata(lang, slug)
  const c = slug ? chapters.find((c) => c.slug === slug) : null
  const ar = lang === 'ar'
  const title = c
    ? ar
      ? `سورة ${c.nameAr} — قراءة واستماع`
      : `Surah ${c.name} — Arabic, English Translation & Audio`
    : ar
      ? 'القرآن الكريم — قراءة واستماع'
      : 'Read Quran — All 114 Surahs, English Translation & Audio'
  const description = c
    ? ar
      ? `اقرأ سورة ${c.nameAr} كاملة (${c.count} آية)، واستمع للتلاوة وكرّر الآيات واحفظ موضع قراءتك في هذا المتصفح.`
      : `Read all ${c.count} verses of Surah ${c.name} in Arabic with Talal Itani’s English translation. Listen, repeat a verse range, bookmark ayahs and save your place.`
    : ar
      ? 'اقرأ سور القرآن الكريم الـ114، وانتقل إلى الأجزاء والآيات واستمع للتلاوة واحفظ موضعك دون حساب.'
      : 'Read all 114 Quran surahs in Arabic with English translation, verse audio, repeat controls and saved reading places. No account needed.'
  return {
    title,
    description,
    alternates: buildLanguageAlternates(c ? `/quran/${c.slug}` : '/quran', {
      currentLanguage: lang,
    }),
  }
}
function Nav({ lang, slug }: { lang: 'en' | 'ar' | 'fr' | 'de'; slug?: string }) {
  const ar = lang === 'ar',
    c = chapters.find((c) => c.slug === slug),
    prefix = ar ? '/ar' : ''
  return (
    <nav
      aria-label={ar ? 'مسار التصفح' : 'Breadcrumb'}
      className="mb-6 flex flex-wrap gap-2 text-sm text-gray-500"
    >
      <Link href={prefix || '/'}>{ar ? 'الرئيسية' : 'Home'}</Link>
      <span>/</span>
      {c ? (
        <>
          <Link href={`${prefix}/quran`}>{ar ? 'القرآن الكريم' : 'Quran'}</Link>
          <span>/</span>
          <span aria-current="page">{ar ? c.nameAr : c.name}</span>
        </>
      ) : (
        <span aria-current="page">{ar ? 'القرآن الكريم' : 'Quran'}</span>
      )}
    </nav>
  )
}
export function QuranHome({ lang }: { lang: 'en' | 'ar' | 'fr' | 'de' }) {
  if (lang === 'fr' || lang === 'de')
    return <QuranPagesTranslated lang={lang} fontClass={naskh.variable} />
  const ar = lang === 'ar'
  return (
    <div
      className={`mx-auto max-w-6xl px-4 py-10 sm:px-6 ${naskh.variable}`}
      lang={lang}
      dir={ar ? 'rtl' : 'ltr'}
    >
      <Nav lang={lang} />
      <header className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold sm:text-4xl">
          {ar ? 'القرآن الكريم' : 'Read the Quran'}
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
          {ar
            ? 'السور الـ114 كاملة. اقرأ واستمع وكرّر الآيات، واحفظ موضعك للعودة إليه دون حساب.'
            : 'All 114 surahs, with Arabic text, English translation and recitation. Read at your pace, repeat verses and save your place without an account.'}
        </p>
      </header>
      <QuranIndex lang={lang} />
      <QuranSources lang={lang} />
      <JsonLd
        data={{
          '@type': 'CollectionPage',
          name: ar ? 'القرآن الكريم' : 'Quran reader',
          url: `https://www.islamful.com${ar ? '/ar' : ''}/quran`,
          inLanguage: lang,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: 114,
            itemListElement: chapters.map((c) => ({
              '@type': 'ListItem',
              position: c.number,
              name: ar ? c.nameAr : c.name,
              url: `https://www.islamful.com${quranPath(c, lang)}`,
            })),
          },
        }}
      />
    </div>
  )
}
export function QuranSurah({ lang, slug }: { lang: 'en' | 'ar' | 'fr' | 'de'; slug: string }) {
  if (lang === 'fr' || lang === 'de')
    return <QuranPagesTranslated lang={lang} slug={slug} fontClass={naskh.variable} />
  const c = chapters.find((c) => c.slug === slug)
  if (!c) notFound()
  const content = corpus.chapters[c.number - 1],
    ar = lang === 'ar'
  const title = ar ? `سورة ${c.nameAr}` : `Surah ${c.name}`
  return (
    <div
      className={`mx-auto max-w-4xl px-4 py-10 sm:px-6 ${naskh.variable}`}
      lang={lang}
      dir={ar ? 'rtl' : 'ltr'}
    >
      <Nav lang={lang} slug={slug} />
      <header className="mb-8 space-y-4 text-center">
        <p className="text-sm text-gray-500">
          {ar ? 'السورة' : 'Surah'} {c.number} · {c.count} {ar ? 'آية' : 'verses'}
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {!ar && (
          <p lang="ar" dir="rtl" className="quran-text text-3xl leading-loose">
            سورة {c.nameAr}
          </p>
        )}
        <p className="text-gray-600 dark:text-gray-300">
          {ar
            ? 'اقرأ السورة كاملة واستمع إليها، أو اختر نطاقًا قصيرًا للتكرار.'
            : `${c.meaning}. Read the complete surah, listen to its recitation or choose a short range to repeat.`}
        </p>
      </header>
      <noscript>
        <p className="mb-5 rounded-xl border p-4">
          {ar
            ? 'النص متاح كاملًا. فعّل جافاسكربت للصوت والحفظ وإعدادات القراءة.'
            : 'The complete text is available below. Enable JavaScript for audio, bookmarks and reading settings.'}
        </p>
      </noscript>
      <QuranReader
        key={`${lang}-${c.number}`}
        chapter={c}
        verses={content.verses}
        bismillah={content.bismillah}
        lang={lang}
      />
      <nav
        aria-label={ar ? 'السور المجاورة' : 'Adjacent surahs'}
        className="flex flex-wrap justify-between gap-4 border-t pt-6"
      >
        {c.number > 1 ? (
          <Link className="underline" href={quranPath(chapters[c.number - 2], lang)}>
            {ar ? 'السابقة:' : 'Previous:'}{' '}
            {ar ? chapters[c.number - 2].nameAr : chapters[c.number - 2].name}
          </Link>
        ) : (
          <span />
        )}
        {c.number < 114 && (
          <Link className="underline" href={quranPath(chapters[c.number], lang)}>
            {ar ? 'التالية:' : 'Next:'} {ar ? chapters[c.number].nameAr : chapters[c.number].name}
          </Link>
        )}
      </nav>
      <QuranSources lang={lang} />
      <JsonLd
        data={{
          '@type': 'WebPage',
          name: title,
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
    </div>
  )
}
