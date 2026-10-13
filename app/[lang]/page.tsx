import GamesGrid from '@/components/landing/GamesGrid'
import TodayDashboard from '@/components/landing/TodayDashboard'
import { todayDate } from '@/utils/today'
import ToolsGrid from '@/components/landing/ToolsGrid'
import FAQ from '@/components/landing/FAQ'
import { getDictionary } from './dictionaries'
import { buildLanguageAlternates, genPageMetadata } from 'app/seo'

export function generateStaticParams() {
  return [{ lang: 'ar' }]
}

export default async function LangHome({ params }: { params: Promise<{ lang: 'ar' }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="flex flex-col">
      <TodayDashboard
        lang={lang}
        initialDate={todayDate(
          new Date().toISOString(),
          { method: 'islamic-umalqura', adjustment: 0, timeZone: 'UTC' },
          lang
        )}
      />
      <ToolsGrid lang={lang} dict={dict} />
      <GamesGrid lang={lang} />
      <FAQ lang={lang} dict={dict} />
    </div>
  )
}

export const metadata = genPageMetadata({
  title: 'إسلامفُل — رفيقك الإسلامي الشامل',
  description:
    'أدوات المسلم اليومية: مواقيت الصلاة، قراءة القرآن والاستماع إليه، أذكار الصباح والمساء، القبلة، التقويم الهجري وحساب الزكاة. مجانًا على الويب.',
  alternates: buildLanguageAlternates('/', { currentLanguage: 'ar' }),
})

// Keep the no-JavaScript UTC reference date fresh; the dashboard uses the live client date.
export const revalidate = 300
