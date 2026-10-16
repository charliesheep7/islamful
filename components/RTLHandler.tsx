'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { localeFromPath } from '@/utils/locale'
export default function RTLHandler() {
  const pathname = usePathname() || '/'
  useEffect(() => {
    const locale = localeFromPath(pathname)
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [pathname])
  return null
}
