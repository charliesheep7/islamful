'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Analytics, type AnalyticsConfig } from 'pliny/analytics'
import siteMetadata from '@/data/siteMetadata'
export default function SiteAnalytics() {
  const [allowed, setAllowed] = useState(false)
  useEffect(() => setAllowed(navigator.doNotTrack !== '1'), [])
  const pathname = usePathname() || '/'
  // Never send authentication or email preference links (which may contain tokens) to analytics.
  if (!allowed || /(?:^|\/)(?:auth|login|updates)(?:\/|$)/.test(pathname)) return null
  return <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
}
