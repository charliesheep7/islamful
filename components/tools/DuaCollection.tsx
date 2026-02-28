'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { Search, Copy, Check, Heart } from 'lucide-react'
import duas, { categories } from '@/data/duas'

const FAVORITES_KEY = 'islamful-dua-favorites'

interface DuaCollectionProps {
  lang?: string
}

export default function DuaCollection({ lang = 'en' }: DuaCollectionProps) {
  const isRTL = lang === 'ar'
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [showFavorites, setShowFavorites] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY)
      if (saved) setFavorites(JSON.parse(saved))
    } catch {
      // No saved favorites
    }
  }, [])

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const filtered = useMemo(() => {
    let result = duas
    if (showFavorites) {
      result = result.filter((d) => favorites.includes(d.id))
    }
    if (activeCategory) {
      result = result.filter((d) => d.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (d) =>
          d.arabic.includes(q) ||
          d.transliteration.toLowerCase().includes(q) ||
          d.translation.toLowerCase().includes(q)
      )
    }
    return result
  }, [activeCategory, search, showFavorites, favorites])

  // Count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const d of duas) {
      counts[d.category] = (counts[d.category] || 0) + 1
    }
    return counts
  }, [])

  const handleCopy = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 rtl:right-3 rtl:left-auto" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isRTL ? 'ابحث عن دعاء...' : 'Search duas...'}
          className={`w-full rounded-xl border border-gray-200 bg-white py-3 ps-10 pe-4 text-sm transition-colors outline-none focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:focus:border-gray-600 ${isRTL ? 'font-arabic' : ''}`}
        />
      </div>

      {/* Category pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setActiveCategory(null)
            setShowFavorites(false)
          }}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            !activeCategory && !showFavorites
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          {isRTL ? 'الكل' : 'All'}
        </button>
        {favorites.length > 0 && (
          <button
            onClick={() => {
              setShowFavorites(!showFavorites)
              setActiveCategory(null)
            }}
            className={`flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              showFavorites
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Heart className="h-3 w-3" />
            {favorites.length}
          </button>
        )}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(activeCategory === cat.id ? null : cat.id)
              setShowFavorites(false)
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${isRTL ? 'font-arabic' : ''} ${
              activeCategory === cat.id
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {isRTL ? cat.nameAr : cat.name}
            <span className="ml-1 text-xs opacity-50">{categoryCounts[cat.id] || 0}</span>
          </button>
        ))}
      </div>

      {/* Duas list */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className={`py-12 text-center text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
            {showFavorites
              ? isRTL
                ? 'لا توجد أدعية محفوظة بعد'
                : 'No saved duas yet. Tap the heart to save.'
              : isRTL
                ? 'لم يتم العثور على أدعية'
                : 'No duas found'}
          </p>
        )}

        {filtered.map((dua) => (
          <div
            key={dua.id}
            className="rounded-2xl bg-white p-6 ring-1 ring-gray-200/60 sm:p-8 dark:bg-white/[0.03] dark:ring-white/10"
          >
            {/* Top row: category + actions */}
            <div className="mb-5 flex items-center justify-between">
              <span
                className={`text-xs font-medium tracking-wide text-gray-400 uppercase ${isRTL ? 'font-arabic tracking-normal normal-case' : ''}`}
              >
                {isRTL ? dua.categoryAr : dua.category}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleFavorite(dua.id)}
                  className="text-gray-300 transition-colors hover:text-red-400 dark:text-gray-600"
                  title={isRTL ? 'حفظ' : 'Save'}
                >
                  <Heart
                    className={`h-4 w-4 ${favorites.includes(dua.id) ? 'fill-red-400 text-red-400' : ''}`}
                  />
                </button>
                <button
                  onClick={() => handleCopy(dua.arabic, dua.id)}
                  className="text-gray-300 transition-colors hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400"
                  title={isRTL ? 'نسخ' : 'Copy'}
                >
                  {copiedId === dua.id ? (
                    <Check className="h-4 w-4 text-[var(--color-primary-500)]" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Arabic text — big, readable */}
            <p
              className="font-arabic mb-5 text-right text-[1.6rem] leading-[2.2] text-gray-900 dark:text-white"
              dir="rtl"
            >
              {dua.arabic}
            </p>

            {/* Transliteration */}
            <p className="mb-2 text-sm leading-relaxed text-gray-500 italic dark:text-gray-400">
              {dua.transliteration}
            </p>

            {/* Translation */}
            <p
              className={`text-sm leading-relaxed text-gray-600 dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}
            >
              {isRTL ? dua.translationAr : dua.translation}
            </p>

            {/* Source */}
            <p className="mt-4 text-xs text-gray-400">{dua.source}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
