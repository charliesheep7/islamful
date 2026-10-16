'use client'

import { useState, useMemo } from 'react'
import { inheritanceUi, inheritanceHelp, inheritanceModel } from '@/data/locales/inheritance-ui'
import { RotateCcw } from 'lucide-react'
import {
  calculateInheritance,
  type Gender,
  type HeirInput,
  type HeirShare,
} from '@/data/inheritance-rules'

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'SAR', symbol: '﷼' },
  { code: 'AED', symbol: 'د.إ' },
  { code: 'MYR', symbol: 'RM' },
  { code: 'PKR', symbol: '₨' },
  { code: 'INR', symbol: '₹' },
]

const PIE_COLORS = [
  '#327952',
  '#2563eb',
  '#d97706',
  '#dc2626',
  '#7c3aed',
  '#0891b2',
  '#db2777',
  '#65a30d',
]

interface NumberStepperProps {
  value: number
  onChange: (v: number) => void
  label: string
  labelAr: string
  isRTL: boolean
}

function NumberStepper({ value, onChange, label, labelAr, isRTL }: NumberStepperProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className={`text-sm text-gray-700 dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}>
        {isRTL ? labelAr : label}
      </span>
      <div className="flex items-center gap-3">
        <button
          aria-label={`${isRTL ? labelAr : label} −`}
          disabled={value === 0}
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          −
        </button>
        <span className="w-8 text-center font-mono text-sm">{value}</span>
        <button
          aria-label={`${isRTL ? labelAr : label} +`}
          disabled={value >= 100}
          onClick={() => onChange(Math.min(100, value + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          +
        </button>
      </div>
    </div>
  )
}

function buildConicGradient(shares: HeirShare[]): string {
  if (shares.length === 0) return 'conic-gradient(#e5e7eb 0deg 360deg)'
  const segments: string[] = []
  let cumulative = 0
  for (let i = 0; i < shares.length; i++) {
    const start = cumulative
    const end = cumulative + shares[i].sharePercent
    const color = PIE_COLORS[i % PIE_COLORS.length]
    segments.push(`${color} ${start}% ${end}%`)
    cumulative = end
  }
  // Fill any remaining gap
  if (cumulative < 100) {
    segments.push(`#e5e7eb ${cumulative}% 100%`)
  }
  return `conic-gradient(${segments.join(', ')})`
}

interface InheritanceCalculatorProps {
  lang?: string
}

export default function InheritanceCalculator({ lang = 'en' }: InheritanceCalculatorProps) {
  const isRTL = lang === 'ar'
  const t = (text: string) => inheritanceUi[lang]?.[text] || text
  const help = inheritanceHelp[lang] || inheritanceHelp.en
  const model = inheritanceModel[lang] || inheritanceModel.en
  const locale =
    ({ ar: 'ar-SA', fr: 'fr-FR', de: 'de-DE' } as Record<string, string>)[lang] || 'en-US'
  const percent = (n: number) =>
    new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 2 }).format(n / 100)

  const [deceasedGender, setDeceasedGender] = useState<Gender>('male')
  const [estateValue, setEstateValue] = useState('')
  const [debts, setDebts] = useState('')
  const [bequests, setBequests] = useState('')
  const [currency, setCurrency] = useState('USD')

  const [heirs, setHeirs] = useState<HeirInput>({
    spouse: false,
    father: false,
    mother: false,
    sons: 0,
    daughters: 0,
    fullBrothers: 0,
    fullSisters: 0,
  })

  const cur = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0]

  const formatAmount = (val: number) =>
    `${cur.symbol}${val.toLocaleString(locale, { maximumFractionDigits: 2 })}`

  const hasHeirs =
    heirs.spouse ||
    heirs.father ||
    heirs.mother ||
    heirs.sons > 0 ||
    heirs.daughters > 0 ||
    heirs.fullBrothers > 0 ||
    heirs.fullSisters > 0

  const estateNum = Number(estateValue)
  const debtNum = debts.trim() === '' ? 0 : Number(debts)
  const bequestNum = bequests.trim() === '' ? 0 : Number(bequests)
  const valid =
    estateNum > 0 &&
    [estateNum, debtNum, bequestNum].every((n) => Number.isFinite(n) && n >= 0 && n <= 1e12)
  const showResults = valid && hasHeirs

  const result = useMemo(() => {
    if (!showResults) return null
    return calculateInheritance(deceasedGender, estateNum, debtNum, bequestNum, heirs)
  }, [deceasedGender, estateNum, debtNum, bequestNum, heirs, showResults])

  const handleReset = () => {
    setDeceasedGender('male')
    setEstateValue('')
    setDebts('')
    setBequests('')
    setHeirs({
      spouse: false,
      father: false,
      mother: false,
      sons: 0,
      daughters: 0,
      fullBrothers: 0,
      fullSisters: 0,
    })
  }

  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:focus:border-gray-600'

  const updateHeir = <K extends keyof HeirInput>(key: K, value: HeirInput[K]) => {
    setHeirs((prev) => ({ ...prev, [key]: value }))
  }

  const spouseLabel =
    deceasedGender === 'male' ? (isRTL ? 'الزوجة' : t('Wife')) : isRTL ? 'الزوج' : t('Husband')

  return (
    <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      <p className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{model.scope}</p>
      <div className="space-y-4">
        {/* Section 1: Deceased Gender */}
        <div className="rounded-2xl bg-white p-6 ring-1 ring-gray-200/60 dark:bg-white/[0.03] dark:ring-white/10">
          <h3
            className={`mb-1 text-sm font-semibold text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
          >
            {isRTL ? 'المتوفى' : t('Deceased')}
          </h3>
          <p className={`mb-4 text-xs text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL ? 'حدد جنس المتوفى' : t('Select the gender of the deceased')}
          </p>
          <div className="flex gap-3">
            <button
              className={`flex-1 rounded-xl py-3 text-sm font-medium transition-colors ${
                deceasedGender === 'male'
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
              aria-pressed={deceasedGender === 'male'}
              onClick={() => setDeceasedGender('male')}
            >
              {isRTL ? 'ذكر' : t('Male')}
            </button>
            <button
              className={`flex-1 rounded-xl py-3 text-sm font-medium transition-colors ${
                deceasedGender === 'female'
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
              aria-pressed={deceasedGender === 'female'}
              onClick={() => setDeceasedGender('female')}
            >
              {isRTL ? 'أنثى' : t('Female')}
            </button>
          </div>
        </div>

        {/* Section 2: Estate */}
        <div className="rounded-2xl bg-white p-6 ring-1 ring-gray-200/60 dark:bg-white/[0.03] dark:ring-white/10">
          <h3
            className={`mb-1 text-sm font-semibold text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
          >
            {isRTL ? 'التركة' : t('Estate')}
          </h3>
          <p className={`mb-4 text-xs text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL
              ? 'القيمة الإجمالية للتركة بعد الديون والوصايا'
              : t('Total estate value, debts, and bequests')}
          </p>
          <div className="mb-4 flex items-center gap-2">
            <label htmlFor="inheritance-currency" className="text-xs text-gray-500">
              {isRTL ? 'العملة' : t('Currency')}
            </label>
            <select
              id="inheritance-currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none dark:border-gray-800 dark:bg-gray-900"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="inheritance-estate"
                className={`mb-1.5 block text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}
              >
                {isRTL ? 'إجمالي قيمة التركة' : t('Total Estate Value')}
              </label>
              <input
                id="inheritance-estate"
                min="0"
                max="1000000000000"
                step="any"
                type="number"
                value={estateValue}
                onChange={(e) => setEstateValue(e.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="inheritance-debts"
                  className={`mb-1.5 block text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}
                >
                  {isRTL ? 'الديون ومصاريف الجنازة' : t('Debts & Funeral Expenses')}
                </label>
                <input
                  id="inheritance-debts"
                  min="0"
                  max="1000000000000"
                  step="any"
                  type="number"
                  value={debts}
                  onChange={(e) => setDebts(e.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="inheritance-bequests"
                  className={`mb-1.5 block text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}
                >
                  {isRTL ? 'الوصايا' : t('Bequests')}
                </label>
                <input
                  id="inheritance-bequests"
                  min="0"
                  max="1000000000000"
                  step="any"
                  type="number"
                  value={bequests}
                  onChange={(e) => setBequests(e.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
                <p className={`mt-1 text-xs text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
                  {isRTL
                    ? 'الوصية محدودة بثلث ما بقي بعد الديون ومصاريف الجنازة'
                    : t('Bequests are limited to 1/3 after debts and funeral expenses')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Surviving Heirs */}
        <div className="rounded-2xl bg-white p-6 ring-1 ring-gray-200/60 dark:bg-white/[0.03] dark:ring-white/10">
          <h3
            className={`mb-1 text-sm font-semibold text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
          >
            {isRTL ? 'الورثة الأحياء' : t('Surviving Heirs')}
          </h3>
          <p className={`mb-4 text-xs text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL
              ? 'حدد الورثة الموجودين وعددهم'
              : t('Select which heirs are present and their count')}
          </p>

          {/* Checkbox heirs */}
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {/* Spouse */}
            <label className="flex cursor-pointer items-center justify-between py-3">
              <span
                className={`text-sm text-gray-700 dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}
              >
                {spouseLabel}
              </span>
              <input
                type="checkbox"
                checked={heirs.spouse}
                onChange={(e) => updateHeir('spouse', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 accent-gray-900 dark:accent-white"
              />
            </label>

            {/* Father */}
            <label className="flex cursor-pointer items-center justify-between py-3">
              <span
                className={`text-sm text-gray-700 dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}
              >
                {isRTL ? 'الأب' : t('Father')}
              </span>
              <input
                type="checkbox"
                checked={heirs.father}
                onChange={(e) => updateHeir('father', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 accent-gray-900 dark:accent-white"
              />
            </label>

            {/* Mother */}
            <label className="flex cursor-pointer items-center justify-between py-3">
              <span
                className={`text-sm text-gray-700 dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}
              >
                {isRTL ? 'الأم' : t('Mother')}
              </span>
              <input
                type="checkbox"
                checked={heirs.mother}
                onChange={(e) => updateHeir('mother', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 accent-gray-900 dark:accent-white"
              />
            </label>
          </div>

          {/* Number stepper heirs */}
          <div className="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
            <NumberStepper
              value={heirs.sons}
              onChange={(v) => updateHeir('sons', v)}
              label={t('Sons')}
              labelAr="الأبناء"
              isRTL={isRTL}
            />
            <NumberStepper
              value={heirs.daughters}
              onChange={(v) => updateHeir('daughters', v)}
              label={t('Daughters')}
              labelAr="البنات"
              isRTL={isRTL}
            />
            <NumberStepper
              value={heirs.fullBrothers}
              onChange={(v) => updateHeir('fullBrothers', v)}
              label={t('Full Brothers')}
              labelAr="الإخوة الأشقاء"
              isRTL={isRTL}
            />
            <NumberStepper
              value={heirs.fullSisters}
              onChange={(v) => updateHeir('fullSisters', v)}
              label={t('Full Sisters')}
              labelAr="الأخوات الشقيقات"
              isRTL={isRTL}
            />
          </div>
        </div>

        {estateValue && !valid && (
          <p role="status" className="text-sm text-red-600 dark:text-red-400">
            {help.invalid}
          </p>
        )}
        {/* Section 4: Results */}
        {result && showResults && (
          <>
            {/* Summary Card */}
            <div className="rounded-2xl bg-gray-900 p-6 text-white sm:p-8 dark:bg-white/[0.06]">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">
                    {isRTL ? 'إجمالي التركة' : t('Total Estate')}
                  </span>
                  <span>{formatAmount(result.totalEstate)}</span>
                </div>
                {result.debtsAndFuneral > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">
                      {isRTL ? 'الديون والمصاريف' : t('Debts & Expenses')}
                    </span>
                    <span>−{formatAmount(result.debtsAndFuneral)}</span>
                  </div>
                )}
                {result.bequests > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">{isRTL ? 'الوصايا' : t('Bequests')}</span>
                    <span>−{formatAmount(result.bequests)}</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-3" />
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {isRTL ? 'التركة القابلة للتوزيع' : t('Distributable Estate')}
                  </span>
                  <span className="text-2xl font-bold">
                    {formatAmount(result.distributableEstate)}
                  </span>
                </div>
              </div>

              {result.bequestLimited && <p className="mt-4 text-sm text-amber-200">{model.cap}</p>}
              {result.unallocatedEstate > 0 && (
                <p className="mt-4 text-sm text-amber-200">
                  {model.unallocated}: {formatAmount(result.unallocatedEstate)}
                </p>
              )}
              {result.hasAwl && (
                <div className="mt-4 rounded-lg bg-amber-500/20 px-4 py-2 text-sm text-amber-200">
                  {isRTL
                    ? 'تجاوزت الأنصبة 100% وتم تخفيضها نسبياً (عَوْل)'
                    : t('Shares exceeded 100% and were proportionally reduced (Awl)')}
                </div>
              )}

              {result.hasRadd && (
                <div className="mt-4 rounded-lg bg-blue-500/20 px-4 py-2 text-sm text-blue-200">
                  {isRTL
                    ? 'بقي جزء من التركة بلا عاصب فتم الرد على أصحاب الفروض (رَدّ)'
                    : t('Surplus redistributed proportionally to fixed-share heirs (Radd)')}
                </div>
              )}
            </div>

            {/* Pie Chart */}
            {result.shares.length > 0 && (
              <div className="rounded-2xl bg-white p-6 ring-1 ring-gray-200/60 dark:bg-white/[0.03] dark:ring-white/10">
                <h3
                  className={`mb-4 text-sm font-semibold text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
                >
                  {isRTL ? 'توزيع الحصص' : t('Share Distribution')}
                </h3>
                <div className="flex flex-col items-center gap-6 sm:flex-row">
                  {/* Pie chart */}
                  <div
                    className="h-48 w-48 shrink-0 rounded-full"
                    style={{ background: buildConicGradient(result.shares) }}
                  />
                  {/* Legend */}
                  <div className="flex flex-wrap gap-3">
                    {result.shares.map((share, i) => (
                      <div key={`${t(share.heir)}-${i}`} className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                        />
                        <span
                          className={`text-xs text-gray-600 dark:text-gray-300 ${isRTL ? 'font-arabic' : ''}`}
                        >
                          {isRTL ? share.heirAr : t(share.heir)} ({percent(share.sharePercent)})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Results Table */}
            <p className="text-sm text-gray-500">{help.group}</p>
            {result.shares.length > 0 && (
              <div className="rounded-2xl bg-white ring-1 ring-gray-200/60 dark:bg-white/[0.03] dark:ring-white/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <th
                          scope="col"
                          className={`px-6 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase ${isRTL ? 'font-arabic text-right' : 'text-left'}`}
                        >
                          {isRTL ? 'الوارث' : t('Heir')}
                        </th>
                        <th
                          scope="col"
                          className={`px-6 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase ${isRTL ? 'font-arabic text-right' : 'text-left'}`}
                        >
                          {isRTL ? 'النصيب' : t('Share')}
                        </th>
                        <th
                          scope="col"
                          className={`px-6 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase ${isRTL ? 'font-arabic text-right' : 'text-left'}`}
                        >
                          {model.reference}
                        </th>
                        <th
                          scope="col"
                          className={`px-6 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase ${isRTL ? 'text-left' : 'text-right'}`}
                        >
                          %
                        </th>
                        <th
                          scope="col"
                          className={`px-6 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase ${isRTL ? 'text-left' : 'text-right'}`}
                        >
                          {isRTL ? 'المبلغ' : t('Amount')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                      {result.shares.map((share, i) => (
                        <tr key={`${t(share.heir)}-${i}`}>
                          <td
                            className={`px-6 py-4 font-medium text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
                          >
                            {isRTL ? share.heirAr : t(share.heir)}
                            {share.count > 1 && (
                              <span className="ms-1 text-xs text-gray-400">
                                ({isRTL ? '×' : 'x'}
                                {share.count.toLocaleString(locale)})
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-300">
                            {share.shareFraction
                              .replace('Fixed + residual', model.mixed)
                              .replace('Residual', help.residual)}
                          </td>
                          <td
                            className={`px-6 py-4 text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}
                          >
                            {isRTL ? share.quranicRefAr : t(share.quranicRef)}
                          </td>
                          <td
                            className={`px-6 py-4 font-mono ${isRTL ? 'text-left' : 'text-right'} text-gray-600 dark:text-gray-300`}
                          >
                            {percent(share.sharePercent)}
                          </td>
                          <td
                            className={`px-6 py-4 font-medium ${isRTL ? 'text-left' : 'text-right'} text-gray-900 dark:text-white`}
                          >
                            {formatAmount(share.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reset + Disclaimer */}
      <div className="mt-6 flex flex-col items-center gap-3">
        {(estateValue || debts || bequests || hasHeirs) && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {isRTL ? 'مسح الكل' : t('Clear all')}
          </button>
        )}
        <p className={`text-center text-xs text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
          {isRTL
            ? 'هذه الحاسبة للإرشاد فقط. استشر عالماً إسلامياً مؤهلاً لحالتك الخاصة.'
            : t(
                'This calculator is for guidance only. Consult a qualified Islamic scholar for your specific case.'
              )}
        </p>
      </div>
    </div>
  )
}
