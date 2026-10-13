import type { Metadata } from 'next'
import { buildLanguageAlternates } from 'app/seo'
import GoldZakatPage from '@/components/tools/GoldZakatPage'
export const metadata: Metadata = {
  title: 'Gold Zakat Calculator — Weight, Purity & Nisab',
  description:
    'Calculate a gold-only Zakat estimate for mixed karats. Enter a dated gold price, choose your jewellery and nisab basis, and download the calculation.',
  alternates: buildLanguageAlternates('/zakat-calculator/gold'),
  openGraph: { images: ['/static/images/gold-zakat-hero.webp'] },
}
export default function Page() {
  return <GoldZakatPage lang="en" />
}
