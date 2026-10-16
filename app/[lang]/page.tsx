import GamesGrid from '@/components/landing/GamesGrid'
import TodayDashboard from '@/components/landing/TodayDashboard'
import { todayDate } from '@/utils/today'
import ToolsGrid from '@/components/landing/ToolsGrid'
import FAQ from '@/components/landing/FAQ'
import { getDictionary } from './dictionaries'
import { buildLanguageAlternates, genPageMetadata } from 'app/seo'

export function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'fr' }, { lang: 'de' }]
}

export default async function LangHome({
  params,
}: {
  params: Promise<{ lang: 'ar' | 'fr' | 'de' }>
}) {
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

const arabicMetadata = genPageMetadata({
  title: 'إسلامفُل — رفيقك الإسلامي الشامل',
  description:
    'أدوات المسلم اليومية: مواقيت الصلاة، قراءة القرآن والاستماع إليه، أذكار الصباح والمساء، القبلة، التقويم الهجري وحساب الزكاة. مجانًا على الويب.',
  alternates: buildLanguageAlternates('/', { currentLanguage: 'ar' }),
})

// Keep the no-JavaScript UTC reference date fresh; the dashboard uses the live client date.
export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (lang !== 'fr' && lang !== 'de') return arabicMetadata
  return genPageMetadata({
    title:
      lang === 'fr'
        ? 'Islamful — Votre compagnon musulman au quotidien'
        : 'Islamful — Dein islamischer Begleiter im Alltag',
    description:
      lang === 'fr'
        ? 'Horaires de prière, Coran, adhkar, Qibla, calendrier hégirien et zakat : des outils islamiques gratuits pour chaque jour.'
        : 'Gebetszeiten, Koran, Adhkar, Qibla, islamischer Kalender und Zakat: kostenlose islamische Tools für jeden Tag.',
    alternates: {
      canonical: `https://www.islamful.com/${lang}`,
      languages: {
        en: 'https://www.islamful.com',
        ar: 'https://www.islamful.com/ar',
        fr: 'https://www.islamful.com/fr',
        de: 'https://www.islamful.com/de',
      },
    },
  })
}
