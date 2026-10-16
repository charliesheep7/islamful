import Link from 'next/link'
import { Metadata } from 'next'
import NamesOfAllah from '@/components/tools/NamesOfAllah'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'fr' }, { lang: 'de' }]
}

const arabicMetadata: Metadata = {
  title: 'أسماء الله الحسنى — ٩٩ اسمًا مع المعاني',
  description: 'تعلّم واحفظ أسماء الله الحسنى التسعة والتسعين مع المعاني والنطق.',
  alternates: buildLanguageAlternates('/names-of-allah', { currentLanguage: 'ar' }),
}

const translatedCopy = {
  fr: {
    title: 'Les 99 noms d’Allah',
    description:
      'Découvrez les 99 noms d’Allah en arabe, leur translittération et leur sens. Marquez les noms appris et partagez-les avec vos proches.',
    intro: 'Apprenez, méditez et évoquez Allah.',
    home: 'Accueil',
  },
  de: {
    title: 'Die 99 Namen Allahs',
    description:
      'Entdecke die 99 Namen Allahs auf Arabisch mit Umschrift und Bedeutung. Markiere gelernte Namen und teile sie mit deinen Liebsten.',
    intro: 'Lerne, denke nach und gedenke Allahs.',
    home: 'Startseite',
  },
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (lang !== 'fr' && lang !== 'de') return arabicMetadata
  const { title, description } = translatedCopy[lang]
  return {
    title,
    description,
    alternates: {
      canonical: `https://www.islamful.com/${lang}/names-of-allah`,
      languages: Object.fromEntries(
        ['en', 'ar', 'fr', 'de'].map((l) => [
          l,
          `https://www.islamful.com${l === 'en' ? '' : `/${l}`}/names-of-allah`,
        ])
      ),
    },
  }
}
export default async function NamesOfAllahPageAr({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (lang === 'fr' || lang === 'de') {
    const t = translatedCopy[lang]
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6" lang={lang}>
        <nav className="mb-6 text-sm">
          <Link href={`/${lang}`}>{t.home}</Link> / {t.title}
        </nav>
        <JsonLd
          data={{
            '@type': 'WebApplication',
            name: `Islamful — ${t.title}`,
            description: t.description,
            url: `https://www.islamful.com/${lang}/names-of-allah`,
            applicationCategory: 'LifestyleApplication',
            operatingSystem: 'Web',
            inLanguage: lang,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }}
        />
        <header className="mb-10 text-center">
          <h1 className="mb-4 text-3xl font-bold">{t.title}</h1>
          <p className="text-lg">{t.intro}</p>
        </header>
        <NamesOfAllah lang={lang} />
      </div>
    )
  }
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" dir="rtl">
      <Breadcrumbs items={[{ name: 'أسماء الله الحسنى', href: '/ar/names-of-allah' }]} />
      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'إسلامفُل - أسماء الله الحسنى',
          description: 'تصفح أسماء الله الحسنى التسعة والتسعين مع المعاني.',
          url: 'https://www.islamful.com/ar/names-of-allah',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          inLanguage: 'ar',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <div className="mb-10 text-center">
        <h1 className="font-arabic mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          أسماء الله الحسنى
        </h1>
        <p className="font-arabic mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          الأسماء الحسنى — تعلّم وتأمّل واذكر.
        </p>
      </div>
      <NamesOfAllah lang="ar" />
    </div>
  )
}
