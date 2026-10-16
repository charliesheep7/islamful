import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
import ListLayout from '@/layouts/ListLayout'
import { getBlogCopy } from '@/data/locales/blog'
import type { Locale } from '@/utils/locale'
type Props = { params: Promise<{ lang: Locale }> }
export async function generateMetadata({ params }: Props) {
  const { lang } = await params
  const c = getBlogCopy(lang)
  return genPageMetadata({
    title: c.blog,
    description: c.description,
    alternates: buildLanguageAlternates('/blog', { currentLanguage: lang }),
  })
}
export default async function Page({ params }: Props) {
  const { lang } = await params
  const posts = allCoreContent(sortPosts(allBlogs.filter((p) => !p.draft && p.lang === lang)))
  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={posts.slice(0, 5)}
      pagination={{ currentPage: 1, totalPages: Math.ceil(posts.length / 5) }}
      title={getBlogCopy(lang).all}
    />
  )
}
