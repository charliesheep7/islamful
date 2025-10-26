import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { getSeoBotPosts, mergePosts } from '@/utils/seobot'
import type { Metadata } from 'next'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  const filteredBlogs = allBlogs.filter((post) => post.lang === 'en' || !post.lang)
  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))

  return paths
}

export async function generateMetadata(props: {
  params: Promise<{ page: string }>
}): Promise<Metadata> {
  const params = await props.params
  const rawPage = Number(params.page)
  const pageNumber = Number.isFinite(rawPage) && rawPage > 1 ? rawPage : 1
  const path = pageNumber <= 1 ? '/blog' : `/blog/page/${pageNumber}`

  return genPageMetadata({
    title: pageNumber <= 1 ? 'Blog' : `Blog - Page ${pageNumber}`,
    alternates: buildLanguageAlternates(path, { includeArabic: false }),
  })
}

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  // Filter posts by language (default to English)
  const filteredBlogs = allBlogs.filter((post) => post.lang === 'en' || !post.lang)
  const contentLayerPosts = allCoreContent(sortPosts(filteredBlogs))

  // Fetch SEObot posts and merge with ContentLayer posts
  const seoBotPosts = await getSeoBotPosts()
  const posts = mergePosts(contentLayerPosts, seoBotPosts)

  const pageNumber = parseInt(params.page as string)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}
