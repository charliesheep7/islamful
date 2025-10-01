import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayout'

const POSTS_PER_PAGE = 5

export function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'zh' }]
}

export const metadata = genPageMetadata({
  title: 'Blog',
  alternates: {
    languages: {
      en: '/blog',
      es: '/es/blog',
      'zh-Hans': '/zh/blog',
    },
  },
})

export default async function LocaleBlogPage({
  params,
}: {
  params: Promise<{ lang: 'es' | 'zh' }>
}) {
  const posts = allCoreContent(sortPosts(allBlogs))
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
