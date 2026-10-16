import { Metadata } from 'next'
import DuaCollection from '@/components/tools/DuaCollection'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export function generateStaticParams() {
  return ['ar', 'fr', 'de'].map((lang) => ({ lang }))
}

const arabicMetadata: Metadata = {
  title: 'مجموعة الأدعية — أدعية إسلامية صحيحة لكل مناسبة',
  description: 'تصفح أدعية صحيحة من القرآن والسنة للصباح والمساء والسفر والطعام والنوم وغيرها.',
  alternates: buildLanguageAlternates('/dua', { currentLanguage: 'ar' }),
}

const translated = {
  fr: {
    title: 'Collection d’invocations',
    description:
      'Parcourez les invocations de la collection avec leur texte arabe, leur translittération, leur sens en français et leurs références. Enregistrez vos favoris et partagez une invocation avec vos proches.',
  },
  de: {
    title: 'Sammlung von Bittgebeten',
    description:
      'Entdecke die Bittgebete der Sammlung mit arabischem Text, Umschrift, deutscher Bedeutung und Quellenangaben. Speichere Favoriten und teile ein Bittgebet mit deinen Liebsten.',
  },
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (lang !== 'fr' && lang !== 'de') return arabicMetadata
  return {
    ...translated[lang],
    alternates: buildLanguageAlternates('/dua', { currentLanguage: lang }),
  }
}
export default async function DuaPageAr({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (lang === 'fr' || lang === 'de') {
    const copy = translated[lang]
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" lang={lang}>
        <Breadcrumbs items={[{ name: copy.title, href: `/${lang}/dua` }]} />
        <JsonLd
          data={{
            '@type': 'WebApplication',
            name: copy.title,
            description: copy.description,
            url: `https://www.islamful.com/${lang}/dua`,
            applicationCategory: 'LifestyleApplication',
            operatingSystem: 'Web',
            inLanguage: lang,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }}
        />
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">{copy.title}</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            {copy.description}
          </p>
        </div>
        <DuaCollection lang={lang} limit={0} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" dir="rtl">
      <Breadcrumbs items={[{ name: 'مجموعة الأدعية', href: '/ar/dua' }]} />
      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'إسلامفُل - مجموعة الأدعية',
          description: 'مجموعة أدعية إسلامية صحيحة من القرآن والسنة.',
          url: 'https://www.islamful.com/ar/dua',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          inLanguage: 'ar',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <div className="mb-10 text-center">
        <h1 className="font-arabic mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          مجموعة الأدعية
        </h1>
        <p className="font-arabic mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          أدعية صحيحة من القرآن والسنة لكل لحظة في يومك.
        </p>
      </div>
      <DuaCollection lang="ar" limit={0} />
    </div>
  )
}
