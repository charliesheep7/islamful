'use client'

import { useState } from 'react'

interface Question {
  verse: string
  surah: string
  reference: string
  options: string[]
}

const QUESTIONS: Question[] = [
  {
    verse: 'In the name of Allah, the Most Gracious, the Most Merciful.',
    surah: 'Al-Fatiha',
    reference: '1:1',
    options: ['Al-Fatiha', 'Al-Baqarah', 'Al-Ikhlas', 'An-Nas'],
  },
  {
    verse:
      'This is the Book about which there is no doubt, a guidance for those conscious of Allah.',
    surah: 'Al-Baqarah',
    reference: '2:2',
    options: ['Al-Imran', 'Al-Baqarah', 'Al-Maidah', 'An-Nisa'],
  },
  {
    verse: 'Say, "He is Allah, [who is] One."',
    surah: 'Al-Ikhlas',
    reference: '112:1',
    options: ['Al-Falaq', 'Al-Ikhlas', 'Al-Kafirun', 'An-Nas'],
  },
  {
    verse: 'Indeed, with hardship [will be] ease.',
    surah: 'Ash-Sharh',
    reference: '94:6',
    options: ['Ad-Duha', 'Ash-Sharh', 'At-Tin', 'Al-Alaq'],
  },
  {
    verse: 'So verily, with the hardship, there is relief.',
    surah: 'Ash-Sharh',
    reference: '94:5',
    options: ['Al-Asr', 'Ash-Sharh', 'Al-Fil', 'Quraysh'],
  },
  {
    verse:
      'And We have certainly made the Quran easy for remembrance, so is there any who will remember?',
    surah: 'Al-Qamar',
    reference: '54:17',
    options: ['Al-Qamar', 'Ar-Rahman', 'Al-Waqiah', 'Al-Hadid'],
  },
  {
    verse: 'Allah does not burden a soul beyond that it can bear.',
    surah: 'Al-Baqarah',
    reference: '2:286',
    options: ['Al-Baqarah', 'Al-Imran', 'An-Nisa', 'Al-Maidah'],
  },
  {
    verse: 'And your Lord says, "Call upon Me; I will respond to you."',
    surah: 'Ghafir',
    reference: '40:60',
    options: ['Ghafir', 'Fussilat', 'Ash-Shura', 'Az-Zukhruf'],
  },
  {
    verse: 'Indeed, Allah is with the patient.',
    surah: 'Al-Baqarah',
    reference: '2:153',
    options: ['Al-Anfal', 'Al-Baqarah', 'Al-Imran', 'At-Tawbah'],
  },
  {
    verse: 'So which of the favors of your Lord would you deny?',
    surah: 'Ar-Rahman',
    reference: '55:13',
    options: ['Al-Waqiah', 'Ar-Rahman', 'Al-Mulk', 'Al-Qamar'],
  },
  {
    verse: 'Read! In the Name of your Lord Who created.',
    surah: 'Al-Alaq',
    reference: '96:1',
    options: ['Al-Alaq', 'Al-Qalam', 'Al-Muzzammil', 'Al-Muddaththir'],
  },
  {
    verse: 'By time, indeed, mankind is in loss.',
    surah: 'Al-Asr',
    reference: '103:1-2',
    options: ['Al-Asr', 'At-Takathur', 'Al-Humazah', 'Al-Fil'],
  },
  {
    verse: 'When the victory of Allah has come and the conquest.',
    surah: 'An-Nasr',
    reference: '110:1',
    options: ['An-Nasr', 'Al-Masad', 'Al-Ikhlas', 'Al-Kafirun'],
  },
  {
    verse: 'And whoever puts their trust in Allah, then He is sufficient for them.',
    surah: 'At-Talaq',
    reference: '65:3',
    options: ['At-Tahrim', 'At-Talaq', 'Al-Mumtahanah', 'As-Saff'],
  },
  {
    verse: 'Indeed, the mercy of Allah is near to the doers of good.',
    surah: 'Al-Araf',
    reference: '7:56',
    options: ['Al-Anam', 'Al-Araf', 'Al-Anfal', 'At-Tawbah'],
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

export default function QuranVerseQuiz() {
  const [questions, setQuestions] = useState(() => shuffleArray(QUESTIONS).slice(0, 10))
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
    setQuestions(shuffleArray(QUESTIONS).slice(0, 10))
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
          <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Quiz Complete!</h3>
          <p className="text-primary-500 mb-1 text-4xl font-bold">
            {score}/{questions.length}
          </p>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            {score === questions.length
              ? 'Mashallah! Perfect score!'
              : score >= 7
                ? 'Great knowledge of the Quran!'
                : score >= 4
                  ? 'Good effort! Keep reading the Quran.'
                  : 'Keep studying the Quran, you will improve!'}
          </p>
          <button
            onClick={restart}
            className="bg-primary-500 hover:bg-primary-600 rounded-xl px-6 py-3 font-semibold text-white transition"
          >
            Play Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg">
      {/* Progress */}
      <div className="mb-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          Question {current + 1} of {questions.length}
        </span>
        <span>
          Score: {score}/{current + (showResult ? 1 : 0)}
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
          Which surah is this verse from?
        </p>
        <blockquote className="text-lg leading-relaxed text-gray-900 italic dark:text-white">
          &ldquo;{question.verse}&rdquo;
        </blockquote>
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
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              className={`rounded-xl border-2 px-5 py-3.5 text-left font-medium transition-all ${style} ${!selected ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="text-gray-900 dark:text-white">{option}</span>
              {showResult && option === question.surah && (
                <span className="ml-2 text-sm text-emerald-600 dark:text-emerald-400">
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
          {current + 1 >= questions.length ? 'See Results' : 'Next Question'}
        </button>
      )}
    </div>
  )
}
