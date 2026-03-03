'use client'

import { useState, useMemo } from 'react'
import { RotateCcw } from 'lucide-react'

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '\u20ac' },
  { code: 'GBP', symbol: '\u00a3' },
  { code: 'SAR', symbol: '\ufdfc' },
  { code: 'AED', symbol: '\u062f.\u0625' },
  { code: 'MYR', symbol: 'RM' },
  { code: 'PKR', symbol: '\u20a8' },
  { code: 'INR', symbol: '\u20b9' },
]

interface IslamicMortgageCalculatorProps {
  lang?: string
}

export default function IslamicMortgageCalculator({ lang = 'en' }: IslamicMortgageCalculatorProps) {
  const isRTL = lang === 'ar'

  const [activeTab, setActiveTab] = useState<'murabaha' | 'ijara' | 'musharaka' | 'compare'>(
    'murabaha'
  )
  const [propertyValue, setPropertyValue] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [termYears, setTermYears] = useState('25')
  const [profitRate, setProfitRate] = useState('4.5')
  const [conventionalRate, setConventionalRate] = useState('6.0')
  const [currency, setCurrency] = useState('USD')

  const cur = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0]

  const formatAmount = (val: number) =>
    `${cur.symbol}${val.toLocaleString(isRTL ? 'ar-SA' : 'en-US', { maximumFractionDigits: 0 })}`

  const principal = (parseFloat(propertyValue) || 0) - (parseFloat(downPayment) || 0)
  const months = (parseInt(termYears) || 25) * 12
  const rate = (parseFloat(profitRate) || 4.5) / 100
  const convRate = (parseFloat(conventionalRate) || 6.0) / 100

  const murabaha = useMemo(() => {
    if (principal <= 0) return null
    const totalPrice = principal * (1 + rate * (months / 12))
    const monthlyPayment = totalPrice / months
    const totalProfit = totalPrice - principal
    return { monthlyPayment, totalPrice, totalProfit, principal }
  }, [principal, months, rate])

  const ijara = useMemo(() => {
    if (principal <= 0) return null
    const monthlyRent = (principal * rate) / 12
    const monthlyPurchase = principal / months
    const monthlyTotal = monthlyRent + monthlyPurchase
    const totalCost = monthlyTotal * months
    const totalRent = monthlyRent * months
    return { monthlyRent, monthlyPurchase, monthlyTotal, totalCost, totalRent }
  }, [principal, months, rate])

  const musharaka = useMemo(() => {
    if (principal <= 0) return null
    let bankEquity = principal
    let totalRent = 0
    const schedule: {
      year: number
      rent: number
      equity: number
      bankShare: number
      buyerEquity: number
    }[] = []
    const fixedMonthly = principal / months + (principal * rate) / 12

    for (let m = 1; m <= months; m++) {
      const rentPortion = (bankEquity * rate) / 12
      const equityPortion = Math.min(fixedMonthly - rentPortion, bankEquity)
      bankEquity = Math.max(0, bankEquity - equityPortion)
      totalRent += rentPortion
      if (m % 12 === 0 || m === 1) {
        schedule.push({
          year: Math.ceil(m / 12),
          rent: rentPortion,
          equity: equityPortion,
          bankShare: bankEquity,
          buyerEquity: principal - bankEquity,
        })
      }
    }
    const totalCost = principal + totalRent
    return { fixedMonthly, totalCost, totalRent, schedule }
  }, [principal, months, rate])

  const conventional = useMemo(() => {
    if (principal <= 0) return null
    const r = convRate / 12
    if (r === 0) {
      const M = principal / months
      return { monthlyPayment: M, totalCost: principal, totalInterest: 0 }
    }
    const M = (principal * (r * Math.pow(1 + r, months))) / (Math.pow(1 + r, months) - 1)
    const totalCost = M * months
    const totalInterest = totalCost - principal
    return { monthlyPayment: M, totalCost, totalInterest }
  }, [principal, months, convRate])

  const hasInput = parseFloat(propertyValue) > 0

  const handleReset = () => {
    setPropertyValue('')
    setDownPayment('')
    setTermYears('25')
    setProfitRate('4.5')
    setConventionalRate('6.0')
  }

  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:focus:border-gray-600'

  const tabs = [
    {
      id: 'murabaha' as const,
      name: 'Murabaha',
      nameAr: '\u0627\u0644\u0645\u0631\u0627\u0628\u062d\u0629',
    },
    { id: 'ijara' as const, name: 'Ijara', nameAr: '\u0627\u0644\u0625\u062c\u0627\u0631\u0629' },
    {
      id: 'musharaka' as const,
      name: 'Musharaka',
      nameAr: '\u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0629',
    },
    { id: 'compare' as const, name: 'Compare All', nameAr: '\u0645\u0642\u0627\u0631\u0646\u0629' },
  ]

  const compareMethods = useMemo(() => {
    if (!murabaha || !ijara || !musharaka || !conventional) return []
    return [
      {
        name: 'Murabaha',
        nameAr: '\u0627\u0644\u0645\u0631\u0627\u0628\u062d\u0629',
        totalCost: murabaha.totalPrice,
        isConventional: false,
        note: `Fixed markup: ${formatAmount(murabaha.totalProfit)}`,
        noteAr: `\u0631\u0628\u062d \u062b\u0627\u0628\u062a: ${formatAmount(murabaha.totalProfit)}`,
      },
      {
        name: 'Ijara',
        nameAr: '\u0627\u0644\u0625\u062c\u0627\u0631\u0629',
        totalCost: ijara.totalCost,
        isConventional: false,
        note: `Total rent: ${formatAmount(ijara.totalRent)}`,
        noteAr: `\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0625\u064a\u062c\u0627\u0631: ${formatAmount(ijara.totalRent)}`,
      },
      {
        name: 'Musharaka',
        nameAr: '\u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0629',
        totalCost: musharaka.totalCost,
        isConventional: false,
        note: `Decreasing rent: ${formatAmount(musharaka.totalRent)}`,
        noteAr: `\u0625\u064a\u062c\u0627\u0631 \u0645\u062a\u0646\u0627\u0642\u0635: ${formatAmount(musharaka.totalRent)}`,
      },
      {
        name: 'Conventional',
        nameAr: '\u0627\u0644\u062a\u0642\u0644\u064a\u062f\u064a',
        totalCost: conventional.totalCost,
        isConventional: true,
        note: `Interest paid: ${formatAmount(conventional.totalInterest)}`,
        noteAr: `\u0641\u0648\u0627\u0626\u062f \u0645\u062f\u0641\u0648\u0639\u0629: ${formatAmount(conventional.totalInterest)}`,
      },
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [murabaha, ijara, musharaka, conventional, currency, isRTL])

  return (
    <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Tab selector */}
      <div className="mb-8 flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-lg px-3 py-2.5 text-xs font-medium transition-all sm:text-sm ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            } ${isRTL ? 'font-arabic' : ''}`}
          >
            {isRTL ? tab.nameAr : tab.name}
          </button>
        ))}
      </div>

      {/* Currency selector */}
      <div className="mb-8 flex items-center justify-center gap-2">
        <label className="text-xs text-gray-500">
          {isRTL ? '\u0627\u0644\u0639\u0645\u0644\u0629' : 'Currency'}
        </label>
        <select
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

      {/* Input form */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-gray-200/60 dark:bg-white/[0.03] dark:ring-white/10">
          <h3
            className={`mb-1 text-sm font-semibold text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
          >
            {isRTL
              ? '\u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0639\u0642\u0627\u0631'
              : 'Property Details'}
          </h3>
          <p className={`mb-4 text-xs text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL
              ? '\u0623\u062f\u062e\u0644 \u0642\u064a\u0645\u0629 \u0627\u0644\u0639\u0642\u0627\u0631 \u0648\u0634\u0631\u0648\u0637 \u0627\u0644\u062a\u0645\u0648\u064a\u0644'
              : 'Enter property value and financing terms'}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={`mb-1.5 block text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
                {isRTL
                  ? '\u0642\u064a\u0645\u0629 \u0627\u0644\u0639\u0642\u0627\u0631'
                  : 'Property Value'}
              </label>
              <input
                type="number"
                value={propertyValue}
                onChange={(e) => setPropertyValue(e.target.value)}
                placeholder={isRTL ? '\u0645\u062b\u0627\u0644: 500000' : 'e.g. 500000'}
                className={inputClass}
              />
            </div>
            <div>
              <label className={`mb-1.5 block text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
                {isRTL
                  ? '\u0627\u0644\u062f\u0641\u0639\u0629 \u0627\u0644\u0645\u0642\u062f\u0645\u0629'
                  : 'Down Payment'}
              </label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                placeholder={isRTL ? '\u0645\u062b\u0627\u0644: 100000' : 'e.g. 100000'}
                className={inputClass}
              />
            </div>
            <div>
              <label className={`mb-1.5 block text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
                {isRTL
                  ? '\u0645\u062f\u0629 \u0627\u0644\u062a\u0645\u0648\u064a\u0644 (\u0633\u0646\u0648\u0627\u062a)'
                  : 'Term (years)'}
              </label>
              <input
                type="number"
                value={termYears}
                onChange={(e) => setTermYears(e.target.value)}
                placeholder="25"
                className={inputClass}
              />
            </div>
            <div>
              <label className={`mb-1.5 block text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
                {isRTL
                  ? '\u0645\u0639\u062f\u0644 \u0627\u0644\u0631\u0628\u062d (%)'
                  : 'Profit/Markup Rate (%)'}
              </label>
              <input
                type="number"
                step="0.1"
                value={profitRate}
                onChange={(e) => setProfitRate(e.target.value)}
                placeholder="4.5"
                className={inputClass}
              />
            </div>
            {activeTab === 'compare' && (
              <div className="sm:col-span-2">
                <label
                  className={`mb-1.5 block text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}
                >
                  {isRTL
                    ? '\u0633\u0639\u0631 \u0627\u0644\u0641\u0627\u0626\u062f\u0629 \u0627\u0644\u062a\u0642\u0644\u064a\u062f\u064a (%)'
                    : 'Conventional Interest Rate (%)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={conventionalRate}
                  onChange={(e) => setConventionalRate(e.target.value)}
                  placeholder="6.0"
                  className={inputClass}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {hasInput && principal > 0 && (
        <div className="mt-6">
          {/* Murabaha Results */}
          {activeTab === 'murabaha' && murabaha && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-gray-900 p-6 text-white sm:p-8 dark:bg-white/[0.06]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">
                      {isRTL
                        ? '\u0627\u0644\u0645\u0628\u0644\u063a \u0627\u0644\u0623\u0635\u0644\u064a'
                        : 'Principal'}
                    </span>
                    <span>{formatAmount(murabaha.principal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">
                      {isRTL
                        ? '\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0631\u0628\u062d'
                        : 'Total Profit (markup)'}
                    </span>
                    <span>{formatAmount(murabaha.totalProfit)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">
                      {isRTL
                        ? '\u0627\u0644\u062a\u0643\u0644\u0641\u0629 \u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a\u0629'
                        : 'Total Cost'}
                    </span>
                    <span>{formatAmount(murabaha.totalPrice)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3" />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL
                        ? '\u0627\u0644\u0642\u0633\u0637 \u0627\u0644\u0634\u0647\u0631\u064a'
                        : 'Monthly Payment'}
                    </span>
                    <span className="text-2xl font-bold">
                      {formatAmount(murabaha.monthlyPayment)}
                    </span>
                  </div>
                </div>
              </div>
              <p
                className={`text-sm text-gray-600 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}
              >
                {isRTL
                  ? '\u064a\u0634\u062a\u0631\u064a \u0627\u0644\u0628\u0646\u0643 \u0627\u0644\u0639\u0642\u0627\u0631 \u0648\u064a\u0628\u064a\u0639\u0647 \u0644\u0643 \u0628\u0633\u0639\u0631 \u0645\u062a\u0641\u0642 \u0639\u0644\u064a\u0647 \u064a\u062a\u0636\u0645\u0646 \u0647\u0627\u0645\u0634 \u0631\u0628\u062d. \u0627\u0644\u062a\u0643\u0644\u0641\u0629 \u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a\u0629 \u062b\u0627\u0628\u062a\u0629 \u0645\u0646 \u0627\u0644\u064a\u0648\u0645 \u0627\u0644\u0623\u0648\u0644 \u2014 \u0644\u0627 \u0641\u0648\u0627\u0626\u062f \u0645\u0631\u0643\u0628\u0629.'
                  : 'The bank purchases the property and sells it to you at an agreed markup. Your total cost is fixed from day one \u2014 no compounding.'}
              </p>
            </div>
          )}

          {/* Ijara Results */}
          {activeTab === 'ijara' && ijara && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-gray-900 p-6 text-white sm:p-8 dark:bg-white/[0.06]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">
                      {isRTL
                        ? '\u0627\u0644\u0625\u064a\u062c\u0627\u0631 \u0627\u0644\u0634\u0647\u0631\u064a'
                        : 'Monthly Rent'}
                    </span>
                    <span>{formatAmount(ijara.monthlyRent)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">
                      {isRTL
                        ? '\u0642\u0633\u0637 \u0627\u0644\u0634\u0631\u0627\u0621 \u0627\u0644\u0634\u0647\u0631\u064a'
                        : 'Monthly Purchase Contribution'}
                    </span>
                    <span>{formatAmount(ijara.monthlyPurchase)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">
                      {isRTL
                        ? '\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0625\u064a\u062c\u0627\u0631 \u0627\u0644\u0645\u062f\u0641\u0648\u0639'
                        : 'Total Rent Paid'}
                    </span>
                    <span>{formatAmount(ijara.totalRent)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">
                      {isRTL
                        ? '\u0627\u0644\u062a\u0643\u0644\u0641\u0629 \u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a\u0629'
                        : 'Total Cost'}
                    </span>
                    <span>{formatAmount(ijara.totalCost)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3" />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL
                        ? '\u0627\u0644\u062f\u0641\u0639\u0629 \u0627\u0644\u0634\u0647\u0631\u064a\u0629 \u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a\u0629'
                        : 'Total Monthly'}
                    </span>
                    <span className="text-2xl font-bold">{formatAmount(ijara.monthlyTotal)}</span>
                  </div>
                </div>
              </div>
              <p
                className={`text-sm text-gray-600 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}
              >
                {isRTL
                  ? '\u064a\u0634\u062a\u0631\u064a \u0627\u0644\u0628\u0646\u0643 \u0627\u0644\u0639\u0642\u0627\u0631 \u0648\u064a\u0624\u062c\u0631\u0647 \u0644\u0643. \u062a\u062f\u0641\u0639 \u0625\u064a\u062c\u0627\u0631\u0627\u064b + \u0623\u0642\u0633\u0627\u0637 \u0634\u0631\u0627\u0621. \u0641\u064a \u0646\u0647\u0627\u064a\u0629 \u0627\u0644\u0645\u062f\u0629\u060c \u062a\u0645\u0644\u0643 \u0627\u0644\u0639\u0642\u0627\u0631.'
                  : 'The bank buys the property and leases it to you. You pay rent + purchase installments. At the end of the term, you own the property.'}
              </p>
            </div>
          )}

          {/* Musharaka Results */}
          {activeTab === 'musharaka' && musharaka && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-gray-900 p-6 text-white sm:p-8 dark:bg-white/[0.06]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">
                      {isRTL
                        ? '\u0627\u0644\u062f\u0641\u0639\u0629 \u0627\u0644\u0634\u0647\u0631\u064a\u0629 \u0627\u0644\u0623\u0648\u0644\u0649'
                        : 'Initial Monthly Payment'}
                    </span>
                    <span>{formatAmount(musharaka.fixedMonthly)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">
                      {isRTL
                        ? '\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0625\u064a\u062c\u0627\u0631 \u0627\u0644\u0645\u062f\u0641\u0648\u0639'
                        : 'Total Rent Paid'}
                    </span>
                    <span>{formatAmount(musharaka.totalRent)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3" />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL
                        ? '\u0627\u0644\u062a\u0643\u0644\u0641\u0629 \u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a\u0629'
                        : 'Total Cost'}
                    </span>
                    <span className="text-2xl font-bold">{formatAmount(musharaka.totalCost)}</span>
                  </div>
                </div>
              </div>

              {/* Yearly Schedule Table */}
              <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                      <th
                        className={`px-4 py-3 text-xs font-medium text-gray-500 ${isRTL ? 'font-arabic text-right' : 'text-left'}`}
                      >
                        {isRTL ? '\u0627\u0644\u0633\u0646\u0629' : 'Year'}
                      </th>
                      <th
                        className={`px-4 py-3 text-xs font-medium text-gray-500 ${isRTL ? 'font-arabic text-right' : 'text-left'}`}
                      >
                        {isRTL
                          ? '\u0627\u0644\u0625\u064a\u062c\u0627\u0631 \u0627\u0644\u0634\u0647\u0631\u064a'
                          : 'Monthly Rent'}
                      </th>
                      <th
                        className={`px-4 py-3 text-xs font-medium text-gray-500 ${isRTL ? 'font-arabic text-right' : 'text-left'}`}
                      >
                        {isRTL
                          ? '\u0627\u0644\u062d\u0635\u0629 \u0627\u0644\u0634\u0647\u0631\u064a\u0629'
                          : 'Monthly Equity'}
                      </th>
                      <th
                        className={`px-4 py-3 text-xs font-medium text-gray-500 ${isRTL ? 'font-arabic text-right' : 'text-left'}`}
                      >
                        {isRTL
                          ? '\u062d\u0635\u0629 \u0627\u0644\u0628\u0646\u0643'
                          : 'Bank Share %'}
                      </th>
                      <th
                        className={`px-4 py-3 text-xs font-medium text-gray-500 ${isRTL ? 'font-arabic text-right' : 'text-left'}`}
                      >
                        {isRTL ? '\u062d\u0635\u062a\u0643' : 'Your Equity %'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {musharaka.schedule.map((row) => (
                      <tr
                        key={row.year}
                        className="border-b border-gray-100 dark:border-gray-800/50"
                      >
                        <td className="px-4 py-2.5 font-mono text-xs text-gray-900 dark:text-white">
                          {row.year}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-gray-600 dark:text-gray-400">
                          {formatAmount(row.rent)}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-gray-600 dark:text-gray-400">
                          {formatAmount(row.equity)}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-gray-600 dark:text-gray-400">
                          {principal > 0 ? ((row.bankShare / principal) * 100).toFixed(1) : '0'}%
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-[var(--color-primary-500)]">
                          {principal > 0 ? ((row.buyerEquity / principal) * 100).toFixed(1) : '0'}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p
                className={`text-sm text-gray-600 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}
              >
                {isRTL
                  ? '\u0623\u0646\u062a \u0648\u0627\u0644\u0628\u0646\u0643 \u062a\u0645\u0644\u0643\u0627\u0646 \u0627\u0644\u0639\u0642\u0627\u0631 \u0645\u0639\u0627\u064b. \u062a\u062f\u0641\u0639 \u0625\u064a\u062c\u0627\u0631\u0627\u064b \u0639\u0644\u0649 \u062d\u0635\u0629 \u0627\u0644\u0628\u0646\u0643 \u0648\u062a\u0634\u062a\u0631\u064a \u062d\u0635\u062a\u0647 \u062a\u062f\u0631\u064a\u062c\u064a\u0627\u064b. \u0643\u0644\u0645\u0627 \u0632\u0627\u062f\u062a \u062d\u0635\u062a\u0643\u060c \u0627\u0646\u062e\u0641\u0636 \u0627\u0644\u0625\u064a\u062c\u0627\u0631.'
                  : 'You and the bank co-own the property. You pay rent on the bank\u2019s share and gradually buy their equity. As your share grows, rent decreases.'}
              </p>
            </div>
          )}

          {/* Compare All Results */}
          {activeTab === 'compare' && compareMethods.length > 0 && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <h3
                  className={`mb-6 text-sm font-semibold text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
                >
                  {isRTL
                    ? '\u0645\u0642\u0627\u0631\u0646\u0629 \u0627\u0644\u062a\u0643\u0644\u0641\u0629 \u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a\u0629'
                    : 'Total Cost Comparison'}
                </h3>
                <div className="space-y-5">
                  {(() => {
                    const maxCost = Math.max(...compareMethods.map((m) => m.totalCost))
                    return compareMethods.map((method) => {
                      const width = (method.totalCost / maxCost) * 100
                      return (
                        <div key={method.name} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className={isRTL ? 'font-arabic' : ''}>
                              {isRTL ? method.nameAr : method.name}
                            </span>
                            <span className="font-mono text-xs">
                              {formatAmount(method.totalCost)}
                            </span>
                          </div>
                          <div className="h-8 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            <div
                              className={`h-full rounded-lg transition-all duration-500 ${method.isConventional ? 'bg-red-400' : 'bg-[var(--color-primary-500)]'}`}
                              style={{ width: `${width}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500">
                            {isRTL ? method.noteAr : method.note}
                          </div>
                        </div>
                      )
                    })
                  })()}
                </div>
              </div>

              {/* Savings summary */}
              {conventional && (
                <div className="rounded-2xl bg-gray-900 p-6 text-white sm:p-8 dark:bg-white/[0.06]">
                  <h3 className={`mb-4 text-sm font-semibold ${isRTL ? 'font-arabic' : ''}`}>
                    {isRTL
                      ? '\u0627\u0644\u062a\u0648\u0641\u064a\u0631 \u0645\u0642\u0627\u0631\u0646\u0629 \u0628\u0627\u0644\u062a\u0645\u0648\u064a\u0644 \u0627\u0644\u062a\u0642\u0644\u064a\u062f\u064a'
                      : 'Savings vs Conventional Mortgage'}
                  </h3>
                  <div className="space-y-2">
                    {compareMethods
                      .filter((m) => !m.isConventional)
                      .map((method) => {
                        const savings = conventional.totalCost - method.totalCost
                        return (
                          <div
                            key={method.name}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className={`text-white/50 ${isRTL ? 'font-arabic' : ''}`}>
                              {isRTL ? method.nameAr : method.name}
                            </span>
                            <span className={savings >= 0 ? 'text-green-400' : 'text-red-400'}>
                              {savings >= 0
                                ? `${isRTL ? '\u062a\u0648\u0641\u064a\u0631' : 'Save'} ${formatAmount(savings)}`
                                : `${isRTL ? '\u0623\u0643\u062b\u0631 \u0628\u0640' : 'More by'} ${formatAmount(Math.abs(savings))}`}
                            </span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Reset + Disclaimer */}
      <div className="mt-6 flex flex-col items-center gap-3">
        {hasInput && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {isRTL ? '\u0645\u0633\u062d \u0627\u0644\u0643\u0644' : 'Clear all'}
          </button>
        )}
        <p className={`text-center text-xs text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
          {isRTL
            ? '\u0647\u0630\u0647 \u0627\u0644\u062d\u0627\u0633\u0628\u0629 \u0644\u0623\u063a\u0631\u0627\u0636 \u062a\u0639\u0644\u064a\u0645\u064a\u0629 \u0641\u0642\u0637. \u0627\u0633\u062a\u0634\u0631 \u0645\u0624\u0633\u0633\u0627\u062a \u0627\u0644\u062a\u0645\u0648\u064a\u0644 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064a \u0644\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u0634\u0631\u0648\u0637 \u0627\u0644\u062a\u0645\u0648\u064a\u0644 \u0627\u0644\u0641\u0639\u0644\u064a\u0629.'
            : 'This calculator is for educational purposes only. Consult Islamic finance institutions for actual financing terms.'}
        </p>
      </div>

      {/* Educational note */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
        <h3
          className={`mb-2 text-sm font-semibold text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
        >
          {isRTL
            ? '\u0644\u0645\u0627\u0630\u0627 \u064a\u062d\u0631\u0645 \u0627\u0644\u0631\u0628\u0627 \u0641\u064a \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u061f'
            : 'Why Is Riba (Interest) Prohibited in Islam?'}
        </h3>
        <p className={`text-sm text-gray-600 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
          {isRTL
            ? '\u0642\u0627\u0644 \u0627\u0644\u0644\u0647 \u062a\u0639\u0627\u0644\u0649: \u00ab\u0627\u0644\u0651\u064e\u0630\u0650\u064a\u0646\u064e \u064a\u064e\u0623\u0652\u0643\u064f\u0644\u064f\u0648\u0646\u064e \u0627\u0644\u0631\u0651\u0650\u0628\u064e\u0627 \u0644\u064e\u0627 \u064a\u064e\u0642\u064f\u0648\u0645\u064f\u0648\u0646\u064e \u0625\u0650\u0644\u0651\u064e\u0627 \u0643\u064e\u0645\u064e\u0627 \u064a\u064e\u0642\u064f\u0648\u0645\u064f \u0627\u0644\u0651\u064e\u0630\u0650\u064a \u064a\u064e\u062a\u064e\u062e\u064e\u0628\u0651\u064e\u0637\u064f\u0647\u064f \u0627\u0644\u0634\u0651\u064e\u064a\u0652\u0637\u064e\u0627\u0646\u064f \u0645\u0650\u0646\u064e \u0627\u0644\u0652\u0645\u064e\u0633\u0651\u0650\u00bb (\u0627\u0644\u0628\u0642\u0631\u0629: 275). \u0627\u0644\u0631\u0628\u0627 \u0645\u062d\u0631\u0645 \u0644\u0623\u0646\u0647 \u064a\u0624\u062f\u064a \u0625\u0644\u0649 \u0627\u0644\u0638\u0644\u0645 \u0648\u0627\u0644\u0627\u0633\u062a\u063a\u0644\u0627\u0644 \u0627\u0644\u0645\u0627\u0644\u064a.'
            : '\u201cThose who consume interest cannot stand except as one stands who is being beaten by Satan into insanity.\u201d (Quran 2:275). Interest is prohibited because it leads to injustice and financial exploitation.'}
        </p>
      </div>
    </div>
  )
}
