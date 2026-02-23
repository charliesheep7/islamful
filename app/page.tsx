import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import CTA from '@/components/landing/CTA'
import Testimonials from '@/components/landing/Testimonials'
import FAQ from '@/components/landing/FAQ'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
import type { Dictionary } from '@/types/dictionary'
import enDict from '../dictionaries/en.json'

export const metadata = genPageMetadata({
  title: 'Deen Back – Overcome Your Nafs',
  description:
    "Deen Back helps Muslims overcome addiction to haram content through Qur'an SOS, daily dhikr, and a faith-centered support community.",
  alternates: buildLanguageAlternates('/'),
})

export default function Page() {
  const dict = enDict as Dictionary

  return (
    <div className="flex flex-col">
      <Hero lang="en" dict={dict} />
      <Features lang="en" dict={dict} />
      <CTA lang="en" dict={dict} />
      <Testimonials lang="en" dict={dict} />
      <FAQ lang="en" dict={dict} />
    </div>
  )
}
