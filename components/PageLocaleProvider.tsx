'use client'
import { PageLocaleContext } from './hooks/useLocale'
import type { Locale } from '@/utils/locale'
export default function PageLocaleProvider({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  return <PageLocaleContext.Provider value={locale}>{children}</PageLocaleContext.Provider>
}
