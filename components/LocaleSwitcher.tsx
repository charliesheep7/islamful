'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

const locales = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
] as const

export default function LocaleSwitcher() {
  const pathname = usePathname() || '/'
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Detect current language
  const currentLang = pathname.startsWith('/es') ? 'es' : pathname.startsWith('/zh') ? 'zh' : 'en'
  const currentLocale = locales.find((l) => l.code === currentLang) || locales[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get path for each locale
  const getLocalePath = (code: string) => {
    if (code === 'en') {
      return pathname.replace(/^\/(es|zh)/, '') || '/'
    }
    return `/${code}${pathname.replace(/^\/(es|zh)/, '')}`
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
        aria-label="Select language"
      >
        <span className="text-lg">{currentLocale.flag}</span>
        <span className="hidden sm:inline">{currentLocale.label}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="ring-opacity-5 absolute right-0 z-50 mt-2 w-48 rounded-md bg-white ring-1 shadow-lg ring-black dark:bg-gray-800 dark:ring-gray-700">
          <div className="py-1" role="menu">
            {locales.map((locale) => (
              <Link
                key={locale.code}
                href={getLocalePath(locale.code)}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  currentLang === locale.code
                    ? 'text-accent-700 dark:text-accent-400 bg-gray-50 dark:bg-gray-700'
                    : 'text-gray-900 dark:text-gray-100'
                }`}
                role="menuitem"
              >
                <span className="text-lg">{locale.flag}</span>
                <span>{locale.label}</span>
                {currentLang === locale.code && (
                  <svg className="ml-auto h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
