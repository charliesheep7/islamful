/** Bounds are calculator limits, not lender eligibility rules. Blank deposit means zero. */
export function parseMortgageInputs(
  value: string,
  deposit: string,
  term: string,
  profit: string,
  comparison: string
) {
  const number = (s: string) => (s.trim() === '' ? NaN : Number(s))
  const property = number(value)
  const down = deposit.trim() === '' ? 0 : number(deposit)
  const years = number(term)
  const rate = number(profit) / 100
  const convRate = number(comparison) / 100
  const valid =
    [property, down, years, rate].every(Number.isFinite) &&
    property > 0 &&
    property <= 1e12 &&
    down >= 0 &&
    down < property &&
    Number.isInteger(years) &&
    years >= 1 &&
    years <= 50 &&
    rate >= 0 &&
    rate <= 1
  return {
    property,
    principal: property - down,
    months: years * 12,
    rate,
    convRate,
    valid,
    comparisonValid: Number.isFinite(convRate) && convRate >= 0 && convRate <= 1,
  }
}

/** Simplified fixed-payment model; rent falls and equity purchases rise until payoff. */
export function diminishingSchedule(principal: number, months: number, rate: number) {
  if (
    !Number.isFinite(principal) ||
    principal <= 0 ||
    principal > 1e12 ||
    !Number.isInteger(months) ||
    months < 1 ||
    months > 600 ||
    !Number.isFinite(rate) ||
    rate < 0 ||
    rate > 1
  )
    throw new RangeError('Invalid mortgage inputs')
  let bankEquity = principal
  let totalRent = 0
  const schedule: { month: number; rent: number; equity: number; bankShare: number }[] = []
  const fixedMonthly = principal / months + (principal * rate) / 12
  for (let month = 1; month <= months && bankEquity > 0; month++) {
    const rent = (bankEquity * rate) / 12
    // Clear floating-point residue in the final contractual month.
    const equity = month === months ? bankEquity : Math.min(fixedMonthly - rent, bankEquity)
    bankEquity = Math.max(0, bankEquity - equity)
    totalRent += rent
    if (month % 12 === 0 || bankEquity === 0) {
      schedule.push({ month, rent, equity, bankShare: bankEquity })
    }
  }
  return { fixedMonthly, totalCost: principal + totalRent, totalRent, schedule }
}
