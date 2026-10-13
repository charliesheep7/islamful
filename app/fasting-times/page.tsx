import FastingPage from '@/components/fasting/FastingPage'
import { fastingCopy } from '@/data/fasting'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
export const metadata = genPageMetadata({
  title: fastingCopy.en.dailyTitle,
  description: fastingCopy.en.dailyDescription,
  alternates: buildLanguageAlternates('/fasting-times', { currentLanguage: 'en' }),
})
export default function Page() {
  return <FastingPage lang="en" ramadan={false} />
}
