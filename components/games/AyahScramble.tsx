'use client'

import { useState, useEffect } from 'react'
import { scrambleCopy, type ScrambleVerse } from '@/data/locales/scramble-game'
import type { Locale } from '@/utils/locale'

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function AyahScramble({ bank, lang }: { bank: ScrambleVerse[]; lang: Locale }) {
  const c = scrambleCopy[lang]
  const [ids, setIds] = useState(() => bank.map((_, i) => i).slice(0, 8))
  const allVerses = ids.map((id) => bank[id])
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [placed, setPlaced] = useState<string[]>([])
  const [available, setAvailable] = useState<string[]>(() => [...bank[0].words])
  const [checked, setChecked] = useState(false)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const nextIds = shuffleArray(bank.map((_, i) => i)).slice(0, 8)
    setIds(nextIds)
    setAvailable(shuffleArray([...bank[nextIds[0]].words]))
  }, [bank])

  const verse = allVerses[current]
  const isCorrect = placed.join(' ') === verse.words.join(' ')

  const handleWordClick = (word: string, index: number) => {
    if (checked) return
    setPlaced([...placed, word])
    const newAvailable = [...available]
    newAvailable.splice(index, 1)
    setAvailable(newAvailable)
  }

  const handlePlacedClick = (word: string, index: number) => {
    if (checked) return
    setAvailable([...available, word])
    const newPlaced = [...placed]
    newPlaced.splice(index, 1)
    setPlaced(newPlaced)
  }

  const checkAnswer = () => {
    if (checked || available.length > 0) return
    setChecked(true)
    if (isCorrect) setScore((s) => s + 1)
  }

  const nextVerse = () => {
    if (current + 1 >= allVerses.length) {
      setFinished(true)
    } else {
      const next = current + 1
      setCurrent(next)
      setPlaced([])
      setAvailable(shuffleArray([...allVerses[next].words]))
      setChecked(false)
    }
  }

  const clearPlaced = () => {
    setAvailable(shuffleArray([...verse.words]))
    setPlaced([])
    setChecked(false)
  }

  const restart = () => {
    const nextIds = shuffleArray(bank.map((_, i) => i)).slice(0, 8)
    const newVerses = nextIds.map((id) => bank[id])
    setIds(nextIds)
    setCurrent(0)
    setScore(0)
    setPlaced([])
    setAvailable(shuffleArray([...newVerses[0].words]))
    setChecked(false)
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="rounded-2xl border border-white/30 bg-white/50 p-8 backdrop-blur-lg dark:border-white/10 dark:bg-white/[0.06]">
          <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{c.complete}</h3>
          <p className="text-primary-500 mb-1 text-4xl font-bold">
            {score}/{allVerses.length}
          </p>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            {score === allVerses.length
              ? c.perfect
              : score >= 6
                ? c.great
                : score >= 3
                  ? c.good
                  : c.learn}
          </p>
          <button
            onClick={restart}
            className="bg-primary-500 hover:bg-primary-600 rounded-xl px-6 py-3 font-semibold text-white transition"
          >
            {c.again}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg" data-verse-id={ids[current]}>
      {/* Progress */}
      <div className="mb-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          {c.verse} {current + 1} {c.of} {allVerses.length}
        </span>
        <span>
          {c.score}: {score}/{current + (checked ? 1 : 0)}
        </span>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="bg-primary-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${((current + (checked ? 1 : 0)) / allVerses.length) * 100}%` }}
        />
      </div>

      <p className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400">
        {c.instruction.replace('{surah}', verse.surah).replace('{reference}', verse.reference)}
      </p>

      {/* Placed words area */}
      <div
        data-testid="placed-words"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        className="mb-4 min-h-[80px] rounded-2xl border-2 border-dashed border-gray-300 p-4 dark:border-gray-600"
      >
        {placed.length === 0 ? (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500">{c.empty}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {placed.map((word, i) => (
              <button
                key={`placed-${i}`}
                disabled={checked}
                onClick={() => handlePlacedClick(word, i)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  checked
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                      : 'border-red-400 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    : 'border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100 dark:border-primary-600 dark:bg-primary-900/30 dark:text-primary-300'
                }`}
              >
                {word}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Available words */}
      <div
        data-testid="available-words"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        className="mb-6 flex flex-wrap justify-center gap-2"
      >
        {available.map((word, i) => (
          <button
            key={`avail-${i}`}
            onClick={() => handleWordClick(word, i)}
            disabled={checked}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Correct answer on wrong */}
      {checked && !isCorrect && (
        <div className="mb-4 rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
          <p className="mb-1 text-xs font-medium text-amber-600 dark:text-amber-400">{c.correct}</p>
          {verse.texts.map((text, i) => (
            <p
              key={i}
              data-testid="original-verse"
              lang={lang}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              className="text-sm text-amber-800 dark:text-amber-200"
            >
              {text}
            </p>
          ))}
        </div>
      )}

      {verse.footnotes.length > 0 && (
        <details className="mb-4 text-sm">
          <summary>{c.notes}</summary>
          {verse.footnotes.map((note, i) => (
            <p key={i} data-testid="scramble-footnotes" className="whitespace-pre-line">
              {note}
            </p>
          ))}
        </details>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-3">
        {!checked ? (
          <>
            <button
              onClick={checkAnswer}
              disabled={available.length > 0}
              className="bg-primary-500 hover:bg-primary-600 rounded-xl px-6 py-3 font-semibold text-white transition disabled:opacity-40"
            >
              {c.check}
            </button>
            <button
              onClick={clearPlaced}
              className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {c.clear}
            </button>
          </>
        ) : (
          <button
            onClick={nextVerse}
            className="bg-primary-500 hover:bg-primary-600 w-full rounded-xl py-3 font-semibold text-white transition"
          >
            {current + 1 >= allVerses.length ? c.results : c.next}
          </button>
        )}
      </div>
    </div>
  )
}
