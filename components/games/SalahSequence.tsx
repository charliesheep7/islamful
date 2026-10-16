'use client'

import { salahGame, salahArabic } from '@/data/locales/salah-game'
import { useLocale } from '@/components/hooks/useLocale'

import { useState, useCallback, useRef, useEffect } from 'react'

const CORRECT_ORDER = Array.from({ length: 9 }, (_, index) => index + 1)

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function SalahSequence() {
  const { currentLang } = useLocale()
  const c = salahGame[currentLang]
  const [positions, setPositions] = useState(CORRECT_ORDER)
  useEffect(() => setPositions(shuffleArray(CORRECT_ORDER)), [])
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
    const isCorrect = positions.every((pos, i) => pos === CORRECT_ORDER[i])
    if (isCorrect) setCompleted(true)
  }

  const reset = () => {
    setPositions(shuffleArray(CORRECT_ORDER))
    setChecked(false)
    setCompleted(false)
  }

  return (
    <div className="mx-auto max-w-lg">
      <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">{c.instruction}</p>

      <div className="space-y-2">
        {positions.map((pos, index) => {
          const isCorrect = checked && pos === CORRECT_ORDER[index]
          const isWrong = checked && pos !== CORRECT_ORDER[index]

          return (
            <div
              key={pos}
              data-step-id={pos}
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
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-gray-900 dark:text-white">{c.steps[pos - 1][0]}</p>
                  <span
                    lang="ar"
                    dir="rtl"
                    className="font-arabic text-sm text-gray-400 dark:text-gray-500"
                  >
                    {salahArabic[pos - 1]}
                  </span>
                </div>
                {(checked || completed) && (
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {c.steps[pos - 1][1]}
                  </p>
                )}
              </div>
              {!completed && (
                <div className="flex shrink-0 flex-col gap-0.5">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    aria-label={`${c.up}: ${c.steps[pos - 1][0]}`}
                    disabled={index === 0}
                    className="rounded px-1.5 py-0.5 text-xs text-gray-400 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-700"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    aria-label={`${c.down}: ${c.steps[pos - 1][0]}`}
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
              {c.check}
            </button>
            <button
              onClick={reset}
              className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {c.shuffle}
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-lg font-bold text-violet-600">{c.success}</p>
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
