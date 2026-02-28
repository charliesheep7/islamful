'use client'

import { useState, useMemo } from 'react'
import { RotateCcw } from 'lucide-react'

const NISAB_GOLD_GRAMS = 87.48 // 7.5 tola
const NISAB_SILVER_GRAMS = 612.36 // 52.5 tola
const ZAKAT_RATE = 0.025

const CURRENCIES = [
  { code: 'USD', symbol: '$', goldPerGram: 90, silverPerGram: 1.1 },
  { code: 'EUR', symbol: '€', goldPerGram: 83, silverPerGram: 1.01 },
  { code: 'GBP', symbol: '£', goldPerGram: 71, silverPerGram: 0.87 },
  { code: 'SAR', symbol: '﷼', goldPerGram: 338, silverPerGram: 4.13 },
  { code: 'AED', symbol: 'د.إ', goldPerGram: 331, silverPerGram: 4.04 },
  { code: 'MYR', symbol: 'RM', goldPerGram: 400, silverPerGram: 4.89 },
  { code: 'PKR', symbol: '₨', goldPerGram: 25100, silverPerGram: 307 },
  { code: 'INR', symbol: '₹', goldPerGram: 7550, silverPerGram: 92 },
]

interface ZakatCalculatorProps {
  lang?: string
}

export default function ZakatCalculator({ lang = 'en' }: ZakatCalculatorProps) {
  const isRTL = lang === 'ar'

  const [currency, setCurrency] = useState('USD')
  const [cash, setCash] = useState('')
  const [savings, setSavings] = useState('')
  const [goldGrams, setGoldGrams] = useState('')
  const [silverGrams, setSilverGrams] = useState('')
  const [investments, setInvestments] = useState('')
  const [otherAssets, setOtherAssets] = useState('')
  const [debts, setDebts] = useState('')
  const [nisabType, setNisabType] = useState<'gold' | 'silver'>('gold')

  const cur = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0]

  const calculation = useMemo(() => {
    const cashVal = parseFloat(cash) || 0
    const savingsVal = parseFloat(savings) || 0
    const goldVal = (parseFloat(goldGrams) || 0) * cur.goldPerGram
    const silverVal = (parseFloat(silverGrams) || 0) * cur.silverPerGram
    const investVal = parseFloat(investments) || 0
    const otherVal = parseFloat(otherAssets) || 0
    const debtVal = parseFloat(debts) || 0

    const totalAssets = cashVal + savingsVal + goldVal + silverVal + investVal + otherVal
    const netWealth = totalAssets - debtVal
    const nisab =
      nisabType === 'gold'
        ? NISAB_GOLD_GRAMS * cur.goldPerGram
        : NISAB_SILVER_GRAMS * cur.silverPerGram
    const zakatDue = netWealth >= nisab ? netWealth * ZAKAT_RATE : 0

    return { totalAssets, netWealth, nisab, zakatDue, isAboveNisab: netWealth >= nisab }
  }, [cash, savings, goldGrams, silverGrams, investments, otherAssets, debts, nisabType, cur])

  const hasInput =
    cash || savings || goldGrams || silverGrams || investments || otherAssets || debts

  const formatAmount = (val: number) =>
    `${cur.symbol}${val.toLocaleString(isRTL ? 'ar-SA' : 'en-US', { maximumFractionDigits: 2 })}`

  const handleReset = () => {
    setCash('')
    setSavings('')
    setGoldGrams('')
    setSilverGrams('')
    setInvestments('')
    setOtherAssets('')
    setDebts('')
  }

  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:focus:border-gray-600'

  return (
    <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Currency + Nisab selectors */}
      <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">{isRTL ? 'العملة' : 'Currency'}</label>
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNisabType('gold')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              nisabType === 'gold'
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'text-gray-400 hover:text-gray-600 dark:text-gray-500'
            }`}
          >
            {isRTL ? 'نصاب الذهب' : 'Gold Nisab'}
          </button>
          <button
            onClick={() => setNisabType('silver')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              nisabType === 'silver'
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'text-gray-400 hover:text-gray-600 dark:text-gray-500'
            }`}
          >
            {isRTL ? 'نصاب الفضة' : 'Silver Nisab'}
          </button>
        </div>
      </div>

      {/* Form sections */}
      <div className="space-y-4">
        {/* Cash & Savings */}
        <div className="rounded-2xl bg-white p-6 ring-1 ring-gray-200/60 dark:bg-white/[0.03] dark:ring-white/10">
          <h3
            className={`mb-1 text-sm font-semibold text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
          >
            {isRTL ? 'النقد والمدخرات' : 'Cash & Savings'}
          </h3>
          <p className={`mb-4 text-xs text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL
              ? 'أموال في اليد، الحسابات الجارية، حسابات التوفير'
              : 'Money in hand, checking accounts, savings accounts'}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={`mb-1.5 block text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
                {isRTL ? 'النقد والحسابات الجارية' : 'Cash & checking'}
              </label>
              <input
                type="number"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={`mb-1.5 block text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
                {isRTL ? 'حسابات التوفير' : 'Savings'}
              </label>
              <input
                type="number"
                value={savings}
                onChange={(e) => setSavings(e.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Gold & Silver */}
        <div className="rounded-2xl bg-white p-6 ring-1 ring-gray-200/60 dark:bg-white/[0.03] dark:ring-white/10">
          <h3
            className={`mb-1 text-sm font-semibold text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
          >
            {isRTL ? 'الذهب والفضة' : 'Gold & Silver'}
          </h3>
          <p className={`mb-4 text-xs text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL
              ? 'المجوهرات والسبائك (فقط ما يزيد عن الاستخدام الشخصي المعتاد)'
              : 'Jewelry and bullion (only what exceeds normal personal use)'}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={`mb-1.5 block text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
                {isRTL ? 'الذهب (جرام)' : 'Gold (grams)'}
              </label>
              <input
                type="number"
                value={goldGrams}
                onChange={(e) => setGoldGrams(e.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={`mb-1.5 block text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
                {isRTL ? 'الفضة (جرام)' : 'Silver (grams)'}
              </label>
              <input
                type="number"
                value={silverGrams}
                onChange={(e) => setSilverGrams(e.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Investments */}
        <div className="rounded-2xl bg-white p-6 ring-1 ring-gray-200/60 dark:bg-white/[0.03] dark:ring-white/10">
          <h3
            className={`mb-1 text-sm font-semibold text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
          >
            {isRTL ? 'الاستثمارات' : 'Investments'}
          </h3>
          <p className={`mb-4 text-xs text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL
              ? 'الأسهم، الصناديق، العملات الرقمية، إيجارات العقارات'
              : 'Stocks, funds, crypto, rental income, business inventory'}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={`mb-1.5 block text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
                {isRTL ? 'الأسهم والعملات الرقمية' : 'Stocks, crypto, etc.'}
              </label>
              <input
                type="number"
                value={investments}
                onChange={(e) => setInvestments(e.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={`mb-1.5 block text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
                {isRTL ? 'أصول أخرى' : 'Other zakatable assets'}
              </label>
              <input
                type="number"
                value={otherAssets}
                onChange={(e) => setOtherAssets(e.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Debts */}
        <div className="rounded-2xl bg-white p-6 ring-1 ring-gray-200/60 dark:bg-white/[0.03] dark:ring-white/10">
          <h3
            className={`mb-1 text-sm font-semibold text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
          >
            {isRTL ? 'الديون' : 'Debts'}
          </h3>
          <p className={`mb-4 text-xs text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL
              ? 'الديون المستحقة خلال العام (لا تشمل الرهن العقاري طويل الأجل)'
              : 'Debts due within the year (not long-term mortgages)'}
          </p>
          <input
            type="number"
            value={debts}
            onChange={(e) => setDebts(e.target.value)}
            placeholder="0"
            className={inputClass}
          />
        </div>
      </div>

      {/* Results */}
      {hasInput && (
        <div className="mt-6 rounded-2xl bg-gray-900 p-6 text-white sm:p-8 dark:bg-white/[0.06]">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">{isRTL ? 'إجمالي الأصول' : 'Total Assets'}</span>
              <span>{formatAmount(calculation.totalAssets)}</span>
            </div>
            {parseFloat(debts) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">{isRTL ? 'بعد خصم الديون' : 'After debts'}</span>
                <span>{formatAmount(calculation.netWealth)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">
                {isRTL ? 'النصاب' : 'Nisab threshold'} (
                {nisabType === 'gold' ? (isRTL ? 'ذهب' : 'gold') : isRTL ? 'فضة' : 'silver'})
              </span>
              <span>{formatAmount(calculation.nisab)}</span>
            </div>
            <div className="border-t border-white/10 pt-3" />
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {isRTL ? 'الزكاة المستحقة (2.5%)' : 'Zakat Due (2.5%)'}
              </span>
              <span className="text-2xl font-bold">{formatAmount(calculation.zakatDue)}</span>
            </div>
          </div>

          {!calculation.isAboveNisab && (
            <p className={`mt-4 text-sm text-white/50 ${isRTL ? 'font-arabic' : ''}`}>
              {isRTL
                ? 'ثروتك أقل من النصاب. لا تجب عليك الزكاة حالياً.'
                : 'Your wealth is below the nisab. No zakat is due at this time.'}
            </p>
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
            {isRTL ? 'مسح الكل' : 'Clear all'}
          </button>
        )}
        <p className={`text-center text-xs text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
          {isRTL
            ? 'هذه الأداة للتوجيه فقط. أسعار المعادن تقريبية. استشر عالماً لحالتك الخاصة.'
            : 'For guidance only. Metal prices are approximate. Consult a scholar for your situation.'}
        </p>
      </div>
    </div>
  )
}
