'use client'
import { usePathname } from 'next/navigation'
import { createContext, useContext } from 'react'
import { localeFromPath, localizedPath, type Locale } from '@/utils/locale'
export const PageLocaleContext = createContext<Locale>('en')
export function useLocale() {
  const path = usePathname() || '/'
  const pageLocale = useContext(PageLocaleContext)
  const currentLang =
    path.startsWith('/updates/') || path.startsWith('/auth/') ? pageLocale : localeFromPath(path)
  return {
    currentLang,
    getLocalePath: (path: string) => localizedPath(path, currentLang),
    isArabic: currentLang === 'ar',
    isEnglish: currentLang === 'en',
  }
}
