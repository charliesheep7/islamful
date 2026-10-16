import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import QuranAnswersPage from '@/components/tools/QuranAnswersPage'
import { answersCopy } from '@/data/locales/answers'
import { isLocale } from '@/utils/locale'
import { buildLanguageAlternates } from 'app/seo'
export function generateStaticParams() {
  return ['ar', 'fr', 'de'].map((lang) => ({ lang }))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang) || lang === 'en') notFound()
  return {
    title: answersCopy[lang].title,
    description: answersCopy[lang].description,
    alternates: buildLanguageAlternates('/answers', { currentLanguage: lang }),
  }
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang) || lang === 'en') notFound()
  return <QuranAnswersPage lang={lang} />
}
