import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary } from './dictionaries'
import { DictionaryProvider } from './DictionaryProvider'

// The root layout reads the locale from middleware headers. force-static
// empties headers(), causing Arabic responses to declare English/LTR.
// Keep request rendering while retaining the locale allowlist below.
/**
 * Only the locales in generateStaticParams exist. Without this, any single
 * path segment — /pricing, /llms.txt, a typo — matched [lang] and rendered the
 * Arabic homepage with a 200 and `index, follow`, so every bad URL became an
 * indexable duplicate of the homepage.
 */
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: 'ar' | 'fr' | 'de' }>
}): Promise<Metadata> {
  const { lang } = await params
  return {
    openGraph: {
      locale: lang,
    },
  }
}

export function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'fr' }, { lang: 'de' }]
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  const dict = await getDictionary(lang)
  return <DictionaryProvider dictionary={dict}>{children}</DictionaryProvider>
}
