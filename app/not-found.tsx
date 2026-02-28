import Link from '@/components/Link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    absolute: 'Page Not Found — Islamful',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-7xl font-bold text-[var(--color-accent-500)]">404</h1>
      <p className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Page not found</p>
      <p className="mb-8 max-w-md text-gray-600 dark:text-gray-400">
        The page you&apos;re looking for doesn&apos;t exist. But there&apos;s plenty to explore on
        Islamful.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-[var(--color-accent-500)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-accent-600)]"
        >
          Back to homepage
        </Link>
        <Link
          href="/prayer-times"
          className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:border-[var(--color-accent-300)] hover:text-[var(--color-accent-600)] dark:border-gray-700 dark:text-gray-300"
        >
          Prayer Times
        </Link>
        <Link
          href="/haram-check"
          className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:border-[var(--color-accent-300)] hover:text-[var(--color-accent-600)] dark:border-gray-700 dark:text-gray-300"
        >
          Haram Checker
        </Link>
        <Link
          href="/blog"
          className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:border-[var(--color-accent-300)] hover:text-[var(--color-accent-600)] dark:border-gray-700 dark:text-gray-300"
        >
          Blog
        </Link>
      </div>
    </div>
  )
}
