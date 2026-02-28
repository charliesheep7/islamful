import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import Breadcrumbs from '@/components/seo/Breadcrumbs'

import FAQ from '@/components/FAQ'
import Share from '@/components/Share'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags, faqs, summary, lang } = content
  const basePath = path.split('/')[0]
  const isArabic = lang === 'ar'

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <Breadcrumbs
        items={[
          { name: isArabic ? 'المدونة' : 'Blog', href: isArabic ? '/ar/blog' : '/blog' },
          { name: title, href: isArabic ? `/ar/${path}` : `/${path}` },
        ]}
      />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">{isArabic ? 'نُشر في' : 'Published on'}</dt>
                  <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(
                        isArabic ? 'ar-SA' : siteMetadata.locale,
                        postDateTemplate
                      )}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0 dark:divide-gray-700">
            <dl className="pt-6 pb-10 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
              <dt className="sr-only">{isArabic ? 'المؤلفون' : 'Authors'}</dt>
              <dd>
                <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-y-8 xl:space-x-0 sm:rtl:space-x-reverse">
                  {authorDetails.map((author) => (
                    <li
                      className="flex items-center space-x-3 text-start rtl:space-x-reverse"
                      key={author.name}
                    >
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={42}
                          height={42}
                          alt={author.name}
                          className="h-12 w-12 rounded-full"
                        />
                      )}
                      <dl className="text-sm leading-5 font-medium">
                        <dt className="sr-only">{isArabic ? 'الاسم' : 'Name'}</dt>
                        <dd className="text-gray-900 dark:text-gray-100">{author.name}</dd>
                        {(author.occupation || author.company) && (
                          <>
                            <dt className="sr-only">{isArabic ? 'الدور' : 'Role'}</dt>
                            <dd className="text-gray-500 dark:text-gray-400">
                              {[author.occupation, author.company].filter(Boolean).join(' • ')}
                            </dd>
                          </>
                        )}
                      </dl>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
            <div className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
              <div className="prose dark:prose-invert max-w-none pt-10 pb-8">
                <Share title={title} slug={slug} summary={summary} />
                {children}
                {faqs && <FAQ faqs={faqs} />}
              </div>
              <div className="pt-6 pb-6 text-sm text-gray-700 dark:text-gray-300">
                <Link href={discussUrl(path)} rel="nofollow">
                  {isArabic ? 'ناقش على X' : 'Discuss on X'}
                </Link>
              </div>
              {siteMetadata.comments && (
                <div
                  className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300"
                  id="comment"
                >
                  <Comments slug={slug} />
                </div>
              )}
            </div>
            <footer>
              <div className="divide-gray-200 text-sm leading-5 font-medium xl:col-start-1 xl:row-start-2 xl:divide-y dark:divide-gray-700">
                {(next || prev) && (
                  <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                    {(() => {
                      const firstArticle = isArabic ? next : prev
                      return (
                        firstArticle &&
                        firstArticle.path && (
                          <div>
                            <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                              {isArabic ? 'المقال التالي' : 'Previous Article'}
                            </h2>
                            <div className="text-accent-600 hover:text-accent-700 dark:hover:text-accent-400">
                              <Link href={`/${firstArticle.path}`}>{firstArticle.title}</Link>
                            </div>
                          </div>
                        )
                      )
                    })()}
                    {(() => {
                      const secondArticle = isArabic ? prev : next
                      return (
                        secondArticle &&
                        secondArticle.path && (
                          <div>
                            <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                              {isArabic ? 'المقال السابق' : 'Next Article'}
                            </h2>
                            <div className="text-accent-600 hover:text-accent-700 dark:hover:text-accent-400">
                              <Link href={`/${secondArticle.path}`}>{secondArticle.title}</Link>
                            </div>
                          </div>
                        )
                      )
                    })()}
                  </div>
                )}
              </div>
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${basePath}`}
                  className="text-accent-600 hover:text-accent-700 dark:hover:text-accent-400"
                  aria-label={isArabic ? 'العودة إلى المدونة' : 'Back to the blog'}
                >
                  {isArabic ? 'العودة إلى المدونة →' : '← Back to the blog'}
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
