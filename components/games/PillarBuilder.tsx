'use client'

import { useState, useMemo } from 'react'

interface Pillar {
  id: number
  name: string
  arabic: string
  description: string
}

const PILLARS: Pillar[] = [
  {
    id: 1,
    name: 'Shahada',
    arabic: 'الشهادة',
    description:
      'Declaration of faith: "There is no god but Allah, and Muhammad is the Messenger of Allah."',
  },
  {
    id: 2,
    name: 'Salah',
    arabic: 'الصلاة',
    description: 'Performing the five daily prayers at their prescribed times facing the Qibla.',
  },
  {
    id: 3,
    name: 'Zakat',
    arabic: 'الزكاة',
    description:
      'Giving 2.5% of qualifying wealth annually to those in need as obligatory charity.',
  },
  {
    id: 4,
    name: 'Sawm',
    arabic: 'الصوم',
    description:
      'Fasting during the month of Ramadan from dawn to sunset, abstaining from food, drink, and other needs.',
  },
  {
    id: 5,
    name: 'Hajj',
    arabic: 'الحج',
    description:
      'Pilgrimage to Makkah at least once in a lifetime for those who are physically and financially able.',
  },
]

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function PillarBuilder() {
  const shuffledDescriptions = useMemo(() => shuffleArray(PILLARS), [])
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
    const allCorrect = PILLARS.every((p) => matches[p.id] === p.id)
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
      <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Click a pillar, then click its matching description. Match all 5 pillars of Islam correctly.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pillars column */}
        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-400 uppercase dark:text-gray-500">
            Pillars
          </h3>
          <div className="space-y-2">
            {PILLARS.map((pillar) => {
              const isSelected = selectedPillar === pillar.id
              const isMatched = matches[pillar.id] !== undefined && matches[pillar.id] !== null
              const isCorrect = checked && matches[pillar.id] === pillar.id
              const isWrong = checked && matches[pillar.id] !== pillar.id && isMatched

              return (
                <button
                  key={pillar.id}
                  onClick={() => handlePillarClick(pillar.id)}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-left transition-all ${
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
                      {pillar.name}
                    </span>
                    <span className="font-arabic text-sm text-gray-400">{pillar.arabic}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Descriptions column */}
        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-400 uppercase dark:text-gray-500">
            Descriptions
          </h3>
          <div className="space-y-2">
            {shuffledDescriptions.map((desc) => {
              const isUsed = matchedDescriptions.has(desc.id)
              const isCorrectMatch =
                checked &&
                Object.entries(matches).some(([k, v]) => v === desc.id && Number(k) === desc.id)

              return (
                <button
                  key={desc.id}
                  onClick={() => handleDescriptionClick(desc.id)}
                  disabled={isUsed && selectedPillar === null}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-left text-sm transition-all ${
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
                  {desc.description}
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
              Check Matches
            </button>
            <button
              onClick={reset}
              className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Reset
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-lg font-bold text-teal-600">
              Mashallah! You know the 5 pillars of Islam!
            </p>
            <button
              onClick={reset}
              className="bg-primary-500 hover:bg-primary-600 rounded-xl px-6 py-3 font-semibold text-white transition"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
