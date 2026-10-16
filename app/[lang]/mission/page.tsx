import { notFound } from 'next/navigation'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
import { missionPages } from '@/data/locales/information'
export function generateStaticParams() {
  return ['ar', 'fr', 'de'].map((lang) => ({ lang }))
}
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  const c = missionPages[lang]
  return genPageMetadata({
    title: c.title,
    description: c.description,
    alternates: buildLanguageAlternates('/mission', { currentLanguage: lang }),
  })
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  const c = missionPages[lang]
  return (
    <div
      className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <article className="prose prose-lg dark:prose-invert mx-auto">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          {c.title}
        </h1>
        <p className="mb-12 text-xl leading-relaxed text-gray-600 dark:text-gray-300">
          {c.subtitle}
        </p>
        <div className="space-y-8 text-gray-700 dark:text-gray-300 [&>p]:leading-relaxed">
          {c.opening.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {c.sections.map((s) => (
            <section key={s.title}>
              <h2 className="mt-12 text-2xl font-bold text-gray-900 dark:text-white">{s.title}</h2>
              {s.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
          <div className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-lg font-medium text-gray-900 dark:text-white">{c.cta}</p>
            <a
              href="mailto:hello@infinique.org"
              className="mt-4 inline-block font-medium text-emerald-700 dark:text-emerald-400"
            >
              {c.contact}
            </a>
          </div>
        </div>
      </article>
    </div>
  )
}
