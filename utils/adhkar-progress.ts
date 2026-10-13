export type CountTarget = { id: string; target: number }
export type AdhkarProgress = { version: 1; day: string; counts: Record<string, number> }
export function localDay(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}
export function emptyProgress(targets: CountTarget[], day: string): AdhkarProgress {
  return { version: 1, day, counts: Object.fromEntries(targets.map((t) => [t.id, 0])) }
}
export function parseProgress(
  raw: string | null,
  targets: CountTarget[],
  day: string
): AdhkarProgress {
  const blank = emptyProgress(targets, day)
  try {
    const v = JSON.parse(raw || 'null')
    if (v?.version !== 1 || v.day !== day || !v.counts || typeof v.counts !== 'object') return blank
    for (const t of targets) {
      const value = v.counts[t.id]
      if (Number.isInteger(value) && value >= 0 && value <= t.target) blank.counts[t.id] = value
    }
  } catch {
    /* Corrupt or unavailable stored data starts a fresh session. */
  }
  return blank
}
export function changeCount(
  current: AdhkarProgress,
  targets: CountTarget[],
  id: string,
  action: 'increment' | 'undo' | 'complete',
  day: string
): AdhkarProgress {
  const safe = parseProgress(JSON.stringify(current), targets, day)
  const target = targets.find((t) => t.id === id)
  if (!target) return safe
  safe.counts[id] =
    action === 'complete'
      ? target.target
      : Math.min(target.target, Math.max(0, safe.counts[id] + (action === 'increment' ? 1 : -1)))
  return safe
}
export function summary(progress: AdhkarProgress, targets: CountTarget[]) {
  const done = targets.filter((t) => progress.counts[t.id] === t.target).length
  return { done, total: targets.length, complete: targets.length > 0 && done === targets.length }
}
