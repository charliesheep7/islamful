'use client'

import Link from '@/components/Link'
import tools from '@/data/tools'
import type { Dictionary } from '@/types/dictionary'

interface ToolsGridProps {
  lang?: string
  dict?: Dictionary
}

export default function ToolsGrid({ lang = 'en', dict }: ToolsGridProps) {
  const isRTL = lang === 'ar'

  return (
    <section id="tools" className="py-20 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2
            className={`text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white ${isRTL ? 'font-arabic' : ''}`}
          >
            {dict?.tools?.heading || 'Tools for your deen.'}
          </h2>
        </div>

        {/* All tools — uniform grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon
            const name = isRTL ? tool.nameAr : tool.name

            return (
              <Link key={tool.slug} href={`/${tool.slug}`} className="group no-underline">
                <div className="relative flex h-full flex-col items-center overflow-hidden rounded-2xl bg-gray-900 px-4 py-8 text-center transition-all duration-300 hover:shadow-xl sm:px-6 sm:py-10 dark:bg-white/[0.06]">
                  <Icon
                    className="mb-4 h-7 w-7 text-white/60 transition-colors group-hover:text-white/90"
                    strokeWidth={1.5}
                  />
                  <h3
                    className={`text-sm font-medium text-white/80 transition-colors group-hover:text-white ${isRTL ? 'font-arabic' : ''}`}
                  >
                    {name}
                  </h3>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
