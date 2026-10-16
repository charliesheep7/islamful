import { getBlogCopy } from '@/data/locales/blog'
import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import ListLayout from '@/layouts/ListLayout'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 5

export async function generateMetadata(props: {
  params: Promise<{ tag: string; lang: 'ar' | 'fr' | 'de' }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    title: tag,
    description: `${getBlogCopy(params.lang).tag} ${tag} — Islamful`,
    alternates: buildLanguageAlternates(`/tags/${tag}`, { currentLanguage: params.lang }),
  })
}

export default async function LocaleTagPage(props: {
  params: Promise<{ tag: string; lang: 'ar' | 'fr' | 'de' }>
}) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const { lang } = params

  // Filter Arabic posts by tag
  const arabicBlogs = allBlogs.filter((post) => post.lang === lang)
  const filteredPosts = arabicBlogs.filter(
    (post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)
  )

  if (filteredPosts.length === 0) {
    return notFound()
  }

  const posts = allCoreContent(sortPosts(filteredPosts))
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return <ListLayout posts={posts} initialDisplayPosts={posts} title={tag} />
}
