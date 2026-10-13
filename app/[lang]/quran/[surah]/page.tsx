import { chapters } from '@/data/quran'
import { QuranSurah, quranMetadata } from '@/components/quran/QuranPages'
import { notFound } from 'next/navigation'
export const dynamicParams = false
export function generateStaticParams() {
  return chapters.map((c) => ({ surah: c.slug }))
}
export async function generateMetadata({ params }: { params: Promise<{ surah: string }> }) {
  const { surah } = await params
  if (!chapters.some((c) => c.slug === surah)) notFound()
  return quranMetadata('ar', surah)
}
export default async function Page({ params }: { params: Promise<{ surah: string }> }) {
  const { surah } = await params
  return <QuranSurah lang="ar" slug={surah} />
}
