'use client'

import { useState, useEffect } from 'react'
import { useLocale } from '@/components/hooks/useLocale'
import { hadithQuestions, hadithGame } from '@/data/locales/hadith-game'

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function HadithOrNot() {
  const { currentLang } = useLocale()
  const c = hadithGame[currentLang]
  const [ids, setIds] = useState(() => Array.from({ length: 10 }, (_, i) => i))
  useEffect(() => setIds(shuffleArray(Array.from({ length: 15 }, (_, i) => i)).slice(0, 10)), [])
  const questions = ids.map((id) => hadithQuestions[currentLang][id])
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null)
  const [finished, setFinished] = useState(false)

  const question = questions[current]

  const handleAnswer = (isReal: boolean) => {
    if (answered) return
    setUserAnswer(isReal)
    setAnswered(true)
    if (isReal === question.isReal) setScore((s) => s + 1)
  }

  const nextQuestion = () => {
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent((c) => c + 1)
      setAnswered(false)
      setUserAnswer(null)
    }
  }

  const restart = () => {
    setIds(shuffleArray(Array.from({ length: 15 }, (_, i) => i)).slice(0, 10))
    setCurrent(0)
    setScore(0)
    setAnswered(false)
    setUserAnswer(null)
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

  const isCorrect = userAnswer === question.isReal

  return (
    <div className="mx-auto max-w-lg" data-question-id={ids[current]}>
      <p className="mb-4 text-sm text-gray-500">{c.note}</p>
      {/* Progress */}
      <div className="mb-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          {c.question} {current + 1} {c.of} {questions.length}
        </span>
        <span>
          {c.score}: {score}/{current + (answered ? 1 : 0)}
        </span>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="bg-primary-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${((current + (answered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Quote */}
      <div className="mb-6 rounded-2xl border border-white/30 bg-white/50 p-6 backdrop-blur-lg dark:border-white/10 dark:bg-white/[0.06]">
        <p className="mb-2 text-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
          {c.prompt}
        </p>
        <blockquote
          data-testid="quiz-statement"
          className="text-lg leading-relaxed text-gray-900 italic dark:text-white"
        >
          &ldquo;{question.text}&rdquo;
        </blockquote>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleAnswer(true)}
          disabled={answered}
          className={`rounded-xl border-2 px-5 py-4 text-center font-semibold transition-all ${
            answered
              ? question.isReal
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                : userAnswer === true
                  ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  : 'border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800'
              : 'border-emerald-200 bg-white text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-gray-800 dark:text-emerald-400 dark:hover:border-emerald-600'
          }`}
        >
          {c.yes}
        </button>
        <button
          onClick={() => handleAnswer(false)}
          disabled={answered}
          className={`rounded-xl border-2 px-5 py-4 text-center font-semibold transition-all ${
            answered
              ? !question.isReal
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                : userAnswer === false
                  ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  : 'border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800'
              : 'border-rose-200 bg-white text-rose-700 hover:border-rose-400 hover:bg-rose-50 dark:border-rose-800 dark:bg-gray-800 dark:text-rose-400 dark:hover:border-rose-600'
          }`}
        >
          {c.no}
        </button>
      </div>

      {/* Explanation */}
      {answered && (
        <>
          <div
            className={`mt-4 rounded-xl p-4 ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}
          >
            <p
              className={`mb-2 font-semibold ${isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}
            >
              {isCorrect ? c.correct : c.incorrect}
            </p>
            <p data-testid="quiz-explanation" className="text-sm text-gray-700 dark:text-gray-300">
              {question.explanation}
            </p>
            {question.source && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {c.source}:{' '}
                <a
                  href={question.sourceUrl}
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {question.source}
                </a>
              </p>
            )}
          </div>

          <button
            onClick={nextQuestion}
            className="bg-primary-500 hover:bg-primary-600 mt-6 w-full rounded-xl py-3 font-semibold text-white transition"
          >
            {current + 1 >= questions.length ? c.results : c.next}
          </button>
        </>
      )}
    </div>
  )
}
