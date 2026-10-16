import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import HijriBirthdayCalculator from '@/components/tools/HijriBirthdayCalculator'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { birthdayCopy } from '@/data/locales/birthday'
import { isLocale } from '@/utils/locale'
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
  if (!isLocale(lang)) return {}
  const t = birthdayCopy[lang]
  return {
    title: t.title,
    description: t.description,
    alternates: buildLanguageAlternates('/hijri-birthday', { currentLanguage: lang }),
  }
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = birthdayCopy[lang]
  return (
    <div
      className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <Breadcrumbs items={[{ name: t.title, href: `/${lang}/hijri-birthday` }]} />
      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: t.title,
          description: t.description,
          url: `https://www.islamful.com/${lang}/hijri-birthday`,
          inLanguage: lang,
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <header className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{t.title}</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          {t.description}
        </p>
      </header>
      <HijriBirthdayCalculator lang={lang} />
    </div>
  )
}
