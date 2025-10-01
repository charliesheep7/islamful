'use client'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import LocaleSwitcher from './LocaleSwitcher'
import { usePathname } from 'next/navigation'

const Header = () => {
  const pathname = usePathname()
  const lang = pathname.startsWith('/es') ? 'es' : pathname.startsWith('/zh') ? 'zh' : 'en'

  // Simple translation function - we'll fetch from server for now
  const getNavText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: { home: 'Home', blog: 'Blog', about: 'About' },
      es: { home: 'Inicio', blog: 'Blog', about: 'Acerca de' },
      zh: { home: '首页', blog: '博客', about: '关于' },
    }
    return translations[lang]?.[key] || key
  }
  let headerClass =
    'flex items-center w-full bg-gray-50 dark:bg-gray-950 justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          <div className="mr-3">
            <Logo />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 text-2xl font-semibold sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="hover:text-accent-600 dark:hover:text-accent-400 m-1 font-medium text-gray-800 dark:text-gray-100"
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
