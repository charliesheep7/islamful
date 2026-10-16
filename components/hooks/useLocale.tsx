'use client'
import { usePathname } from 'next/navigation'
import { localeFromPath, localizedPath } from '@/utils/locale'
export function useLocale() {
  const currentLang = localeFromPath(usePathname() || '/')
  return {
    currentLang,
    getLocalePath: (path: string) => localizedPath(path, currentLang),
    isArabic: currentLang === 'ar',
    isEnglish: currentLang === 'en',
  }
}
