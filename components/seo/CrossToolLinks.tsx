import { translatedTool } from '@/data/locales/tools'
import { localizedPath, type Locale } from '@/utils/locale'
import Link from '@/components/Link'
import tools from '@/data/tools'

interface CrossToolLinksProps {
  currentTool: string
  lang?: Locale
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
        {
          {
            en: 'More Islamic Tools',
            ar: 'أدوات إسلامية أخرى',
            fr: 'Autres outils islamiques',
            de: 'Weitere islamische Tools',
          }[lang]
        }
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {otherTools.map((tool) => (
          <Link
            key={tool.slug}
            href={localizedPath(`/${tool.slug}`, lang)}
            className="rounded-xl border border-[var(--color-cream-300)] px-4 py-3 text-center transition hover:border-[var(--color-primary-400)] hover:shadow-sm dark:border-gray-800"
          >
            <p
              className={`text-sm font-semibold text-gray-900 dark:text-white ${isAr ? 'font-arabic' : ''}`}
            >
              {translatedTool(tool, lang).name}
            </p>
            <p
              className={`mt-1 line-clamp-2 text-xs text-[var(--color-cream-600)] dark:text-gray-400 ${isAr ? 'font-arabic' : ''}`}
            >
              {translatedTool(tool, lang).description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
