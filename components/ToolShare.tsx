'use client'
import { usePathname } from 'next/navigation'
import { Share2 } from 'lucide-react'
import tools from '@/data/tools'
import games from '@/data/games'
import Share from './Share'
import { engagementLocale, trackShare } from '@/utils/engagement'
import { engagementCopy } from '@/data/engagement-copy'

export default function ToolShare() {
  const pathname = usePathname() || '/'
  const path = pathname.replace(/^\/(ar|en|fr|de)(?=\/|$)/, '')
  const ar = pathname.startsWith('/ar/')
  const tool =
    tools.find((t) => path === `/${t.slug}` || path.startsWith(`/${t.slug}/`)) ||
    games.find((g) => path === `/games/${g.slug}`)
  if (!tool) return null
  return (
    <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-6">
      <details
        key={pathname}
        className="group"
        onToggle={(event) => {
          if (event.currentTarget.open) trackShare('share_open', 'menu', pathname)
        }}
      >
        <summary className="ms-auto flex min-h-11 w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-green-900/15 px-4 text-sm font-medium text-[#327952] hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-gray-600 dark:text-green-200 dark:hover:bg-gray-800 [&::-webkit-details-marker]:hidden">
          <Share2 size={17} aria-hidden="true" />
          {engagementCopy[engagementLocale(pathname)].sharePage}
        </summary>
        <Share title={ar ? tool.nameAr : tool.name} tool />
      </details>
    </div>
  )
}
