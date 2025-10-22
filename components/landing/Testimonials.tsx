'use client'
import { useState } from 'react'
import { BookOpen, CheckCircle2, Mail, ChevronDown } from 'lucide-react'
import type { Dictionary } from '@/types/dictionary'

interface TestimonialsProps {
  lang?: string
  dict?: Dictionary
}

const testimonials = [
  {
    category: 'Spiritual Growth',
    icon: BookOpen,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    name: 'Aisha M.',
    title: 'New Revert',
    quote:
      'DeenUp helped me understand Islam with authentic Quranic guidance. The AI companion answered my questions with proper references.',
    fullStory:
      "As a new Muslim, I had so many questions about daily practices and Islamic teachings. DeenUp's AI companion provided instant answers backed by Quranic verses and Hadith references. I could ask anything at 3 AM and get authentic guidance. It's like having a knowledgeable friend available 24/7, helping me grow in my faith with confidence.",
  },
  {
    category: 'Daily Habits',
    icon: CheckCircle2,
    iconColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    name: 'Omar K.',
    title: 'Working Professional',
    quote:
      "The Daily Good Deen checklist keeps me consistent. I've built a 60-day streak and my faith has never been stronger.",
    fullStory:
      'Between work deadlines and family responsibilities, I was struggling to maintain my Islamic practices. The Daily Good Deen checklist helped me track my progress and build lasting habits. Seeing my streak grow motivated me to stay consistent with my prayers and Quran reading. The gentle reminders and beautiful unlocked postcards make spiritual growth feel rewarding.',
  },
  {
    category: 'Community Support',
    icon: Mail,
    iconColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    name: 'Fatima S.',
    title: 'University Student',
    quote:
      'The anonymous letters feature connected me with Muslims worldwide. I received encouragement during my hardest times.',
    fullStory:
      "Living far from family as a Muslim student felt isolating. Through DeenUp's letter feature, I connected with Muslim brothers and sisters globally. The anonymous support and encouragement I received reminded me I'm never alone in this journey. I've also been able to help others, which strengthened my own faith immensely. Truly a blessing.",
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
            {dict?.testimonials?.heading || 'Stories from the Ummah'}
          </h2>
          <p
            className={`mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl dark:text-gray-300 ${lang === 'ar' ? 'font-arabic' : ''}`}
          >
            {dict?.testimonials?.subtitle ||
              'See how DeenUp is helping Muslims strengthen their faith journey'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => {
            const Icon = testimonial.icon
            const isExpanded = expandedIndex === index

            return (
              <div
                key={index}
                className={`group relative rounded-2xl border-2 ${testimonial.borderColor} ${testimonial.bgColor} p-6 transition-all duration-300 hover:shadow-xl ${
                  isExpanded ? 'ring-2 shadow-2xl ring-[--color-accent-500]' : ''
                }`}
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
                    "{testimonial.quote}"
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
