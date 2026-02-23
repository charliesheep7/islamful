'use client'

import clsx from 'clsx'
import { BookOpen, ShieldCheck, ChevronDown, Users } from 'lucide-react'
import { useState } from 'react'
import type { Dictionary } from '@/types/dictionary'

interface TestimonialsProps {
  lang?: string
  dict?: Dictionary
}

const testimonials = [
  {
    category: 'Quran SOS',
    icon: BookOpen,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    name: 'Ahmad R.',
    title: 'University Student',
    quote:
      'The Quran SOS mode changed everything for me. Whenever I feel an urge, I open it immediately and the verses pull me back. I have not relapsed in 47 days.',
    fullStory:
      "I had struggled with a haram habit for years — ashamed, isolated, and feeling like Allah had given up on me. Deen Back showed me that Allah's mercy is greater than my weakness. The Quran SOS mode is the most powerful tool I have ever used. When the urge hits, I open it immediately and let the Qur'an words wash over me. The reflection prompts help me understand why I was feeling that way. 47 days clean and counting — not because I am strong, but because I learned to turn to Allah the moment I am weak.",
  },
  {
    category: 'Faith Button',
    icon: ShieldCheck,
    iconColor: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    name: 'Mariam K.',
    title: 'Working Professional',
    quote:
      'The Panic Button is my instant reset. Late nights at work used to be my weakness — now I tap it and do dhikr instead. My iman has never felt this steady.',
    fullStory:
      "I used to think my problem was unique to me, too embarrassing to share. Late nights working alone were always when I would slip. Deen Back's Panic Button changed my reaction completely — the moment I feel the pull, I tap it. The guided dhikr that comes up is so calming. I do not fight the urge with willpower alone anymore; I replace it with remembrance of Allah. My Iman Tracker now shows 3 months of consistent spiritual practice. That consistency has made me more present at work, more patient as a mother, and more connected to my Deen.",
  },
  {
    category: 'Support Group',
    icon: Users,
    iconColor: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-900/20',
    borderColor: 'border-teal-200 dark:border-teal-800',
    name: 'Yusuf T.',
    title: 'Father of Three',
    quote:
      'Knowing there are brothers going through the same struggle — and winning — gave me the courage to keep going. The support group is a real brotherhood.',
    fullStory:
      "The hardest part of my struggle was the silence. No one to talk to. Too ashamed to tell my wife or imam. When I found the Deen Back Support Group, I cried. Finally — brothers who understood, who did not judge, who shared the same fight. We remind each other of Allah when one of us is low. We celebrate each other's clean streaks. We hold each other accountable with kindness, not shame. Allah says believers are like a single body — when one part suffers, the rest responds. That is exactly what this group feels like.",
  },
]

export default function Testimonials({ lang = 'en', dict }: TestimonialsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <section className="bg-gradient-to-b from-white to-[--color-bg] py-20 sm:py-28 dark:from-gray-950 dark:to-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2
            className={`mb-4 text-3xl font-bold text-[--color-text] sm:text-4xl lg:text-5xl dark:text-white ${lang === 'ar' ? 'font-arabic' : ''}`}
          >
            {dict?.testimonials?.heading || 'Real Journeys Back to Allah'}
          </h2>
          <p
            className={`mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl dark:text-gray-300 ${lang === 'ar' ? 'font-arabic' : ''}`}
          >
            {dict?.testimonials?.subtitle ||
              'Brothers and sisters who used Deen Back to overcome their struggles and return to their Deen'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => {
            const Icon = testimonial.icon
            const isExpanded = expandedIndex === index

            return (
              <div
                key={index}
                className={clsx(
                  'group relative rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-xl',
                  testimonial.borderColor,
                  testimonial.bgColor,
                  isExpanded && ['ring-2', 'shadow-2xl', 'ring-[--color-accent-500]']
                )}
              >
                {/* Icon and category badge */}
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`rounded-lg p-2 ${testimonial.bgColor} border ${testimonial.borderColor}`}
                  >
                    <Icon className={`h-5 w-5 ${testimonial.iconColor}`} />
                  </div>
                  <span
                    className={`text-sm font-semibold ${testimonial.iconColor} tracking-wide uppercase`}
                  >
                    {testimonial.category}
                  </span>
                </div>

                {/* Quote */}
                <blockquote className="mb-4">
                  <p className="leading-relaxed text-gray-700 italic dark:text-gray-200">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </blockquote>

                {/* Expanded story */}
                {isExpanded && (
                  <div className="animate-fade-in mb-4 rounded-lg border border-gray-200 bg-white/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      {testimonial.fullStory}
                    </p>
                  </div>
                )}

                {/* Author info */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                  <div>
                    <p className="font-semibold text-[--color-text] dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.title}</p>
                  </div>
                </div>

                {/* Read more button */}
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[--color-accent-600] transition-all duration-200 hover:border-[--color-accent-300] hover:bg-[--color-surface] dark:border-gray-700 dark:bg-gray-800 dark:text-[--color-accent-400] dark:hover:border-[--color-accent-700] dark:hover:bg-gray-700 ${lang === 'ar' ? 'font-arabic' : ''}`}
                >
                  {isExpanded
                    ? dict?.testimonials?.showLess || 'Show less'
                    : dict?.testimonials?.readMore || 'Read full story'}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
