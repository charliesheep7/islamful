import Link from 'next/link'
import { Metadata } from 'next'
import QiblaFinder from '@/components/tools/QiblaFinder'
import QiblaGuide from '@/components/tools/QiblaGuide'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'
import CrossToolLinks from '@/components/seo/CrossToolLinks'

export function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'fr' }, { lang: 'de' }]
}

const arabicMetadata: Metadata = {
  title: { absolute: 'محدد القبلة — اتجاه القبلة والبوصلة | إسلامفُل' },
  description:
    'اعرف زاوية اتجاه القبلة من موقع الجهاز أو الإحداثيات التي تدخلها. نتيجة عنوان الإنترنت تقريبية، والبوصلة الحية متاحة على الأجهزة المدعومة.',
  alternates: buildLanguageAlternates('/qibla-finder', { currentLanguage: 'ar' }),
  openGraph: {
    title: 'محدد القبلة — اتجاه القبلة والبوصلة | إسلامفُل',
    description:
      'احسب زاوية اتجاه القبلة من موقعك، مع بوصلة حية على الأجهزة المدعومة. نتيجة عنوان الإنترنت تقريبية. مجاناً دون تثبيت تطبيق.',
    url: 'https://www.islamful.com/ar/qibla-finder',
    siteName: 'Islamful',
    images: ['/static/images/og-image.png'],
    type: 'website',
  },
  twitter: {
    title: 'محدد القبلة — اتجاه القبلة والبوصلة | إسلامفُل',
    description:
      'احسب زاوية اتجاه القبلة من موقعك، مع بوصلة حية على الأجهزة المدعومة. نتيجة عنوان الإنترنت تقريبية. مجاناً دون تثبيت تطبيق.',
    card: 'summary_large_image',
    images: ['/static/images/og-image.png'],
  },
}

const translatedCopy = {
  fr: {
    title: 'Direction de la Qibla',
    description:
      'Trouvez la direction de la Kaaba depuis la position de votre appareil ou vos coordonnées, avec une boussole sur les appareils compatibles.',
    home: 'Accueil',
  },
  de: {
    title: 'Qibla-Richtung',
    description:
      'Finde die Richtung zur Kaaba anhand deines Gerätestandorts oder eingegebener Koordinaten, mit Kompass auf unterstützten Geräten.',
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
      canonical: `https://www.islamful.com/${lang}/qibla-finder`,
      languages: Object.fromEntries(
        ['en', 'ar', 'fr', 'de'].map((l) => [
          l,
          `https://www.islamful.com${l === 'en' ? '' : `/${l}`}/qibla-finder`,
        ])
      ),
    },
    openGraph: { title, description, locale: lang },
  }
}
export default async function QiblaFinderPageAr({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (lang === 'fr' || lang === 'de') {
    const t = translatedCopy[lang]
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6" lang={lang}>
        <nav className="mb-6 text-sm">
          <Link href={`/${lang}`}>{t.home}</Link> / {t.title}
        </nav>
        <header className="mb-10 text-center">
          <h1 className="mb-4 text-3xl font-bold">{t.title}</h1>
          <p className="text-lg">{t.description}</p>
        </header>
        <JsonLd
          data={{
            '@type': 'WebApplication',
            name: `Islamful — ${t.title}`,
            description: t.description,
            url: `https://www.islamful.com/${lang}/qibla-finder`,
            inLanguage: lang,
            applicationCategory: 'LifestyleApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }}
        />
        <QiblaFinder lang={lang} />
        <QiblaGuide lang={lang} />
        <CrossToolLinks currentTool="qibla-finder" lang={lang} />
      </div>
    )
  }
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" dir="rtl">
      <Breadcrumbs items={[{ name: 'محدد القبلة', href: '/ar/qibla-finder' }]} />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'إسلامفُل - محدد القبلة',
          description:
            'احسب زاوية اتجاه القبلة من موقعك أو الإحداثيات التي تدخلها، مع بوصلة حية على الأجهزة المدعومة.',
          url: 'https://www.islamful.com/ar/qibla-finder',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          inLanguage: 'ar',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />

      <div className="mb-10 text-center">
        <h1 className="font-arabic mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          محدد القبلة
        </h1>
        <p className="font-arabic mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          اعرف اتجاه القبلة للصلاة من موقعك، مع زاوية الاتجاه وبوصلة حية على الأجهزة المدعومة.
        </p>
      </div>

      <QiblaFinder lang="ar" />

      <QiblaGuide lang="ar" />

      <CrossToolLinks currentTool="qibla-finder" lang="ar" />
    </div>
  )
}
