export const ZAKAT_CURRENCIES = ['USD', 'GBP', 'EUR', 'SAR', 'AED', 'MYR', 'PKR', 'INR'] as const
export const KARATS = [24, 22, 21, 18, 14, 10, 9] as const
export const SILVER_PURITY = [1000, 999, 925] as const
export const MONEY_FIELDS = [
  'cash',
  'savings',
  'investments',
  'business',
  'receivables',
  'other',
  'liabilities',
] as const
export type MoneyField = (typeof MONEY_FIELDS)[number]
export type ZakatDraft = Record<MoneyField, string> & {
  currency: string
  date: string
  hawl: 'yes' | 'no' | 'unsure'
  nisabMode: 'amount' | 'gold' | 'silver'
  nisabAmount: string
  convention: '87.48/612.36' | '85/595'
  goldPrice: string
  silverPrice: string
  metalMode: 'value' | 'weight'
  goldValue: string
  silverValue: string
  goldWeight: string
  silverWeight: string
  karat: number
  silverPurity: number
}
export class ZakatInputError extends Error {
  constructor(
    public field: keyof ZakatDraft,
    public code: 'number' | 'required' | 'choice' | 'date'
  ) {
    super(`${field}: ${code}`)
  }
}
export function emptyZakatDraft(date: string, currency = 'USD'): ZakatDraft {
  return {
    currency,
    date,
    hawl: 'unsure',
    nisabMode: 'amount',
    nisabAmount: '',
    convention: '87.48/612.36',
    goldPrice: '',
    silverPrice: '',
    metalMode: 'value',
    goldValue: '',
    silverValue: '',
    goldWeight: '',
    silverWeight: '',
    karat: 24,
    silverPurity: 1000,
    cash: '',
    savings: '',
    investments: '',
    business: '',
    receivables: '',
    other: '',
    liabilities: '',
  }
}

// Decimal strings become integers before any arithmetic. No parseFloat fallback,
// grouped/ambiguous numbers, negative values, exponential notation or silent truncation.
function decimal(raw: string, field: keyof ZakatDraft, places: number, required = false): bigint {
  const text = raw
    .trim()
    .replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 1776))
    .replace(/٫/g, '.')
  if (!text) {
    if (required) throw new ZakatInputError(field, 'required')
    return BigInt('0')
  }
  if (!new RegExp(`^\\d{1,13}(?:\\.\\d{1,${places}})?$`).test(text))
    throw new ZakatInputError(field, 'number')
  const [whole, fraction = ''] = text.split('.')
  const value = BigInt(whole) * BigInt(10 ** places) + BigInt(fraction.padEnd(places, '0'))
  if (value > BigInt('1000000000000') * BigInt(10 ** places))
    throw new ZakatInputError(field, 'number')
  if (required && value === BigInt('0')) throw new ZakatInputError(field, 'required')
  return value
}
const round = (n: bigint, d: bigint) => (n + d / BigInt('2')) / d
const ceil = (n: bigint, d: bigint) => (n + d - BigInt('1')) / d
const amount = (cents: bigint) => Number(cents) / 100

export function calculateZakat(d: ZakatDraft) {
  if (!(ZAKAT_CURRENCIES as readonly string[]).includes(d.currency))
    throw new ZakatInputError('currency', 'choice')
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(d.date) ||
    d.date < '1900-01-01' ||
    d.date > '2100-12-31' ||
    !Number.isFinite(Date.parse(d.date + 'T00:00:00Z')) ||
    new Date(d.date + 'T00:00:00Z').toISOString().slice(0, 10) !== d.date
  )
    throw new ZakatInputError('date', 'date')
  if (!['yes', 'no', 'unsure'].includes(d.hawl)) throw new ZakatInputError('hawl', 'choice')
  if (!['amount', 'gold', 'silver'].includes(d.nisabMode))
    throw new ZakatInputError('nisabMode', 'choice')
  if (!['87.48/612.36', '85/595'].includes(d.convention))
    throw new ZakatInputError('convention', 'choice')
  if (!['value', 'weight'].includes(d.metalMode)) throw new ZakatInputError('metalMode', 'choice')
  const money = Object.fromEntries(
    MONEY_FIELDS.map((field) => [field, decimal(d[field], field, 2)])
  ) as Record<MoneyField, bigint>
  const goldWeight = d.metalMode === 'weight' ? decimal(d.goldWeight, 'goldWeight', 3) : BigInt('0')
  const silverWeight =
    d.metalMode === 'weight' ? decimal(d.silverWeight, 'silverWeight', 3) : BigInt('0')
  const needGold = d.nisabMode === 'gold' || goldWeight > BigInt('0')
  const needSilver = d.nisabMode === 'silver' || silverWeight > BigInt('0')
  const goldPrice = needGold ? decimal(d.goldPrice, 'goldPrice', 6, true) : BigInt('0')
  const silverPrice = needSilver ? decimal(d.silverPrice, 'silverPrice', 6, true) : BigInt('0')
  if (!(KARATS as readonly number[]).includes(d.karat)) throw new ZakatInputError('karat', 'choice')
  if (!(SILVER_PURITY as readonly number[]).includes(d.silverPurity))
    throw new ZakatInputError('silverPurity', 'choice')
  const gold =
    d.metalMode === 'value'
      ? decimal(d.goldValue, 'goldValue', 2)
      : round(goldWeight * BigInt(d.karat) * goldPrice, BigInt('24') * BigInt('10000000'))
  const silver =
    d.metalMode === 'value'
      ? decimal(d.silverValue, 'silverValue', 2)
      : round(
          silverWeight * BigInt(d.silverPurity) * silverPrice,
          BigInt('1000') * BigInt('10000000')
        )
  const assetFields = [
    ...MONEY_FIELDS.filter((f) => f !== 'liabilities'),
    ...(d.metalMode === 'value'
      ? (['goldValue', 'silverValue'] as const)
      : (['goldWeight', 'silverWeight'] as const)),
  ]
  if (!assetFields.some((f) => d[f].trim() !== '')) throw new ZakatInputError('cash', 'required')
  const grams =
    d.convention === '87.48/612.36'
      ? [BigInt('8748'), BigInt('61236')]
      : [BigInt('8500'), BigInt('59500')]
  const nisab =
    d.nisabMode === 'amount'
      ? decimal(d.nisabAmount, 'nisabAmount', 2, true)
      : ceil(
          d.nisabMode === 'gold' ? grams[0] * goldPrice : grams[1] * silverPrice,
          BigInt('1000000')
        )
  const assets =
    money.cash +
    money.savings +
    money.investments +
    money.business +
    money.receivables +
    money.other +
    gold +
    silver
  const net = assets > money.liabilities ? assets - money.liabilities : BigInt('0')
  // Keep the numeric/Intl display comfortably below the point where a Number
  // can no longer distinguish neighboring cents. All arithmetic above is integral.
  if ([assets, nisab, net, gold, silver].some((v) => v > BigInt('900000000000000')))
    throw new ZakatInputError('cash', 'number')
  const above = net >= nisab
  return {
    assets: amount(assets),
    net: amount(net),
    liabilities: amount(money.liabilities),
    gold: amount(gold),
    silver: amount(silver),
    nisab: amount(nisab),
    above,
    potential: amount(above ? ceil(net, BigInt('40')) : BigInt('0')),
    status: !above
      ? ('below' as const)
      : d.hawl === 'yes'
        ? ('estimate' as const)
        : d.hawl === 'no'
          ? ('not-yet' as const)
          : ('check-hawl' as const),
  }
}
export type ZakatResult = ReturnType<typeof calculateZakat>
