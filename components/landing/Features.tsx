'use client'
import { BookOpen, CheckCircle2, Mail } from 'lucide-react'
import type { Dictionary } from '@/types/dictionary'

interface FeaturesProps {
  lang?: string
  dict?: Dictionary
}

export default function Features({ lang = 'en', dict }: FeaturesProps) {
  const features = [
    {
      icon: BookOpen,
      title: dict?.features?.aiCompanion?.title || 'Ask Anything, Anytime',
      description:
        dict?.features?.aiCompanion?.description ||
        'Get instant answers to your Islamic questions, backed by authentic Quranic citations and Hadith references. Your AI companion is available 24/7 to help guide you.',
      comingSoon: true,
      size: 'large', // PRIMARY FEATURE - Takes more space
    },
    {
      icon: CheckCircle2,
      title: dict?.features?.dailyChecklist?.title || 'Build Better Habits',
      description:
        dict?.features?.dailyChecklist?.description ||
        'Track your daily Islamic practices and watch your Deen grow stronger. Complete your Daily Good Deen checklist and build lasting spiritual habits.',
      comingSoon: true,
      size: 'medium',
    },
    {
      icon: Mail,
      title: dict?.features?.letters?.title || 'Connect with the Ummah',
      description:
        dict?.features?.letters?.description ||
        'Write and receive anonymous letters to help Muslim brothers and sisters around the globe. Share encouragement, seek advice, and strengthen bonds—like a message in a bottle across the Muslim world.',
      comingSoon: true,
      size: 'large',
    },
  ]
  return (
    <section id="features" className="bg-white py-20 sm:py-28 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2
            className={`mb-4 text-3xl font-bold text-[--color-text] sm:text-4xl lg:text-5xl dark:text-white ${lang === 'ar' ? 'font-arabic' : ''}`}
          >
            {dict?.features?.heading || 'Your Complete Islamic Companion'}
          </h2>
          <p
            className={`mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl dark:text-gray-300 ${lang === 'ar' ? 'font-arabic' : ''}`}
          >
            {dict?.features?.subtitle ||
              'Strengthen your Deen with guidance, habits, and community'}
          </p>
        </div>

        {/* Bento grid layout with varying sizes */}
        <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isLarge = feature.size === 'large'

            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-[--color-surface] to-[--color-bg] p-8 transition-all duration-500 hover:border-[--color-accent-300] hover:shadow-[--color-accent-500]/10 hover:shadow-xl dark:border-gray-700 dark:from-gray-900 dark:to-gray-800 dark:hover:border-[--color-accent-700] ${
                  isLarge ? 'md:col-span-2' : ''
                }`}
              >
                {/* Background gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[--color-accent-500]/0 to-[--color-accent-500]/0 transition-all duration-500 group-hover:from-[--color-accent-500]/5 group-hover:to-[--color-accent-500]/10" />

                {/* Coming Soon badge */}
                {feature.comingSoon && (
                  <div
                    className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} rounded-full bg-[--color-accent-100] px-3 py-1 text-xs font-semibold text-[--color-accent-700] dark:bg-[--color-accent-900] dark:text-[--color-accent-300] ${lang === 'ar' ? 'font-arabic' : ''}`}
                  >
                    {dict?.hero?.comingSoon || 'Coming Soon'}
                  </div>
                )}

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-4 w-fit rounded-xl bg-gradient-to-br from-[--color-accent-500] to-[--color-accent-600] p-3 shadow-[--color-accent-500]/30 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-[--color-accent-500]/50">
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <h3
                    className={`mb-3 text-xl font-bold text-[--color-text] transition-colors group-hover:text-[--color-accent-600] sm:text-2xl dark:text-white dark:group-hover:text-[--color-accent-400] ${lang === 'ar' ? 'font-arabic' : ''}`}
                  >
                    {feature.title}
                  </h3>

                  <p
                    className={`flex-grow leading-relaxed text-gray-600 dark:text-gray-300 ${lang === 'ar' ? 'font-arabic' : ''}`}
                  >
                    {feature.description}
                  </p>

                  {/* Hover indicator */}
                  <div
                    className={`mt-6 flex items-center text-sm font-medium text-[--color-accent-600] opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-[--color-accent-400] ${lang === 'ar' ? 'font-arabic' : ''}`}
                  >
                    <span className={lang === 'ar' ? 'ml-2' : 'mr-2'}>
                      {dict?.features?.learnMore || 'Learn more'}
                    </span>
                    <svg
                      className={`h-4 w-4 transition-transform ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
