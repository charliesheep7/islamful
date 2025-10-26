import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import CTA from '@/components/landing/CTA'
import MediaTicker from '@/components/landing/MediaTicker'
import Testimonials from '@/components/landing/Testimonials'
import FAQ from '@/components/landing/FAQ'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'DeenUp - Your Islamic Companion',
  description:
    "Stay consistent with Salah, Quran, and community through DeenUp's AI-powered Islamic companion.",
  alternates: buildLanguageAlternates('/'),
})

export default async function Page() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <CTA />
      <MediaTicker />
      <Testimonials />
      <FAQ />
    </div>
  )
}
