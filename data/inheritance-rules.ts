export type Gender = 'male' | 'female'

export interface HeirInput {
  spouse: boolean
  father: boolean
  mother: boolean
  sons: number
  daughters: number
  fullBrothers: number
  fullSisters: number
}

export interface HeirShare {
  heir: string
  heirAr: string
  count: number
  shareFraction: string
  sharePercent: number
  amount: number
  quranicRef: string
  quranicRefAr: string
}

export interface InheritanceResult {
  totalEstate: number
  debtsAndFuneral: number
  bequests: number
  distributableEstate: number
  shares: HeirShare[]
  hasAwl: boolean
  hasRadd: boolean
}

// --- Fraction arithmetic helpers ---

interface Fraction {
  num: number
  den: number
}

function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a
}

function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b
}

function findLCM(denominators: number[]): number {
  return denominators.reduce((acc, d) => lcm(acc, d), 1)
}

function simplify(f: Fraction): Fraction {
  if (f.num === 0) return { num: 0, den: 1 }
  const d = gcd(Math.abs(f.num), Math.abs(f.den))
  return { num: f.num / d, den: f.den / d }
}

function addFractions(a: Fraction, b: Fraction): Fraction {
  return simplify({ num: a.num * b.den + b.num * a.den, den: a.den * b.den })
}

function subtractFractions(a: Fraction, b: Fraction): Fraction {
  return simplify({ num: a.num * b.den - b.num * a.den, den: a.den * b.den })
}

function fractionToString(f: Fraction): string {
  const s = simplify(f)
  if (s.num === 0) return '0'
  if (s.den === 1) return `${s.num}`
  return `${s.num}/${s.den}`
}

function fractionToDecimal(f: Fraction): number {
  return f.den === 0 ? 0 : f.num / f.den
}

// --- Internal share tracking ---

interface ShareEntry {
  heir: string
  heirAr: string
  count: number
  fraction: Fraction
  isResidual: boolean
  quranicRef: string
  quranicRefAr: string
}

export function calculateInheritance(
  deceasedGender: Gender,
  estateValue: number,
  debts: number,
  bequests: number,
  heirs: HeirInput
): InheritanceResult {
  // Step 1: Calculate distributable estate
  const maxBequests = estateValue / 3
  const actualBequests = Math.min(bequests, maxBequests)
  const distributableEstate = Math.max(0, estateValue - debts - actualBequests)

  const hasChildren = heirs.sons > 0 || heirs.daughters > 0
  const hasSons = heirs.sons > 0
  const totalSiblings = heirs.fullBrothers + heirs.fullSisters

  const shares: ShareEntry[] = []

  // Step 2: Determine fixed shares (Ashab al-Furud)

  // --- Spouse ---
  if (heirs.spouse) {
    if (deceasedGender === 'male') {
      // Deceased is male → spouse is wife
      const fraction: Fraction = hasChildren ? { num: 1, den: 8 } : { num: 1, den: 4 }
      shares.push({
        heir: 'Wife',
        heirAr: 'الزوجة',
        count: 1,
        fraction,
        isResidual: false,
        quranicRef: 'Quran 4:12',
        quranicRefAr: 'النساء: ١٢',
      })
    } else {
      // Deceased is female → spouse is husband
      const fraction: Fraction = hasChildren ? { num: 1, den: 4 } : { num: 1, den: 2 }
      shares.push({
        heir: 'Husband',
        heirAr: 'الزوج',
        count: 1,
        fraction,
        isResidual: false,
        quranicRef: 'Quran 4:12',
        quranicRefAr: 'النساء: ١٢',
      })
    }
  }

  // --- Father ---
  if (heirs.father) {
    if (hasChildren) {
      // Father gets 1/6 fixed share when deceased has children
      shares.push({
        heir: 'Father',
        heirAr: 'الأب',
        count: 1,
        fraction: { num: 1, den: 6 },
        isResidual: false,
        quranicRef: 'Quran 4:11',
        quranicRefAr: 'النساء: ١١',
      })
    }
    // If no children, father is residual (handled in step 3)
  }

  // --- Mother ---
  if (heirs.mother) {
    if (hasChildren || totalSiblings >= 2) {
      shares.push({
        heir: 'Mother',
        heirAr: 'الأم',
        count: 1,
        fraction: { num: 1, den: 6 },
        isResidual: false,
        quranicRef: 'Quran 4:11',
        quranicRefAr: 'النساء: ١١',
      })
    } else {
      shares.push({
        heir: 'Mother',
        heirAr: 'الأم',
        count: 1,
        fraction: { num: 1, den: 3 },
        isResidual: false,
        quranicRef: 'Quran 4:11',
        quranicRefAr: 'النساء: ١١',
      })
    }
  }

  // --- Daughters (only as fixed share holders when no sons) ---
  if (heirs.daughters > 0 && !hasSons) {
    if (heirs.daughters === 1) {
      shares.push({
        heir: 'Daughter',
        heirAr: 'البنت',
        count: 1,
        fraction: { num: 1, den: 2 },
        isResidual: false,
        quranicRef: 'Quran 4:11',
        quranicRefAr: 'النساء: ١١',
      })
    } else {
      shares.push({
        heir: 'Daughters',
        heirAr: 'البنات',
        count: heirs.daughters,
        fraction: { num: 2, den: 3 },
        isResidual: false,
        quranicRef: 'Quran 4:11',
        quranicRefAr: 'النساء: ١١',
      })
    }
  }

  // --- Full Sisters (only when no children and no father) ---
  if (heirs.fullSisters > 0 && !hasChildren && !heirs.father && heirs.fullBrothers === 0) {
    if (heirs.fullSisters === 1) {
      shares.push({
        heir: 'Full Sister',
        heirAr: 'الأخت الشقيقة',
        count: 1,
        fraction: { num: 1, den: 2 },
        isResidual: false,
        quranicRef: 'Quran 4:176',
        quranicRefAr: 'النساء: ١٧٦',
      })
    } else {
      shares.push({
        heir: 'Full Sisters',
        heirAr: 'الأخوات الشقيقات',
        count: heirs.fullSisters,
        fraction: { num: 2, den: 3 },
        isResidual: false,
        quranicRef: 'Quran 4:176',
        quranicRefAr: 'النساء: ١٧٦',
      })
    }
  }

  // Step 3: Calculate residual heirs (Asaba)

  // Sum all fixed shares
  let totalFixed: Fraction = { num: 0, den: 1 }
  for (const s of shares) {
    totalFixed = addFractions(totalFixed, s.fraction)
  }

  let remainder: Fraction = subtractFractions({ num: 1, den: 1 }, totalFixed)

  if (hasSons) {
    // Sons and daughters together in 2:1 ratio get remainder
    const maleShares = heirs.sons * 2
    const femaleShares = heirs.daughters
    const totalParts = maleShares + femaleShares

    if (heirs.sons > 0) {
      const sonsFraction: Fraction = {
        num: remainder.num * maleShares,
        den: remainder.den * totalParts,
      }
      shares.push({
        heir: heirs.sons === 1 ? 'Son' : 'Sons',
        heirAr: heirs.sons === 1 ? 'الابن' : 'الأبناء',
        count: heirs.sons,
        fraction: simplify(sonsFraction),
        isResidual: true,
        quranicRef: 'Quran 4:11',
        quranicRefAr: 'النساء: ١١',
      })
    }

    if (heirs.daughters > 0) {
      const daughtersFraction: Fraction = {
        num: remainder.num * femaleShares,
        den: remainder.den * totalParts,
      }
      shares.push({
        heir: heirs.daughters === 1 ? 'Daughter' : 'Daughters',
        heirAr: heirs.daughters === 1 ? 'البنت' : 'البنات',
        count: heirs.daughters,
        fraction: simplify(daughtersFraction),
        isResidual: true,
        quranicRef: 'Quran 4:11',
        quranicRefAr: 'النساء: ١١',
      })
    }
    remainder = { num: 0, den: 1 }
  } else if (!hasChildren && heirs.father) {
    // Father gets remainder when no children
    shares.push({
      heir: 'Father',
      heirAr: 'الأب',
      count: 1,
      fraction: remainder,
      isResidual: true,
      quranicRef: 'Quran 4:11',
      quranicRefAr: 'النساء: ١١',
    })
    remainder = { num: 0, den: 1 }
  } else if (!hasChildren && !heirs.father && heirs.fullBrothers > 0) {
    // Full brothers (and sisters with them in 2:1 ratio) get remainder
    const maleShares = heirs.fullBrothers * 2
    const femaleShares = heirs.fullSisters
    const totalParts = maleShares + femaleShares

    // If sisters were already assigned fixed shares (no brothers case), remove them
    // since brothers convert them to residual heirs
    // But in our logic, sisters are only added as fixed when fullBrothers === 0,
    // so if we're here (fullBrothers > 0), sisters weren't added as fixed.

    const brothersFraction: Fraction = {
      num: remainder.num * maleShares,
      den: remainder.den * totalParts,
    }
    shares.push({
      heir: heirs.fullBrothers === 1 ? 'Full Brother' : 'Full Brothers',
      heirAr: heirs.fullBrothers === 1 ? 'الأخ الشقيق' : 'الإخوة الأشقاء',
      count: heirs.fullBrothers,
      fraction: simplify(brothersFraction),
      isResidual: true,
      quranicRef: 'Quran 4:176',
      quranicRefAr: 'النساء: ١٧٦',
    })

    if (heirs.fullSisters > 0) {
      const sistersFraction: Fraction = {
        num: remainder.num * femaleShares,
        den: remainder.den * totalParts,
      }
      shares.push({
        heir: heirs.fullSisters === 1 ? 'Full Sister' : 'Full Sisters',
        heirAr: heirs.fullSisters === 1 ? 'الأخت الشقيقة' : 'الأخوات الشقيقات',
        count: heirs.fullSisters,
        fraction: simplify(sistersFraction),
        isResidual: true,
        quranicRef: 'Quran 4:176',
        quranicRefAr: 'النساء: ١٧٦',
      })
    }

    remainder = { num: 0, den: 1 }
  }

  // Step 4: Check for Awl (oversubscription)
  let hasAwl = false
  let totalAllocated: Fraction = { num: 0, den: 1 }
  for (const s of shares) {
    totalAllocated = addFractions(totalAllocated, s.fraction)
  }

  if (totalAllocated.num > totalAllocated.den && totalAllocated.den > 0) {
    hasAwl = true
    // Apply Awl: proportionally reduce all shares
    // Each share's new fraction = original fraction / totalAllocated
    // i.e., new = (original.num / original.den) / (totalAllocated.num / totalAllocated.den)
    // = (original.num * totalAllocated.den) / (original.den * totalAllocated.num)
    const allDenominators = shares.map((s) => s.fraction.den)
    const commonDen = findLCM(allDenominators)

    // Convert all to common denominator
    const numerators = shares.map((s) => (s.fraction.num * commonDen) / s.fraction.den)
    const totalNumerator = numerators.reduce((sum, n) => sum + n, 0)

    // Awl: the new denominator becomes totalNumerator (which is > commonDen)
    for (let i = 0; i < shares.length; i++) {
      shares[i].fraction = simplify({ num: numerators[i], den: totalNumerator })
    }
  }

  // Step 5: Check for Radd (undersubscription)
  let hasRadd = false
  totalAllocated = { num: 0, den: 1 }
  for (const s of shares) {
    totalAllocated = addFractions(totalAllocated, s.fraction)
  }

  const hasResidualHeirs = shares.some((s) => s.isResidual)

  if (
    !hasResidualHeirs &&
    totalAllocated.num < totalAllocated.den &&
    totalAllocated.num > 0 &&
    shares.length > 0
  ) {
    hasRadd = true
    const unallocated = subtractFractions({ num: 1, den: 1 }, totalAllocated)

    // Non-spouse fixed heirs get the redistribution
    const spouseIndex = shares.findIndex((s) => s.heir === 'Wife' || s.heir === 'Husband')
    const nonSpouseShares = shares.filter((_, i) => i !== spouseIndex)

    if (nonSpouseShares.length > 0) {
      // Calculate total of non-spouse shares
      let nonSpouseTotal: Fraction = { num: 0, den: 1 }
      for (const s of nonSpouseShares) {
        nonSpouseTotal = addFractions(nonSpouseTotal, s.fraction)
      }

      // Distribute unallocated proportionally among non-spouse heirs
      for (let i = 0; i < shares.length; i++) {
        if (i === spouseIndex) continue
        // Proportion = share.fraction / nonSpouseTotal
        // Additional = unallocated * proportion
        const proportion: Fraction = {
          num: shares[i].fraction.num * nonSpouseTotal.den,
          den: shares[i].fraction.den * nonSpouseTotal.num,
        }
        const additional: Fraction = {
          num: unallocated.num * proportion.num,
          den: unallocated.den * proportion.den,
        }
        shares[i].fraction = simplify(addFractions(shares[i].fraction, additional))
      }
    } else if (spouseIndex !== -1) {
      // Only spouse exists — give remainder to spouse (edge case)
      shares[spouseIndex].fraction = { num: 1, den: 1 }
    }
  }

  // Step 6: Convert to amounts and percentages
  const result: HeirShare[] = shares.map((s) => {
    const decimal = fractionToDecimal(s.fraction)
    const percent = Math.round(decimal * 10000) / 100
    const amount = Math.round(distributableEstate * decimal * 100) / 100

    return {
      heir: s.heir,
      heirAr: s.heirAr,
      count: s.count,
      shareFraction:
        s.isResidual && !hasAwl
          ? `Residual (${fractionToString(s.fraction)})`
          : fractionToString(s.fraction),
      sharePercent: percent,
      amount,
      quranicRef: s.quranicRef,
      quranicRefAr: s.quranicRefAr,
    }
  })

  return {
    totalEstate: estateValue,
    debtsAndFuneral: debts,
    bequests: actualBequests,
    distributableEstate,
    shares: result,
    hasAwl,
    hasRadd,
  }
}
