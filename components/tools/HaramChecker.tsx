'use client'

import { useState } from 'react'
import { Search, CheckCircle, XCircle, AlertTriangle, Info, Loader2, Sparkles } from 'lucide-react'

type Ruling = 'halal' | 'haram' | 'mashbooh' | 'depends' | 'not_applicable'

interface HaramEntry {
  name: string
  ruling: Ruling
  explanation: string
  source?: string
}

// Static fallback database for instant results
const database: HaramEntry[] = [
  {
    name: 'gelatin',
    ruling: 'depends',
    explanation:
      'Pork-derived gelatin is haram. Gelatin from halal-slaughtered animals or fish is halal.',
    source: 'Islamic Fiqh Academy',
  },
  {
    name: 'alcohol',
    ruling: 'haram',
    explanation: 'Consuming alcohol (khamr) is haram — wine, beer, spirits, any intoxicant.',
    source: 'Quran 5:90',
  },
  {
    name: 'pork',
    ruling: 'haram',
    explanation: 'Pork and all pork-derived products are clearly prohibited.',
    source: 'Quran 2:173',
  },
  {
    name: 'chicken',
    ruling: 'depends',
    explanation: 'Halal if slaughtered according to Islamic guidelines (zabiha).',
    source: 'Islamic Jurisprudence',
  },
  {
    name: 'beef',
    ruling: 'depends',
    explanation: 'Halal when slaughtered according to Islamic guidelines (zabiha).',
    source: 'Islamic Jurisprudence',
  },
  {
    name: 'fish',
    ruling: 'halal',
    explanation: 'Fish and seafood are generally halal. Fish with scales are unanimously halal.',
    source: 'Quran 5:96',
  },
  {
    name: 'shrimp',
    ruling: 'halal',
    explanation:
      "Halal by the majority of scholars (Shafi'i, Maliki, Hanbali). Some Hanafi scholars differ.",
    source: 'Majority scholarly opinion',
  },
  {
    name: 'vanilla extract',
    ruling: 'depends',
    explanation:
      'Contains alcohol as a solvent. Most scholars permit it when alcohol evaporates in cooking.',
    source: 'Contemporary scholarly opinions',
  },
  {
    name: 'vinegar',
    ruling: 'halal',
    explanation:
      'The Prophet (peace be upon him) praised vinegar. Transformation to acetic acid makes it permissible.',
    source: 'Sahih Muslim',
  },
  {
    name: 'soy sauce',
    ruling: 'depends',
    explanation:
      'Naturally brewed soy sauce may contain trace alcohol. Most scholars consider it halal.',
    source: 'Contemporary scholarly opinions',
  },
  {
    name: 'whey',
    ruling: 'depends',
    explanation:
      'Halal itself, but questionable if it contains animal-derived rennet from non-halal sources.',
    source: 'Islamic Food Guidelines',
  },
  {
    name: 'rennet',
    ruling: 'depends',
    explanation:
      'Halal from halal-slaughtered animals. Pork-derived is haram. Microbial/vegetable rennet is halal.',
    source: 'Islamic Fiqh Council',
  },
  {
    name: 'e120',
    ruling: 'haram',
    explanation: 'E120 (carmine/cochineal) is from crushed insects. Haram by most scholars.',
    source: 'Majority scholarly opinion',
  },
  {
    name: 'carmine',
    ruling: 'haram',
    explanation:
      'Derived from crushed cochineal insects. Found in red-colored foods and cosmetics.',
    source: 'Majority scholarly opinion',
  },
  {
    name: 'glycerin',
    ruling: 'depends',
    explanation: 'Plant-based is halal. Pork-derived is haram. Check the source.',
    source: 'Islamic Food Guidelines',
  },
  {
    name: 'l-cysteine',
    ruling: 'depends',
    explanation: 'Can be from human hair (haram), duck feathers, or synthetic (halal).',
    source: 'Islamic Food Guidelines',
  },
  {
    name: 'mushroom',
    ruling: 'halal',
    explanation: 'Halal. Mushrooms are a fungus, not an animal product.',
    source: 'General scholarly consensus',
  },
  {
    name: 'chocolate',
    ruling: 'depends',
    explanation:
      'Plain chocolate is halal. Check for alcohol, non-halal gelatin, or animal emulsifiers.',
    source: 'Islamic Food Guidelines',
  },
  {
    name: 'coffee',
    ruling: 'halal',
    explanation: 'Halal by scholarly consensus. Not an intoxicant.',
    source: 'Scholarly consensus',
  },
  {
    name: 'music',
    ruling: 'depends',
    explanation:
      'Debated among scholars. Some prohibit instruments except the daff. Nasheeds are generally permissible.',
    source: 'Varied scholarly opinions',
  },
  {
    name: 'cryptocurrency',
    ruling: 'depends',
    explanation:
      'Varied opinions. Some permit it as a digital asset, others cite speculation (gharar) concerns.',
    source: 'Contemporary scholarly opinions',
  },
  {
    name: 'insurance',
    ruling: 'depends',
    explanation:
      'Conventional insurance involves gharar and riba. Takaful (Islamic insurance) is the halal alternative.',
    source: 'Islamic Fiqh Academy',
  },
  {
    name: 'mortgages',
    ruling: 'depends',
    explanation:
      'Conventional mortgages involve riba (interest). Islamic mortgages (Murabaha, Ijara) are halal alternatives.',
    source: 'European Council for Fatwa and Research',
  },
]

function searchDatabase(query: string): HaramEntry | null {
  const normalized = query.toLowerCase().trim()
  if (!normalized) return null
  return (
    database.find((entry) => entry.name.includes(normalized) || normalized.includes(entry.name)) ||
    null
  )
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''

async function askAI(query: string, lang: string): Promise<HaramEntry | null> {
  if (!SUPABASE_URL) return null

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/haram-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
}

export default function HaramChecker({ lang = 'en', defaultQuery = '' }: HaramCheckerProps) {
  const isRTL = lang === 'ar'
  const [query, setQuery] = useState(defaultQuery)
  const [result, setResult] = useState<HaramEntry | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [isAiResult, setIsAiResult] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setSearched(true)
    setIsAiResult(false)

    // 1. Try static database first (instant)
    const localResult = searchDatabase(query)
    if (localResult) {
      setResult(localResult)
      return
    }

    // 2. Fall back to AI
    setLoading(true)
    setResult(null)
    try {
      const aiResult = await askAI(query, lang)
      if (aiResult) {
        setResult(aiResult)
        setIsAiResult(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const config = result ? rulingConfig[result.ruling] || rulingConfig.depends : null
  const Icon = config?.icon

  return (
    <div className="mx-auto max-w-lg" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 rtl:right-3 rtl:left-auto" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isRTL
                  ? 'ابحث عن طعام أو مكون أو نشاط...'
                  : 'Search any food, ingredient, or activity...'
              }
              className={`w-full rounded-lg border border-gray-300 py-2.5 ps-10 pe-3 text-sm text-gray-900 focus:border-[var(--color-accent-500)] focus:ring-[var(--color-accent-500)] dark:border-gray-600 dark:bg-gray-800 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="rounded-lg bg-[var(--color-accent-500)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-600)] disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isRTL ? 'تحقق' : 'Check'}
          </button>
        </div>
      </form>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-gray-50 p-6 dark:bg-gray-800/50">
          <Loader2 className="h-4 w-4 animate-spin text-[var(--color-accent-500)]" />
          <span
            className={`text-sm text-gray-600 dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}
          >
            {isRTL ? 'جارٍ البحث بالذكاء الاصطناعي...' : 'Asking AI scholar...'}
          </span>
        </div>
      )}

      {/* No results */}
      {searched && !loading && !result && (
        <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800/50">
          <p className={`text-sm text-gray-600 dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL
              ? `لم نجد نتائج لـ "${query}". جرّب مصطلحاً مختلفاً.`
              : `No results for "${query}". Try a different term.`}
          </p>
        </div>
      )}

      {/* Result */}
      {result && config && Icon && (
        <div className={`rounded-lg border p-4 ${config.bg}`}>
          <div className="mb-2 flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.color}`} />
            <span className={`text-sm font-bold ${config.color}`}>
              {isRTL ? config.labelAr : config.label}
            </span>
            <span className="text-sm font-semibold text-gray-900 capitalize dark:text-white">
              &middot; {result.name}
            </span>
            {isAiResult && (
              <span className="ms-auto flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
                <Sparkles className="h-3 w-3" />
                AI
              </span>
            )}
          </div>
          <p
            className={`text-sm leading-relaxed text-gray-700 dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}
          >
            {result.explanation}
          </p>
          {result.source && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {isRTL ? 'المصدر' : 'Source'}: {result.source}
            </p>
          )}
        </div>
      )}

      {/* Disclaimer */}
      {searched && (
        <p
          className={`mt-6 text-xs text-gray-400 dark:text-gray-500 ${isRTL ? 'font-arabic' : ''}`}
        >
          {isRTL
            ? 'تنويه: للمعلومات العامة فقط. عند الشك، استشر عالماً موثوقاً.'
            : 'For informational purposes only. When in doubt, consult a trusted scholar.'}
        </p>
      )}
    </div>
  )
}
