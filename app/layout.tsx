import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import { Noto_Sans, Noto_Sans_Arabic, DM_Serif_Text } from 'next/font/google'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import { Metadata } from 'next'
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

const dm_serif = DM_Serif_Text({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-serif',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
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
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
}

export async function generateStaticParams() {
  return [{ lang: 'en' }]
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || ''

  return (
    <html
      lang="en"
      dir="ltr"
      className={`${noto_sans.variable} ${noto_sans_arabic.variable} ${dm_serif.variable} scroll-smooth`}
      suppressHydrationWarning
    >
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
        rel="apple-touch-icon"
        sizes="76x76"
        href={`${basePath}/static/favicons/apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${basePath}/static/favicons/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/static/favicons/favicon-16x16.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href={`${basePath}/static/favicons/android-chrome-192x192.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="512x512"
        href={`${basePath}/static/favicons/android-chrome-512x512.png`}
      />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <link
        rel="mask-icon"
        href={`${basePath}/static/favicons/safari-pinned-tab.svg`}
        color="#D97757"
      />
      <meta name="msapplication-TileColor" content="#D97757" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#FAF9F5" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'DeenUp',
            url: 'https://www.deenup.app',
            logo: 'https://www.deenup.app/static/favicons/android-chrome-512x512.png',
          }),
        }}
      />
      <body className="bg-gray-50 font-sans text-gray-800 antialiased ltr:pl-[calc(100vw-100%)] rtl:pr-[calc(100vw-100%)] dark:bg-gray-950 dark:text-white">
        <RTLHandler />
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
            <Header />
            <main className="mb-auto">{children}</main>
          </SearchProvider>
        </ThemeProviders>
      </body>
    </html>
  )
}
