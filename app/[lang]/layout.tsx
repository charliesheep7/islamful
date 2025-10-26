import type { Metadata } from 'next'
import { getDictionary } from './dictionaries'
import { DictionaryProvider } from './DictionaryProvider'

export const dynamic = 'force-static'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: 'ar' }>
}): Promise<Metadata> {
  const { lang } = await params
  return {
    openGraph: {
      locale: 'ar',
    },
  }
}

export function generateStaticParams() {
  return [{ lang: 'ar' }]
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: 'ar' }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  return <DictionaryProvider dictionary={dict}>{children}</DictionaryProvider>
}
