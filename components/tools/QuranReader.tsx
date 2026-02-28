'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Loader2, ChevronLeft, ArrowLeft } from 'lucide-react'

interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
}

interface Ayah {
  number: number
  numberInSurah: number
  text: string
  translation?: string
}

const CACHE_PREFIX = 'islamful-quran-'

interface QuranReaderProps {
  lang?: string
}

export default function QuranReader({ lang = 'en' }: QuranReaderProps) {
  const isRTL = lang === 'ar'
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null)
  const [ayahs, setAyahs] = useState<Ayah[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingAyahs, setLoadingAyahs] = useState(false)
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Load surah list
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_PREFIX + 'surahs')
    if (cached) {
      setSurahs(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetch('https://api.alquran.cloud/v1/surah')
      .then((r) => r.json())
      .then((data) => {
        if (data.data) {
          setSurahs(data.data)
          localStorage.setItem(CACHE_PREFIX + 'surahs', JSON.stringify(data.data))
        }
      })
      .catch(() => setError('Failed to load Quran data'))
      .finally(() => setLoading(false))
  }, [])

  // Load surah ayahs
  const loadSurah = useCallback(async (surahNumber: number) => {
    setSelectedSurah(surahNumber)
    setLoadingAyahs(true)
    setError(null)

    const cacheKey = CACHE_PREFIX + `surah-${surahNumber}`
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      setAyahs(JSON.parse(cached))
      setLoadingAyahs(false)
      return
    }

    try {
      // Fetch Arabic + English translation in parallel
      const [arRes, enRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`),
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`),
      ])
      const [arData, enData] = await Promise.all([arRes.json(), enRes.json()])

      if (arData.data && enData.data) {
        const merged: Ayah[] = arData.data.ayahs.map((a: Ayah, i: number) => ({
          number: a.number,
          numberInSurah: a.numberInSurah,
          text: a.text,
          translation: enData.data.ayahs[i]?.text || '',
        }))
        setAyahs(merged)
        localStorage.setItem(cacheKey, JSON.stringify(merged))
      }
    } catch {
      setError('Failed to load surah')
    } finally {
      setLoadingAyahs(false)
    }
  }, [])

  const currentSurah = surahs.find((s) => s.number === selectedSurah)

  const filteredSurahs = search.trim()
    ? surahs.filter(
        (s) =>
          s.englishName.toLowerCase().includes(search.toLowerCase()) ||
          s.englishNameTranslation.toLowerCase().includes(search.toLowerCase()) ||
          s.name.includes(search) ||
          s.number.toString() === search.trim()
      )
    : surahs

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error && !surahs.length) {
    return (
      <div className="rounded-2xl bg-red-50 px-6 py-10 text-center dark:bg-red-900/10">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  // Surah reading view
  if (selectedSurah && currentSurah) {
    return (
      <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <button
          onClick={() => {
            setSelectedSurah(null)
            setAyahs([])
          }}
          className="mb-6 flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
          {isRTL ? 'العودة للسور' : 'All Surahs'}
        </button>

        <div className="mb-8 text-center">
          <h2 className="font-arabic text-3xl font-bold text-gray-900 dark:text-white">
            {currentSurah.name}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {currentSurah.englishName} — {currentSurah.englishNameTranslation}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            {currentSurah.numberOfAyahs} {isRTL ? 'آية' : 'ayahs'} ·{' '}
            {currentSurah.revelationType === 'Meccan'
              ? isRTL
                ? 'مكية'
                : 'Meccan'
              : isRTL
                ? 'مدنية'
                : 'Medinan'}
          </p>
        </div>

        {loadingAyahs ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Bismillah (except Surah 1 and 9) */}
            {selectedSurah !== 1 && selectedSurah !== 9 && (
              <p className="font-arabic text-center text-xl text-gray-500 dark:text-gray-400">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </p>
            )}

            {ayahs.map((ayah) => (
              <div
                key={ayah.number}
                className="rounded-2xl bg-white p-6 ring-1 ring-gray-200/60 dark:bg-white/[0.03] dark:ring-white/10"
              >
                <div className="mb-3 flex items-start justify-between">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500 dark:bg-gray-800">
                    {ayah.numberInSurah}
                  </span>
                </div>
                <p
                  className="font-arabic text-right text-2xl leading-[2] text-gray-900 dark:text-white"
                  dir="rtl"
                >
                  {ayah.text}
                </p>
                {ayah.translation && (
                  <p className="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    {ayah.translation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Surah navigation */}
        <div className="mt-8 flex items-center justify-between">
          {selectedSurah > 1 ? (
            <button
              onClick={() => loadSurah(selectedSurah - 1)}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <ChevronLeft className="h-4 w-4" />
              {surahs[selectedSurah - 2]?.englishName}
            </button>
          ) : (
            <div />
          )}
          {selectedSurah < 114 && (
            <button
              onClick={() => loadSurah(selectedSurah + 1)}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {surahs[selectedSurah]?.englishName}
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </button>
          )}
        </div>
      </div>
    )
  }

  // Surah list view
  return (
    <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 rtl:right-3 rtl:left-auto" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isRTL ? 'ابحث عن سورة...' : 'Search surahs...'}
          className={`w-full rounded-xl border border-gray-200 bg-white py-3 ps-10 pe-4 text-sm transition-colors outline-none focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:focus:border-gray-600 ${isRTL ? 'font-arabic' : ''}`}
        />
      </div>

      {/* Surah grid */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {filteredSurahs.map((surah) => (
          <button
            key={surah.number}
            onClick={() => loadSurah(surah.number)}
            className="group flex items-center gap-4 rounded-xl bg-white px-4 py-3 text-left ring-1 ring-gray-200/60 transition-all hover:ring-gray-300 dark:bg-white/[0.03] dark:ring-white/10 dark:hover:ring-white/20"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-medium text-gray-500 dark:bg-gray-800">
              {surah.number}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {surah.englishName}
                </p>
                <p className="font-arabic text-base text-gray-900 dark:text-white">{surah.name}</p>
              </div>
              <p className="text-xs text-gray-400">
                {surah.englishNameTranslation} · {surah.numberOfAyahs} {isRTL ? 'آية' : 'ayahs'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
