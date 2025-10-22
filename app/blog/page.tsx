import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayout'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({
  title: 'Blog',
  alternates: {
    languages: {
      en: '/blog',
      ar: '/ar/blog',
    },
  },
})

export default async function BlogPage(props: { searchParams: Promise<{ page: string }> }) {
  // Filter posts by language (default to English)
  const filteredBlogs = allBlogs.filter((post) => post.lang === 'en' || !post.lang)
  const posts = allCoreContent(sortPosts(filteredBlogs))
  const pageNumber = 1
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE * pageNumber)
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
