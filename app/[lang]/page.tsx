import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import CTA from '@/components/landing/CTA'
import MediaTicker from '@/components/landing/MediaTicker'
import Testimonials from '@/components/landing/Testimonials'
import FAQ from '@/components/landing/FAQ'
import { getDictionary } from './dictionaries'
import { buildLanguageAlternates } from 'app/seo'

export function generateStaticParams() {
  return [{ lang: 'ar' }]
}

export default async function LangHome({ params }: { params: Promise<{ lang: 'ar' }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="flex flex-col">
      <Hero lang={lang} dict={dict} />
      <Features lang={lang} dict={dict} />
      <CTA lang={lang} dict={dict} />
      <MediaTicker />
      <Testimonials lang={lang} dict={dict} />
      <FAQ lang={lang} dict={dict} />
    </div>
  )
}

export const metadata = {
  alternates: buildLanguageAlternates('/', { currentLanguage: 'ar' }),
}
