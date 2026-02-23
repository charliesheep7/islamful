import Image from 'next/image'
import Link from 'next/link'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Deen Back - Your Islamic Companion',
  description: 'Best App for Muslim Self-Control',
  alternates: buildLanguageAlternates('/'),
})

export default async function Page() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 text-center">
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-[--color-primary-500] sm:text-6xl dark:text-[--color-primary-400]">
        Deen Back
      </h1>
      <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
        Best App for Muslim Self-Control
      </p>

      <Link
        href="https://apps.apple.com/tn/app/deen-back-daily-dua-dhikr/id6755876142"
        className="mb-12 inline-block transition-transform hover:scale-105"
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/static/images/apple-app-store-badge.svg"
          alt="Download on the App Store"
          height={60}
          style={{ width: 'auto', height: '60px' }}
        />
      </Link>

      <div className="relative mx-auto w-full max-w-sm px-4 sm:max-w-md">
        <Image
          src="/static/images/hero.webp"
          alt="Deen Back App Interface"
          width={400}
          height={800}
          className="mx-auto rounded-3xl shadow-2xl"
          priority
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    </div>
  )
}
