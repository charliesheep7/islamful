import FastingPage from '@/components/fasting/FastingPage'
import { fastingCopy } from '@/data/fasting'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
export const metadata = genPageMetadata({
  title: fastingCopy.ar.ramadanTitle,
  description: fastingCopy.ar.ramadanDescription,
  alternates: buildLanguageAlternates('/ramadan-calendar', { currentLanguage: 'ar' }),
})
export default function Page() {
  return <FastingPage lang="ar" ramadan={true} />
}
