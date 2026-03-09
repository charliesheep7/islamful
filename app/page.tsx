import Hero from '@/components/landing/Hero'
import ToolsGrid from '@/components/landing/ToolsGrid'
import GamesGrid from '@/components/landing/GamesGrid'
import CTA from '@/components/landing/CTA'
import FAQ from '@/components/landing/FAQ'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
import type { Dictionary } from '@/types/dictionary'
import enDict from '../dictionaries/en.json'

export const metadata = {
  ...genPageMetadata({
    title: 'Islamful — Every Tool a Muslim Needs',
    description:
      'Smart Islamic tools powered by AI — prayer times, halal checker, Quran, dua, dhikr, and more. Everything a Muslim needs, all in one place.',
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
      <Hero lang="en" dict={dict} />
      <ToolsGrid lang="en" dict={dict} />
      <GamesGrid />
      <CTA lang="en" dict={dict} />
      <FAQ lang="en" dict={dict} />
    </div>
  )
}
