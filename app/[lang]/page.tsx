import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from '../Main'
import { getDictionary } from './dictionaries'

export function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'zh' }]
}

export default async function LangHome({ params }: { params: Promise<{ lang: 'es' | 'zh' }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)
  return <Main posts={posts} dict={dict} />
}

export const metadata = {
  alternates: {
    languages: {
      en: '/',
      es: '/es',
      'zh-Hans': '/zh',
    },
  },
}
