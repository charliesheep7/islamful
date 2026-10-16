import { notFound } from 'next/navigation'
import { QuranHome, quranMetadata } from '@/components/quran/QuranPages'
export function generateStaticParams() {
  return ['ar', 'fr', 'de'].map((lang) => ({ lang }))
}
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  return quranMetadata(lang)
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  return <QuranHome lang={lang} />
}
