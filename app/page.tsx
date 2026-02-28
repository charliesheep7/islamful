import Hero from '@/components/landing/Hero'
import ToolsGrid from '@/components/landing/ToolsGrid'
import CTA from '@/components/landing/CTA'
import FAQ from '@/components/landing/FAQ'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
import type { Dictionary } from '@/types/dictionary'
import enDict from '../dictionaries/en.json'

export const metadata = {
  ...genPageMetadata({
    title: 'Islamful — Your Complete Islamic Companion',
    description:
      'Prayer times, halal checker, Quran, dua, dhikr, and more — all in one place. Free Islamic tools for every Muslim.',
    alternates: buildLanguageAlternates('/'),
  }),
  title: {
    absolute: 'Islamful — Your Complete Islamic Companion',
  },
}

export default function Page() {
  const dict = enDict as Dictionary

  return (
    <div className="flex flex-col">
      <Hero lang="en" dict={dict} />
      <ToolsGrid lang="en" dict={dict} />
      <CTA lang="en" dict={dict} />
      <FAQ lang="en" dict={dict} />
    </div>
  )
}
