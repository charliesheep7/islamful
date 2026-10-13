import { Metadata } from 'next'
import ZakatCalculator from '@/components/tools/ZakatCalculator'
import ZakatGuide from '@/components/tools/ZakatGuide'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'

export const metadata: Metadata = {
  title: 'Zakat Calculator — Calculate Your Zakat Obligation',
  description:
    'Estimate Zakat on savings, gold, silver and eligible investments. Choose your nisab, prices and lunar-year status, with a transparent calculation and downloadable summary.',
  alternates: buildLanguageAlternates('/zakat-calculator'),
}

export default function ZakatCalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Zakat Calculator', href: '/zakat-calculator' }]} />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'Islamful Zakat Calculator',
          description: 'Calculate your annual zakat obligation based on your wealth.',
          url: 'https://www.islamful.com/zakat-calculator',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />

      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          Zakat Calculator
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Estimate your Zakat on savings, gold and other eligible wealth. Choose your nisab and see
          the full calculation.
        </p>
      </div>

      <ZakatCalculator lang="en" initialDate={new Date().toISOString().slice(0, 10)} />
      <ZakatGuide lang="en" />
    </div>
  )
}
