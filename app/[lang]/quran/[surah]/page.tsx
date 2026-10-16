import { chapters } from '@/data/quran'
import { QuranSurah, quranMetadata } from '@/components/quran/QuranPages'
import { notFound } from 'next/navigation'
export const dynamicParams = false
export function generateStaticParams() {
  return ['ar', 'fr', 'de'].flatMap((lang) => chapters.map((c) => ({ lang, surah: c.slug })))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; surah: string }>
}) {
  const { lang, surah } = await params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  if (!chapters.some((c) => c.slug === surah)) notFound()
  return quranMetadata(lang, surah)
}
export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; surah: string }>
}) {
  const { lang, surah } = await params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  return <QuranSurah lang={lang} slug={surah} />
}
