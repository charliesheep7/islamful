import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
import ListLayout from '@/layouts/ListLayout'
import { getSeoBotPosts, mergePosts } from '@/utils/seobot'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({
  title: 'Blog',
  description:
    'Guides, reflections, and product updates from the DeenUp team to support your daily ibadah.',
  alternates: buildLanguageAlternates('/blog'),
})

export default async function BlogPage(props: { searchParams: Promise<{ page: string }> }) {
  // Filter posts by language (default to English)
  const filteredBlogs = allBlogs.filter((post) => post.lang === 'en' || !post.lang)
  const contentLayerPosts = allCoreContent(sortPosts(filteredBlogs))

  // Fetch SEObot posts and merge with ContentLayer posts
  const seoBotPosts = await getSeoBotPosts()
  const posts = mergePosts(contentLayerPosts, seoBotPosts)

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
