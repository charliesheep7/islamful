'use client'

import { authConfig } from '@/utils/supabase/config'
import baseDatabase from '@/data/haram-database.json'
import { haramTranslations, haramEntries } from '@/data/locales/haram'
import { useState } from 'react'
import { Search, CheckCircle, XCircle, AlertTriangle, Info, Loader2, Sparkles } from 'lucide-react'
import { findLocalEntry } from './haram-search'

type Ruling = 'halal' | 'haram' | 'mashbooh' | 'depends' | 'not_applicable'

interface HaramEntry {
  name: string
  ruling: Ruling
  explanation: string
  source?: string
  sourceUrl?: string
}

// Prewritten summaries. The full set has not received a comprehensive scholarly source audit.
const database = baseDatabase as HaramEntry[]

function searchDatabase(query: string): HaramEntry | null {
  return findLocalEntry(query, database)
}

const supabaseConfig = authConfig()
const SUPABASE_URL = supabaseConfig?.url || ''

async function askAI(query: string, lang: string): Promise<HaramEntry | null> {
  if (!SUPABASE_URL) return null

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/haram-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: supabaseConfig?.key || '' },
      body: JSON.stringify({ query: query.trim(), lang }),
    })

    if (!res.ok) return null

    const data = await res.json()
    if (data.error || !data.ruling) return null
    return data as HaramEntry
  } catch {
    return null
  }
}

const rulingConfig: Record<
  Ruling,
  { label: string; labelAr: string; color: string; bg: string; icon: typeof CheckCircle }
> = {
  halal: {
    label: 'Halal',
    labelAr: 'حلال',
    color: 'text-green-700 dark:text-green-400',
    bg: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    icon: CheckCircle,
  },
  haram: {
    label: 'Haram',
    labelAr: 'حرام',
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    icon: XCircle,
  },
  mashbooh: {
    label: 'Mashbooh (Doubtful)',
    labelAr: 'مشبوه',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
    icon: AlertTriangle,
  },
  depends: {
    label: 'It Depends',
    labelAr: 'يعتمد على المصدر',
    color: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
    icon: Info,
  },
  not_applicable: {
    label: 'Not Applicable',
    labelAr: 'غير متعلق',
    color: 'text-gray-700 dark:text-gray-400',
    bg: 'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700',
    icon: Info,
  },
}

interface HaramCheckerProps {
  lang?: string
  defaultQuery?: string
  standalone?: boolean
}

export default function HaramChecker({
  lang = 'en',
  defaultQuery = '',
  standalone = false,
}: HaramCheckerProps) {
  const isRTL = lang === 'ar'
  const t = (en: string, ar: string) => haramTranslations[lang]?.[en] || (isRTL ? ar : en)
  const [query, setQuery] = useState(defaultQuery)
  const [result, setResult] = useState<HaramEntry | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [isAiResult, setIsAiResult] = useState(false)

  const doSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setSearched(true)
    setIsAiResult(false)

    // 1. Try static database first (instant)
    const localizedEntries = haramEntries[lang] || []
    const match = findLocalEntry(searchQuery, localizedEntries)
    const localResult = match ? { ...database[match.index], ...match } : searchDatabase(searchQuery)
    const localizedResult =
      localResult &&
      localizedEntries.find(
        (entry) => entry.index === database.findIndex((item) => item.name === localResult.name)
      )
    if (localResult) {
      setResult(localizedResult ? { ...localResult, ...localizedResult } : localResult)
      return
    }

    // 2. Fall back to AI
    setLoading(true)
    setResult(null)
    try {
      const aiResult = await askAI(searchQuery, lang)
      if (aiResult) {
        setResult(aiResult)
        setIsAiResult(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    doSearch(query)
  }

  const config = result ? rulingConfig[result.ruling] || rulingConfig.depends : null
  const Icon = config?.icon

  const inner = (
    <>
      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 rtl:right-3 rtl:left-auto" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t(
                'Type anything... food, activity, lifestyle...',
                'اكتب أي شيء... طعام، نشاط، أسلوب حياة...'
              )}
              placeholder={t(
                'Type anything... food, activity, lifestyle...',
                'اكتب أي شيء... طعام، نشاط، أسلوب حياة...'
              )}
              className={`w-full rounded-lg border border-gray-300 py-2.5 ps-10 pe-3 text-sm text-gray-900 focus:border-[var(--color-accent-500)] focus:ring-[var(--color-accent-500)] dark:border-gray-600 dark:bg-gray-800 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="rounded-lg bg-[var(--color-accent-500)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-600)] disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('Check', 'تحقق')}
          </button>
        </div>
      </form>

      {/* Suggestion chips */}
      {!searched && (
        <div className={`-mt-3 mb-6 flex flex-wrap gap-2 ${isRTL ? 'font-arabic' : ''}`}>
          {['Music', 'Dogs', 'Tattoos', 'Smoking', 'Stocks', 'Dating', 'Yoga', 'Gold'].map(
            (chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setQuery(t(chip, chip))
                  doSearch(chip)
                }}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 transition-colors hover:border-[var(--color-accent-500)] hover:text-[var(--color-accent-500)] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-[var(--color-accent-400)] dark:hover:text-[var(--color-accent-400)]"
              >
                {t(chip, chip)}
              </button>
            )
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-gray-50 p-6 dark:bg-gray-800/50">
          <Loader2 className="h-4 w-4 animate-spin text-[var(--color-accent-500)]" />
          <span
            className={`text-sm text-gray-600 dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}
          >
            {t(
              'Preparing AI-generated information...',
              'جارٍ إعداد معلومات عامة بالذكاء الاصطناعي...'
            )}
          </span>
        </div>
      )}

      {/* No results */}
      {searched && !loading && !result && (
        <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800/50">
          <p className={`text-sm text-gray-600 dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}>
            {t('No results. Try a different term.', 'لم نجد نتائج. جرّب مصطلحًا مختلفًا.')}
          </p>
        </div>
      )}

      {/* Result */}
      {result && config && Icon && (
        <div className={`rounded-lg border p-4 ${config.bg}`}>
          <div className="mb-2 flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.color}`} />
            <span className={`text-sm font-bold ${config.color}`}>
              {t(config.label, config.labelAr)}
            </span>
            <span className="text-sm font-semibold text-gray-900 capitalize dark:text-white">
              &middot; {result.name}
            </span>
            <span className="ms-auto flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
              {isAiResult && <Sparkles className="h-3 w-3" />}
              {isAiResult ? t('AI', 'ذكاء اصطناعي') : t('Prewritten', 'ملخص مكتوب مسبقاً')}
            </span>
          </div>
          <p className="mb-2 text-xs text-gray-600 dark:text-gray-400">
            {t('General information, not a verified fatwa.', 'معلومات عامة، وليست فتوى معتمدة.')}
          </p>
          <p
            className={`text-sm leading-relaxed text-gray-700 dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}
          >
            {result.explanation}
          </p>
          {result.source && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {t('Reference to verify', 'مرجع للتحقق')}:{' '}
              {result.sourceUrl ? (
                <a
                  href={result.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {result.source}
                </a>
              ) : (
                result.source
              )}
            </p>
          )}
        </div>
      )}

      {/* Disclaimer */}
      {searched && (
        <p
          className={`mt-6 text-xs text-gray-400 dark:text-gray-500 ${isRTL ? 'font-arabic' : ''}`}
        >
          {t(
            'Prewritten and AI-generated summaries have not all been independently reviewed and may be incomplete or wrong. Verify any reference yourself; consult a qualified scholar for a personal ruling.',
            'الملخصات المكتوبة مسبقاً وإجابات الذكاء الاصطناعي لم تخضع جميعها لمراجعة علمية مستقلة، وقد تكون ناقصة أو خاطئة. تحقق من المراجع بنفسك، واستشر عالماً موثوقاً عند الحاجة إلى فتوى.'
          )}
        </p>
      )}
    </>
  )

  // When embedded in a blog post (no standalone prop), wrap in a card
  if (!standalone) {
    return (
      <div
        className="not-prose my-8 rounded-2xl border border-[var(--color-cream-300)] bg-[var(--color-cream-50)] p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="mb-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-500)]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[var(--color-primary-500)] uppercase">
            <Search className="h-3.5 w-3.5" />
            {t('Free Tool', 'أداة مجانية')}
          </span>
          <h3
            className={`mt-2 text-lg font-bold text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
          >
            {t('Halal and Haram Topic Guide', 'دليل موضوعات الحلال والحرام')}
          </h3>
          <p
            className={`mt-1 text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}
          >
            {t(
              'Explore general information about food, activities, and daily life',
              'ابحث عن معلومات عامة حول الطعام والأنشطة والحياة اليومية'
            )}
          </p>
        </div>
        {inner}
      </div>
    )
  }

  // Standalone page — no card wrapper
  return (
    <div className="mx-auto max-w-lg" dir={isRTL ? 'rtl' : 'ltr'}>
      {inner}
    </div>
  )
}
