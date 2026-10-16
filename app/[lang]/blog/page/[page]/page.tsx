import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
import ListLayout from '@/layouts/ListLayout'
import { getBlogCopy } from '@/data/locales/blog'
import type { Locale } from '@/utils/locale'
import { notFound } from 'next/navigation'
type Props = { params: Promise<{ lang: Locale; page: string }> }
export async function generateMetadata({ params }: Props) {
  const { lang, page } = await params
  const c = getBlogCopy(lang)
  return genPageMetadata({
    title: `${c.blog} — ${c.page} ${page}`,
    description: c.description,
    alternates: buildLanguageAlternates(Number(page) === 1 ? '/blog' : `/blog/page/${page}`, {
      currentLanguage: lang,
    }),
  })
}
export default async function Page({ params }: Props) {
  const { lang, page } = await params
  const n = Number(page)
  const posts = allCoreContent(sortPosts(allBlogs.filter((p) => !p.draft && p.lang === lang)))
  if (!Number.isInteger(n) || n < 1 || n > Math.ceil(posts.length / 5)) notFound()
  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={posts.slice((n - 1) * 5, n * 5)}
      pagination={{ currentPage: n, totalPages: Math.ceil(posts.length / 5) }}
      title={getBlogCopy(lang).all}
    />
  )
}
