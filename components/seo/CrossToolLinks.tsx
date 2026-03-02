import Link from '@/components/Link'
import tools from '@/data/tools'

interface CrossToolLinksProps {
  currentTool: string
  lang?: 'en' | 'ar'
}

export default function CrossToolLinks({ currentTool, lang = 'en' }: CrossToolLinksProps) {
  const isAr = lang === 'ar'
  const otherTools = tools.filter((t) => t.slug !== currentTool && t.status === 'live').slice(0, 4)

  if (otherTools.length === 0) return null

  return (
    <section className="mt-16 border-t border-[var(--color-cream-300)] pt-10 dark:border-gray-800">
      <h2
        className={`mb-4 text-sm font-semibold tracking-wide text-[var(--color-cream-600)] uppercase dark:text-gray-400 ${isAr ? 'font-arabic' : ''}`}
      >
        {isAr ? 'أدوات إسلامية أخرى' : 'More Islamic Tools'}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {otherTools.map((tool) => (
          <Link
            key={tool.slug}
            href={isAr ? `/ar/${tool.slug}` : `/${tool.slug}`}
            className="rounded-xl border border-[var(--color-cream-300)] px-4 py-3 text-center transition hover:border-[var(--color-primary-400)] hover:shadow-sm dark:border-gray-800"
          >
            <p
              className={`text-sm font-semibold text-gray-900 dark:text-white ${isAr ? 'font-arabic' : ''}`}
            >
              {isAr ? tool.nameAr : tool.name}
            </p>
            <p
              className={`mt-1 line-clamp-2 text-xs text-[var(--color-cream-600)] dark:text-gray-400 ${isAr ? 'font-arabic' : ''}`}
            >
              {isAr ? tool.descriptionAr : tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
