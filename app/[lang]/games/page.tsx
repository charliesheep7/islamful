import { notFound } from 'next/navigation'
import { gamePages } from '@/data/locales/game-pages'
import { translatedGame } from '@/data/locales/games'
import Link from '@/components/Link'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'
import games from '@/data/games'
import CrossToolLinks from '@/components/seo/CrossToolLinks'

export function generateStaticParams() {
  return ['ar', 'fr', 'de'].map((lang) => ({ lang }))
}
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  const c = gamePages[lang]
  return {
    title: c.metadata,
    description: c.description,
    alternates: buildLanguageAlternates('/games', { currentLanguage: lang }),
    openGraph: {
      title: c.metadata,
      description: c.description,
      url: `https://www.islamful.com/${lang}/games`,
    },
  }
}
export default async function GamesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  const c = gamePages[lang]
  return (
    <div
      className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <Breadcrumbs items={[{ name: c.title, href: `/${lang}/games` }]} />

      <JsonLd
        data={{
          '@type': 'CollectionPage',
          name: c.title,
          description: c.description,
          url: `https://www.islamful.com/${lang}/games`,
          inLanguage: lang,
        }}
      />

      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          {c.title}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          {c.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {games.map((game) => {
          const Icon = game.icon
          const translated = translatedGame(game, lang)
          const shortDesc = translated.description.split('.')[0] + '.'

          return (
            <Link
              key={game.slug}
              href={`/${lang}/games/${game.slug}`}
              className="group no-underline"
            >
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/30 bg-white/50 px-4 py-6 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:px-5 sm:py-8 dark:border-white/10 dark:bg-white/[0.06]">
                <Icon
                  className="mb-3 h-6 w-6 text-gray-400 transition-colors group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                  strokeWidth={1.5}
                />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {translated.name}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                  {shortDesc}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* SEO Content */}
      <section className="mt-16 space-y-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{c.learn}</h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p>{c.intro}</p>
          <h3>{c.ages}</h3>
          <p>{c.agesText}</p>
          <h3>{c.education}</h3>
          <p>{c.educationText}</p>
        </div>
      </section>

      <CrossToolLinks currentTool="games" lang={lang} />
    </div>
  )
}
