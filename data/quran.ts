import index from './quran/index.json'
export const chapters = index.chapters
export const juzStarts = index.juzs
export type Chapter = (typeof chapters)[number]
export type Verse = {
  number: number
  global: number
  arabic: string
  translation: string
  footnotes?: string
  juz: number
  page: number
}
export const RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', nameAr: 'مشاري راشد العفاسي' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary', nameAr: 'محمود خليل الحصري' },
] as const
export type Reciter = (typeof RECITERS)[number]['id']
export const quranPath = (chapter: Chapter, lang: string = 'en', ayah?: number) =>
  `${['ar', 'fr', 'de'].includes(lang) ? `/${lang}` : ''}/quran/${chapter.slug}${ayah ? `#ayah-${ayah}` : ''}`
export const normalizeDigits = (s: string) =>
  s
    .replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 1776))
export function verseNumber(raw: string, count: number) {
  const value = normalizeDigits(raw.trim())
  if (!/^\d{1,3}$/.test(value)) return null
  const number = Number(value)
  return number >= 1 && number <= count ? number : null
}
export function reference(raw: string) {
  const match = normalizeDigits(raw.trim()).match(/^(\d{1,3})(?:\s*[:：]\s*(\d{1,3}))?$/)
  if (!match) return null
  const chapter = chapters[Number(match[1]) - 1]
  if (!chapter) return null
  const ayah = match[2] ? verseNumber(match[2], chapter.count) : 1
  return ayah ? { chapter, ayah } : null
}
// Search keys only; neither Arabic source text nor translations are changed.
export const searchKey = (s: string) =>
  normalizeDigits(s)
    .normalize('NFD')
    .replace(/\u0670/g, 'ا')
    .replace(/\u0640/g, '')
    .replace(/[\u0300-\u036f\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/رحمان/g, 'رحمن')
    .replace(/هاذا/g, 'هذا')
    .replace(/ذالك/g, 'ذلك')
    .replace(/لاكن/g, 'لكن')
    .replace(/ى/g, 'ي')
    .replace(/[^\p{L}\p{N}]+/gu, '')
    .toLowerCase()
export function audioSource(global: number, reciter: Reciter) {
  if (
    !Number.isInteger(global) ||
    global < 1 ||
    global > 6236 ||
    !RECITERS.some((r) => r.id === reciter)
  )
    throw new Error('Invalid Quran audio reference')
  return `https://cdn.islamic.network/quran/audio/128/${reciter}/${global}.mp3`
}
export function nextAudioStep(
  verse: number,
  pass: number,
  end: number,
  repeats: number,
  sequence: boolean
) {
  if (pass < repeats) return { verse, pass: pass + 1 }
  if (sequence && verse < end) return { verse: verse + 1, pass: 1 }
  return null
}
export type Place = { surah: number; ayah: number }
export type ReaderData = {
  version: 1
  place: Place | null
  bookmarks: Place[]
  fontSize: 28 | 36 | 44
  showTranslation: boolean
}
export const READER_KEY = 'islamful.quran.reader.v1'
export function validPlace(v: unknown): v is Place {
  if (!v || typeof v !== 'object') return false
  const p = v as Place,
    c = chapters[p.surah - 1]
  return (
    Number.isInteger(p.surah) && !!c && Number.isInteger(p.ayah) && p.ayah > 0 && p.ayah <= c.count
  )
}
export function readerData(raw: string | null, lang: string): ReaderData {
  const fallback: ReaderData = {
    version: 1,
    place: null,
    bookmarks: [],
    fontSize: 36,
    showTranslation: lang !== 'ar',
  }
  try {
    const v = JSON.parse(raw || 'null')
    if (!v || v.version !== 1) return fallback
    return {
      version: 1,
      place: validPlace(v.place) ? { surah: v.place.surah, ayah: v.place.ayah } : null,
      bookmarks: Array.isArray(v.bookmarks)
        ? v.bookmarks
            .filter(validPlace)
            .filter(
              (p: Place, i: number, a: Place[]) =>
                a.findIndex((x) => x.surah === p.surah && x.ayah === p.ayah) === i
            )
            .slice(0, 100)
            .map((p: Place) => ({ surah: p.surah, ayah: p.ayah }))
        : [],
      fontSize: [28, 36, 44].includes(v.fontSize) ? v.fontSize : 36,
      showTranslation:
        typeof v.showTranslation === 'boolean' ? v.showTranslation : fallback.showTranslation,
    }
  } catch {
    return fallback
  }
}
