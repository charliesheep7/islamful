import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'
import games from '@/data/games'
import CrossToolLinks from '@/components/seo/CrossToolLinks'

import IslamicWordle from '@/components/games/IslamicWordle'
import QuranVerseQuiz from '@/components/games/QuranVerseQuiz'
import WuduSteps from '@/components/games/WuduSteps'
import SalahSequence from '@/components/games/SalahSequence'
import ProphetStoriesQuiz from '@/components/games/ProphetStoriesQuiz'
import PillarBuilder from '@/components/games/PillarBuilder'
import HadithOrNot from '@/components/games/HadithOrNot'
import AyahScramble from '@/components/games/AyahScramble'

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

export async function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }))
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await props.params
  const game = games.find((g) => g.slug === slug)
  if (!game) return {}

  return {
    title: `${game.name} — Free Islamic Game | Islamful`,
    description: game.description,
    alternates: buildLanguageAlternates(`/games/${slug}`),
    openGraph: {
      title: `${game.name} — Free Islamic Game | Islamful`,
      description: game.description,
      url: `https://www.islamful.com/games/${slug}`,
    },
  }
}

export default async function GamePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const game = games.find((g) => g.slug === slug)
  if (!game) notFound()

  const GameComponent = GAME_COMPONENTS[slug]
  if (!GameComponent) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { name: 'Games', href: '/games' },
          { name: game.name, href: `/games/${slug}` },
        ]}
      />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: `Islamful ${game.name}`,
          description: game.description,
          url: `https://www.islamful.com/games/${slug}`,
          applicationCategory: 'GameApplication',
          operatingSystem: 'Web',
          inLanguage: 'en',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        }}
      />

      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          {game.name}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          {game.description}
        </p>
      </div>

      <GameComponent />

      <CrossToolLinks currentTool={`games/${slug}`} />
    </div>
  )
}
