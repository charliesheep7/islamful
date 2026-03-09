'use client'

import { useState, useCallback, useRef } from 'react'

interface Position {
  id: number
  name: string
  arabic: string
  description: string
}

const CORRECT_ORDER: Position[] = [
  {
    id: 1,
    name: 'Standing (Qiyam)',
    arabic: 'قيام',
    description:
      'Stand upright facing the Qibla. Raise hands and say "Allahu Akbar" (Takbiratul Ihram).',
  },
  {
    id: 2,
    name: 'Recitation (Qiraat)',
    arabic: 'قراءة',
    description: 'Recite Surah Al-Fatiha followed by another surah or verses from the Quran.',
  },
  {
    id: 3,
    name: 'Bowing (Ruku)',
    arabic: 'ركوع',
    description: 'Bow down with hands on knees, back straight, saying "Subhana Rabbiyal Adheem."',
  },
  {
    id: 4,
    name: 'Rising from Ruku',
    arabic: 'اعتدال',
    description: 'Rise from bowing, saying "Sami Allahu liman hamidah, Rabbana lakal hamd."',
  },
  {
    id: 5,
    name: 'First Prostration (Sujud)',
    arabic: 'سجود',
    description:
      'Prostrate with forehead, nose, palms, knees, and toes touching the ground. Say "Subhana Rabbiyal A\'la."',
  },
  {
    id: 6,
    name: 'Sitting between Sujud',
    arabic: 'جلسة',
    description: 'Sit briefly between the two prostrations, saying "Rabbi ighfir li."',
  },
  {
    id: 7,
    name: 'Second Prostration',
    arabic: 'سجود',
    description: 'Perform a second prostration the same as the first.',
  },
  {
    id: 8,
    name: 'Final Sitting (Tashahhud)',
    arabic: 'تشهد',
    description: 'Sit and recite At-Tahiyyat, Durood (salutations upon the Prophet), and dua.',
  },
  {
    id: 9,
    name: 'Tasleem (Salaam)',
    arabic: 'تسليم',
    description:
      'Turn head right then left saying "Assalamu alaikum wa rahmatullah" to end the prayer.',
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

export default function SalahSequence() {
  const [positions, setPositions] = useState<Position[]>(() => shuffleArray(CORRECT_ORDER))
  const [checked, setChecked] = useState(false)
  const [completed, setCompleted] = useState(false)

  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  const handleDragStart = (index: number) => {
    dragItem.current = index
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    dragOverItem.current = index
  }

  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null) return
    const updated = [...positions]
    const [moved] = updated.splice(dragItem.current, 1)
    updated.splice(dragOverItem.current, 0, moved)
    setPositions(updated)
    setChecked(false)
    dragItem.current = null
    dragOverItem.current = null
  }

  const moveItem = useCallback(
    (from: number, direction: 'up' | 'down') => {
      const to = direction === 'up' ? from - 1 : from + 1
      if (to < 0 || to >= positions.length) return
      const updated = [...positions]
      ;[updated[from], updated[to]] = [updated[to], updated[from]]
      setPositions(updated)
      setChecked(false)
    },
    [positions]
  )

  const checkOrder = () => {
    setChecked(true)
    const isCorrect = positions.every((pos, i) => pos.id === CORRECT_ORDER[i].id)
    if (isCorrect) setCompleted(true)
  }

  const reset = () => {
    setPositions(shuffleArray(CORRECT_ORDER))
    setChecked(false)
    setCompleted(false)
  }

  return (
    <div className="mx-auto max-w-lg">
      <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Arrange the positions of salah in the correct sequence. Drag and drop or use arrows.
      </p>

      <div className="space-y-2">
        {positions.map((pos, index) => {
          const isCorrect = checked && pos.id === CORRECT_ORDER[index].id
          const isWrong = checked && pos.id !== CORRECT_ORDER[index].id

          return (
            <div
              key={pos.id}
              draggable={!completed}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={handleDrop}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all ${
                completed
                  ? 'border-violet-400 bg-violet-50 dark:border-violet-600 dark:bg-violet-900/20'
                  : isCorrect
                    ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-900/20'
                    : isWrong
                      ? 'border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/20'
                      : 'border-gray-200 bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-800'
              } ${!completed ? 'cursor-grab active:cursor-grabbing' : ''}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 dark:text-white">{pos.name}</p>
                  <span className="font-arabic text-sm text-gray-400 dark:text-gray-500">
                    {pos.arabic}
                  </span>
                </div>
                {(checked || completed) && (
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {pos.description}
                  </p>
                )}
              </div>
              {!completed && (
                <div className="flex shrink-0 flex-col gap-0.5">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="rounded px-1.5 py-0.5 text-xs text-gray-400 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-700"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === positions.length - 1}
                    className="rounded px-1.5 py-0.5 text-xs text-gray-400 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-700"
                  >
                    ▼
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex justify-center gap-3">
        {!completed ? (
          <>
            <button
              onClick={checkOrder}
              className="bg-primary-500 hover:bg-primary-600 rounded-xl px-6 py-3 font-semibold text-white transition"
            >
              Check Sequence
            </button>
            <button
              onClick={reset}
              className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Shuffle
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-lg font-bold text-violet-600">
              Mashallah! You know the sequence of salah!
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
