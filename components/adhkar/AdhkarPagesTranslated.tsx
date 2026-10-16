import Link from 'next/link'
import { notFound } from 'next/navigation'
import { routines } from '@/data/adhkar'
import { adhkarRoutines } from '@/data/locales/adhkar'
import { adhkarPages } from '@/data/locales/adhkar-pages'
import { buildLanguageAlternates } from 'app/seo'
import corpus from '@/data/quran/corpus.json'
import french from '@/data/quran/translations/fr.json'
import german from '@/data/quran/translations/de.json'
import AdhkarRoutine from './AdhkarRoutine'
import QuranSources from '@/components/quran/QuranSources'
import JsonLd from '@/components/seo/JsonLd'
export function translatedAdhkarMetadata(lang: 'fr' | 'de', id?: string) {
  const r = routines.find((r) => r.id === id),
    c = adhkarPages[lang]
  if (id && !r) notFound()
  const text = r ? adhkarRoutines[lang][r.id] : null
  return {
    title: text ? `${text.title} — ${c.suffix}` : c.metadataTitle,
    description: text?.description || c.description,
    alternates: buildLanguageAlternates(id ? `/adhkar/${id}` : '/adhkar', {
      currentLanguage: lang,
    }),
  }
}
export function AdhkarHomeTranslated({ lang }: { lang: 'fr' | 'de' }) {
  const c = adhkarPages[lang]
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6" lang={lang}>
      <header className="space-y-4">
        <p className="text-sm text-emerald-800 dark:text-emerald-300">{c.eyebrow}</p>
        <h1 className="text-4xl font-bold">{c.title}</h1>
        <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-300">{c.intro}</p>
      </header>
      <div className="grid gap-5 md:grid-cols-3">
        {routines.map((r) => (
          <Link
            key={r.id}
            className="space-y-4 rounded-2xl border bg-white p-6 hover:border-emerald-700 dark:bg-gray-900"
            href={`/${lang}/adhkar/${r.id}`}
          >
            <h2 className="text-2xl font-semibold">{adhkarRoutines[lang][r.id].title}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {adhkarRoutines[lang][r.id].description}
            </p>
            <p className="font-medium text-emerald-800 dark:text-emerald-300">{c.open}</p>
          </Link>
        ))}
      </div>
      <section className="space-y-3 rounded-2xl border p-6">
        <h2 className="text-xl font-semibold">{c.tasbeehTitle}</h2>
        <p>{c.tasbeehIntro}</p>
        <Link className="underline" href={`/${lang}/dhikr`}>
          {c.tasbeehOpen}
        </Link>
      </section>
      <p className="text-sm text-gray-500">{c.selected}</p>
      <JsonLd
        data={{
          '@type': 'CollectionPage',
          name: c.title,
          inLanguage: lang,
          url: `https://www.islamful.com/${lang}/adhkar`,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: 3,
            itemListElement: routines.map((r, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: adhkarRoutines[lang][r.id].title,
              url: `https://www.islamful.com/${lang}/adhkar/${r.id}`,
            })),
          },
        }}
      />
    </div>
  )
}
export function AdhkarPageTranslated({
  lang,
  id,
  fontClass,
}: {
  lang: 'fr' | 'de'
  id: string
  fontClass: string
}) {
  const routine = routines.find((r) => r.id === id)
  if (!routine) notFound()
  const c = adhkarPages[lang],
    text = adhkarRoutines[lang][routine.id],
    translation = lang === 'fr' ? french : german
  const shortSurahs = Object.fromEntries(
    [112, 113, 114].map((n) => [
      n,
      {
        bismillah: corpus.chapters[n - 1].bismillah,
        verses: corpus.chapters[n - 1].verses.map((v, i) => ({
          ...v,
          ...translation.chapters[n - 1][i],
        })),
      },
    ])
  )
  return (
    <div className={`mx-auto max-w-4xl px-4 py-10 sm:px-6 ${fontClass}`} lang={lang}>
      <nav aria-label={c.navigation} className="mb-8 flex flex-wrap gap-3 text-sm">
        <Link className="rounded-full border px-4 py-2" href={`/${lang}/adhkar`}>
          {c.all}
        </Link>
        {routines.map((r) => (
          <Link
            key={r.id}
            aria-current={r.id === id ? 'page' : undefined}
            className={`rounded-full border px-4 py-2 ${r.id === id ? 'bg-emerald-800 text-white' : ''}`}
            href={`/${lang}/adhkar/${r.id}`}
          >
            {adhkarRoutines[lang][r.id].title}
          </Link>
        ))}
        <Link className="rounded-full border px-4 py-2" href={`/${lang}/dhikr`}>
          {c.tasbeeh}
        </Link>
      </nav>
      <header className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold sm:text-4xl">{text.title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">{text.description}</p>
        <p className="text-sm text-gray-500">{c.order}</p>
      </header>
      <noscript>
        <p className="mb-5 rounded-xl border p-4">{c.noScript}</p>
      </noscript>
      <AdhkarRoutine routine={routine.id} lang={lang} surahs={shortSurahs} />
      <section className="space-y-4 border-t pt-6 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{c.about}</h2>
        <p>{c.timing}</p>
        <p>{c.editorial}</p>
        <p>{c.audio}</p>
        <p>
          <Link className="underline" href={`/${lang}/prayer-times`}>
            {c.prayer}
          </Link>{' '}
          ·{' '}
          <Link className="underline" href={`/${lang}/quran`}>
            {c.quran}
          </Link>{' '}
          ·{' '}
          <Link className="underline" href={`/${lang}/dua`}>
            {c.dua}
          </Link>
        </p>
      </section>
      <QuranSources lang={lang} />
      <JsonLd
        data={{
          '@type': 'WebPage',
          name: text.title,
          inLanguage: lang,
          url: `https://www.islamful.com/${lang}/adhkar/${id}`,
          description: text.description,
        }}
      />
    </div>
  )
}
