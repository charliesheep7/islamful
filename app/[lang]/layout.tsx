import type { Metadata } from 'next'
import { getDictionary } from './dictionaries'
import { DictionaryProvider } from './DictionaryProvider'

export const dynamic = 'force-static'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: 'es' | 'zh' }>
}): Promise<Metadata> {
  const { lang } = await params
  const ogLocale = lang === 'es' ? 'es_ES' : 'zh_CN'
  return {
    openGraph: {
      locale: ogLocale,
    },
    alternates: {
      languages: {
        en: '/',
        es: '/es',
        'zh-Hans': '/zh',
      },
    },
  }
}

export function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'zh' }]
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: 'es' | 'zh' }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  return <DictionaryProvider dictionary={dict}>{children}</DictionaryProvider>
}
