import type { Metadata } from 'next'
import { buildLanguageAlternates } from 'app/seo'
import GoldZakatPage from '@/components/tools/GoldZakatPage'
export const metadata: Metadata = {
  title: 'حاسبة زكاة الذهب — الوزن والعيار والنصاب',
  description:
    'احسب زكاة الذهب بمختلف العيارات. أدخل سعرًا مؤرخًا واختر حكم الحلي والنصاب وحالة الحول، ثم نزّل ملخص الحساب. تدعم الأرقام العربية.',
  alternates: buildLanguageAlternates('/zakat-calculator/gold', { currentLanguage: 'ar' }),
  openGraph: { images: ['/static/images/gold-zakat-hero.webp'] },
}
export default function Page() {
  return <GoldZakatPage lang="ar" />
}
