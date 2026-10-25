import RelatedReading from '@/components/seo/RelatedReading'
import {
  AdhkarHomeTranslated,
  AdhkarPageTranslated,
  translatedAdhkarMetadata,
} from './AdhkarPagesTranslated'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Noto_Naskh_Arabic } from 'next/font/google'
import { buildLanguageAlternates } from 'app/seo'
import { routines, type RoutineId } from '@/data/adhkar'
import corpus from '@/data/quran/corpus.json'
import QuranSources from '@/components/quran/QuranSources'
import JsonLd from '@/components/seo/JsonLd'
import AdhkarRoutine from './AdhkarRoutine'
const naskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: '400',
  display: 'swap',
  variable: '--font-quran',
})
export function adhkarMetadata(lang: 'en' | 'ar' | 'fr' | 'de', id?: string) {
  if (lang === 'fr' || lang === 'de') return translatedAdhkarMetadata(lang, id)
  const r = routines.find((r) => r.id === id),
    ar = lang === 'ar'
  if (id && !r) notFound()
  return {
    title: r
      ? (ar ? r.titleAr : r.title) +
        ' — ' +
        (ar ? 'نصوص ومصادر وعداد' : 'Arabic, Meanings & Counter')
      : ar
        ? 'الأذكار اليومية — الصباح والمساء وبعد الصلاة'
        : 'Daily Adhkar — Morning, Evening & After Prayer',
    description: r
      ? ar
        ? r.descriptionAr
        : r.description
      : ar
        ? 'اقرأ أذكار الصباح والمساء وبعد الصلاة مع المصادر والعدادات وحفظ التقدم في متصفحك.'
        : 'Read sourced morning, evening and after-prayer adhkar with Arabic text, English meanings and saved counters. No account required.',
    alternates: buildLanguageAlternates(id ? `/adhkar/${id}` : '/adhkar', {
      currentLanguage: lang,
    }),
  }
}
export function AdhkarNav({
  lang,
  current,
}: {
  lang: 'en' | 'ar' | 'fr' | 'de'
  current?: RoutineId
}) {
  const ar = lang === 'ar',
    prefix = ar ? '/ar' : ''
  return (
    <nav
      aria-label={ar ? 'أوقات الأذكار' : 'Adhkar routines'}
      className="mb-8 flex flex-wrap gap-3 text-sm"
    >
      <Link className="rounded-full border px-4 py-2" href={`${prefix}/adhkar`}>
        {ar ? 'كل الأذكار' : 'All routines'}
      </Link>
      {routines.map((r) => (
        <Link
          aria-current={current === r.id ? 'page' : undefined}
          className={`rounded-full border px-4 py-2 ${current === r.id ? 'bg-emerald-800 text-white' : ''}`}
          key={r.id}
          href={`${prefix}/adhkar/${r.id}`}
        >
          {ar ? r.titleAr : r.title}
        </Link>
      ))}
      <Link className="rounded-full border px-4 py-2" href={`${prefix}/dhikr`}>
        {ar ? 'عداد التسبيح' : 'Tasbeeh counter'}
      </Link>
    </nav>
  )
}
export function AdhkarHome({ lang }: { lang: 'en' | 'ar' | 'fr' | 'de' }) {
  if (lang === 'fr' || lang === 'de') return <AdhkarHomeTranslated lang={lang} />
  const ar = lang === 'ar',
    prefix = ar ? '/ar' : ''
  return (
    <div
      className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6"
      lang={lang}
      dir={ar ? 'rtl' : 'ltr'}
    >
      <header className="space-y-4">
        <p className="text-sm text-emerald-800 dark:text-emerald-300">
          {ar ? 'وقت للذكر، كل يوم' : 'A moment of remembrance, every day'}
        </p>
        <h1 className="text-4xl font-bold">{ar ? 'الأذكار اليومية' : 'Daily adhkar'}</h1>
        <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-300">
          {ar
            ? 'اختر أذكار الصباح أو المساء أو ما بعد الصلاة. النصوص والمصادر متاحة مباشرة؛ استخدم العدادات إن رغبت واحفظ موضعك في هذا المتصفح.'
            : 'Choose morning, evening or after-prayer remembrance. Read the texts and sources directly, or use the counters to keep your place in this browser.'}
        </p>
      </header>
      <div className="grid gap-5 md:grid-cols-3">
        {routines.map((r) => (
          <Link
            key={r.id}
            className="space-y-4 rounded-2xl border bg-white p-6 hover:border-emerald-700 dark:bg-gray-900"
            href={`${prefix}/adhkar/${r.id}`}
          >
            <h2 className="text-2xl font-semibold">{ar ? r.titleAr : r.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {ar ? r.descriptionAr : r.description}
            </p>
            <p className="font-medium text-emerald-800 dark:text-emerald-300">
              {ar ? 'افتح الأذكار ←' : 'Open routine →'}
            </p>
          </Link>
        ))}
      </div>
      <section className="space-y-3 rounded-2xl border p-6">
        <h2 className="text-xl font-semibold">
          {ar ? 'تسبيح بسيط' : 'Just want a tasbeeh counter?'}
        </h2>
        <p>
          {ar
            ? 'اختر إحدى صيغتي التسبيح المأثورتين بعد الصلاة، مع التراجع وإعادة البدء.'
            : 'Choose either narrated post-prayer tasbih sequence, with undo and restart controls.'}
        </p>
        <Link className="underline" href={`${prefix}/dhikr`}>
          {ar ? 'افتح عداد التسبيح' : 'Open the tasbeeh counter'}
        </Link>
      </section>
      <p className="text-sm text-gray-500">
        {ar
          ? 'هذه مجموعات مختارة وليست حصرًا لجميع الأذكار المأثورة. لكل نص مصدره، وتوجد صيغ صحيحة أخرى.'
          : 'These are selected collections, not an exhaustive catalogue of every narrated dhikr. Each text has its source; other established wordings also exist.'}
      </p>
      <JsonLd
        data={{
          '@type': 'CollectionPage',
          name: ar ? 'الأذكار اليومية' : 'Daily adhkar',
          inLanguage: lang,
          url: `https://www.islamful.com${prefix}/adhkar`,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: 3,
            itemListElement: routines.map((r, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: ar ? r.titleAr : r.title,
              url: `https://www.islamful.com${prefix}/adhkar/${r.id}`,
            })),
          },
        }}
      />
      <RelatedReading path="/adhkar" lang={lang} />
    </div>
  )
}
export function AdhkarPage({ lang, id }: { lang: 'en' | 'ar' | 'fr' | 'de'; id: string }) {
  if (lang === 'fr' || lang === 'de')
    return <AdhkarPageTranslated lang={lang} id={id} fontClass={naskh.variable} />
  const routine = routines.find((r) => r.id === id)
  if (!routine) notFound()
  const ar = lang === 'ar',
    prefix = ar ? '/ar' : ''
  const shortSurahs = Object.fromEntries(
    [112, 113, 114].map((n) => [
      n,
      { bismillah: corpus.chapters[n - 1].bismillah, verses: corpus.chapters[n - 1].verses },
    ])
  )
  return (
    <div
      className={`mx-auto max-w-4xl px-4 py-10 sm:px-6 ${naskh.variable}`}
      lang={lang}
      dir={ar ? 'rtl' : 'ltr'}
    >
      <AdhkarNav lang={lang} current={routine.id} />
      <header className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold sm:text-4xl">{ar ? routine.titleAr : routine.title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {ar ? routine.descriptionAr : routine.description}
        </p>
        <p className="text-sm text-gray-500">
          {ar
            ? 'مجموعة مختارة وليست حصرًا لجميع الأذكار. الأعداد المتكررة موثقة بجوار كل نص؛ و«مرة واحدة» علامة قراءة عندما لا يذكر المصدر عددًا. لا يلزم ترتيب جميع البطاقات بهذا الشكل.'
            : 'A selected collection, not an exhaustive list. Repeated counts are sourced beside each text; “read once” is a checklist marker where no repetition count is stated. The overall card order is not a prescribed sequence.'}
        </p>
      </header>
      <noscript>
        <p className="mb-5 rounded-xl border p-4">
          {ar
            ? 'يمكنك قراءة النصوص والمصادر كاملة. فعّل جافاسكربت للعدادات والحفظ والتلاوة.'
            : 'All texts and sources are readable below. Enable JavaScript for counters, saving progress and audio.'}
        </p>
      </noscript>
      <AdhkarRoutine routine={routine.id} lang={lang} surahs={shortSurahs} />
      <section className="space-y-4 border-t pt-6 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {ar ? 'عن هذه المجموعة' : 'About this collection'}
        </h2>
        <p>
          {ar
            ? 'تُقرأ أذكار الصباح في الصباح وأذكار المساء في المساء، وأذكار ما بعد الصلاة بعد الفراغ منها. يظل النص متاحًا للقراءة والتعلم في أي وقت. تاريخ العداد هو تاريخ جهازك المحلي، وليس تحديدًا لوقت عبادة أو حكمًا على صحتها.'
            : 'Use morning remembrance in the morning, evening remembrance in the evening, and post-prayer remembrance after finishing salah. Texts remain open for reading and learning at any time. The counter’s date follows your device and does not determine religious time boundaries.'}
        </p>
        <p>
          {ar
            ? 'المعاني الإنجليزية للأدعية شروح موجزة من تحرير إسلامفُل، وليست نقلًا حرفيًا لترجمة كتاب الحديث. ألفاظ الآيات وترجمتها من المصادر المبينة أدناه. نُسبت درجات الأحاديث إلى أصحابها حيث ذُكرت. روجعت المراجع في ١٣ أكتوبر ٢٠٢٦.'
            : 'English meanings of the supplications are concise Islamful editorial explanations, not verbatim translations from a hadith edition. Quran text and translation come from the sources below. Hadith grades name their assessor where shown. References checked 13 October 2026.'}
        </p>
        <p>
          {ar
            ? 'يتاح صوت سور الإخلاص والفلق والناس بصوت مشاري العفاسي. الاستماع لا يزيد العداد تلقائيًا. أضف قراءة إلى العداد بنفسك بعد أن تقرأ.'
            : 'Audio is available for Al-Ikhlas, Al-Falaq and An-Nas, recited by Mishary Alafasy. Listening does not increase the counters; record your own recitation when you choose.'}
        </p>
        <p>
          <Link className="underline" href={`${prefix}/prayer-times`}>
            {ar ? 'مواقيت الصلاة' : 'Prayer times'}
          </Link>{' '}
          ·{' '}
          <Link className="underline" href={`${prefix}/quran`}>
            {ar ? 'قراءة القرآن' : 'Read Quran'}
          </Link>{' '}
          ·{' '}
          <Link className="underline" href={`${prefix}/dua`}>
            {ar ? 'أدعية أخرى' : 'More duas'}
          </Link>
        </p>
      </section>
      <QuranSources lang={lang} />
      <RelatedReading path={`/adhkar/${id}`} lang={lang} />
      <JsonLd
        data={{
          '@type': 'WebPage',
          name: ar ? routine.titleAr : routine.title,
          inLanguage: lang,
          url: `https://www.islamful.com${prefix}/adhkar/${routine.id}`,
          description: ar ? routine.descriptionAr : routine.description,
        }}
      />
    </div>
  )
}
