'use client'

import { usePathname } from 'next/navigation'
import Link from './Link'
import tools from '@/data/tools'
import { useLocale } from './hooks/useLocale'
import { translatedTool } from '@/data/locales/tools'
import { relatedToolSlugs } from '@/utils/related-tools'

export default function ToolsBox() {
  const { currentLang } = useLocale()
  const pathname = usePathname() || '/'
  const displayed = relatedToolSlugs(pathname)
    .map((slug) => tools.find((tool) => tool.slug === slug && tool.status === 'live'))
    .filter((tool) => tool !== undefined)
  const copy = {
    en: ['Put this into practice', 'All tools'],
    ar: ['خطوتك العملية التالية', 'جميع الأدوات'],
    fr: ['Passez à la pratique', 'Tous les outils'],
    de: ['Jetzt praktisch anwenden', 'Alle Tools'],
  }[currentLang]

  return (
    <section
      aria-label={copy[0]}
      className="not-prose my-8 rounded-2xl border border-[#327952]/20 bg-[#F6F5EE] p-6 dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{copy[0]}</h3>
        <Link
          href="/#tools"
          className="shrink-0 text-sm font-medium text-[#327952] hover:underline dark:text-emerald-400"
        >
          {copy[1]}
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {displayed.map((tool) => {
          const Icon = tool.icon
          const translated = translatedTool(tool, currentLang)
          return (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="flex items-start gap-3 rounded-xl bg-white p-3 shadow-sm transition hover:shadow-md dark:bg-gray-800"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tool.iconBg}`}
              >
                <Icon className={`h-5 w-5 ${tool.iconColor}`} />
              </span>
              <span>
                <span className="block text-sm font-medium text-gray-800 dark:text-gray-100">
                  {translated.name}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                  {translated.description}
                </span>
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
