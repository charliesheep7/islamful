'use client'

import { usePathname } from 'next/navigation'

/**
 * Hook to get the current locale and create locale-aware URLs
 */
export function useLocale() {
  const pathname = usePathname() || '/'

  // Detect current language from pathname
  const currentLang = pathname.startsWith('/ar') ? 'ar' : 'en'

  /**
   * Convert a path to a locale-aware path
   * @param path - The path to convert (e.g., '/blog', '/about')
   * @returns Locale-aware path (e.g., '/ar/blog' for Arabic, '/blog' for English)
   */
  const getLocalePath = (path: string): string => {
    // Handle empty or root paths
    if (!path || path === '/') {
      return currentLang === 'ar' ? '/ar' : '/'
    }

    // Remove any existing locale prefix first
    const cleanPath = path.replace(/^\/(ar|en)/, '') || '/'

    // Add locale prefix for non-English
    if (currentLang === 'ar') {
      return `/ar${cleanPath}`
    }

    // English uses root path (no prefix)
    return cleanPath
  }

  return {
    currentLang,
    getLocalePath,
    isArabic: currentLang === 'ar',
    isEnglish: currentLang === 'en',
  }
}
