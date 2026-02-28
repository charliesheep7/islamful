'use client'

import { useState, useCallback, useEffect } from 'react'
import { RotateCcw, ChevronRight, Minus } from 'lucide-react'

interface DhikrMode {
  id: string
  name: string
  nameAr: string
  arabic: string
  target: number
}

// The complete post-salah Sunnah dhikr sequence
const MODES: DhikrMode[] = [
  {
    id: 'subhanallah',
    name: 'SubhanAllah',
    nameAr: 'سبحان الله',
    arabic: 'سُبْحَانَ ٱللَّهِ',
    target: 33,
  },
  {
    id: 'alhamdulillah',
    name: 'Alhamdulillah',
    nameAr: 'الحمد لله',
    arabic: 'ٱلْحَمْدُ لِلَّهِ',
    target: 33,
  },
  {
    id: 'allahuakbar',
    name: 'Allahu Akbar',
    nameAr: 'الله أكبر',
    arabic: 'ٱللَّهُ أَكْبَرُ',
    target: 34,
  },
]

const STORAGE_KEY = 'islamful-dhikr-v2'

interface DhikrState {
  modeIndex: number
  counts: number[]
  sessions: number // how many full 100-rounds completed today
  lastDate: string
}

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

function loadState(): DhikrState {
  if (typeof window === 'undefined')
    return { modeIndex: 0, counts: [0, 0, 0], sessions: 0, lastDate: getToday() }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DhikrState
      if (parsed.lastDate !== getToday()) {
        return { modeIndex: 0, counts: [0, 0, 0], sessions: 0, lastDate: getToday() }
      }
      return parsed
    }
  } catch {
    // No saved state
  }
  return { modeIndex: 0, counts: [0, 0, 0], sessions: 0, lastDate: getToday() }
}

interface DhikrCounterProps {
  lang?: string
}

export default function DhikrCounter({ lang = 'en' }: DhikrCounterProps) {
  const isRTL = lang === 'ar'
  const [state, setState] = useState<DhikrState>(() => loadState())
  const [pulse, setPulse] = useState(false)
  const [completed, setCompleted] = useState(false)

  const mode = MODES[state.modeIndex]
  const count = state.counts[state.modeIndex]
  const progress = Math.min(count / mode.target, 1)
  const totalCount = state.counts.reduce((a, b) => a + b, 0)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const handleTap = useCallback(() => {
    if (completed) return

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20)
    }

    setPulse(true)
    setTimeout(() => setPulse(false), 120)

    setState((prev) => {
      const newCounts = [...prev.counts]
      newCounts[prev.modeIndex] = prev.counts[prev.modeIndex] + 1

      if (newCounts[prev.modeIndex] >= MODES[prev.modeIndex].target) {
        const nextIndex = prev.modeIndex + 1
        if (nextIndex < MODES.length) {
          setTimeout(() => {
            setState((p) => ({ ...p, modeIndex: nextIndex }))
          }, 500)
        } else {
          // Full round complete
          setTimeout(() => setCompleted(true), 500)
        }
      }

      return { ...prev, counts: newCounts, lastDate: getToday() }
    })
  }, [completed])

  const handleUndo = useCallback(() => {
    setState((prev) => {
      const newCounts = [...prev.counts]
      if (newCounts[prev.modeIndex] > 0) {
        newCounts[prev.modeIndex] = newCounts[prev.modeIndex] - 1
      }
      return { ...prev, counts: newCounts }
    })
  }, [])

  const handleReset = useCallback(() => {
    setState((prev) => ({
      modeIndex: 0,
      counts: [0, 0, 0],
      sessions: prev.sessions,
      lastDate: getToday(),
    }))
    setCompleted(false)
  }, [])

  const handleNewSession = useCallback(() => {
    setState((prev) => ({
      modeIndex: 0,
      counts: [0, 0, 0],
      sessions: prev.sessions + 1,
      lastDate: getToday(),
    }))
    setCompleted(false)
  }, [])

  const handleModeSwitch = useCallback((index: number) => {
    setState((prev) => ({ ...prev, modeIndex: index }))
    setCompleted(false)
  }, [])

  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference * (1 - progress)

  // Prayer dots (5 daily prayers)
  const prayerNames = isRTL
    ? ['الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء']
    : ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

  return (
    <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Today's prayer progress */}
      <div className="mb-8 flex items-center justify-center gap-3">
        {prayerNames.map((name, i) => (
          <div key={name} className="flex flex-col items-center gap-1">
            <div
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                i < state.sessions
                  ? 'bg-[var(--color-primary-500)]'
                  : 'bg-gray-200 dark:bg-gray-800'
              }`}
            />
            <span className={`text-[10px] text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
              {name}
            </span>
          </div>
        ))}
      </div>

      {/* Mode selector */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {MODES.map((m, i) => {
          const done = state.counts[i] >= m.target
          return (
            <button
              key={m.id}
              onClick={() => handleModeSwitch(i)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                i === state.modeIndex
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : done
                    ? 'text-[var(--color-primary-500)]'
                    : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
            >
              {isRTL ? m.nameAr : m.name}
              {done && ' ✓'}
            </button>
          )
        })}
      </div>

      {/* Counter circle */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleTap}
          className="relative flex h-72 w-72 items-center justify-center rounded-full outline-none select-none focus-visible:ring-2 focus-visible:ring-gray-400 sm:h-80 sm:w-80"
          aria-label={isRTL ? 'اضغط للعد' : 'Tap to count'}
        >
          {/* Progress ring */}
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 256 256">
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-gray-200 dark:text-gray-800"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="text-gray-900 transition-all duration-300 dark:text-white"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>

          {/* Inner content */}
          <div
            className={`flex flex-col items-center transition-transform duration-100 ${pulse ? 'scale-[0.97]' : 'scale-100'}`}
          >
            <span className="font-arabic text-2xl leading-tight text-gray-900 sm:text-3xl dark:text-white">
              {mode.arabic}
            </span>
            <span className="mt-4 text-6xl font-extralight text-gray-900 tabular-nums sm:text-7xl dark:text-white">
              {count}
            </span>
            <span className="mt-1 text-sm text-gray-300 dark:text-gray-600">
              {mode.target - count > 0
                ? isRTL
                  ? `باقي ${mode.target - count}`
                  : `${mode.target - count} left`
                : ''}
            </span>
          </div>
        </button>

        {/* Step progress */}
        <div className="mt-6 flex items-center gap-3">
          {MODES.map((m, i) => {
            const done = state.counts[i] >= m.target
            const active = i === state.modeIndex
            return (
              <div key={m.id} className="flex items-center gap-3">
                <div
                  className={`h-2 w-2 rounded-full transition-all ${
                    done
                      ? 'bg-[var(--color-primary-500)]'
                      : active
                        ? 'bg-gray-400 dark:bg-gray-500'
                        : 'bg-gray-200 dark:bg-gray-800'
                  }`}
                />
                {i < MODES.length - 1 && (
                  <ChevronRight className="h-3 w-3 text-gray-300 dark:text-gray-700" />
                )}
              </div>
            )
          })}
        </div>

        {/* Total count */}
        <p className="mt-4 text-sm text-gray-400 tabular-nums">
          {isRTL ? `${totalCount} / 100` : `${totalCount} / 100`}
        </p>

        {/* Completed state */}
        {completed && (
          <div className="mt-6 text-center">
            <p
              className={`text-lg font-medium text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
            >
              {isRTL ? 'بارك الله فيك' : 'MashaAllah'}
            </p>
            <button
              onClick={handleNewSession}
              className="mt-3 rounded-full bg-[var(--color-primary-500)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-600)]"
            >
              {isRTL ? 'الصلاة التالية' : 'Next prayer'}
            </button>
          </div>
        )}

        {/* Controls */}
        {!completed && (
          <div className="mt-6 flex items-center gap-6">
            <button
              onClick={handleUndo}
              className="flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
              title={isRTL ? 'تراجع' : 'Undo'}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {isRTL ? 'إعادة' : 'Reset'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
