import { goldPageCopy } from '@/data/locales/gold-page'
import type { Metadata } from 'next'
import { buildLanguageAlternates } from 'app/seo'
import GoldZakatPage from '@/components/tools/GoldZakatPage'
const arabicMetadata: Metadata = {
  title: 'حاسبة زكاة الذهب — الوزن والعيار والنصاب',
  description:
    'احسب زكاة الذهب بمختلف العيارات. أدخل سعرًا مؤرخًا واختر حكم الحلي والنصاب وحالة الحول، ثم نزّل ملخص الحساب. تدعم الأرقام العربية.',
  alternates: buildLanguageAlternates('/zakat-calculator/gold', { currentLanguage: 'ar' }),
  openGraph: { images: ['/static/images/gold-zakat-hero.webp'] },
}
export function generateStaticParams() {
  return ['ar', 'fr', 'de'].map((lang) => ({ lang }))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (lang !== 'fr' && lang !== 'de') return arabicMetadata
  const copy = goldPageCopy[lang]
  return {
    title: copy.title,
    description: copy.description,
    alternates: buildLanguageAlternates('/zakat-calculator/gold', { currentLanguage: lang }),
    openGraph: { images: ['/static/images/gold-zakat-hero.webp'] },
  }
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <GoldZakatPage lang={lang === 'fr' || lang === 'de' ? lang : 'ar'} />
}
