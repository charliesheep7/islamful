'use client'

import { useState, useEffect, useCallback } from 'react'

const WORDS = [
  { word: 'TAQWA', hint: 'God-consciousness and piety' },
  { word: 'UMMAH', hint: 'The Muslim community as a whole' },
  { word: 'HADIJ', hint: 'Pilgrim performing Hajj' },
  { word: 'SALAH', hint: 'The five daily prayers' },
  { word: 'SAWAM', hint: 'Fasting during Ramadan' },
  { word: 'ZAKAH', hint: 'Obligatory charitable giving' },
  { word: 'HIJAB', hint: 'Modest head covering' },
  { word: 'QURAN', hint: 'The Holy Book of Islam' },
  { word: 'AQIDA', hint: 'Islamic creed or belief system' },
  { word: 'DAWAH', hint: 'Inviting others to Islam' },
  { word: 'DHIKR', hint: 'Remembrance of Allah' },
  { word: 'FATWA', hint: 'Islamic legal ruling' },
  { word: 'FIQAH', hint: 'Islamic jurisprudence' },
  { word: 'HALAL', hint: 'Permissible in Islam' },
  { word: 'HARAM', hint: 'Prohibited in Islam' },
  { word: 'IHRAM', hint: 'Sacred state for Hajj/Umrah' },
  { word: 'IMAAN', hint: 'Faith and belief' },
  { word: 'JIHAD', hint: 'Striving in the way of Allah' },
  { word: 'KAFIR', hint: 'One who disbelieves' },
  { word: 'MASJD', hint: 'Place of worship (mosque)' },
  { word: 'NIKAH', hint: 'Islamic marriage contract' },
  { word: 'QIBLA', hint: 'Direction of prayer' },
  { word: 'SADQA', hint: 'Voluntary charity' },
  { word: 'SHURA', hint: 'Mutual consultation' },
  { word: 'SUJUD', hint: 'Prostration in prayer' },
  { word: 'SURAH', hint: 'A chapter of the Quran' },
  { word: 'TAUBA', hint: 'Repentance to Allah' },
  { word: 'UMRAH', hint: 'The lesser pilgrimage' },
  { word: 'WUDHU', hint: 'Ablution before prayer' },
  { word: 'ISRAF', hint: 'Extravagance and waste' },
]

function getDailyWord(): { word: string; hint: string } {
  const start = new Date('2025-01-01').getTime()
  const now = new Date().setHours(0, 0, 0, 0)
  const dayIndex = Math.floor((now - start) / 86400000) % WORDS.length
  return WORDS[dayIndex]
}

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty'

function getLetterStatuses(guess: string, answer: string): LetterStatus[] {
  const statuses: LetterStatus[] = Array(5).fill('absent')
  const answerLetters = answer.split('')
  const remaining = [...answerLetters]

  // First pass: correct positions
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      statuses[i] = 'correct'
      remaining[remaining.indexOf(guess[i])] = ''
    }
  }
  // Second pass: present but wrong position
  for (let i = 0; i < 5; i++) {
    if (statuses[i] !== 'correct' && remaining.includes(guess[i])) {
      statuses[i] = 'present'
      remaining[remaining.indexOf(guess[i])] = ''
    }
  }
  return statuses
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL'],
]

const statusColors: Record<LetterStatus, string> = {
  correct: 'bg-emerald-500 text-white border-emerald-500',
  present: 'bg-amber-500 text-white border-amber-500',
  absent: 'bg-gray-400 text-white border-gray-400 dark:bg-gray-600',
  empty: 'border-gray-300 dark:border-gray-600',
}

export default function IslamicWordle() {
  const [daily] = useState(() => getDailyWord())
  const { word: answer, hint } = daily
  const [guesses, setGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [shake, setShake] = useState(false)

  const won = guesses.includes(answer)
  const lost = guesses.length >= 6 && !won

  const keyboardStatuses = useCallback((): Record<string, LetterStatus> => {
    const map: Record<string, LetterStatus> = {}
    guesses.forEach((guess) => {
      const statuses = getLetterStatuses(guess, answer)
      guess.split('').forEach((letter, i) => {
        const current = map[letter]
        const next = statuses[i]
        if (next === 'correct') map[letter] = 'correct'
        else if (next === 'present' && current !== 'correct') map[letter] = 'present'
        else if (!current) map[letter] = next
      })
    })
    return map
  }, [guesses, answer])

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== 5) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    const upper = currentGuess.toUpperCase()
    setGuesses((prev) => [...prev, upper])
    setCurrentGuess('')
    if (upper === answer || guesses.length + 1 >= 6) {
      setGameOver(true)
    }
  }, [currentGuess, answer, guesses.length])

  const handleKey = useCallback(
    (key: string) => {
      if (gameOver) return
      if (key === 'ENTER') {
        submitGuess()
      } else if (key === 'DEL' || key === 'BACKSPACE') {
        setCurrentGuess((prev) => prev.slice(0, -1))
      } else if (/^[A-Z]$/i.test(key) && currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key.toUpperCase())
      }
    },
    [gameOver, currentGuess, submitGuess]
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => handleKey(e.key.toUpperCase())
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleKey])

  const kbStatuses = keyboardStatuses()

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4">
      {/* Hint toggle */}
      <button
        onClick={() => setShowHint(!showHint)}
        className="text-primary-500 hover:text-primary-600 text-sm underline"
      >
        {showHint ? 'Hide hint' : 'Need a hint?'}
      </button>
      {showHint && (
        <p className="text-center text-sm text-gray-500 italic dark:text-gray-400">{hint}</p>
      )}

      {/* Grid */}
      <div className="grid gap-1.5">
        {Array.from({ length: 6 }).map((_, rowIdx) => {
          const guess = guesses[rowIdx]
          const isCurrentRow = rowIdx === guesses.length && !gameOver
          const letters = guess
            ? guess.split('')
            : isCurrentRow
              ? currentGuess.padEnd(5, ' ').split('')
              : Array(5).fill(' ')
          const statuses = guess ? getLetterStatuses(guess, answer) : Array(5).fill('empty')

          return (
            <div
              key={rowIdx}
              className={`flex gap-1.5 ${isCurrentRow && shake ? 'animate-[shake_0.3s_ease-in-out]' : ''}`}
            >
              {letters.map((letter, i) => (
                <div
                  key={i}
                  className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-lg font-bold transition-all sm:h-14 sm:w-14 sm:text-xl ${statusColors[statuses[i] as LetterStatus]} ${!guess && letter.trim() ? 'scale-105 border-gray-500 dark:border-gray-400' : ''}`}
                >
                  {letter.trim()}
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Result */}
      {gameOver && (
        <div className="text-center">
          {won ? (
            <p className="text-lg font-bold text-emerald-600">
              Mashallah! You got it in {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}!
            </p>
          ) : (
            <p className="text-lg font-bold text-red-500">
              The word was <span className="text-primary-500">{answer}</span>. Try again tomorrow!
            </p>
          )}
        </div>
      )}

      {/* Keyboard */}
      <div className="mt-2 flex flex-col items-center gap-1.5">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1">
            {row.map((key) => {
              const status = kbStatuses[key]
              const isSpecial = key === 'ENTER' || key === 'DEL'
              return (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  className={`flex h-12 items-center justify-center rounded-md font-semibold transition-colors ${
                    isSpecial ? 'px-2 text-xs sm:px-3 sm:text-sm' : 'w-8 text-sm sm:w-9'
                  } ${
                    status
                      ? statusColors[status]
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {key}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
