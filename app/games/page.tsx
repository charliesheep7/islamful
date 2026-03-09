import { Metadata } from 'next'
import Link from '@/components/Link'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'
import games from '@/data/games'
import CrossToolLinks from '@/components/seo/CrossToolLinks'

export const metadata: Metadata = {
  title: 'Islamic Games — Fun Islamic Quizzes & Learning Games',
  description:
    'Play fun Islamic games and quizzes. Test your knowledge of the Quran, prophets, hadith, prayer, and more. Educational and entertaining for all ages.',
  alternates: buildLanguageAlternates('/games'),
  openGraph: {
    title: 'Islamic Games — Fun Quizzes & Learning Games | Islamful',
    description:
      'Play fun Islamic games and quizzes. Test your knowledge of the Quran, prophets, hadith, prayer, and more.',
    url: 'https://www.islamful.com/games',
  },
}

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Games', href: '/games' }]} />

      <JsonLd
        data={{
          '@type': 'CollectionPage',
          name: 'Islamic Games & Quizzes',
          description:
            'A collection of fun, educational Islamic games and quizzes to test and improve your knowledge of Islam.',
          url: 'https://www.islamful.com/games',
        }}
      />

      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          Islamic Games
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Learn and have fun with Islamic quizzes, word games, and interactive challenges. Perfect
          for all ages.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {games.map((game) => {
          const Icon = game.icon
          const shortDesc = game.description.split('.')[0] + '.'

          return (
            <Link key={game.slug} href={`/games/${game.slug}`} className="group no-underline">
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/30 bg-white/50 px-4 py-6 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:px-5 sm:py-8 dark:border-white/10 dark:bg-white/[0.06]">
                <Icon
                  className="mb-3 h-6 w-6 text-gray-400 transition-colors group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                  strokeWidth={1.5}
                />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{game.name}</h3>
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Learn Islam Through Play
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p>
            These interactive Islamic games are designed to make learning about Islam fun and
            engaging. Whether you are a new Muslim, a student, or simply want to test your
            knowledge, these games cover essential topics including Quran verses, prophet stories,
            hadith authentication, prayer steps, and more.
          </p>
          <h3>Games for All Ages</h3>
          <p>
            From <strong>Islamic Wordle</strong> with a new word every day, to hands-on learning
            games like <strong>Wudu Steps</strong> and <strong>Salah Sequence</strong>, there is
            something for everyone. Children can learn the basics of prayer and ablution, while
            adults can challenge themselves with hadith verification and Quran verse identification.
          </p>
          <h3>Educational and Fun</h3>
          <p>
            Each game is built to be educational first. Correct answers come with explanations,
            Quran references, and hadith sources so you learn something new every time you play.
          </p>
        </div>
      </section>

      <CrossToolLinks currentTool="games" />
    </div>
  )
}
