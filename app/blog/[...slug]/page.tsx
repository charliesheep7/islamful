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
import { buildLanguageAlternates } from 'app/seo'
import { notFound } from 'next/navigation'

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

  const post = allBlogs.find((p) => p.slug === slug && (p.lang === 'en' || !p.lang))
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

  // Check if this post has an Arabic version
  const hasArabicVersion = allBlogs.some((p) => p.slug === post.slug && p.lang === 'ar')

  return {
    title: post.title,
    description: post.summary,
    alternates: hasArabicVersion
      ? buildLanguageAlternates(`/blog/${post.slug}`)
      : {
          canonical: `${siteMetadata.siteUrl}/blog/${post.slug}`,
        },
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

  const filteredBlogs = allBlogs.filter((post) => post.lang === 'en' || !post.lang)
  const post = allBlogs.find((p) => p.slug === slug && (p.lang === 'en' || !p.lang)) as
    | Blog
    | undefined

  if (!post) {
    return notFound()
  }

  const posts = allCoreContent(sortPosts(filteredBlogs))
  const postIndex = posts.findIndex((p) => p.slug === slug)
  const prev = postIndex !== -1 ? posts[postIndex + 1] : null
  const next = postIndex !== -1 ? posts[postIndex - 1] : null

  const authorDetails = resolveAuthorDetails(post.authors)
  const mainContent = coreContent(post)

  const jsonLd = post.structuredData || {}
  jsonLd['author'] = buildJsonLdAuthors(authorDetails)

  const Layout = layouts[post.layout || defaultLayout]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </>
  )
}
