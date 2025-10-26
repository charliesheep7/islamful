import 'css/prism.css'
import 'katex/dist/katex.css'

import PageTitle from '@/components/PageTitle'
import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs, allAuthors } from 'contentlayer/generated'
import type { Authors, Blog } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import { getSeoBotPostBySlug, getSeoBotPosts, mergePosts } from '@/utils/seobot'

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}
const DEFAULT_AUTHOR_SLUG = siteMetadata.authorSlug || 'mathias-yussif'

const resolveAuthorDetails = (authorSlugs?: string[]) => {
  const slugs = authorSlugs && authorSlugs.length > 0 ? authorSlugs : [DEFAULT_AUTHOR_SLUG]

  const resolvedAuthors = slugs
    .map((author) => allAuthors.find((p) => p.slug === author))
    .filter((author): author is Authors => Boolean(author))
    .map((author) => coreContent(author))

  if (resolvedAuthors.length > 0) {
    return resolvedAuthors
  }

  const fallbackAuthor = allAuthors.find((p) => p.slug === DEFAULT_AUTHOR_SLUG)
  return fallbackAuthor ? [coreContent(fallbackAuthor as Authors)] : []
}

const buildJsonLdAuthors = (authorDetails: ReturnType<typeof resolveAuthorDetails>) => {
  return authorDetails.map((author) => {
    const sameAs = [
      author.linkedin,
      author.twitter,
      author.github,
      author.bluesky,
      ...(author.seoProfiles || []),
    ].filter(Boolean)

    return {
      '@type': 'Person',
      name: author.name,
      jobTitle: author.occupation || undefined,
      worksFor: author.company
        ? {
            '@type': 'Organization',
            name: author.company,
          }
        : undefined,
      image: author.avatar ? `${siteMetadata.siteUrl}${author.avatar}` : undefined,
      sameAs: sameAs.length > 0 ? Array.from(new Set(sameAs)) : undefined,
    }
  })
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))

  // First, try to find the post in ContentLayer
  let post = allBlogs.find((p) => p.slug === slug && (p.lang === 'en' || !p.lang))

  // If not found in ContentLayer, try SEObot
  if (!post) {
    const seoBotPost = await getSeoBotPostBySlug(slug)
    if (!seoBotPost) {
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    post = seoBotPost as any
  }

  // At this point, post is guaranteed to be defined
  if (!post) return

  const authorDetails = resolveAuthorDetails(post.authors)

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img && img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })
  // Add the keywords if available (SEObot posts have metaKeywords)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const keywords = (post as any).metaKeywords

  // Check if this post has an Arabic version
  const hasArabicVersion = allBlogs.some((p) => p.slug === post.slug && p.lang === 'ar')

  return {
    title: post.title,
    description: post.summary,
    keywords: keywords || undefined,
    alternates: hasArabicVersion
      ? {
          languages: {
            'x-default': `/blog/${post.slug}`,
            en: `/blog/${post.slug}`,
            ar: `/ar/blog/${post.slug}`,
          },
        }
      : undefined,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}

export const generateStaticParams = async () => {
  // Generate params for English posts only
  const englishBlogs = allBlogs.filter((p) => p.lang === 'en' || !p.lang)
  return englishBlogs.map((p) => ({ slug: p.slug.split('/').map((name) => decodeURI(name)) }))
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))

  // Try to find post in ContentLayer first
  const filteredBlogs = allBlogs.filter((post) => post.lang === 'en' || !post.lang)
  const post = allBlogs.find((p) => p.slug === slug && (p.lang === 'en' || !p.lang)) as
    | Blog
    | undefined

  // If not found in ContentLayer, try SEObot
  const seoBotPost = !post ? await getSeoBotPostBySlug(slug) : null

  if (!post && !seoBotPost) {
    return notFound()
  }

  // Merge ContentLayer posts with SEObot posts for prev/next
  const seoBotPosts = await getSeoBotPosts()
  const contentLayerPosts = allCoreContent(sortPosts(filteredBlogs))
  const allPosts = mergePosts(contentLayerPosts, seoBotPosts)

  const postIndex = allPosts.findIndex((p) => p.slug === slug)
  const prev = postIndex !== -1 ? allPosts[postIndex + 1] : null
  const next = postIndex !== -1 ? allPosts[postIndex - 1] : null

  // Use the post from the appropriate source
  const currentPost = post || seoBotPost
  const isSeoBotPost = !post && seoBotPost

  // TypeScript guard - currentPost is guaranteed to exist at this point
  if (!currentPost) return notFound()

  const authorDetails = resolveAuthorDetails(currentPost.authors)

  const mainContent = post
    ? coreContent(post)
    : {
        ...seoBotPost,
        body: seoBotPost?.body.raw,
      }

  const jsonLd = currentPost.structuredData || {}
  jsonLd['author'] = buildJsonLdAuthors(authorDetails)

  const Layout = layouts[currentPost.layout || defaultLayout]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        {isSeoBotPost && seoBotPost ? (
          <>
            {seoBotPost.images && seoBotPost.images[0] && (
              <div className="mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={seoBotPost.images[0]}
                  alt={seoBotPost.title}
                  className="h-auto w-full rounded-lg"
                />
              </div>
            )}
            <div
              className="prose dark:prose-dark max-w-none"
              dangerouslySetInnerHTML={{ __html: seoBotPost.body.raw }}
            />
          </>
        ) : post ? (
          <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
        ) : null}
      </Layout>
    </>
  )
}
