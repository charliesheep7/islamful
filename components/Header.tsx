'use client'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import LocaleSwitcher from './LocaleSwitcher'
import { usePathname } from 'next/navigation'

const Header = () => {
  const pathname = usePathname()
  const lang = pathname.startsWith('/ar') ? 'ar' : 'en'

  // Simple translation function
  const getNavText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: { home: 'Home', blog: 'Blog' },
      ar: { home: 'الرئيسية', blog: 'المدونة' },
    }
    return translations[lang]?.[key] || key
  }
  let headerClass =
    'flex items-center w-full bg-[--color-bg] dark:bg-gray-950 justify-between py-6 backdrop-blur-sm transition-all duration-300 relative z-50'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 border-b border-gray-200/50 dark:border-gray-800/50'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="font-serif text-3xl font-normal text-[--color-accent-600] transition-colors duration-200 hover:text-[--color-accent-700] dark:text-[--color-accent-400] dark:hover:text-[--color-accent-300]">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-3 leading-5 sm:space-x-5">
        <div className="no-scrollbar hidden items-center gap-x-1 sm:flex">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="rounded-lg px-4 py-2 font-medium text-[--color-text] transition-all duration-200 hover:bg-[--color-surface] hover:text-[--color-accent-600] dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-[--color-accent-400]"
              >
                {getNavText(link.title.toLowerCase())}
              </Link>
            ))}
        </div>
        <LocaleSwitcher />
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
