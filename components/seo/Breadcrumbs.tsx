'use client'
import { useLocale } from '@/components/hooks/useLocale'
import { localeFromPath, localizedPath, type Locale } from '@/utils/locale'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import JsonLd from './JsonLd'

interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  lang?: Locale
}

export default function Breadcrumbs({ items, lang }: BreadcrumbsProps) {
  const { currentLang } = useLocale()
  const locale = lang || currentLang
  const labels = {
    en: ['Home', 'Breadcrumb'],
    ar: ['الرئيسية', 'مسار التنقل'],
    fr: ['Accueil', 'Fil d’Ariane'],
    de: ['Startseite', 'Brotkrümelnavigation'],
  }[locale]
  const allItems = [
    { name: labels[0], href: localizedPath('/', locale) },
    ...items.map((item) => ({ ...item, href: localizedPath(item.href, locale) })),
  ]

  const schemaData = {
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteMetadata.siteUrl}${item.href}`,
    })),
  }

  return (
    <>
      <JsonLd data={schemaData} />
      <nav aria-label={labels[1]} className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          {allItems.map((item, index) => (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {index === allItems.length - 1 ? (
                <span aria-current="page" className="font-medium text-gray-900 dark:text-white">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-[var(--color-accent-600)] dark:hover:text-[var(--color-accent-400)]"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
