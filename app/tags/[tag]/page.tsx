import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import ListLayout from '@/layouts/ListLayout'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSeoBotPosts, mergePosts } from '@/utils/seobot'

const POSTS_PER_PAGE = 5

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    title: tag,
    description: `${tag} tags - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    alternates: {
      languages: {
        en: `/tags/${tag}`,
        ar: `/ar/tags/${tag}`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const tagCounts = {} as Record<string, number>

  // Get tags from ContentLayer posts (English only)
  const englishBlogs = allBlogs.filter((post) => post.lang === 'en' || !post.lang)
  englishBlogs.forEach((post) => {
    if (post.tags && post.draft !== true) {
      post.tags.forEach((tag) => {
        const formattedTag = slug(tag)
        tagCounts[formattedTag] = (tagCounts[formattedTag] || 0) + 1
      })
    }
  })

  // Get tags from SEObot posts
  const seoBotPosts = await getSeoBotPosts()
  seoBotPosts.forEach((post) => {
    if (post.tags && !post.draft) {
      post.tags.forEach((tag) => {
        const formattedTag = slug(tag)
        tagCounts[formattedTag] = (tagCounts[formattedTag] || 0) + 1
      })
    }
  })

  return Object.keys(tagCounts).map((tag) => ({ tag }))
}

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params
  const tag = decodeURI(params.tag)

  // Filter ContentLayer posts (English only)
  const englishBlogs = allBlogs.filter((post) => post.lang === 'en' || !post.lang)
  const filteredPosts = englishBlogs.filter(
    (post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)
  )
  const contentLayerPosts = allCoreContent(sortPosts(filteredPosts))

  // Filter SEObot posts
  const seoBotPosts = await getSeoBotPosts()
  const filteredSeoBotPosts = seoBotPosts.filter(
    (post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)
  )

  // Merge both sources
  const posts = mergePosts(contentLayerPosts, filteredSeoBotPosts)

  if (posts.length === 0) {
    return notFound()
  }

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
