'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function RTLHandler() {
  const pathname = usePathname()

  useEffect(() => {
    // Check if current path is Arabic
    const isArabic = pathname.startsWith('/ar/') || pathname === '/ar'

    // Update HTML attributes
    if (isArabic) {
      document.documentElement.setAttribute('lang', 'ar')
      document.documentElement.setAttribute('dir', 'rtl')
    } else {
      document.documentElement.setAttribute('lang', 'en')
      document.documentElement.setAttribute('dir', 'ltr')
    }
  }, [pathname])

  return null
}
