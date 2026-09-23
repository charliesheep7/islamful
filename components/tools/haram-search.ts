// The prewritten entries describe a topic, not every question containing its name.
// Qualified or negated questions must use the general-response path instead.
export function findLocalEntry<T extends { name: string }>(
  query: string,
  entries: readonly T[]
): T | null {
  const normalized = query
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[?!.]+$/, '')
  if (!normalized) return null

  const directQuestion = normalized.match(/^(?:is|are) (.+?) (?:halal|haram)(?: in islam)?$/)
  const topic = directQuestion ? directQuestion[1] : normalized
  const names = [topic]
  if (topic.endsWith('ies')) names.push(`${topic.slice(0, -3)}y`)
  if (topic.endsWith('s') && !topic.endsWith('ss')) names.push(topic.slice(0, -1))

  return entries.find((entry) => names.includes(entry.name.toLowerCase())) || null
}
