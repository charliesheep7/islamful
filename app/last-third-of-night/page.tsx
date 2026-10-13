import NightPlannerPage from '@/components/tools/NightPlannerPage'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Last Third of the Night Calculator — Tahajjud & Islamic Midnight',
  description:
    'Calculate the last third of the night and Islamic midnight from your city or local Maghrib and Fajr times. Plan one night and download a calendar event.',
  alternates: buildLanguageAlternates('/last-third-of-night', { currentLanguage: 'en' }),
})

export default function Page() {
  return <NightPlannerPage lang="en" />
}
