'use client'

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { muslimNames, type MuslimName } from '@/data/muslim-names'

const ALL_TAGS = [
  'Prophet',
  'Quranic',
  'Companion',
  'Virtue',
  'Nature',
  'Classic',
  'Popular',
  'Paradise',
  'Angel',
]

const ORIGINS = ['Arabic', 'Persian', 'Turkish', 'Urdu', 'Hebrew']

interface MuslimBabyNamesProps {
  lang?: string
}

export default function MuslimBabyNames({ lang = 'en' }: MuslimBabyNamesProps) {
  const isRTL = lang === 'ar'
  const [search, setSearch] = useState('')
  const [gender, setGender] = useState<'all' | 'male' | 'female' | 'unisex'>('all')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [activeOrigin, setActiveOrigin] = useState<string | null>(null)
  const [selected, setSelected] = useState<MuslimName | null>(null)
  const [showAll, setShowAll] = useState(false)

  const filtered = useMemo(() => {
    let results = muslimNames

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      results = results.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.arabic.includes(search.trim()) ||
          n.meaning.toLowerCase().includes(q)
      )
    }

    if (gender !== 'all') {
      results = results.filter((n) => n.gender === gender)
    }

    if (activeTag) {
      results = results.filter((n) =>
        n.tags.some((t) => t.toLowerCase().includes(activeTag.toLowerCase()))
      )
    }

    if (activeOrigin) {
      results = results.filter((n) => n.origin === activeOrigin)
    }

    return results
  }, [search, gender, activeTag, activeOrigin])

  const displayed = showAll ? filtered : filtered.slice(0, 48)
  const hasMore = filtered.length > 48 && !showAll

  const genderLabel = (g: MuslimName['gender']) => {
    if (g === 'male') return isRTL ? 'ذكر' : 'Boy'
    if (g === 'female') return isRTL ? 'أنثى' : 'Girl'
    return isRTL ? 'مشترك' : 'Unisex'
  }

  const genderColor = (g: MuslimName['gender']) => {
    if (g === 'male') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    if (g === 'female') return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
    return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
  }

  return (
    <div className={isRTL ? 'rtl' : ''}>
      {/* Search + filters */}
      <div className="mb-6 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 rtl:right-3 rtl:left-auto" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setShowAll(false)
            }}
            placeholder={isRTL ? 'ابحث بالاسم أو المعنى...' : 'Search by name or meaning...'}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 ps-10 pe-10 text-sm transition-colors outline-none focus:border-emerald-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 rtl:right-auto rtl:left-3"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Gender filter */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'male', 'female', 'unisex'] as const).map((g) => (
            <button
              key={g}
              onClick={() => {
                setGender(g)
                setShowAll(false)
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                gender === g
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {g === 'all'
                ? isRTL
                  ? 'الكل'
                  : 'All'
                : g === 'male'
                  ? isRTL
                    ? 'أولاد'
                    : 'Boys'
                  : g === 'female'
                    ? isRTL
                      ? 'بنات'
                      : 'Girls'
                    : isRTL
                      ? 'مشترك'
                      : 'Unisex'}
            </button>
          ))}
        </div>

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setActiveTag(activeTag === tag ? null : tag)
                setShowAll(false)
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeTag === tag
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Origin filter */}
        <div className="flex flex-wrap gap-2">
          {ORIGINS.map((origin) => (
            <button
              key={origin}
              onClick={() => {
                setActiveOrigin(activeOrigin === origin ? null : origin)
                setShowAll(false)
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeOrigin === origin
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {origin}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500">
          {isRTL
            ? `${filtered.length} اسم`
            : `${filtered.length} name${filtered.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Name detail modal */}
      {selected && (
        <div
          role="button"
          tabIndex={0}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
          onKeyDown={(e) => e.key === 'Escape' && setSelected(null)}
        >
          <div
            role="button"
            tabIndex={0}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${genderColor(selected.gender)}`}
              >
                {genderLabel(selected.gender)}
              </span>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p
              className="font-arabic mb-1 text-center text-5xl font-bold text-gray-900 dark:text-white"
              dir="rtl"
            >
              {selected.arabic}
            </p>
            <h2 className="mb-3 text-center text-2xl font-bold text-gray-900 dark:text-white">
              {selected.name}
            </h2>
            <p className="mb-4 text-center leading-relaxed text-gray-600 dark:text-gray-300">
              {selected.meaning}
            </p>

            <div className="mb-4 flex items-center justify-center gap-2 text-sm text-gray-400">
              <span>{selected.origin}</span>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5">
              {selected.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Names grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-gray-50 px-6 py-12 text-center dark:bg-gray-800/50">
          <p className="text-gray-400 dark:text-gray-500">
            {isRTL ? 'لم يتم العثور على أسماء' : 'No names found'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {displayed.map((nameObj) => (
              <button
                key={nameObj.name}
                onClick={() => setSelected(nameObj)}
                className="group flex flex-col items-center rounded-2xl bg-white p-4 text-center ring-1 ring-gray-200/60 transition-all hover:shadow-md hover:ring-emerald-300 dark:bg-white/[0.03] dark:ring-white/10 dark:hover:ring-emerald-700"
              >
                <p
                  className="font-arabic mb-1 text-2xl font-semibold text-gray-900 dark:text-white"
                  dir="rtl"
                >
                  {nameObj.arabic}
                </p>
                <p className="mb-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {nameObj.name}
                </p>
                <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-gray-400 dark:text-gray-500">
                  {nameObj.meaning}
                </p>
                <span
                  className={`mt-auto rounded-full px-2 py-0.5 text-[10px] font-medium ${genderColor(nameObj.gender)}`}
                >
                  {genderLabel(nameObj.gender)}
                </span>
              </button>
            ))}
          </div>

          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAll(true)}
                className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {isRTL
                  ? `عرض ${filtered.length - 48} اسمًا إضافيًا`
                  : `Show ${filtered.length - 48} more names`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
