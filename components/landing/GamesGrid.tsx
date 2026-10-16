'use client'

import Link from '@/components/Link'
import { translatedGame } from '@/data/locales/games'
import type { Locale } from '@/utils/locale'
import games from '@/data/games'

export default function GamesGrid({ lang = 'en' }: { lang?: Locale }) {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            {
              {
                en: 'Learn through play.',
                ar: 'تعلّم باللعب.',
                fr: 'Apprenez en jouant.',
                de: 'Spielend lernen.',
              }[lang]
            }
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            {
              {
                en: 'Fun Islamic games and quizzes for all ages.',
                ar: 'ألعاب وأسئلة إسلامية لمختلف الأعمار.',
                fr: 'Des jeux et quiz islamiques pour tous les âges.',
                de: 'Islamische Spiele und Quizfragen für jedes Alter.',
              }[lang]
            }
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {games.map((game) => {
            const Icon = game.icon
            const translated = translatedGame(game, lang)
            const shortDesc = translated.description.split('.')[0] + '.'

            return (
              <Link key={game.slug} href={`/games/${game.slug}`} className="group no-underline">
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
      </div>
    </section>
  )
}
