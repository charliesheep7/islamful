import { Metadata } from 'next'
import InheritancePage from '@/components/tools/InheritancePageTranslated'
import { inheritancePages } from '@/data/locales/inheritance-page'
import { buildLanguageAlternates } from 'app/seo'
export const metadata: Metadata = {
  title: inheritancePages.en.title,
  description: inheritancePages.en.description,
  alternates: buildLanguageAlternates('/inheritance-calculator'),
}
export default function Page() {
  return <InheritancePage lang="en" />
}
