import PageContent from '@/components/tools/MortgagePageTranslated'
import { mortgagePages } from '@/data/locales/mortgage-page'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
export const metadata = genPageMetadata({
  title: mortgagePages.en.title,
  description: mortgagePages.en.description,
  alternates: buildLanguageAlternates('/islamic-mortgage'),
})
export default function Page() {
  return <PageContent lang="en" />
}
