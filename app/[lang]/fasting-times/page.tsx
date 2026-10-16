import FastingPage from '@/components/fasting/FastingPage'
import { fastingCopy } from '@/data/fasting'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
import type { Locale } from '@/utils/locale'
type Props = { params: Promise<{ lang: Locale }> }
export async function generateMetadata({ params }: Props) {
  const { lang } = await params
  return genPageMetadata({
    title: fastingCopy[lang].dailyTitle,
    description: fastingCopy[lang].dailyDescription,
    alternates: buildLanguageAlternates('/fasting-times', { currentLanguage: lang }),
  })
}
export default async function Page({ params }: Props) {
  const { lang } = await params
  return <FastingPage lang={lang} ramadan={false} />
}
export const revalidate = 3600
