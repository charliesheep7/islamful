'use client'
import { usePathname } from 'next/navigation'
import { Analytics, type AnalyticsConfig } from 'pliny/analytics'
import siteMetadata from '@/data/siteMetadata'
export default function SiteAnalytics() {
  const pathname = usePathname() || '/'
  // Never send authentication or email preference links (which may contain tokens) to analytics.
  if (/(?:^|\/)(?:auth|login|updates)(?:\/|$)/.test(pathname)) return null
  return <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
}
