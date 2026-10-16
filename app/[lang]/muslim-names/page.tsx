import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import MuslimBabyNames from '@/components/tools/MuslimBabyNames'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { babyNamesPages } from '@/data/locales/baby-names'
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
  const copy = babyNamesPages[lang]
  return {
    title: copy.title,
    description: copy.description,
    alternates: buildLanguageAlternates('/muslim-names', { currentLanguage: lang }),
  }
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  const copy = babyNamesPages[lang]
  return (
    <div
      className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <Breadcrumbs items={[{ name: copy.title, href: `/${lang}/muslim-names` }]} />
      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: copy.title,
          description: copy.description,
          url: `https://www.islamful.com/${lang}/muslim-names`,
          inLanguage: lang,
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <header className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{copy.title}</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          {copy.description}
        </p>
      </header>
      <MuslimBabyNames lang={lang} />
      <p className="mt-8 text-sm text-gray-500">{copy.note}</p>
    </div>
  )
}
