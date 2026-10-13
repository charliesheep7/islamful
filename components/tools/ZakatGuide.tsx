import Link from 'next/link'
import JsonLd from '@/components/seo/JsonLd'

const sources = [
  [
    'https://islamic-relief.org/zakat-faq/',
    'Islamic Relief: nisab and wealth',
    'الإغاثة الإسلامية: النصاب والأموال',
  ],
  [
    'https://www.islamic-relief.org.uk/giving/islamic-giving/zakat/zakat-calculator/',
    'Islamic Relief UK: 87.48 g / 612.36 g convention',
    'الإغاثة الإسلامية بريطانيا: معيار 87.48 / 612.36 غرام',
  ],
  [
    'https://islamqa.info/ar/answers/193553',
    'IslamQA: pure metal and 85 g / 595 g convention',
    'الإسلام سؤال وجواب: المعدن الخالص ومعيار 85 / 595 غرام',
  ],
  [
    'https://www.islamic-relief.org.uk/giving/islamic-giving/zakat/zakat-on-jewellery/',
    'Islamic Relief: jewellery differences',
    'الإغاثة الإسلامية: الخلاف في زكاة الحلي',
  ],
  [
    'https://nzf.org.uk/knowledge/zakat-on-stocks-and-shares/',
    'National Zakat Foundation: investment valuation',
    'مؤسسة الزكاة الوطنية: تقييم الاستثمارات',
  ],
  [
    'https://nzf.org.uk/knowledge/payment-of-zakat-deductible-liabilities/',
    'National Zakat Foundation: debt deductions',
    'مؤسسة الزكاة الوطنية: خصم الديون',
  ],
  [
    'https://nzf.org.uk/knowledge/is-zakat-binding-only-after-the-passing-of-a-lunar-year/',
    'National Zakat Foundation: the lunar year',
    'مؤسسة الزكاة الوطنية: الحول القمري',
  ],
]
export const zakatQuestions = {
  en: [
    [
      'Which nisab should I select?',
      'Use the basis advised by your trusted authority. Gold and silver give different thresholds. This tool supports a local currency amount or either metal, with 87.48/612.36 g and 85/595 g conventions. The selected basis appears in your result.',
    ],
    [
      'Does the calculator include personal jewellery?',
      'You decide which eligible metals to enter. The Hanafi position includes gold and silver jewellery; other schools generally exempt permitted personal-use jewellery subject to conditions. Stones are not metal. The tool does not choose a ruling for you.',
    ],
    [
      'Should I enter my entire investment portfolio?',
      'Not automatically. National Zakat Foundation distinguishes shares bought for resale from long-term holdings, whose zakatable underlying assets need assessment. Enter the eligible value you have established, not an unexplained percentage or the whole value of every asset.',
    ],
    [
      'Can I subtract all my debts?',
      'Do not assume every liability is deductible. National Zakat Foundation gives conditions for deductions, excludes future bills not yet due and distinguishes long-term instalments. Apply the guidance relevant to your situation before entering the deduction.',
    ],
    [
      'Does every pound or dollar need its own full year?',
      'National Zakat Foundation uses a common Zakat anniversary for qualifying cash, metals and trade assets acquired during the year. Confirm your anniversary and applicable rules, especially if wealth fell below nisab. This calculator only uses your stated lunar-year answer.',
    ],
    [
      'How is the estimate calculated?',
      'The tool adds eligible assets, subtracts your entered deductions and compares the non-negative balance with your selected nisab. At or above nisab, it calculates 2.5% of the whole balance. An incomplete or uncertain lunar year produces a planning result, not a claim that payment is due now.',
    ],
  ],
  ar: [
    [
      'أي نصاب أختار؟',
      'استخدم الأساس الذي تنصح به الجهة الموثوقة لديك. يختلف نصاب الذهب عن الفضة. تدعم الأداة مبلغًا محليًا أو حسابًا بأحد المعدنين، بمعياري 87.48/612.36 غرام و85/595 غرام. يظهر الأساس المختار في نتيجتك.',
    ],
    [
      'هل تشمل الحاسبة حلي الاستعمال؟',
      'أنت تحدد المعادن الزكوية التي تدخلها. يوجب الحنفية الزكاة في حلي الذهب والفضة، بينما تعفي مذاهب أخرى حلي الاستعمال المباح بشروط. الأحجار ليست معدنًا. لا تختار الأداة حكمًا فقهيًا عنك.',
    ],
    [
      'هل أدخل قيمة محفظتي الاستثمارية كاملة؟',
      'ليس تلقائيًا. تميّز مؤسسة الزكاة الوطنية بين أسهم إعادة البيع والاستثمار طويل الأجل الذي يحتاج تقييم أصوله الزكوية. أدخل القيمة الزكوية التي تحققت منها، لا نسبة غير مفسّرة أو كامل قيمة كل أصل.',
    ],
    [
      'هل أخصم جميع ديوني؟',
      'لا تفترض أن كل التزام قابل للخصم. تذكر مؤسسة الزكاة الوطنية شروطًا للخصم، وتستبعد الفواتير المستقبلية غير المستحقة، وتفرّق بين أقساط الديون طويلة الأجل. طبّق الإرشاد المناسب لحالتك قبل إدخال الخصم.',
    ],
    [
      'هل يلزم حول مستقل لكل مبلغ جديد؟',
      'تستخدم مؤسسة الزكاة الوطنية موعدًا مشتركًا لزكاة النقد والمعادن وعروض التجارة المؤهلة المكتسبة خلال العام. تحقّق من موعدك والأحكام المنطبقة، خصوصًا عند نقص المال عن النصاب. تعتمد الحاسبة فقط على إجابتك عن الحول.',
    ],
    [
      'كيف يُحسب التقدير؟',
      'تجمع الأداة الأصول الزكوية وتخصم الالتزامات التي أدخلتها، ثم تقارن الرصيد غير السالب بالنصاب المختار. عند بلوغه تحسب ٢٫٥٪ من كامل الرصيد. إذا لم يكتمل الحول أو لم تتأكد منه تكون النتيجة للتخطيط، لا تقريرًا بوجوب الدفع الآن.',
    ],
  ],
}
export default function ZakatGuide({ lang }: { lang: 'en' | 'ar' }) {
  const ar = lang === 'ar'
  const faqs = zakatQuestions[lang]
  return (
    <section
      lang={lang}
      dir={ar ? 'rtl' : 'ltr'}
      className="mt-12 space-y-7 border-t border-gray-200 pt-9 dark:border-gray-800"
    >
      <h2 className="text-2xl font-bold">
        {ar ? 'استخدام حاسبة الزكاة' : 'Using the Zakat calculator'}
      </h2>
      <p className="leading-relaxed">
        {ar
          ? 'اختر تاريخ التقييم والنصاب، ثم أدخل أموالك وخصوماتك المؤهلة بعملة واحدة. مثال حسابي فقط: إذا كان صافي المال 10,000 والنصاب المختار 5,000 واكتمل الحول، يكون التقدير 250، لا 125. المثال لا يمثل أسعارًا حالية.'
          : 'Choose a valuation date and nisab, then enter eligible assets and deductions in one currency. Arithmetic example only: with net wealth of 10,000, a selected nisab of 5,000 and a completed lunar year, the estimate is 250, not 125. These are not current market prices.'}
      </p>
      <div className="space-y-6">
        {faqs.map(([question, answer]) => (
          <div key={question}>
            <h3 className="mb-2 text-lg font-semibold">{question}</h3>
            <p className="leading-relaxed text-gray-600 dark:text-gray-300">{answer}</p>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold">{ar ? 'المصادر والأسس' : 'Sources and calculation bases'}</h3>
        <ul className="list-inside list-disc space-y-2 text-sm">
          {sources.map(([href, en, arabic]) => (
            <li key={href}>
              <a href={href} className="underline underline-offset-4">
                {ar ? arabic : en}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-500">
          {ar
            ? 'راجعنا المصادر في 13 أكتوبر 2026. لا يعني ذلك اعتماد هذه الأداة من الجهات المذكورة أو مراجعة عالم مستقل لها. للميراث والأموال المعقدة وأهلية المكلّف اسأل مختصًا بالزكاة.'
            : 'Sources checked 13 October 2026. This does not imply endorsement by the named organizations or an independent scholarly review of this tool. Ask a Zakat specialist about complex assets and personal eligibility.'}
        </p>
      </div>
      <p className="flex flex-wrap gap-5 text-sm">
        <Link
          className="underline"
          href={ar ? '/ar/zakat-calculator/gold' : '/zakat-calculator/gold'}
        >
          {ar ? 'حاسبة الذهب بمختلف العيارات' : 'Gold calculator for mixed purities'}
        </Link>
        <a className="underline" href={ar ? '/ar/islamic-calendar' : '/islamic-calendar'}>
          {ar ? 'التقويم الهجري' : 'Hijri calendar'}
        </a>
        {!ar && (
          <Link className="underline" href="/blog/how-to-calculate-zakat">
            Step-by-step Zakat guide
          </Link>
        )}
      </p>
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
    </section>
  )
}
