'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Fragment } from 'react'
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@headlessui/react'

const locales = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
] as const

export default function LocaleSwitcher() {
  const pathname = usePathname() || '/'

  // Detect current language
  const currentLang = pathname.startsWith('/ar') ? 'ar' : 'en'
  const currentLocale = locales.find((l) => l.code === currentLang) || locales[0]

  // Get path for each locale
  const getLocalePath = (code: string) => {
    if (code === 'en') {
      return pathname.replace(/^\/ar/, '') || '/'
    }
    return `/${code}${pathname.replace(/^\/ar/, '')}`
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div className="flex items-center justify-center">
        <MenuButton
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
          aria-label="Select language"
        >
          <span className="text-lg">{currentLocale.flag}</span>
          <span className="hidden sm:inline">{currentLocale.label}</span>
          <svg
            className="h-4 w-4 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </MenuButton>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="ring-opacity-5 absolute right-0 z-50 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-lg border-2 border-gray-200 bg-white shadow-2xl ring-1 ring-black focus:outline-hidden dark:border-gray-700 dark:bg-gray-800">
          <div className="py-1">
            {locales.map((locale) => (
              <MenuItem key={locale.code}>
                {({ focus }) => (
                  <Link
                    href={getLocalePath(locale.code)}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      focus ? 'bg-gray-100 dark:bg-gray-700' : ''
                    } ${
                      currentLang === locale.code
                        ? 'bg-gray-50 font-medium text-[--color-accent-700] dark:bg-gray-700 dark:text-[--color-accent-400]'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}
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
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  )
}
