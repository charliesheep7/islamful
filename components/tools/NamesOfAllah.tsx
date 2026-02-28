'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
import namesOfAllah from '@/data/namesOfAllah'

const LEARNED_KEY = 'islamful-names-learned'

interface NamesOfAllahProps {
  lang?: string
}

export default function NamesOfAllah({ lang = 'en' }: NamesOfAllahProps) {
  const isRTL = lang === 'ar'
  const [search, setSearch] = useState('')
  const [learned, setLearned] = useState<number[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LEARNED_KEY)
      if (saved) setLearned(JSON.parse(saved))
    } catch {
      // No saved state
    }
  }, [])

  const toggleLearned = useCallback((id: number) => {
    setLearned((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      localStorage.setItem(LEARNED_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return namesOfAllah
    const q = search.toLowerCase()
    return namesOfAllah.filter(
      (n) =>
        n.arabic.includes(q) ||
        n.transliteration.toLowerCase().includes(q) ||
        n.meaning.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Progress */}
      <div className="mb-8 text-center">
        <p className="text-sm text-gray-400">
          {isRTL
            ? `${learned.length} من 99 اسمًا تعلّمته`
            : `${learned.length} of 99 names learned`}
        </p>
        <div className="mx-auto mt-2 h-1 max-w-xs overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
          <div
            className="h-full rounded-full bg-[var(--color-primary-500)] transition-all duration-500"
            style={{ width: `${(learned.length / 99) * 100}%` }}
          />
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 rtl:right-3 rtl:left-auto" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isRTL ? 'ابحث عن اسم...' : 'Search by name or meaning...'}
          className={`w-full rounded-xl border border-gray-200 bg-white py-3 ps-10 pe-4 text-sm transition-colors outline-none focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:focus:border-gray-600 ${isRTL ? 'font-arabic' : ''}`}
        />
      </div>

      {/* Names list */}
      <div className="space-y-2">
        {filtered.map((name) => {
          const isLearned = learned.includes(name.id)
          return (
            <button
              key={name.id}
              onClick={() => toggleLearned(name.id)}
              className={`flex w-full items-center gap-4 rounded-xl px-5 py-4 text-left transition-all sm:gap-6 ${
                isLearned
                  ? 'bg-[var(--color-primary-500)]/5 ring-1 ring-[var(--color-primary-500)]/20'
                  : 'bg-white ring-1 ring-gray-200/60 hover:ring-gray-300 dark:bg-white/[0.03] dark:ring-white/10 dark:hover:ring-white/20'
              }`}
            >
              {/* Number */}
              <span className="w-7 shrink-0 text-center text-xs text-gray-400 tabular-nums">
                {name.id}
              </span>

              {/* Arabic name */}
              <span className="font-arabic w-32 shrink-0 text-right text-xl text-gray-900 sm:w-40 sm:text-2xl dark:text-white">
                {name.arabic}
              </span>

              {/* Transliteration + meaning */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {name.transliteration}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isRTL ? name.meaningAr : name.meaning}
                </p>
              </div>

              {/* Learned indicator */}
              {isLearned && (
                <span className="shrink-0 text-xs font-medium text-[var(--color-primary-500)]">
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className={`py-12 text-center text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
          {isRTL ? 'لم يتم العثور على نتائج' : 'No names found'}
        </p>
      )}
    </div>
  )
}
