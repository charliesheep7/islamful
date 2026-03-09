import { Metadata } from 'next'
import QuranAnswers from '@/components/tools/QuranAnswers'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'
import CrossToolLinks from '@/components/seo/CrossToolLinks'

export const metadata: Metadata = {
  title: 'إجابات القرآن — اسأل سؤالاً واحصل على آية',
  description:
    'اسأل أي سؤال واحصل على آية جميلة من القرآن الكريم كإجابة. شارك بطاقة إجابتك مع الأهل والأصدقاء.',
  alternates: buildLanguageAlternates('/answers', { currentLanguage: 'ar' }),
}

export default function QuranAnswersPageAr() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'إجابات القرآن', href: '/ar/answers' }]} />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'إجابات القرآن',
          description:
            'اسأل أي سؤال واحصل على آية جميلة من القرآن الكريم كإجابة. شارك بطاقة إجابتك مع الأهل والأصدقاء.',
          url: 'https://www.islamful.com/ar/answers',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          inLanguage: 'ar',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        }}
      />

      <div className="mb-10 text-center">
        <h1 className="font-arabic mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          إجابات القرآن
        </h1>
        <p className="font-arabic mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          اسأل ما في قلبك. القرآن سيتحدث.
        </p>
      </div>

      <QuranAnswers lang="ar" standalone />

      <CrossToolLinks currentTool="answers" lang="ar" />
    </div>
  )
}
