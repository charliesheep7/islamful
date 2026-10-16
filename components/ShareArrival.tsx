'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { publicContentId, shareChannels, trackShare, type ShareChannel } from '@/utils/engagement'
export default function ShareArrival() {
  const pathname = usePathname() || '/'
  const lastArrival = useRef('')
  useEffect(() => {
    const recordArrival = () => {
      const channel = new URLSearchParams(window.location.search).get('shared')
      if (!channel || !shareChannels.includes(channel as ShareChannel) || channel === 'menu') return
      const contentId = publicContentId(pathname, window.location.hash.slice(1))
      const key = `${pathname}:${channel}:${contentId || ''}`
      if (lastArrival.current === key) return
      lastArrival.current = key
      trackShare('share_arrival', channel as ShareChannel, pathname, contentId || undefined)
    }
    recordArrival()
    // A different shared card can open within the same document.
    window.addEventListener('hashchange', recordArrival)
    return () => window.removeEventListener('hashchange', recordArrival)
  }, [pathname])
  return null
}
