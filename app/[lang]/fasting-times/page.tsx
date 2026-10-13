import FastingPage from '@/components/fasting/FastingPage'
import { fastingCopy } from '@/data/fasting'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
export const metadata = genPageMetadata({
  title: fastingCopy.ar.dailyTitle,
  description: fastingCopy.ar.dailyDescription,
  alternates: buildLanguageAlternates('/fasting-times', { currentLanguage: 'ar' }),
})
export default function Page() {
  return <FastingPage lang="ar" ramadan={false} />
}
