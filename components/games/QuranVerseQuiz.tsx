'use client'

import { useState, useEffect } from 'react'
import { quranQuizCopy, type QuranQuizQuestion } from '@/data/locales/quran-quiz'
import type { Locale } from '@/utils/locale'

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function QuranVerseQuiz({
  bank,
  lang,
}: {
  bank: QuranQuizQuestion[]
  lang: Locale
}) {
  const c = quranQuizCopy[lang]
  const [ids, setIds] = useState(() => bank.map((_, i) => i).slice(0, 10))
  useEffect(() => setIds(shuffleArray(bank.map((_, i) => i)).slice(0, 10)), [bank])
  const questions = ids.map((id) => bank[id])
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [finished, setFinished] = useState(false)

  const question = questions[current]

  const handleSelect = (option: string) => {
    if (selected) return
    setSelected(option)
    setShowResult(true)
    if (option === question.surah) {
      setScore((s) => s + 1)
    }
  }

  const nextQuestion = () => {
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
      setShowResult(false)
    }
  }

  const restart = () => {
    setIds(shuffleArray(bank.map((_, i) => i)).slice(0, 10))
    setCurrent(0)
    setScore(0)
    setSelected(null)
    setShowResult(false)
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="rounded-2xl border border-white/30 bg-white/50 p-8 backdrop-blur-lg dark:border-white/10 dark:bg-white/[0.06]">
          <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{c.complete}</h3>
          <p className="text-primary-500 mb-1 text-4xl font-bold">
            {score}/{questions.length}
          </p>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            {score === questions.length
              ? c.perfect
              : score >= 7
                ? c.great
                : score >= 4
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
    <div className="mx-auto max-w-lg" data-question-id={ids[current]}>
      {/* Progress */}
      <div className="mb-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          {c.question} {current + 1} {c.of} {questions.length}
        </span>
        <span>
          {c.score}: {score}/{current + (showResult ? 1 : 0)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="bg-primary-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${((current + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="mb-6 rounded-2xl border border-white/30 bg-white/50 p-6 backdrop-blur-lg dark:border-white/10 dark:bg-white/[0.06]">
        <p className="mb-2 text-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
          {c.prompt}
        </p>
        {question.verses.map((verse, index) => (
          <div key={index} className="mt-3">
            <blockquote
              data-testid="quiz-verse"
              lang={lang}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              className="text-lg leading-relaxed text-gray-900 dark:text-white"
            >
              {verse.text}
            </blockquote>
            {verse.footnotes && (
              <details className="mt-2 text-sm">
                <summary>{c.notes}</summary>
                <p data-testid="quiz-footnotes" className="whitespace-pre-line">
                  {verse.footnotes}
                </p>
              </details>
            )}
          </div>
        ))}
      </div>

      {/* Options */}
      <div className="grid gap-3">
        {question.options.map((option) => {
          let style =
            'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-500'
          if (showResult) {
            if (option === question.surah) {
              style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
            } else if (option === selected) {
              style = 'border-red-500 bg-red-50 dark:bg-red-900/30'
            } else {
              style = 'border-gray-200 bg-gray-50 opacity-50 dark:border-gray-700 dark:bg-gray-800'
            }
          }
          return (
            <button
              key={option}
              data-option={option}
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              className={`rounded-xl border-2 px-5 py-3.5 text-start font-medium transition-all ${style} ${!selected ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="text-gray-900 dark:text-white">{option}</span>
              {showResult && option === question.surah && (
                <span className="ms-2 text-sm text-emerald-600 dark:text-emerald-400">
                  ({question.reference})
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Next button */}
      {showResult && (
        <button
          onClick={nextQuestion}
          className="bg-primary-500 hover:bg-primary-600 mt-6 w-full rounded-xl py-3 font-semibold text-white transition"
        >
          {current + 1 >= questions.length ? c.results : c.next}
        </button>
      )}
    </div>
  )
}
