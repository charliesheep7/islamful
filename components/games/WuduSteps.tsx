'use client'

import { useState, useCallback, useRef } from 'react'

interface Step {
  id: number
  name: string
  description: string
}

const CORRECT_ORDER: Step[] = [
  {
    id: 1,
    name: 'Intention (Niyyah)',
    description: 'Make the intention in your heart to perform wudu for the sake of Allah.',
  },
  {
    id: 2,
    name: 'Say Bismillah',
    description: 'Begin by saying "Bismillah" (In the name of Allah).',
  },
  { id: 3, name: 'Wash Hands', description: 'Wash both hands up to the wrists three times.' },
  {
    id: 4,
    name: 'Rinse Mouth',
    description: 'Take water into the mouth and rinse it three times.',
  },
  {
    id: 5,
    name: 'Sniff Water into Nose',
    description: 'Sniff water into the nostrils and blow it out three times.',
  },
  {
    id: 6,
    name: 'Wash Face',
    description: 'Wash the entire face three times, from hairline to chin.',
  },
  {
    id: 7,
    name: 'Wash Arms',
    description: 'Wash the right arm then left arm up to the elbows three times each.',
  },
  {
    id: 8,
    name: 'Wipe Head',
    description: 'Wipe over the head with wet hands from front to back and back to front.',
  },
  {
    id: 9,
    name: 'Wipe Ears',
    description: 'Wipe the inside and outside of both ears with wet fingers.',
  },
  {
    id: 10,
    name: 'Wash Feet',
    description: 'Wash the right foot then left foot up to the ankles three times each.',
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

export default function WuduSteps() {
  const [steps, setSteps] = useState<Step[]>(() => shuffleArray(CORRECT_ORDER))
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
    const updated = [...steps]
    const [moved] = updated.splice(dragItem.current, 1)
    updated.splice(dragOverItem.current, 0, moved)
    setSteps(updated)
    setChecked(false)
    dragItem.current = null
    dragOverItem.current = null
  }

  const moveItem = useCallback(
    (from: number, direction: 'up' | 'down') => {
      const to = direction === 'up' ? from - 1 : from + 1
      if (to < 0 || to >= steps.length) return
      const updated = [...steps]
      ;[updated[from], updated[to]] = [updated[to], updated[from]]
      setSteps(updated)
      setChecked(false)
    },
    [steps]
  )

  const checkOrder = () => {
    setChecked(true)
    const isCorrect = steps.every((step, i) => step.id === CORRECT_ORDER[i].id)
    if (isCorrect) setCompleted(true)
  }

  const reset = () => {
    setSteps(shuffleArray(CORRECT_ORDER))
    setChecked(false)
    setCompleted(false)
  }

  return (
    <div className="mx-auto max-w-lg">
      <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Drag and drop (or use arrows) to arrange the steps of wudu in the correct order.
      </p>

      <div className="space-y-2">
        {steps.map((step, index) => {
          const isCorrect = checked && step.id === CORRECT_ORDER[index].id
          const isWrong = checked && step.id !== CORRECT_ORDER[index].id

          return (
            <div
              key={step.id}
              draggable={!completed}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={handleDrop}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all ${
                completed
                  ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-900/20'
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
                <p className="font-medium text-gray-900 dark:text-white">{step.name}</p>
                {(checked || completed) && (
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {step.description}
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
                    disabled={index === steps.length - 1}
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
              Check Order
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
            <p className="mb-4 text-lg font-bold text-emerald-600">
              Mashallah! You know the steps of wudu!
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
