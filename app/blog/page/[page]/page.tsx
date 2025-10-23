import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { getSeoBotPosts, mergePosts } from '@/utils/seobot'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  const filteredBlogs = allBlogs.filter((post) => post.lang === 'en' || !post.lang)
  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))

  return paths
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
