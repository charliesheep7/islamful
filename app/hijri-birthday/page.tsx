import { Metadata } from 'next'
import HijriBirthdayCalculator from '@/components/tools/HijriBirthdayCalculator'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export const metadata: Metadata = {
  title: 'Hijri Birthday Calculator — Find Your Islamic Birthday',
  description:
    'Convert your Gregorian birthday to Hijri, find out your Islamic age in lunar years, and see when your next Hijri birthday falls.',
  alternates: buildLanguageAlternates('/hijri-birthday'),
}

export default function HijriBirthdayPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Hijri Birthday Calculator', href: '/hijri-birthday' }]} />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'Islamful Hijri Birthday Calculator',
          description:
            'Convert your Gregorian birthday to Hijri and find your Islamic age and next Hijri birthday.',
          url: 'https://www.islamful.com/hijri-birthday',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />

      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          Hijri Birthday Calculator
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Discover your Islamic birthday, your age in Hijri years, and when your next Hijri birthday
          falls on the Gregorian calendar.
        </p>
      </div>

      <HijriBirthdayCalculator lang="en" />
    </div>
  )
}
