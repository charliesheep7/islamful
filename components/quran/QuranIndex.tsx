'use client'
import { quranUi } from '@/data/locales/quran-ui'
import { useMemo, useState } from 'react'
import { chapterMeanings } from '@/data/locales/quran-chapters'
import Link from 'next/link'
import { chapters, juzStarts, quranPath, reference, searchKey } from '@/data/quran'
import { useReaderData } from './useReaderData'

export default function QuranIndex({ lang }: { lang: 'en' | 'ar' | 'fr' | 'de' }) {
  const ar = lang === 'ar',
    t = (en: string, arabic: string) => (ar ? arabic : lang === 'en' ? en : quranUi[lang][en] || en)
  const [query, setQuery] = useState('')
  const { data, clear, available, ready } = useReaderData(lang)
  const ref = reference(query)
  const filtered = useMemo(() => {
    const key = searchKey(query.replace(/\b(surah|surat|sura|sourate|sure)\b|سورة|سوره/gi, ''))
    if (!key) return chapters
    if (reference(query)) return [reference(query)!.chapter]
    return chapters.filter((c) =>
      [
        c.name,
        c.nameAr,
        c.slug,
        c.meaning,
        lang === 'fr' || lang === 'de' ? chapterMeanings[lang][c.number - 1] : '',
        String(c.number),
      ].some((s) => searchKey(s).includes(key))
    )
  }, [query, lang])
  const number = (n: number) =>
    new Intl.NumberFormat(ar ? 'ar' : 'en', {
      numberingSystem: ar ? 'arab' : 'latn',
      useGrouping: false,
    }).format(n)
  return (
    <div data-testid="quran-index" className="space-y-8">
      {ready && !available && (
        <p role="status" className="rounded-xl border p-4 text-sm">
          {t(
            'This browser cannot load saved reading data. You can still read every surah.',
            'لا يستطيع هذا المتصفح تحميل بيانات القراءة المحفوظة. يمكنك قراءة جميع السور.'
          )}
        </p>
      )}
      {data.place && (
        <section className="rounded-2xl bg-emerald-50 p-5 dark:bg-emerald-950">
          <h2 className="mb-2 font-semibold">
            {t('Continue from your saved place', 'تابع من موضعك المحفوظ')}
          </h2>
          <Link
            data-testid="resume-quran"
            className="underline underline-offset-4"
            href={quranPath(chapters[data.place.surah - 1], lang, data.place.ayah)}
          >
            {ar ? chapters[data.place.surah - 1].nameAr : chapters[data.place.surah - 1].name} ·{' '}
            {t('Verse', 'الآية')} {number(data.place.ayah)}
          </Link>
        </section>
      )}
      {data.bookmarks.length > 0 && (
        <details className="rounded-xl border p-4">
          <summary className="cursor-pointer font-medium">
            {t('Your bookmarks', 'علاماتك المرجعية')} ({number(data.bookmarks.length)})
          </summary>
          <ul className="mt-4 flex flex-wrap gap-3">
            {data.bookmarks.map((p) => (
              <li key={`${p.surah}:${p.ayah}`}>
                <Link className="underline" href={quranPath(chapters[p.surah - 1], lang, p.ayah)}>
                  {ar ? chapters[p.surah - 1].nameAr : chapters[p.surah - 1].name} {number(p.ayah)}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      )}
      {(data.place || data.bookmarks.length > 0) && (
        <button type="button" className="text-sm underline" onClick={clear}>
          {t(
            'Clear saved place, bookmarks and preferences',
            'مسح الموضع والعلامات والتفضيلات المحفوظة'
          )}
        </button>
      )}
      <section className="space-y-3">
        <h2 className="text-xl font-bold">{t('Quick access', 'وصول سريع')}</h2>
        <div className="flex flex-wrap gap-3">
          {[1, 18, 36, 55, 67, 112].map((n) => (
            <Link
              key={n}
              href={quranPath(chapters[n - 1], lang)}
              className="rounded-full border border-emerald-700/20 bg-white px-4 py-2 dark:bg-gray-900"
            >
              {ar ? chapters[n - 1].nameAr : chapters[n - 1].name}
            </Link>
          ))}
        </div>
      </section>
      <div>
        <label htmlFor="quran-surah-search" className="mb-2 block font-medium">
          {t('Find a surah or verse reference', 'ابحث عن سورة أو مرجع آية')}
        </label>
        <input
          id="quran-surah-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('Al-Mulk, الكهف, 67 or 2:255', 'الملك، Al-Kahf، ٦٧ أو ٢:٢٥٥')}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base dark:border-gray-700 dark:bg-gray-900"
        />
        <p className="mt-2 text-sm text-gray-500" role="status">
          {number(filtered.length)} {t('surahs', 'سورة')}
        </p>
      </div>
      <ul data-testid="surah-list" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <li key={c.number}>
            <Link
              prefetch={false}
              href={quranPath(c, lang, ref?.chapter.number === c.number ? ref.ayah : undefined)}
              className="flex h-full gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-emerald-600 dark:border-gray-800 dark:bg-gray-900"
            >
              <span className="text-sm text-gray-500">{number(c.number)}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{ar ? c.nameAr : c.name}</span>
                <span className="mt-1 block text-sm text-gray-500">
                  {ar ? c.name : lang === 'en' ? c.meaning : chapterMeanings[lang][c.number - 1]}
                </span>
                <span className="mt-2 block text-xs text-gray-500">
                  {number(c.count)} {t('verses', 'آية')}
                  {ref?.chapter.number === c.number &&
                    ` · ${t('Go to verse', 'انتقل للآية')} ${number(ref.ayah)}`}
                </span>
              </span>
              {!ar && (
                <span lang="ar" dir="rtl" className="self-center text-xl">
                  {c.nameAr}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && (
        <p>
          {t(
            'No matching surah. Try its Arabic/English name or a reference such as 2:255.',
            'لا توجد سورة مطابقة. جرّب الاسم العربي أو الإنجليزي أو مرجعًا مثل ٢:٢٥٥.'
          )}
        </p>
      )}
      <section>
        <h2 className="mb-4 text-xl font-bold">{t('Start a juz', 'بداية الجزء')}</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {juzStarts.map((j) => (
            <Link
              key={j.number}
              prefetch={false}
              className="rounded-xl border p-3 text-center"
              href={quranPath(chapters[j.surah - 1], lang, j.ayah)}
            >
              {t('Juz', 'الجزء')} {number(j.number)}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
