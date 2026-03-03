import { Metadata } from 'next'
import IslamicMortgageCalculator from '@/components/tools/IslamicMortgageCalculator'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'
import CrossToolLinks from '@/components/seo/CrossToolLinks'

export const metadata: Metadata = {
  title: 'Islamic Mortgage Calculator — Halal Financing | Islamful',
  description:
    'Compare Murabaha, Ijara, and Diminishing Musharaka against conventional mortgages. Free Islamic finance calculator with side-by-side cost comparison.',
  alternates: buildLanguageAlternates('/islamic-mortgage'),
  openGraph: {
    title: 'Islamic Mortgage Calculator — Halal Financing | Islamful',
    description:
      'Compare Murabaha, Ijara, and Diminishing Musharaka against conventional mortgages. Free halal financing calculator.',
    url: 'https://www.islamful.com/islamic-mortgage',
    siteName: 'Islamful',
    images: ['/static/images/og-image.png'],
    type: 'website',
  },
  twitter: {
    title: 'Islamic Mortgage Calculator — Halal Financing | Islamful',
    description:
      'Compare Murabaha, Ijara, and Diminishing Musharaka against conventional mortgages. Free halal financing calculator.',
    card: 'summary_large_image',
    images: ['/static/images/og-image.png'],
  },
}

export default function IslamicMortgagePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Islamic Mortgage Calculator', href: '/islamic-mortgage' }]} />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'Islamful Islamic Mortgage Calculator',
          description:
            'Compare Murabaha, Ijara, and Diminishing Musharaka against conventional mortgages. Free halal home financing calculator.',
          url: 'https://www.islamful.com/islamic-mortgage',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          inLanguage: 'en',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        }}
      />

      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          Islamic Mortgage Calculator
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Compare halal home financing options side by side. Explore Murabaha, Ijara, and
          Diminishing Musharaka to find the best Sharia-compliant path to homeownership.
        </p>
      </div>

      <IslamicMortgageCalculator lang="en" />

      <JsonLd
        data={{
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is Murabaha (cost-plus financing)?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Murabaha is an Islamic financing structure where the bank purchases the property and resells it to you at an agreed-upon markup. The total cost is fixed upfront — there is no compounding interest. You pay in equal monthly installments over the agreed term, making it one of the most straightforward Islamic mortgage options.',
              },
            },
            {
              '@type': 'Question',
              name: 'What is Diminishing Musharaka and how does it work?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Diminishing Musharaka (Musharaka Mutanaqisa) is a partnership-based Islamic financing model. You and the bank co-own the property. Each month you pay rent on the bank\u2019s share and purchase a portion of their equity. Over time your ownership increases and the rent decreases, until you own the property outright. It is widely considered the most equitable Islamic mortgage structure.',
              },
            },
            {
              '@type': 'Question',
              name: 'Is a conventional mortgage haram in Islam?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, the majority of Islamic scholars agree that conventional mortgages involve riba (interest), which is explicitly prohibited in the Quran (2:275-279). The Prophet Muhammad (peace be upon him) also warned against riba in multiple hadith. Islamic financing alternatives like Murabaha, Ijara, and Diminishing Musharaka are structured to avoid interest while still enabling homeownership.',
              },
            },
            {
              '@type': 'Question',
              name: 'How do Islamic mortgages differ from conventional mortgages?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The key difference is that Islamic mortgages avoid charging interest (riba). Instead, they use trade-based (Murabaha), lease-based (Ijara), or partnership-based (Musharaka) structures. The bank takes on real ownership risk in the transaction, and profit is generated through legitimate trade or rental income rather than lending money at interest. This aligns with the Islamic principle that money should not generate money without underlying economic activity.',
              },
            },
          ],
        }}
      />

      {/* SEO Content Below Fold */}
      <section className="mt-16 space-y-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          A Complete Guide to Islamic Home Financing
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h3>Why Riba (Interest) Is Haram in Islam</h3>
          <p>
            Riba, commonly translated as interest or usury, is one of the most serious financial
            prohibitions in Islam. The Quran addresses it in multiple verses, with the strongest
            warning in Surah Al-Baqarah: &ldquo;Those who consume interest cannot stand except as
            one stands who is being beaten by Satan into insanity. That is because they say: Trade
            is just like interest. But Allah has permitted trade and has forbidden interest.&rdquo;
            (Quran 2:275). The Prophet Muhammad (peace be upon him) further emphasized its gravity,
            stating that riba is among the seven destructive sins and that both the one who pays and
            receives interest bear equal sin.
          </p>
          <p>
            The prohibition exists because interest-based lending creates wealth without productive
            economic activity, transfers risk unfairly to the borrower, and can trap individuals and
            communities in cycles of debt. Islamic finance, by contrast, requires that financial
            transactions be backed by real assets or services, ensuring that both parties share in
            the risks and rewards of the arrangement.
          </p>

          <h3>The Three Main Islamic Financing Models</h3>
          <p>
            Islamic scholars and financial institutions have developed several Sharia-compliant
            alternatives to conventional mortgages. Each model avoids interest while providing a
            viable path to homeownership:
          </p>
          <ul>
            <li>
              <strong>Murabaha (Cost-Plus Sale)</strong> &mdash; The bank purchases the property at
              market price and immediately resells it to you at a higher, agreed-upon price that
              includes a profit margin. You pay this fixed total in equal monthly installments.
              There is no compounding, and the total cost is known from day one. This is the
              simplest model and is widely used in Malaysia, the Gulf states, and the UK.
            </li>
            <li>
              <strong>Ijara (Lease-to-Own)</strong> &mdash; The bank buys the property and leases it
              to you. Your monthly payment consists of rent plus a contribution toward purchasing
              the property. At the end of the lease term, ownership transfers to you. This model is
              similar to a hire-purchase agreement and is particularly popular in the Middle East.
            </li>
            <li>
              <strong>Diminishing Musharaka (Partnership)</strong> &mdash; You and the bank enter a
              joint ownership arrangement. Each month, you pay rent on the bank&apos;s share of the
              property and buy a portion of their equity. As your ownership stake increases, the
              rent you pay decreases proportionally. This is widely considered the most equitable
              Islamic financing model because both parties share ownership risk, and it is the
              preferred structure in many Western Islamic finance institutions.
            </li>
          </ul>

          <h3>How to Choose Between Islamic Financing Methods</h3>
          <p>
            The best option depends on your financial goals and local availability. Murabaha offers
            simplicity and predictability &mdash; your total cost is locked in from the start, which
            makes budgeting straightforward. Ijara provides flexibility, as rental rates may be
            reviewed periodically. Diminishing Musharaka typically offers the lowest total cost over
            the long term because the rent component decreases as you build equity, but the early
            payments can be higher.
          </p>
          <p>
            When evaluating options, compare the total cost of financing (not just the monthly
            payment), understand whether profit rates are fixed or variable, check for early
            repayment penalties, and ensure the product is certified by a recognized Sharia
            supervisory board.
          </p>

          <h3>The Growth of Islamic Finance</h3>
          <p>
            The global Islamic finance industry has grown significantly, with assets exceeding $4
            trillion worldwide. Islamic mortgages are now available in over 80 countries, including
            the United States, United Kingdom, Canada, Australia, Malaysia, and across the Gulf
            Cooperation Council states. Major conventional banks including HSBC, Standard Chartered,
            and many regional institutions now offer dedicated Islamic home financing products.
          </p>
          <p>
            This growth reflects not only demand from Muslim communities but also the broader appeal
            of ethical, asset-backed financing. The principles of Islamic finance &mdash; risk
            sharing, transparency, and the prohibition of speculation &mdash; align with growing
            global interest in responsible and sustainable financial practices.
          </p>
        </div>
      </section>

      <CrossToolLinks currentTool="islamic-mortgage" />
    </div>
  )
}
