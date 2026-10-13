import TodayDashboard from '@/components/landing/TodayDashboard'
import { todayDate } from '@/utils/today'
import ToolsGrid from '@/components/landing/ToolsGrid'
import GamesGrid from '@/components/landing/GamesGrid'
import FAQ from '@/components/landing/FAQ'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
import type { Dictionary } from '@/types/dictionary'
import enDict from '../dictionaries/en.json'

export const metadata = {
  ...genPageMetadata({
    title: 'Islamful — Every Tool a Muslim Needs',
    description:
      'Daily Muslim tools in one place: prayer times, Quran reading and audio, morning and evening adhkar, Qibla, Islamic calendar and zakat calculator. Free on the web.',
    alternates: buildLanguageAlternates('/'),
  }),
  title: {
    absolute: 'Islamful — Every Tool a Muslim Needs',
  },
}

export default function Page() {
  const dict = enDict as Dictionary

  return (
    <div className="flex flex-col">
      <TodayDashboard
        lang="en"
        initialDate={todayDate(
          new Date().toISOString(),
          { method: 'islamic-umalqura', adjustment: 0, timeZone: 'UTC' },
          'en'
        )}
      />
      <ToolsGrid lang="en" dict={dict} />
      <GamesGrid />
      <FAQ lang="en" dict={dict} />
    </div>
  )
}

// Keep the no-JavaScript UTC reference date fresh; the dashboard uses the live client date.
export const revalidate = 300
