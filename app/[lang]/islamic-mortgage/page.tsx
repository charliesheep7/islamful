import PageContent from '@/components/tools/MortgagePageTranslated'
import { mortgagePages } from '@/data/locales/mortgage-page'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
import type { Locale } from '@/utils/locale'
type Props = { params: Promise<{ lang: Locale }> }
export async function generateMetadata({ params }: Props) {
  const { lang } = await params
  return genPageMetadata({
    title: mortgagePages[lang].title,
    description: mortgagePages[lang].description,
    alternates: buildLanguageAlternates('/islamic-mortgage', { currentLanguage: lang }),
  })
}
export default async function Page({ params }: Props) {
  return <PageContent lang={(await params).lang} />
}
