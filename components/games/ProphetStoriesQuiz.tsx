'use client'

import { prophetQuestions, prophetGame } from '@/data/locales/prophet-game'
import { useLocale } from '@/components/hooks/useLocale'

import { useState, useEffect } from 'react'

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function ProphetStoriesQuiz() {
  const { currentLang } = useLocale()
  const c = prophetGame[currentLang]
  const [questionIds, setQuestionIds] = useState(() => Array.from({ length: 10 }, (_, i) => i))
  useEffect(
    () => setQuestionIds(shuffleArray(Array.from({ length: 15 }, (_, i) => i)).slice(0, 10)),
    []
  )
  const questions = questionIds.map((id) => prophetQuestions[currentLang][id])
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
    if (option === question.answer) setScore((s) => s + 1)
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
    setQuestionIds(shuffleArray(Array.from({ length: 15 }, (_, i) => i)).slice(0, 10))
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
    <div className="mx-auto max-w-lg" data-question-id={questionIds[current]}>
      {/* Progress */}
      <div className="mb-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          {c.question} {current + 1} {c.of} {questions.length}
        </span>
        <span>
          {c.score}: {score}/{current + (showResult ? 1 : 0)}
        </span>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="bg-primary-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${((current + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="mb-6 rounded-2xl border border-white/30 bg-white/50 p-6 backdrop-blur-lg dark:border-white/10 dark:bg-white/[0.06]">
        <p
          data-testid="quiz-question"
          className="text-lg font-medium text-gray-900 dark:text-white"
        >
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="grid gap-3">
        {question.options.map((option) => {
          let style =
            'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-500'
          if (showResult) {
            if (option === question.answer) {
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
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              className={`rounded-xl border-2 px-5 py-3.5 text-start font-medium transition-all ${style} ${!selected ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="text-gray-900 dark:text-white">{option}</span>
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {showResult && (
        <div className="mt-4 rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
          <p data-testid="quiz-explanation" className="text-sm text-amber-800 dark:text-amber-200">
            {question.explanation}
          </p>
        </div>
      )}

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
