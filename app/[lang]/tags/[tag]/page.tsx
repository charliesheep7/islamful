import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import ListLayout from '@/layouts/ListLayout'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 5

export async function generateMetadata(props: {
  params: Promise<{ tag: string; lang: 'ar' }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    title: tag,
    description: `${tag} tags - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    alternates: buildLanguageAlternates(`/tags/${tag}`, { currentLanguage: 'ar' }),
  })
}

export const generateStaticParams = async () => {
  const tagCounts = {} as Record<string, number>

  // Get tags from Arabic posts only
  const arabicBlogs = allBlogs.filter((post) => post.lang === 'ar')
  arabicBlogs.forEach((post) => {
    if (post.tags && post.draft !== true) {
      post.tags.forEach((tag) => {
        const formattedTag = slug(tag)
        tagCounts[formattedTag] = (tagCounts[formattedTag] || 0) + 1
      })
    }
  })

  return Object.keys(tagCounts).map((tag) => ({ tag, lang: 'ar' as const }))
}

export default async function LocaleTagPage(props: {
  params: Promise<{ tag: string; lang: 'ar' }>
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

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={tag}
    />
  )
}
