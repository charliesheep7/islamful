import { Metadata } from 'next'
import { translatedGame } from '@/data/locales/games'
import { gamePages } from '@/data/locales/game-pages'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'
import games from '@/data/games'
import CrossToolLinks from '@/components/seo/CrossToolLinks'

import IslamicWordle from '@/components/games/IslamicWordle'
import QuranVerseQuiz from '@/components/games/QuranVerseQuizPage'
import WuduSteps from '@/components/games/WuduSteps'
import SalahSequence from '@/components/games/SalahSequence'
import ProphetStoriesQuiz from '@/components/games/ProphetStoriesQuiz'
import PillarBuilder from '@/components/games/PillarBuilder'
import HadithOrNot from '@/components/games/HadithOrNot'
import AyahScramble from '@/components/games/AyahScramblePage'

const GAME_COMPONENTS: Record<string, React.ComponentType> = {
  'islamic-wordle': IslamicWordle,
  'quran-verse-quiz': QuranVerseQuiz,
  'wudu-steps': WuduSteps,
  'salah-sequence': SalahSequence,
  'prophet-stories-quiz': ProphetStoriesQuiz,
  'pillar-builder': PillarBuilder,
  'hadith-or-not': HadithOrNot,
  'ayah-scramble': AyahScramble,
}

export function generateStaticParams() {
  return ['ar', 'fr', 'de'].flatMap((lang) => games.map((game) => ({ lang, slug: game.slug })))
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string; lang: string }>
}): Promise<Metadata> {
  const { slug, lang } = await props.params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  const game = games.find((g) => g.slug === slug)
  if (!game) notFound()
  const translated = translatedGame(game, lang)
  const c = gamePages[lang]

  return {
    title: { absolute: `${translated.name} — ${c.free} | Islamful` },
    description: translated.description,
    alternates: buildLanguageAlternates(`/games/${slug}`, { currentLanguage: lang }),
    openGraph: {
      title: `${translated.name} — ${c.free} | Islamful`,
      description: translated.description,
      url: `https://www.islamful.com/${lang}/games/${slug}`,
    },
  }
}

export default async function GamePageAr(props: {
  params: Promise<{ slug: string; lang: string }>
}) {
  const { slug, lang } = await props.params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  const game = games.find((g) => g.slug === slug)
  if (!game) notFound()
  const translated = translatedGame(game, lang)
  const c = gamePages[lang]

  const GameComponent = GAME_COMPONENTS[slug]
  if (!GameComponent) notFound()

  return (
    <div
      className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <Breadcrumbs
        items={[
          { name: c.title, href: `/${lang}/games` },
          { name: translated.name, href: `/${lang}/games/${slug}` },
        ]}
      />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: `Islamful ${translated.name}`,
          description: translated.description,
          url: `https://www.islamful.com/${lang}/games/${slug}`,
          applicationCategory: 'GameApplication',
          operatingSystem: 'Web',
          inLanguage: lang,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        }}
      />

      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          {translated.name}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          {translated.description}
        </p>
      </div>

      {slug === 'quran-verse-quiz' ? (
        <QuranVerseQuiz lang={lang} />
      ) : slug === 'ayah-scramble' ? (
        <AyahScramble lang={lang} />
      ) : (
        <GameComponent />
      )}

      <CrossToolLinks currentTool={`games/${slug}`} lang={lang} />
    </div>
  )
}
