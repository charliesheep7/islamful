'use client'
import { useEffect } from 'react'
import { useLocale } from './hooks/useLocale'
export default function RTLHandler() {
  const { currentLang } = useLocale()
  useEffect(() => {
    document.documentElement.lang = currentLang
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr'
  }, [currentLang])
  return null
}
