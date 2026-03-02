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

        {/* Glass morphism tool cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon
            const name = isRTL ? tool.nameAr : tool.name
            const description = isRTL ? tool.descriptionAr : tool.description
            // Take first sentence of description
            const shortDesc = description.split('.')[0] + '.'

            return (
              <Link key={tool.slug} href={`/${tool.slug}`} className="group no-underline">
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/30 bg-white/50 px-4 py-6 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:px-5 sm:py-8 dark:border-white/10 dark:bg-white/[0.06]">
                  <Icon
                    className="mb-3 h-6 w-6 text-gray-400 transition-colors group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                    strokeWidth={1.5}
                  />
                  <h3
                    className={`text-sm font-medium text-gray-900 dark:text-white ${isRTL ? 'font-arabic' : ''}`}
                  >
                    {name}
                  </h3>
                  <p
                    className={`mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}
                  >
                    {shortDesc}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
