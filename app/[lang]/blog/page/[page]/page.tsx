import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import { blogArchiveAlternates } from '@/utils/blog-archive-alternates'
import ListLayout from '@/layouts/ListLayout'
import { getBlogCopy } from '@/data/locales/blog'
import type { Locale } from '@/utils/locale'
import { notFound } from 'next/navigation'

// One page per five of this language's published posts, as the page counts them.
export const dynamicParams = false
export function generateStaticParams({ params }: { params: { lang: string } }) {
  const count = allBlogs.filter((p) => !p.draft && p.lang === params.lang).length
  return Array.from({ length: Math.max(1, Math.ceil(count / 5)) }, (_, i) => ({
    page: String(i + 1),
  }))
}
type Props = { params: Promise<{ lang: Locale; page: string }> }
export async function generateMetadata({ params }: Props) {
  const { lang, page } = await params
  const c = getBlogCopy(lang)
  return genPageMetadata({
    title: `${c.blog} — ${c.page} ${page}`,
    description: c.description,
    alternates: blogArchiveAlternates(Number(page), lang),
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
