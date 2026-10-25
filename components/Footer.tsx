'use client'

import Link from './Link'
import NextLink from 'next/link'
import { navigation } from '@/data/locales/navigation'
import EmailUpdates from './EmailUpdates'
import siteMetadata from '@/data/siteMetadata'
import { translatedTool } from '@/data/locales/tools'
import tools from '@/data/tools'
import { useLocale } from './hooks/useLocale'

export default function Footer({ year }: { year: number }) {
  const { currentLang } = useLocale()
  const t = navigation[currentLang]
  const liveTools = tools.filter((t) => t.status === 'live')
  const prefix = currentLang === 'en' ? '' : `/${currentLang}`

  return (
    <footer className="border-t border-gray-200 bg-[--color-bg] dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <EmailUpdates />
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {siteMetadata.headerTitle}
            </span>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t.tagline}</p>
            <nav aria-label={t.language} className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {[
                ['en', 'English'],
                ['ar', 'العربية'],
                ['fr', 'Français'],
                ['de', 'Deutsch'],
              ].map(([locale, label]) => (
                <NextLink
                  key={locale}
                  href={locale === 'en' ? '/' : `/${locale}`}
                  hrefLang={locale}
                  lang={locale}
                  className="hover:underline"
                >
                  {label}
                </NextLink>
              ))}
            </nav>
          </div>

          {/* Tools */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">{t.tools}</h3>
            <ul className="space-y-2">
              {liveTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`${prefix}/${tool.slug}`}
                    className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {translatedTool(tool, currentLang).name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Content */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              {t.content}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`${prefix}/blog`}
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {t.blog}
                </Link>
              </li>
              <li>
                <Link
                  href={`${prefix}/games`}
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {t.games}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">{t.legal}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`${prefix}/privacy`}
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={`${prefix}/terms`}
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {t.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
          <p className="text-center text-sm text-gray-400 dark:text-gray-500">
            &copy; {year} {siteMetadata.headerTitle}. {t.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
