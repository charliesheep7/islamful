import { Metadata } from 'next'
import InheritanceCalculator from '@/components/tools/InheritanceCalculator'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'
import CrossToolLinks from '@/components/seo/CrossToolLinks'

export const metadata: Metadata = {
  title: 'Islamic Inheritance Calculator (Faraid) | Islamful',
  description:
    'Calculate Islamic inheritance shares based on Quran 4:11-12 and 4:176. Free Faraid calculator with Quranic references for each heir.',
  alternates: buildLanguageAlternates('/inheritance-calculator'),
  openGraph: {
    title: 'Islamic Inheritance Calculator (Faraid) | Islamful',
    description:
      'Calculate Islamic inheritance shares based on Quran 4:11-12. Free Faraid calculator with Quranic references for each heir.',
    url: 'https://www.islamful.com/inheritance-calculator',
    siteName: 'Islamful',
    images: ['/static/images/og-image.png'],
    type: 'website',
  },
  twitter: {
    title: 'Islamic Inheritance Calculator (Faraid) | Islamful',
    description:
      'Calculate Islamic inheritance shares based on Quran 4:11-12. Free Faraid calculator with Quranic references for each heir.',
    card: 'summary_large_image',
    images: ['/static/images/og-image.png'],
  },
}

export default function InheritanceCalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Inheritance Calculator', href: '/inheritance-calculator' }]} />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'Islamful Islamic Inheritance Calculator (Faraid)',
          description:
            'Calculate Islamic inheritance shares based on Quran 4:11-12 and 4:176. Free Faraid calculator with Quranic references for each heir.',
          url: 'https://www.islamful.com/inheritance-calculator',
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
          Islamic Inheritance Calculator
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Calculate inheritance shares (Faraid) according to the Quran and Sunnah. See each
          heir&apos;s exact share with Quranic references.
        </p>
      </div>

      <InheritanceCalculator lang="en" />

      <JsonLd
        data={{
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is Faraid (Islamic inheritance law)?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Faraid (also spelled Faraidh or Fara\'id) is the Islamic science of inheritance distribution. It is based on explicit verses in the Quran — primarily Surah An-Nisa (4:11-12 and 4:176) — which specify exact fractional shares for each heir. The word "Faraid" means "obligatory shares" and is considered one of the most important branches of Islamic jurisprudence (fiqh).',
              },
            },
            {
              '@type': 'Question',
              name: 'What is Awl in Islamic inheritance?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Awl occurs when the total of all prescribed fixed shares exceeds 100% of the estate. In this case, each heir's share is proportionally reduced so that all heirs receive a fair portion. For example, if the total prescribed shares add up to 9/8 (112.5%), the common denominator is increased from 8 to 9, and each heir's numerator remains the same, effectively reducing every share equally. This doctrine was established during the caliphate of Umar ibn al-Khattab (may Allah be pleased with him).",
              },
            },
            {
              '@type': 'Question',
              name: 'What is the order of distribution in Islamic inheritance?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The Islamic order of distribution from an estate is: (1) Funeral expenses and burial costs, (2) Settlement of all debts owed by the deceased, (3) Execution of bequests (wasiyyah), limited to a maximum of one-third of the estate and not permitted to an existing heir, (4) Distribution of the remaining estate among heirs according to the Quranic shares. This order is agreed upon by all four major schools of Islamic jurisprudence.',
              },
            },
            {
              '@type': 'Question',
              name: 'What is the difference between fixed-share heirs and residual heirs in Islam?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'In Islamic inheritance law, there are two categories of heirs: (1) Ashab al-Furud (fixed-share heirs) who receive specific Quran-prescribed fractions such as 1/2, 1/4, 1/8, 2/3, 1/3, or 1/6. These include the spouse, parents, daughters (when no sons), and sisters (when no children or father). (2) Asaba (residual heirs) who receive whatever remains after the fixed shares are distributed. Sons are the primary residual heirs, and when sons and daughters inherit together, the male receives twice the share of the female as stated in Quran 4:11.',
              },
            },
          ],
        }}
      />

      {/* SEO Content Below Fold */}
      <section className="mt-16 space-y-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Understanding Islamic Inheritance (Faraid)
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p>
            <strong>Faraid</strong> (Arabic: فرائض) is the Islamic science of inheritance and one of
            the most precisely defined areas of Islamic law. Unlike many other rulings that are
            derived through scholarly interpretation (ijtihad), the inheritance shares are
            explicitly stated in the Quran with exact fractions — making this one of the few areas
            where Allah Himself details the exact portions for each heir.
          </p>

          <h3>The Quranic Foundation</h3>
          <p>
            The primary verses governing Islamic inheritance are found in{' '}
            <strong>Surah An-Nisa (Chapter 4)</strong> of the Quran. Verses 11 and 12 lay out the
            shares for children, parents, and spouses, while verse 176 (known as the{' '}
            <em>Kalalah</em> verse) addresses the inheritance of siblings when the deceased has no
            children or parents. The Prophet Muhammad (peace be upon him) emphasized the importance
            of this knowledge, saying: &ldquo;Learn the laws of inheritance and teach them to
            people, for it is half of knowledge.&rdquo; (Sunan Ibn Majah)
          </p>

          <h3>Fixed Shares (Ashab al-Furud)</h3>
          <p>
            The Quran prescribes six specific fractions that form the basis of Islamic inheritance:
            one-half (1/2), one-quarter (1/4), one-eighth (1/8), two-thirds (2/3), one-third (1/3),
            and one-sixth (1/6). Each heir&apos;s share depends on their relationship to the
            deceased and the presence of other heirs. For example, a wife receives 1/8 if the
            deceased husband has children, or 1/4 if he has no children. A husband receives 1/4 if
            the deceased wife has children, or 1/2 if she has no children.
          </p>

          <h3>Residual Heirs (Asaba)</h3>
          <p>
            After the fixed shares are distributed, the remainder goes to the residual heirs (
            <em>asaba</em>). Sons are the primary residual heirs. When sons and daughters inherit
            together, the Quran states in verse 4:11: &ldquo;for the male, what is equal to the
            share of two females.&rdquo; If there are no sons, the father (when no children exist)
            or brothers may take the residual share. This 2:1 ratio reflects broader financial
            responsibilities that Islamic law places on men, including the obligation to provide for
            the family (nafaqah).
          </p>

          <h3>Debts Before Inheritance</h3>
          <p>
            A critical principle in Islamic inheritance is that{' '}
            <strong>debts must be settled first</strong>. The Quran repeatedly qualifies inheritance
            shares with the phrase &ldquo;after any bequest he may have made or debt&rdquo; (Quran
            4:11). The order of priority is: funeral expenses, debt repayment, bequests (limited to
            1/3 of the estate), and finally distribution to heirs. This ensures that the rights of
            creditors are protected before any inheritance is divided.
          </p>

          <h3>Awl and Radd</h3>
          <p>
            Two special cases arise in inheritance calculations. <strong>Awl</strong> (increase)
            occurs when the total prescribed shares exceed 100% of the estate. In this case, all
            shares are proportionally reduced. <strong>Radd</strong> (return) occurs when the total
            shares are less than 100% and there are no residual heirs — the surplus is returned
            proportionally to the fixed-share heirs (excluding the spouse according to the majority
            view). Both concepts ensure fair and complete distribution of the estate.
          </p>

          <h3>Why Use an Inheritance Calculator?</h3>
          <p>
            Islamic inheritance calculations can become complex, especially when multiple heirs are
            involved and special cases like Awl arise. This free calculator automates the fraction
            arithmetic and applies all the Quranic rules to give you an accurate breakdown. However,
            it is important to note that real-world inheritance cases may involve additional
            considerations — such as grandchildren, half-siblings, or estate planning — that require
            consultation with a qualified Islamic scholar or mufti.
          </p>
        </div>
      </section>

      <CrossToolLinks currentTool="inheritance-calculator" />
    </div>
  )
}
