import Link from 'next/link'
import { allBlogs } from 'contentlayer/generated'
import { chapters } from '@/data/quran'
import { routines } from '@/data/adhkar'
import { adhkarRoutines } from '@/data/locales/adhkar'
import { isLocale, localizedPath } from '@/utils/locale'

// Resolve curated destinations against published content, never invent translated URLs.
const clusters = [
  {
    match: /wudu|ghusl/,
    articles: [
      'how-to-perform-wudu',
      'does-sleeping-break-wudu',
      'does-bleeding-break-wudu',
      'does-vomiting-break-wudu',
    ],
    tools: [],
  },
  {
    match: /tahajjud|witr|last-third|qiyam/,
    articles: ['how-to-pray-tahajjud', 'how-to-pray-witr', 'how-to-pray-fajr'],
    tools: [],
  },
  {
    match: /quran|surah|ayah|islamic-wordle/,
    articles: [
      'how-to-read-quran-for-beginners',
      'how-to-memorize-the-quran',
      'how-to-recite-quran-with-tajweed',
    ],
    tools: ['/quran/al-fatihah', '/quran/al-mulk', '/quran/al-kahf'],
  },
  {
    match: /dua|adhkar|dhikr/,
    articles: [
      'dua-for-leaving-the-house',
      'dua-for-entering-home',
      'dua-for-waking-up',
      'dua-for-sleeping',
    ],
    tools: ['/adhkar/morning', '/adhkar/evening'],
  },
  {
    match: /lobster|sushi|crab|halal-vs-haram/,
    articles: ['is-sushi-haram', 'is-lobster-haram', 'is-crab-haram', 'halal-vs-haram'],
    tools: [],
  },
  {
    match: /prayer-times|salah|pray-fajr/,
    articles: ['how-to-perform-wudu', 'how-to-pray-fajr', 'how-to-pray-tahajjud'],
    tools: [],
  },
]
const headings = {
  en: 'Continue learning',
  ar: 'تابع التعلّم',
  fr: 'Pour approfondir',
  de: 'Weiterlesen',
}

export default function RelatedReading({ path, lang = 'en' }: { path: string; lang?: string }) {
  const locale = isLocale(lang) ? lang : 'en'
  const cluster = clusters.find((group) => group.match.test(path))
  if (!cluster) return null
  const current = localizedPath(path.startsWith('/') ? path : `/${path}`, locale)
  const articles = cluster.articles.flatMap((slug) => {
    const post = allBlogs.find((p) => p.slug === slug && p.lang === locale && !p.draft)
    return post ? [{ href: localizedPath(`/blog/${slug}`, locale), title: post.title }] : []
  })
  const destinations = cluster.tools.flatMap((route) => {
    const slug = route.split('/')[2]
    const chapter = chapters.find((c) => c.slug === slug)
    const routine = routines.find((r) => r.id === slug)
    const title = chapter
      ? locale === 'ar'
        ? `سورة ${chapter.nameAr}`
        : `Surah ${chapter.name}`
      : routine
        ? locale === 'ar'
          ? routine.titleAr
          : locale === 'en'
            ? routine.title
            : adhkarRoutines[locale][routine.id].title
        : null
    return title ? [{ href: localizedPath(route, locale), title }] : []
  })
  const links = [...destinations, ...articles].filter((item) => item.href !== current).slice(0, 6)
  if (!links.length) return null
  return (
    <aside
      className="not-prose my-8 rounded-xl border border-gray-200 p-5 dark:border-gray-700"
      data-search-cluster="related-reading"
    >
      <h2 className="mb-3 text-lg font-semibold">{headings[locale]}</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              className="text-primary-600 dark:text-primary-400 hover:underline"
              href={item.href}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
