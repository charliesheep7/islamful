import { goldPageCopy } from '@/data/locales/gold-page'
import type { Locale } from '@/utils/locale'
import Image from 'next/image'
import Link from 'next/link'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import GoldZakatCalculator from './GoldZakatCalculator'

export const goldFaqs = {
  fr: goldPageCopy.fr.faqs,
  de: goldPageCopy.de.faqs,
  en: [
    [
      'How does the calculation work?',
      'Each item’s weight is multiplied by its karat divided by 24, then by your 24K price per gram. Included items are added before rounding. If that value reaches your chosen nisab, the calculator estimates 2.5% of the entire included value. The lunar-year answer determines whether this is an annual estimate or a planning amount.',
    ],
    [
      'Does personal jewellery count?',
      'There is scholarly disagreement. The Hanafi approach includes gold jewellery; other schools exempt qualifying personal-use jewellery with conditions. Select the rule you follow. Items marked as savings or investment remain included. Dar al-Ifta’s cited ruling distinguishes adornment from gold held purely for saving or investment.',
    ],
    [
      'Why can I choose a different nisab?',
      'IslamQA documents 85 g of pure gold; Islamic Relief UK publishes an 87.48 g gold threshold. Purity conventions also vary: the cited Dar al-Ifta ruling uses 85 g of 21K gold. Use a trusted local monetary nisab if that is the basis you follow, rather than treating every 85 g figure as pure gold.',
    ],
    [
      'What if I also have savings, silver or debts?',
      'This tool estimates gold alone. Being below the gold threshold does not establish that no Zakat is due on your overall wealth. Use the full calculator to include other eligible assets and deductions. Confirm your Zakat anniversary and personal eligibility with an appropriate adviser.',
    ],
  ],
  ar: [
    [
      'كيف يتم الحساب؟',
      'يُضرب وزن كل قطعة في عيارها مقسومًا على ٢٤، ثم في سعر غرام عيار ٢٤ الذي أدخلته. تُجمع القطع المشمولة قبل التقريب. إذا بلغت القيمة النصاب المختار، يُحسب ٢٫٥٪ من كامل القيمة المشمولة. وتحدد إجابة الحول هل النتيجة تقدير سنوي أم مبلغ للتخطيط.',
    ],
    [
      'هل يُحتسب حلي الاستعمال الشخصي؟',
      'في المسألة خلاف فقهي. يُحتسب حلي الذهب عند الحنفية، وتعفي مذاهب أخرى الحلي الشخصي المستوفي لشروط الإعفاء. اختر الحكم الذي تتبعه. تبقى القطع المصنفة للادخار أو الاستثمار مشمولة. وتفرّق فتوى دار الإفتاء المشار إليها بين الزينة وبين محض الادخار والاستثمار.',
    ],
    [
      'لماذا يمكن اختيار نصاب مختلف؟',
      'يوثّق الإسلام سؤال وجواب نصاب ٨٥ غرامًا من الذهب الخالص، وتنشر الإغاثة الإسلامية في بريطانيا معيار ٨٧٫٤٨ غرامًا. وتختلف معايير النقاء أيضًا؛ فالفتوى المذكورة لدار الإفتاء تعتمد ٨٥ غرامًا من عيار ٢١. إذا كنت تتبع معيارًا محليًا، فأدخل قيمته النقدية الموثوقة بدل افتراض أن كل معيار ٨٥ غرامًا يعني الذهب الخالص.',
    ],
    [
      'ماذا إن كان لدي نقد أو فضة أو ديون؟',
      'تقدّر هذه الأداة الذهب وحده. انخفاضه عن نصاب الذهب لا يعني عدم وجوب الزكاة في مجموع أموالك. استخدم الحاسبة الشاملة لإدخال أصولك وخصوماتك المؤهلة. وراجع تاريخ حولك وأهليتك مع مختص مناسب.',
    ],
  ],
}
export const goldSources = [
  [
    'https://islamqa.info/ar/answers/193553',
    'IslamQA: pure gold and the 85 g basis',
    'الإسلام سؤال وجواب: الذهب الخالص وأساس ٨٥ غرامًا',
  ],
  [
    'https://www.islamic-relief.org.uk/giving/islamic-giving/zakat/zakat-on-jewellery/',
    'Islamic Relief UK: jewellery, nisab and 2.5%',
    'الإغاثة الإسلامية بريطانيا: الحلي والنصاب و٢٫٥٪',
  ],
  [
    'https://dar-alifta.org/ar/fatwa/details/22484/حكم-زكاة-الذهب-الذي-تتخذه-المرأة-للزينة',
    'Dar al-Ifta: personal jewellery and its stated 21K basis',
    'دار الإفتاء: حلي الزينة وأساس عيار ٢١ المذكور في الفتوى',
  ],
  [
    'https://nzf.org.uk/knowledge/is-zakat-binding-only-after-the-passing-of-a-lunar-year/',
    'National Zakat Foundation: the lunar-year anniversary',
    'مؤسسة الزكاة الوطنية: الحول القمري',
  ],
]
export default function GoldZakatPage({ lang }: { lang: Locale }) {
  const ar = lang === 'ar',
    prefix = lang === 'en' ? '' : `/${lang}`,
    copy = lang === 'fr' || lang === 'de' ? goldPageCopy[lang] : null,
    faqs = goldFaqs[lang]
  return (
    <article
      lang={lang}
      dir={ar ? 'rtl' : 'ltr'}
      data-gold-calculator-version="gold-v1"
      className="mx-auto max-w-4xl px-4 py-10 sm:px-6"
    >
      <Breadcrumbs
        lang={lang}
        items={[
          {
            name: copy ? copy.zakat : ar ? 'حاسبة الزكاة' : 'Zakat Calculator',
            href: `${prefix}/zakat-calculator`,
          },
          {
            name: copy ? copy.gold : ar ? 'زكاة الذهب' : 'Gold Zakat',
            href: `${prefix}/zakat-calculator/gold`,
          },
        ]}
      />
      <header className="my-8 grid items-center gap-6 sm:grid-cols-[1.1fr_1fr]">
        <div>
          <h1 className="text-3xl leading-tight font-bold sm:text-4xl">
            {copy ? copy.title : ar ? 'حاسبة زكاة الذهب' : 'Gold Zakat Calculator'}
          </h1>
          <p className="mt-4 leading-relaxed text-stone-600 dark:text-stone-300">
            {copy
              ? copy.description
              : ar
                ? 'أضف أوزان ذهبك وعياراته، واختر النصاب، واحصل على تقدير واضح يمكنك تنزيله.'
                : 'Add your gold weights and purities, choose your nisab, and get a clear estimate you can download.'}
          </p>
        </div>
        <Image
          src="/static/images/gold-zakat-hero.webp"
          width={1536}
          height={1024}
          priority
          alt={
            copy
              ? copy.alt
              : ar
                ? 'أساور وقطعة ذهب على صينية حجرية'
                : 'Gold bangles and an ingot on a stone tray'
          }
          className="aspect-[2/1] w-full rounded-2xl object-cover sm:aspect-[3/2]"
        />
      </header>
      <GoldZakatCalculator lang={lang} initialDate={new Date().toISOString().slice(0, 10)} />
      <section className="mt-10 border-t border-stone-200 pt-8 dark:border-stone-700">
        <h2 className="text-xl font-semibold">
          {copy ? copy.exampleTitle : ar ? 'مثال سريع' : 'A quick example'}
        </h2>
        <p className="mt-3 leading-relaxed">
          {copy
            ? copy.example
            : ar
              ? 'مثال حسابي، وليس سعرًا حاليًا: ١٢٠ غرامًا من عيار ١٨ تعادل ٩٠ غرامًا من الذهب الخالص. عند سعر افتراضي قدره ١٠٠ للغرام، تكون القيمة ٩٬٠٠٠. إذا اخترت أساس ٨٥ غرامًا واكتمل الحول وانطبقت الشروط، يكون التقدير ٢٢٥.'
              : 'An arithmetic example, not a current price: 120 g of 18K gold equals 90 g of pure gold. At a hypothetical price of 100 per gram, its value is 9,000. With the 85 g basis, a completed lunar year and applicable conditions, the estimate is 225.'}
        </p>
        <div className="mt-6 divide-y divide-stone-200 dark:divide-stone-700">
          {faqs.map(([q, a]) => (
            <details key={q} className="py-4">
              <summary className="cursor-pointer font-semibold">{q}</summary>
              <p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-300">{a}</p>
            </details>
          ))}
        </div>
        <details className="mt-5 text-sm">
          <summary className="cursor-pointer font-semibold">
            {copy ? copy.sources : ar ? 'المصادر وطريقة الاستخدام' : 'Sources and method'}
          </summary>
          <ul className="mt-3 list-inside list-disc space-y-3">
            {goldSources.map(([href, en, arabic], index) => (
              <li key={href}>
                <a href={href} className="underline">
                  {copy ? copy.sourceLabels[index] : ar ? arabic : en}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 leading-relaxed">
            {copy
              ? copy.reviewed
              : ar
                ? 'المصادر مراجعة في ١٣ أكتوبر ٢٠٢٦. هذه مراجعة تحريرية وليست اعتمادًا من الجهات المذكورة. استخدم السعر في تاريخ زكاتك واستبعد وزن الأحجار؛ لا يقدّر هذا النموذج قيمة المصنعية أو الحلي المطلية. عند اختلاف أسس التقييم، أدخل نصابًا محليًا أو راجع مختصًا.'
                : 'Sources checked 13 October 2026. This is an editorial source check, not endorsement by these organizations. Use a price for your Zakat date and exclude stone weight. This model does not value workmanship or gold-plated jewellery. If your valuation basis differs, use a local nisab or consult an adviser.'}
          </p>
        </details>
        <nav
          className="mt-7 flex flex-wrap gap-5 text-sm underline"
          aria-label={copy ? copy.related : ar ? 'روابط ذات صلة' : 'Related tools'}
        >
          <Link href={`${prefix}/zakat-calculator`}>
            {copy ? copy.full : ar ? 'حاسبة الزكاة الشاملة' : 'Full Zakat calculator'}
          </Link>
          <Link href={`${prefix}/islamic-calendar`}>
            {copy ? copy.calendar : ar ? 'التقويم الهجري' : 'Hijri calendar'}
          </Link>
          {lang === 'en' && (
            <Link href="/blog/how-to-calculate-zakat">Zakat calculation guide</Link>
          )}
        </nav>
      </section>
      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: copy
            ? copy.title
            : ar
              ? 'حاسبة زكاة الذهب — إسلامفُل'
              : 'Islamful Gold Zakat Calculator',
          url: `https://www.islamful.com${prefix}/zakat-calculator/gold`,
          inLanguage: lang,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <JsonLd
        data={{
          '@type': 'FAQPage',
          mainEntity: faqs.map(([name, text]) => ({
            '@type': 'Question',
            name,
            acceptedAnswer: { '@type': 'Answer', text },
          })),
        }}
      />
    </article>
  )
}
