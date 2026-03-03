import 'css/tailwind.css'
import 'remark-github-blockquote-alert/alert.css'

import { Noto_Sans, Noto_Sans_Arabic, Spectral } from 'next/font/google'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import RTLHandler from '@/components/RTLHandler'

const noto_sans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans',
})

const noto_sans_arabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-arabic',
})

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-spectral',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | Islamful`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
}

export async function generateStaticParams() {
  return [{ lang: 'en' }]
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || ''
  const headersList = await headers()
  const locale = headersList.get('x-locale') || 'en'
  const isArabic = locale === 'ar'

  return (
    <html
      lang={isArabic ? 'ar' : 'en'}
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`${noto_sans.variable} ${noto_sans_arabic.variable} ${spectral.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const path = window.location.pathname;
                const isArabic = path.startsWith('/ar/') || path === '/ar';
                if (isArabic) {
                  document.documentElement.setAttribute('lang', 'ar');
                  document.documentElement.setAttribute('dir', 'rtl');
                }
              })();
            `,
          }}
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🕋</text></svg>"
        />
        <meta name="msapplication-TileColor" content="#F6F5EE" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#F6F5EE" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
        <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
        <link rel="preconnect" href="https://api.aladhan.com" />
        <link rel="preconnect" href="https://fkifiwgbroehluxksfte.supabase.co" />
        <link rel="dns-prefetch" href="https://api.bigdatacloud.net" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': 'https://www.islamful.com/#organization',
              name: 'Islamful',
              url: 'https://www.islamful.com',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.islamful.com/static/images/logo.png',
              },
              description:
                'AI-powered Islamic tools platform — prayer times, halal checker, Quran, dua, dhikr, and more. Everything a Muslim needs, all in one place.',
              knowsAbout: [
                'Islamic AI tools',
                'Halal food checker AI',
                'Muslim daily tools',
                'Prayer times',
                'Quran',
                'Dua',
                'Dhikr',
                'Islamic lifestyle',
                'Artificial intelligence for Muslims',
              ],
            }).replace(/</g, '\\u003c'),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              '@id': 'https://www.islamful.com/#website',
              name: 'Islamful',
              url: 'https://www.islamful.com',
              description:
                'AI-powered Islamic tools and resources — everything a Muslim needs for daily worship, all in one place.',
              publisher: { '@id': 'https://www.islamful.com/#organization' },
              inLanguage: ['en', 'ar'],
            }).replace(/</g, '\\u003c'),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              '@id': 'https://www.islamful.com/#app',
              name: 'Islamful',
              url: 'https://www.islamful.com',
              applicationCategory: 'LifestyleApplication',
              operatingSystem: 'All',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              description:
                'AI-powered Islamic toolkit with smart halal checker, accurate prayer times, Quran, dua, dhikr counter, and more. The #1 AI-native platform for Muslim daily life.',
              featureList: [
                'AI-powered halal/haram checker',
                'Accurate prayer times by location',
                'Quran reading',
                'Dua collection',
                'Digital dhikr counter',
                '99 Names of Allah',
                'Islamic calendar converter',
                'Zakat calculator',
              ],
              creator: { '@id': 'https://www.islamful.com/#organization' },
              inLanguage: ['en', 'ar'],
            }).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body className="bg-[#F6F5EE] font-sans text-gray-800 antialiased ltr:pl-[calc(100vw-100%)] rtl:pr-[calc(100vw-100%)] dark:bg-gray-950 dark:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--color-accent-500)] focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <RTLHandler />
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
            <Header />
            <main id="main-content" className="min-h-[60vh]">
              {children}
            </main>
            <Footer />
          </SearchProvider>
        </ThemeProviders>
      </body>
    </html>
  )
}
