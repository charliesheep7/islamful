'use client'

import { useState } from 'react'

interface Verse {
  words: string[]
  surah: string
  reference: string
}

const VERSES: Verse[] = [
  {
    words: [
      'In',
      'the',
      'name',
      'of',
      'Allah',
      'the',
      'Most',
      'Gracious',
      'the',
      'Most',
      'Merciful',
    ],
    surah: 'Al-Fatiha',
    reference: '1:1',
  },
  {
    words: ['Indeed', 'with', 'hardship', 'will', 'be', 'ease'],
    surah: 'Ash-Sharh',
    reference: '94:6',
  },
  {
    words: ['Say', 'He', 'is', 'Allah', 'who', 'is', 'One'],
    surah: 'Al-Ikhlas',
    reference: '112:1',
  },
  {
    words: [
      'And',
      'We',
      'have',
      'certainly',
      'created',
      'man',
      'and',
      'We',
      'know',
      'what',
      'his',
      'soul',
      'whispers',
      'to',
      'him',
    ],
    surah: 'Qaf',
    reference: '50:16',
  },
  {
    words: ['Allah', 'does', 'not', 'burden', 'a', 'soul', 'beyond', 'that', 'it', 'can', 'bear'],
    surah: 'Al-Baqarah',
    reference: '2:286',
  },
  {
    words: ['So', 'verily', 'with', 'the', 'hardship', 'there', 'is', 'relief'],
    surah: 'Ash-Sharh',
    reference: '94:5',
  },
  {
    words: [
      'And',
      'your',
      'Lord',
      'says',
      'Call',
      'upon',
      'Me',
      'I',
      'will',
      'respond',
      'to',
      'you',
    ],
    surah: 'Ghafir',
    reference: '40:60',
  },
  {
    words: ['Indeed', 'Allah', 'is', 'with', 'the', 'patient'],
    surah: 'Al-Baqarah',
    reference: '2:153',
  },
  {
    words: ['Read', 'in', 'the', 'Name', 'of', 'your', 'Lord', 'Who', 'created'],
    surah: 'Al-Alaq',
    reference: '96:1',
  },
  {
    words: ['By', 'time', 'indeed', 'mankind', 'is', 'in', 'loss'],
    surah: 'Al-Asr',
    reference: '103:1-2',
  },
  {
    words: [
      'And',
      'whoever',
      'puts',
      'their',
      'trust',
      'in',
      'Allah',
      'then',
      'He',
      'is',
      'sufficient',
      'for',
      'them',
    ],
    surah: 'At-Talaq',
    reference: '65:3',
  },
  {
    words: ['So', 'which', 'of', 'the', 'favors', 'of', 'your', 'Lord', 'would', 'you', 'deny'],
    surah: 'Ar-Rahman',
    reference: '55:13',
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

export default function AyahScramble() {
  const [allVerses, setAllVerses] = useState(() => shuffleArray(VERSES).slice(0, 8))
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [placed, setPlaced] = useState<string[]>([])
  const [available, setAvailable] = useState<string[]>(() => shuffleArray([...allVerses[0].words]))
  const [checked, setChecked] = useState(false)
  const [finished, setFinished] = useState(false)

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
    const newVerses = shuffleArray(VERSES).slice(0, 8)
    setAllVerses(newVerses)
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
          <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Game Complete!</h3>
          <p className="text-primary-500 mb-1 text-4xl font-bold">
            {score}/{allVerses.length}
          </p>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            {score === allVerses.length
              ? 'Mashallah! You know these verses perfectly!'
              : score >= 6
                ? 'Excellent Quran knowledge!'
                : score >= 3
                  ? 'Good effort! Keep reading the Quran daily.'
                  : 'Keep practicing! The Quran is best learned through repetition.'}
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
          Verse {current + 1} of {allVerses.length}
        </span>
        <span>
          Score: {score}/{current + (checked ? 1 : 0)}
        </span>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="bg-primary-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${((current + (checked ? 1 : 0)) / allVerses.length) * 100}%` }}
        />
      </div>

      <p className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Arrange the words to form the correct verse from <strong>{verse.surah}</strong> (
        {verse.reference})
      </p>

      {/* Placed words area */}
      <div className="mb-4 min-h-[80px] rounded-2xl border-2 border-dashed border-gray-300 p-4 dark:border-gray-600">
        {placed.length === 0 ? (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500">
            Click words below to build the verse...
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {placed.map((word, i) => (
              <button
                key={`placed-${i}`}
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
      <div className="mb-6 flex flex-wrap justify-center gap-2">
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
          <p className="mb-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            Correct verse:
          </p>
          <p className="text-sm text-amber-800 italic dark:text-amber-200">
            &ldquo;{verse.words.join(' ')}&rdquo;
          </p>
        </div>
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
              Check
            </button>
            <button
              onClick={clearPlaced}
              className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Clear
            </button>
          </>
        ) : (
          <button
            onClick={nextVerse}
            className="bg-primary-500 hover:bg-primary-600 w-full rounded-xl py-3 font-semibold text-white transition"
          >
            {current + 1 >= allVerses.length ? 'See Results' : 'Next Verse'}
          </button>
        )}
      </div>
    </div>
  )
}
