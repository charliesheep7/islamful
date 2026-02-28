'use client'

import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import tools from '@/data/tools'
import { useLocale } from './hooks/useLocale'

const translations = {
  en: {
    tagline: 'Your complete Islamic companion on the web.',
    tools: 'Tools',
    content: 'Content',
    legal: 'Legal',
    blog: 'Blog',
    about: 'About',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    rights: 'All rights reserved.',
  },
  ar: {
    tagline: 'رفيقك الإسلامي الشامل على الويب.',
    tools: 'الأدوات',
    content: 'المحتوى',
    legal: 'قانوني',
    blog: 'المدونة',
    about: 'عن إسلامفُل',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الخدمة',
    rights: 'جميع الحقوق محفوظة.',
  },
}

export default function Footer() {
  const { currentLang } = useLocale()
  const t = translations[currentLang as 'en' | 'ar'] || translations.en
  const liveTools = tools.filter((t) => t.status === 'live')
  const prefix = currentLang === 'ar' ? '/ar' : ''

  return (
    <footer className="border-t border-gray-200 bg-[--color-bg] dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {siteMetadata.headerTitle}
            </span>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t.tagline}</p>
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
                    {tool.name}
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
                  href={`${prefix}/about`}
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {t.about}
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
            &copy; {new Date().getFullYear()} {siteMetadata.headerTitle}. {t.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
