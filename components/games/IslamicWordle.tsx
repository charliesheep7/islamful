'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocale } from '@/components/hooks/useLocale'
import { wordleWords, wordleHints, wordleCopy } from '@/data/locales/wordle-game'

export function dailyWordIndex(now = Date.now()) {
  const day = Math.floor(now / 86400000) - Math.floor(Date.UTC(2025, 0, 1) / 86400000)
  return ((day % wordleWords.length) + wordleWords.length) % wordleWords.length
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
  const { currentLang } = useLocale()
  const c = wordleCopy[currentLang]
  const [day, setDay] = useState(0)
  const answer = wordleWords[day]
  const hint = wordleHints[currentLang][day]
  const [error, setError] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [shake, setShake] = useState(false)

  const won = guesses.includes(answer)
  useEffect(() => {
    let previous = -1
    const refresh = () => {
      const next = dailyWordIndex()
      if (previous === next) return
      previous = next
      setDay(next)
      setGuesses([])
      setCurrentGuess('')
      setGameOver(false)
      setShowHint(false)
      setError('')
    }
    refresh()
    const timer = setInterval(refresh, 30000)
    window.addEventListener('focus', refresh)
    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', refresh)
    }
  }, [])

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
      setError(c.short)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    setError('')
    const upper = currentGuess.toUpperCase()
    setGuesses((prev) => [...prev, upper])
    setCurrentGuess('')
    if (upper === answer || guesses.length + 1 >= 6) {
      setGameOver(true)
    }
  }, [currentGuess, answer, guesses.length, c.short])

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
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.isComposing ||
        target?.closest('input, textarea, select, [contenteditable="true"]')
      )
        return
      if (target?.closest('button, a, summary') && e.key === 'Enter') return
      if (/^[a-z]$/i.test(e.key) || e.key === 'Backspace' || e.key === 'Enter') {
        e.preventDefault()
        handleKey(e.key.toUpperCase())
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleKey])

  const kbStatuses = keyboardStatuses()

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4">
      <p className="text-center text-sm text-gray-500">{c.instruction}</p>
      {/* Hint toggle */}
      <button
        onClick={() => setShowHint(!showHint)}
        className="text-primary-500 hover:text-primary-600 text-sm underline"
      >
        {showHint ? c.hide : c.hint}
      </button>
      {showHint && (
        <p className="text-center text-sm text-gray-500 italic dark:text-gray-400">{hint}</p>
      )}

      {/* Grid */}
      <div className="grid gap-1.5" dir="ltr" data-testid="wordle-grid">
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
              data-row={rowIdx}
              className={`flex gap-1.5 ${isCurrentRow && shake ? 'animate-[shake_0.3s_ease-in-out]' : ''}`}
            >
              {letters.map((letter, i) => (
                <div
                  key={i}
                  data-status={statuses[i]}
                  aria-label={
                    guess
                      ? `${letter}: ${c[statuses[i] as 'correct' | 'present' | 'absent']}`
                      : undefined
                  }
                  className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-lg font-bold transition-all sm:h-14 sm:w-14 sm:text-xl ${statusColors[statuses[i] as LetterStatus]} ${!guess && letter.trim() ? 'scale-105 border-gray-500 dark:border-gray-400' : ''}`}
                >
                  {letter.trim()}
                </div>
              ))}
            </div>
          )
        })}
      </div>

      <p role="status" className="text-sm text-red-600">
        {error}
      </p>
      {/* Result */}
      {gameOver && (
        <div className="text-center">
          {won ? (
            <p className="text-lg font-bold text-emerald-600">
              {c.win.replace('{count}', String(guesses.length))}
            </p>
          ) : (
            <p className="text-lg font-bold text-red-500">{c.lose.replace('{word}', answer)}</p>
          )}
        </div>
      )}

      {/* Keyboard */}
      <div className="mt-2 flex w-full flex-col items-center gap-1.5" dir="ltr">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1">
            {row.map((key) => {
              const status = kbStatuses[key]
              const isSpecial = key === 'ENTER' || key === 'DEL'
              return (
                <button
                  key={key}
                  disabled={gameOver}
                  aria-label={key === 'ENTER' ? c.enter : key === 'DEL' ? c.delete : key}
                  onClick={() => handleKey(key)}
                  className={`flex h-12 items-center justify-center rounded-md font-semibold transition-colors ${
                    isSpecial ? 'px-2 text-xs sm:px-3 sm:text-sm' : 'w-8 text-sm sm:w-9'
                  } ${
                    status
                      ? statusColors[status]
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {key === 'ENTER' ? '↵' : key === 'DEL' ? '⌫' : key}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
