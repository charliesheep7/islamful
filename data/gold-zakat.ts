import { KARATS, ZAKAT_CURRENCIES } from './zakat'

export type GoldLot = { weight: string; karat: number; use: 'investment' | 'jewellery' }
export type GoldDraft = {
  lots: GoldLot[]
  currency: string
  date: string
  price: string
  nisab: '85' | '87.48' | 'custom'
  customNisab: string
  jewellery: 'include' | 'exclude'
  hawl: 'yes' | 'no' | 'unsure'
}
export class GoldInputError extends Error {
  constructor(public field: string) {
    super(field)
  }
}
export function emptyGoldDraft(date: string, currency = 'USD'): GoldDraft {
  return {
    lots: [{ weight: '', karat: 24, use: 'investment' }],
    currency,
    date,
    price: '',
    nisab: '85',
    customNisab: '',
    jewellery: 'include',
    hawl: 'unsure',
  }
}
function decimal(raw: string, field: string, places: number, positive = false) {
  const s = raw
    .trim()
    .replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 1776))
    .replace(/٫/g, '.')
  if (!new RegExp(`^\\d{1,9}(?:\\.\\d{1,${places}})?$`).test(s)) throw new GoldInputError(field)
  const [whole, fraction = ''] = s.split('.')
  const n = BigInt(whole) * BigInt(10 ** places) + BigInt(fraction.padEnd(places, '0'))
  if (positive && n === BigInt(0)) throw new GoldInputError(field)
  return n
}
const rounded = (n: bigint, d: bigint) => (n + d / BigInt(2)) / d
const ceiling = (n: bigint, d: bigint) => (n + d - BigInt(1)) / d
// Every value numerator represents weight-milligrams × karat × price-millionths.
// One currency cent is therefore 24 × 1,000 × 1,000,000 / 100 numerator units.
const CENT = BigInt(240000000)
export function calculateGold(d: GoldDraft) {
  if (!(ZAKAT_CURRENCIES as readonly string[]).includes(d.currency))
    throw new GoldInputError('currency')
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(d.date) ||
    d.date < '1900-01-01' ||
    d.date > '2100-12-31' ||
    !Number.isFinite(Date.parse(d.date + 'T00:00:00Z')) ||
    new Date(d.date + 'T00:00:00Z').toISOString().slice(0, 10) !== d.date
  )
    throw new GoldInputError('date')
  if (!['85', '87.48', 'custom'].includes(d.nisab)) throw new GoldInputError('nisab')
  if (!['include', 'exclude'].includes(d.jewellery)) throw new GoldInputError('jewellery')
  if (!['yes', 'no', 'unsure'].includes(d.hawl)) throw new GoldInputError('hawl')
  if (!Array.isArray(d.lots) || !d.lots.length || d.lots.length > 20)
    throw new GoldInputError('lots')
  const price = decimal(d.price, 'price', 6, true)
  let included = BigInt(0),
    excluded = BigInt(0),
    pureUnits = BigInt(0)
  const lots = d.lots.map((lot, index) => {
    const weight = decimal(lot.weight, `weight-${index}`, 3)
    if (!(KARATS as readonly number[]).includes(lot.karat))
      throw new GoldInputError(`karat-${index}`)
    if (!['investment', 'jewellery'].includes(lot.use)) throw new GoldInputError(`use-${index}`)
    const pure = weight * BigInt(lot.karat),
      value = pure * price
    const include = lot.use === 'investment' || d.jewellery === 'include'
    if (include) {
      included += value
      pureUnits += pure
    } else excluded += value
    return {
      included: include,
      value: Number(rounded(value, CENT)) / 100,
      pureGrams: Number(pure) / 24000,
    }
  })
  const threshold =
    d.nisab === 'custom'
      ? decimal(d.customNisab, 'customNisab', 2, true) * CENT
      : decimal(d.nisab, 'nisab', 3, true) * BigInt(24) * price
  if (
    [included, excluded, threshold, included + excluded].some(
      (n) => n > BigInt('900000000000000') * CENT
    )
  )
    throw new GoldInputError('price')
  const above = included >= threshold
  return {
    lots,
    goldValue: Number(rounded(included, CENT)) / 100,
    excludedValue: Number(rounded(excluded, CENT)) / 100,
    pureGrams: Number(pureUnits) / 24000,
    nisabValue: Number(ceiling(threshold, CENT)) / 100,
    above,
    potential: above ? Number(ceiling(included, CENT * BigInt(40))) / 100 : 0,
    status: !above
      ? ('below' as const)
      : d.hawl === 'yes'
        ? ('estimate' as const)
        : d.hawl === 'no'
          ? ('not-yet' as const)
          : ('check-hawl' as const),
  }
}
export type GoldResult = ReturnType<typeof calculateGold>
