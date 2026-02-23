import { BlogClient } from 'seobot'
import siteMetadata from '@/data/siteMetadata'

// Initialize the SEObot client only if API key is provided
const client = process.env.SEOBOT_API_KEY ? new BlogClient(process.env.SEOBOT_API_KEY) : null

// Type definition for normalized blog post
export interface SeoBotPost {
  title: string
  date: string
  slug: string
  summary: string
  body: {
    raw: string
    code: string
  }
  tags: string[]
  lang: string
  draft: boolean
  lastmod?: string
  images?: string[]
  authors?: string[]
  layout?: string
  path: string
  filePath: string
  readingTime?: { text: string; minutes: number; time: number; words: number }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toc?: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  structuredData?: any
  metaKeywords?: string
  _raw: {
    flattenedPath: string
    sourceFilePath: string
  }
  // Add a flag to identify SEObot posts
  isSeoBotPost: boolean
}

/**
 * Fetch all posts from SEObot API
 */
export async function getSeoBotPosts(): Promise<SeoBotPost[]> {
  // SEObot disabled — add a SEOBOT_API_KEY for deenback.com when ready
  return []
  try {
    if (!client) return []
    // Fetch the first 100 posts (adjust if you need more)
    const { articles } = await client.getArticles(0, 100)

    // Normalize SEObot posts to match ContentLayer structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return articles.map((post: any) => normalizeSeoBotPost(post))
  } catch (error) {
    console.error('Error fetching SEObot posts:', error)
    return []
  }
}

/**
 * Fetch a single post from SEObot by slug
 */
export async function getSeoBotPostBySlug(slug: string): Promise<SeoBotPost | null> {
  try {
    if (!client) return null
    const post = await client.getArticle(slug)

    if (!post) {
      return null
    }

    return normalizeSeoBotPost(post)
  } catch (error) {
    console.error(`Error fetching SEObot post with slug ${slug}:`, error)
    return null
  }
}

/**
 * Normalize a SEObot post to match ContentLayer Blog structure
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeSeoBotPost(post: any): SeoBotPost {
  const slug = post.slug || post.id
  const path = `blog/${slug}`
  const defaultAuthorSlug = siteMetadata.authorSlug || 'mathias-yussif'

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = post.html?.split(/\s+/).length || 0
  const minutes = Math.ceil(wordCount / 200)

  return {
    title: post.headline || post.title || 'Untitled',
    date: post.publishedAt || post.createdAt || new Date().toISOString(),
    slug: slug,
    summary: post.metaDescription || post.description || '',
    body: {
      raw: post.html || post.content || '',
      code: '', // SEObot posts won't have MDX code
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tags: post.tags?.map((tag: any) => tag.title || tag) || [],
    lang: 'en', // SEObot posts are English only for now
    draft: false, // Always include SEObot posts in sitemap
    lastmod: post.updatedAt || post.modifiedAt,
    images: post.image ? [post.image] : [],
    authors: [defaultAuthorSlug], // Use Mathias as the default author for SEObot posts
    layout: 'PostLayout', // Use default layout
    path: path,
    filePath: `seobot/${slug}`,
    readingTime: {
      text: `${minutes} min read`,
      minutes: minutes,
      time: minutes * 60 * 1000,
      words: wordCount,
    },
    toc: [], // Table of contents can be extracted if needed
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.headline || post.title || 'Untitled',
      datePublished: post.publishedAt || post.createdAt || new Date().toISOString(),
      dateModified:
        post.updatedAt || post.publishedAt || post.createdAt || new Date().toISOString(),
      description: post.metaDescription || post.description || '',
      image: post.image,
    },
    metaKeywords: post.metaKeywords,
    _raw: {
      flattenedPath: path,
      sourceFilePath: `seobot/${slug}.md`,
    },
    isSeoBotPost: true,
  }
}

/**
 * Merge ContentLayer posts with SEObot posts
 * Sort by date (newest first)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mergePosts(contentLayerPosts: any[], seoBotPosts: SeoBotPost[]): any[] {
  const allPosts = [...contentLayerPosts, ...seoBotPosts]

  // Sort by date, newest first
  return allPosts.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB.getTime() - dateA.getTime()
  })
}
