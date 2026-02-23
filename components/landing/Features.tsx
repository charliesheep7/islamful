'use client'

import { useState } from 'react'
import { BookOpen, ShieldCheck, Star, TrendingUp, Users, EyeOff, X } from 'lucide-react'
import type { Dictionary } from '@/types/dictionary'

interface FeaturesProps {
  lang?: string
  dict?: Dictionary
}

const features = [
  {
    id: 'quran-sos',
    icon: BookOpen,
    title: 'Quran SOS',
    description:
      "When urges arise, open SOS Quran and be guided to read a short Qur'an verse, reflect on its meaning, and answer prompts designed to slow you down and reset your focus.",
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    comingSoon: false,
    fullDescription:
      "The Quran SOS mode is your first line of defense when temptation strikes. Open the app and you'll be guided through a short Qur'an verse carefully selected to interrupt the impulse cycle. You'll reflect on its meaning and answer simple prompts designed to slow your mind, restore intention, and reconnect with Allah. The experience is gamified to encourage consistency — each session builds awareness, reduces guilt, and strengthens your iman over time.",
  },
  {
    id: 'panic-button',
    icon: ShieldCheck,
    title: 'Panic Button',
    description:
      'Feeling overwhelmed or distracted? One tap brings you immediate grounding: calming dhikr, guided dua, and reflection prompts to interrupt impulses and restore clarity.',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-600 dark:text-orange-400',
    comingSoon: false,
    fullDescription:
      "The Faith Button (Panic Button) is your emergency anchor when urges or anxiety overwhelm you. With a single tap, you enter a calming experience of dhikr and short guided dua — curated to interrupt the momentum of temptation. Reflection prompts guide you back to awareness, helping you reclaim control and return to a state of clarity. It's not just distraction — it's spiritual grounding rooted in the remembrance of Allah.",
  },
  {
    id: 'dua-dhikr',
    icon: Star,
    title: 'Guided Dua & Dhikr',
    description:
      'Engage in structured sessions of dua and dhikr designed for daily use. These short practices quiet the mind, increase spiritual awareness, and build steady remembrance throughout your day.',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    comingSoon: false,
    fullDescription:
      'Daily dhikr and dua are the foundation of a spiritually protected life. Deen Back provides structured, accessible sessions that fit into any schedule — morning adhkar, evening remembrance, and throughout the day. Each practice is accompanied by transliteration, translation, and meaning, so your heart is fully engaged. Over time, consistent remembrance builds a protective spiritual layer and makes turning to Allah your natural response to any challenge.',
  },
  {
    id: 'iman-tracker',
    icon: TrendingUp,
    title: 'Iman Tracker',
    description:
      "Track your consistency across daily spiritual practices. Monitor Qur'an sessions, remembrance habits, and clean streaks. Your progress reflects commitment, discipline, and gradual growth.",
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    comingSoon: false,
    fullDescription:
      "The Iman Tracker turns your spiritual journey into a visible, meaningful progression. Monitor your Qur'an reading, dhikr completion, dua practice, and clean streaks all in one place. Streaks motivate consistency, while the tracking data helps you identify patterns — when you struggle most, what helps most. Recovery is not linear, and the tracker is designed to encourage and not condemn, reflecting commitment and gradual growth.",
  },
  {
    id: 'support-group',
    icon: Users,
    title: 'Support Group',
    description:
      'You do not have to struggle alone. Connect with a respectful, faith-centered community where members encourage one another, share accountability, and pursue intentional living together.',
    iconBg: 'bg-teal-100 dark:bg-teal-900/30',
    iconColor: 'text-teal-600 dark:text-teal-400',
    comingSoon: false,
    fullDescription:
      'Isolation is one of the biggest dangers on the path of recovery. The Deen Back Support Group connects you with a moderated, faith-first community of brothers and sisters who understand the struggle. Share wins, seek advice, give encouragement — all within an environment of mutual respect and Islamic values. Accountability partners and group challenges help you stay committed even when motivation dips. You are part of the Ummah, and this community reflects that.',
  },
  {
    id: 'content-blocker',
    icon: EyeOff,
    title: 'Content & Site Blocker',
    description:
      'Customize your digital environment by filtering distracting or unwanted content. Create a cleaner, more intentional phone experience aligned with your personal values.',
    iconBg: 'bg-gray-100 dark:bg-gray-800/50',
    iconColor: 'text-gray-500 dark:text-gray-400',
    comingSoon: true,
    fullDescription:
      'The Content & Site Blocker will let you take control of what enters your eyes and mind. Block specific sites, filter harmful content categories, and set time-based restrictions — all from within Deen Back. A clean digital environment removes the triggers that lead to relapse. This feature is built not just to block, but to replace — pairing restrictions with positive Islamic content and reminders, so your phone becomes an ally in your recovery.',
  },
]

export default function Features({ lang = 'en', dict }: FeaturesProps) {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)

  const openModal = (featureId: string) => {
    setSelectedFeature(featureId)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedFeature(null)
    document.body.style.overflow = 'unset'
  }

  const activeFeature = features.find((f) => f.id === selectedFeature)

  /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */
  return (
    <>
      <section id="features" className="bg-white py-20 sm:py-28 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16 text-center">
            <h2
              className={`mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white ${lang === 'ar' ? 'font-arabic' : ''}`}
            >
              {dict?.features?.heading || 'Tools Built for Your Spiritual Recovery'}
            </h2>
            <p
              className={`mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl dark:text-gray-300 ${lang === 'ar' ? 'font-arabic' : ''}`}
            >
              {dict?.features?.subtitle ||
                "Turn difficult moments into growth with guided Qur'an, dhikr, and community accountability"}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <div
                  key={feature.id}
                  className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/50"
                >
                  {/* Coming Soon Badge — only for content blocker */}
                  {feature.comingSoon && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        {dict?.hero?.comingSoon || 'Coming Soon'}
                      </span>
                    </div>
                  )}

                  {/* Icon */}
                  <div className="mb-6 flex items-start">
                    <div
                      className={`rounded-xl p-3 ${feature.iconBg} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className={`h-8 w-8 ${feature.iconColor}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col">
                    <h3
                      className={`mb-3 text-xl font-bold text-gray-900 dark:text-white ${lang === 'ar' ? 'font-arabic' : ''}`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`mb-6 flex-1 leading-relaxed text-gray-600 dark:text-gray-400 ${lang === 'ar' ? 'font-arabic' : ''}`}
                    >
                      {feature.description}
                    </p>

                    {/* Learn More Button */}
                    <button
                      onClick={() => openModal(feature.id)}
                      className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent-500)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-accent-600)] hover:shadow-lg"
                    >
                      {dict?.features?.learnMore || 'Learn More'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedFeature && activeFeature && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={closeModal}
          role="presentation"
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Icon */}
            <div className="mb-6 flex items-center gap-4">
              <div className={`rounded-xl p-3 ${activeFeature.iconBg}`}>
                <activeFeature.icon className={`h-8 w-8 ${activeFeature.iconColor}`} />
              </div>
              {activeFeature.comingSoon && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {dict?.hero?.comingSoon || 'Coming Soon'}
                </span>
              )}
            </div>

            {/* Content */}
            <h3
              className={`mb-4 text-2xl font-bold text-gray-900 dark:text-white ${lang === 'ar' ? 'font-arabic' : ''}`}
            >
              {activeFeature.title}
            </h3>
            <p
              className={`mb-6 leading-relaxed text-gray-600 dark:text-gray-400 ${lang === 'ar' ? 'font-arabic' : ''}`}
            >
              {activeFeature.fullDescription}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <a
                href="https://apps.apple.com/tn/app/deen-back-daily-dua-dhikr/id6755876142"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg bg-[var(--color-accent-500)] px-6 py-3 text-center text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-accent-600)] hover:shadow-lg"
              >
                Download Now
              </a>
              <button
                onClick={closeModal}
                className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
