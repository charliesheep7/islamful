'use client'

import { pillarGame, pillarArabic } from '@/data/locales/pillar-game'
import { useLocale } from '@/components/hooks/useLocale'

import { useState, useEffect } from 'react'

const PILLARS = [1, 2, 3, 4, 5]

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function PillarBuilder() {
  const { currentLang } = useLocale()
  const c = pillarGame[currentLang]
  const [shuffledDescriptions, setShuffledDescriptions] = useState(PILLARS)
  useEffect(() => setShuffledDescriptions(shuffleArray(PILLARS)), [])
  const [matches, setMatches] = useState<Record<number, number | null>>({})
  const [selectedPillar, setSelectedPillar] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [completed, setCompleted] = useState(false)

  const handlePillarClick = (pillarId: number) => {
    if (checked || completed) return
    setSelectedPillar(pillarId === selectedPillar ? null : pillarId)
  }

  const handleDescriptionClick = (descPillarId: number) => {
    if (checked || completed || selectedPillar === null) return

    // Remove any existing match for this pillar or description
    const updated = { ...matches }
    Object.entries(updated).forEach(([key, val]) => {
      if (val === descPillarId) updated[Number(key)] = null
    })
    updated[selectedPillar] = descPillarId
    setMatches(updated)
    setSelectedPillar(null)
  }

  const checkAnswers = () => {
    setChecked(true)
    const allCorrect = PILLARS.every((p) => matches[p] === p)
    if (allCorrect) setCompleted(true)
  }

  const reset = () => {
    setMatches({})
    setSelectedPillar(null)
    setChecked(false)
    setCompleted(false)
  }

  const matchedDescriptions = new Set(Object.values(matches).filter(Boolean))

  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">{c.instruction}</p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pillars column */}
        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-400 uppercase dark:text-gray-500">
            {c.pillars}
          </h3>
          <div className="space-y-2">
            {PILLARS.map((pillar) => {
              const isSelected = selectedPillar === pillar
              const isMatched = matches[pillar] !== undefined && matches[pillar] !== null
              const isCorrect = checked && matches[pillar] === pillar
              const isWrong = checked && matches[pillar] !== pillar && isMatched

              return (
                <button
                  key={pillar}
                  data-pillar-id={pillar}
                  aria-pressed={isSelected}
                  disabled={checked || completed}
                  onClick={() => handlePillarClick(pillar)}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-start transition-all ${
                    completed
                      ? 'border-teal-400 bg-teal-50 dark:border-teal-600 dark:bg-teal-900/20'
                      : isCorrect
                        ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-900/20'
                        : isWrong
                          ? 'border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/20'
                          : isSelected
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md'
                            : isMatched
                              ? 'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20'
                              : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {c.items[pillar - 1][0]}
                    </span>
                    <span lang="ar" dir="rtl" className="font-arabic text-sm text-gray-400">
                      {pillarArabic[pillar - 1]}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Descriptions column */}
        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-400 uppercase dark:text-gray-500">
            {c.descriptions}
          </h3>
          <div className="space-y-2">
            {shuffledDescriptions.map((desc) => {
              const isUsed = matchedDescriptions.has(desc)
              const isCorrectMatch =
                checked &&
                Object.entries(matches).some(([k, v]) => v === desc && Number(k) === desc)

              return (
                <button
                  key={desc}
                  data-description-id={desc}
                  onClick={() => handleDescriptionClick(desc)}
                  disabled={checked || completed || (isUsed && selectedPillar === null)}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-start text-sm transition-all ${
                    completed
                      ? 'border-teal-400 bg-teal-50 dark:border-teal-600 dark:bg-teal-900/20'
                      : isCorrectMatch
                        ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-900/20'
                        : checked && isUsed && !isCorrectMatch
                          ? 'border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/20'
                          : isUsed
                            ? 'border-blue-300 bg-blue-50 opacity-60 dark:border-blue-600 dark:bg-blue-900/20'
                            : selectedPillar
                              ? 'hover:border-primary-300 hover:bg-primary-50 dark:hover:border-primary-500 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                              : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                  }`}
                >
                  {c.items[desc - 1][1]}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        {!completed ? (
          <>
            <button
              onClick={checkAnswers}
              disabled={Object.keys(matches).filter((k) => matches[Number(k)] !== null).length < 5}
              className="bg-primary-500 hover:bg-primary-600 rounded-xl px-6 py-3 font-semibold text-white transition disabled:opacity-40"
            >
              {c.check}
            </button>
            <button
              onClick={reset}
              className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {c.reset}
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-lg font-bold text-teal-600">{c.success}</p>
            <button
              onClick={reset}
              className="bg-primary-500 hover:bg-primary-600 rounded-xl px-6 py-3 font-semibold text-white transition"
            >
              {c.again}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
