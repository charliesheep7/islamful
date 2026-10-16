import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import InheritancePage from '@/components/tools/InheritancePageTranslated'
import { inheritancePages } from '@/data/locales/inheritance-page'
import { buildLanguageAlternates } from 'app/seo'
export function generateStaticParams() {
  return ['ar', 'fr', 'de'].map((lang) => ({ lang }))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  const c = inheritancePages[lang]
  return {
    title: c.title,
    description: c.description,
    alternates: buildLanguageAlternates('/inheritance-calculator', { currentLanguage: lang }),
  }
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  return <InheritancePage lang={lang} />
}
