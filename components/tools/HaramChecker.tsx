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
  // --- Activities & Lifestyle ---
  {
    name: 'dating',
    ruling: 'haram',
    explanation:
      'Casual dating involving khalwa (seclusion) with the opposite gender is prohibited. Islam encourages marriage through halal courtship with family involvement.',
    source: 'Quran 17:32, Islamic Jurisprudence',
  },
  {
    name: 'gambling',
    ruling: 'haram',
    explanation:
      'All forms of gambling (maysir) are explicitly prohibited in the Quran, including lotteries, betting, and casino games.',
    source: 'Quran 5:90-91',
  },
  {
    name: 'smoking',
    ruling: 'haram',
    explanation:
      'The majority of contemporary scholars rule smoking as haram due to its proven harm to the body. Islam prohibits self-harm.',
    source: 'Quran 2:195, WHO fatwa consensus',
  },
  {
    name: 'vaping',
    ruling: 'haram',
    explanation:
      'Scholars apply the same ruling as smoking — it contains nicotine, is addictive, and causes bodily harm.',
    source: 'Contemporary scholarly opinions',
  },
  {
    name: 'tattoo',
    ruling: 'haram',
    explanation:
      "The Prophet (peace be upon him) cursed the one who does tattoos and the one who has them done. Permanent tattoos alter Allah's creation.",
    source: 'Sahih al-Bukhari 5937',
  },
  {
    name: 'interest',
    ruling: 'haram',
    explanation:
      'Riba (interest/usury) is strictly forbidden. Both paying and receiving interest are prohibited in Islam.',
    source: 'Quran 2:275-279',
  },
  {
    name: 'dog',
    ruling: 'depends',
    explanation:
      'Keeping dogs as pets is discouraged by most scholars, as angels do not enter a house with a dog. However, dogs for guarding, herding, hunting, or service purposes are permitted.',
    source: 'Sahih al-Bukhari 3225, Sahih Muslim 1574',
  },
  {
    name: 'cat',
    ruling: 'halal',
    explanation:
      'Keeping cats is permissible and encouraged. The Prophet (peace be upon him) was known to love cats, and his companion Abu Hurairah was named "Father of Kittens."',
    source: 'Sunan Abu Dawud, Sahih Muslim',
  },
  {
    name: 'astrology',
    ruling: 'haram',
    explanation:
      'Believing in horoscopes or astrology is haram. Claiming knowledge of the unseen (ghayb) belongs only to Allah.',
    source: 'Sahih Muslim 2230',
  },
  {
    name: 'horoscope',
    ruling: 'haram',
    explanation:
      'Reading and believing in horoscopes is forbidden. The Prophet (peace be upon him) said whoever goes to a fortune-teller has disbelieved in what was revealed to Muhammad.',
    source: 'Sahih Muslim 2230',
  },
  {
    name: 'yoga',
    ruling: 'depends',
    explanation:
      'Physical yoga exercises for fitness are generally permissible. However, spiritual yoga involving meditation, chanting, or Hindu religious elements is prohibited.',
    source: 'Contemporary scholarly opinions',
  },
  {
    name: 'christmas',
    ruling: 'haram',
    explanation:
      'Celebrating Christmas as a religious festival is not permissible as it involves imitating non-Muslim religious practices. Being kind to non-Muslim neighbors during their holidays is encouraged.',
    source: 'Islamic Jurisprudence, Quran 109:6',
  },
  {
    name: 'halloween',
    ruling: 'haram',
    explanation:
      'Halloween has pagan origins and involves imitating non-Islamic traditions. Muslims are advised to avoid participating in its rituals and celebrations.',
    source: 'Islamic Jurisprudence',
  },
  {
    name: 'birthday',
    ruling: 'depends',
    explanation:
      'Scholars differ. Some consider birthday celebrations as imitation of non-Muslim customs. Others permit simple gatherings without extravagance or un-Islamic practices.',
    source: 'Varied scholarly opinions',
  },
  {
    name: 'shaving beard',
    ruling: 'depends',
    explanation:
      'The majority of scholars consider shaving the beard makruh (disliked) or haram, as the Prophet (peace be upon him) commanded letting the beard grow. Some scholars allow trimming.',
    source: 'Sahih al-Bukhari 5893, Sahih Muslim 259',
  },
  {
    name: 'stocks',
    ruling: 'depends',
    explanation:
      "Investing in stocks is permissible if the company's business is halal and does not involve interest, alcohol, gambling, or other haram activities. Sharia-compliant screening is recommended.",
    source: 'AAOIFI Standards, Islamic Fiqh Academy',
  },
  {
    name: 'trading',
    ruling: 'depends',
    explanation:
      'Halal trading involves buying and selling real assets. Day trading with excessive speculation (gharar) or margin trading with interest is prohibited.',
    source: 'Islamic Fiqh Academy',
  },
  {
    name: 'video games',
    ruling: 'depends',
    explanation:
      'Permissible in moderation if the content does not include gambling, explicit material, or shirk. Should not distract from prayers or obligations.',
    source: 'Contemporary scholarly opinions',
  },
  {
    name: 'movies',
    ruling: 'depends',
    explanation:
      'Watching movies is permissible if the content is clean and does not contain explicit scenes, promote haram, or distract from Islamic duties.',
    source: 'Contemporary scholarly opinions',
  },
  {
    name: 'silk',
    ruling: 'depends',
    explanation:
      'Wearing pure silk is haram for men but halal for women. The Prophet (peace be upon him) prohibited silk and gold for men of his ummah.',
    source: 'Sahih al-Bukhari 5426, Sunan Abu Dawud',
  },
  {
    name: 'gold',
    ruling: 'depends',
    explanation:
      'Wearing gold jewelry is haram for men but halal for women. Owning gold as an investment or asset is permissible for both.',
    source: 'Sahih Muslim 2078',
  },
  {
    name: 'nail polish',
    ruling: 'depends',
    explanation:
      'Wearing nail polish is permissible outside of prayer times. However, regular nail polish prevents water from reaching the nails during wudu, invalidating it. Breathable/halal nail polish exists as an alternative.',
    source: 'Islamic Fiqh, contemporary opinions',
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
  standalone?: boolean
}

export default function HaramChecker({
  lang = 'en',
  defaultQuery = '',
  standalone = false,
}: HaramCheckerProps) {
  const isRTL = lang === 'ar'
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
    const localResult = searchDatabase(searchQuery)
    if (localResult) {
      setResult(localResult)
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
              placeholder={
                isRTL
                  ? 'اكتب أي شيء... طعام، نشاط، أسلوب حياة...'
                  : 'Type anything... food, activity, lifestyle...'
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

      {/* Suggestion chips */}
      {!searched && (
        <div className={`-mt-3 mb-6 flex flex-wrap gap-2 ${isRTL ? 'font-arabic' : ''}`}>
          {(isRTL
            ? ['موسيقى', 'كلاب', 'وشم', 'تدخين', 'أسهم', 'مواعدة', 'يوغا', 'ذهب']
            : ['Music', 'Dogs', 'Tattoos', 'Smoking', 'Stocks', 'Dating', 'Yoga', 'Gold']
          ).map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                setQuery(chip)
                doSearch(chip)
              }}
              className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 transition-colors hover:border-[var(--color-accent-500)] hover:text-[var(--color-accent-500)] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-[var(--color-accent-400)] dark:hover:text-[var(--color-accent-400)]"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

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
            {isRTL ? 'أداة مجانية' : 'Free Tool'}
          </span>
          <h3
            className={`mt-2 text-lg font-bold text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
          >
            {isRTL ? 'فاحص الحلال والحرام' : 'Islamic Ruling Checker'}
          </h3>
          <p
            className={`mt-1 text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}
          >
            {isRTL
              ? 'تحقق من حكم أي شيء — طعام، أنشطة، أسلوب حياة، والمزيد'
              : 'Check the ruling on anything — food, activities, lifestyle, and more'}
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
