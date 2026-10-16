import { notFound } from 'next/navigation'
import { AdhkarPage, adhkarMetadata } from '@/components/adhkar/AdhkarPages'
import { routines } from '@/data/adhkar'
export const dynamicParams = false
export function generateStaticParams() {
  return ['ar', 'fr', 'de'].flatMap((lang) => routines.map((r) => ({ lang, routine: r.id })))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; routine: string }>
}) {
  const { lang, routine } = await params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  return adhkarMetadata(lang, routine)
}
export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; routine: string }>
}) {
  const { lang, routine } = await params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  return <AdhkarPage lang={lang} id={routine} />
}
