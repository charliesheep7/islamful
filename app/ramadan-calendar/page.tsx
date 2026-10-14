import FastingPage from '@/components/fasting/FastingPage'
import { fastingCopy } from '@/data/fasting'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
export const metadata = genPageMetadata({
  title: fastingCopy.en.ramadanTitle,
  description: fastingCopy.en.ramadanDescription,
  alternates: buildLanguageAlternates('/ramadan-calendar', { currentLanguage: 'en' }),
})
export default function Page() {
  return <FastingPage lang="en" ramadan={true} />
}

// Refresh the dated server snapshot; the browser follows the city clock live.
export const revalidate = 3600
