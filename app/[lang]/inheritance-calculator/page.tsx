import { Metadata } from 'next'
import InheritanceCalculator from '@/components/tools/InheritanceCalculator'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'
import CrossToolLinks from '@/components/seo/CrossToolLinks'

export function generateStaticParams() {
  return [{ lang: 'ar' }]
}

export const metadata: Metadata = {
  title: 'حاسبة المواريث (الفرائض) — الأنصبة الشرعية | إسلامفُل',
  description:
    'احسب أنصبة الميراث الشرعية وفق القرآن الكريم (النساء: 11-12 و176). حاسبة فرائض مجانية مع المراجع القرآنية لكل وارث.',
  alternates: buildLanguageAlternates('/inheritance-calculator', { currentLanguage: 'ar' }),
  openGraph: {
    title: 'حاسبة المواريث (الفرائض) — الأنصبة الشرعية | إسلامفُل',
    description:
      'احسب أنصبة الميراث الشرعية وفق القرآن الكريم. حاسبة فرائض مجانية مع المراجع القرآنية لكل وارث.',
    url: 'https://www.islamful.com/ar/inheritance-calculator',
    siteName: 'Islamful',
    images: ['/static/images/og-image.png'],
    type: 'website',
  },
  twitter: {
    title: 'حاسبة المواريث (الفرائض) — الأنصبة الشرعية | إسلامفُل',
    description:
      'احسب أنصبة الميراث الشرعية وفق القرآن الكريم. حاسبة فرائض مجانية مع المراجع القرآنية لكل وارث.',
    card: 'summary_large_image',
    images: ['/static/images/og-image.png'],
  },
}

export default async function InheritanceCalculatorPageAr() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" dir="rtl">
      <Breadcrumbs items={[{ name: 'حاسبة المواريث', href: '/ar/inheritance-calculator' }]} />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'إسلامفُل - حاسبة المواريث الإسلامية (الفرائض)',
          description:
            'احسب أنصبة الميراث الشرعية وفق القرآن الكريم. حاسبة فرائض مجانية مع المراجع القرآنية لكل وارث.',
          url: 'https://www.islamful.com/ar/inheritance-calculator',
          applicationCategory: 'FinanceApplication',
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
          حاسبة المواريث الإسلامية
        </h1>
        <p className="font-arabic mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          احسب أنصبة الميراث (الفرائض) وفق القرآن والسنة. اطلع على نصيب كل وارث مع المراجع القرآنية.
        </p>
      </div>

      <InheritanceCalculator lang="ar" />

      <JsonLd
        data={{
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'ما هو علم الفرائض (المواريث الإسلامية)؟',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'علم الفرائض هو علم تقسيم التركة بين الورثة وفق الشريعة الإسلامية. يستند إلى آيات صريحة في القرآن الكريم — خاصة سورة النساء (الآيات 11-12 و176) — التي تحدد الأنصبة المقدرة لكل وارث بدقة. ويُعدّ من أهم فروع الفقه الإسلامي، وقد قال النبي صلى الله عليه وسلم: «تعلموا الفرائض وعلّموها الناس فإنها نصف العلم» (سنن ابن ماجه).',
              },
            },
            {
              '@type': 'Question',
              name: 'ما هو العَوْل في الميراث الإسلامي؟',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'العَوْل هو حالة تحدث عندما يتجاوز مجموع الأنصبة المقدرة (الفروض) أصل المسألة. في هذه الحالة يُزاد أصل المسألة ليساوي مجموع السهام، فتنقص حصة كل وارث بنسبة متساوية. وقد أُقرّ هذا الحكم في عهد الخليفة عمر بن الخطاب رضي الله عنه.',
              },
            },
            {
              '@type': 'Question',
              name: 'ما هو ترتيب التوزيع في الميراث الإسلامي؟',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'يكون ترتيب التصرف في التركة كالتالي: (1) تجهيز الميت ومصاريف الجنازة والدفن، (2) سداد جميع الديون المستحقة على المتوفى، (3) تنفيذ الوصايا في حدود الثلث ولغير وارث، (4) توزيع ما تبقى من التركة على الورثة حسب الأنصبة الشرعية المقدرة في القرآن الكريم.',
              },
            },
            {
              '@type': 'Question',
              name: 'ما الفرق بين أصحاب الفروض والعصبة؟',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'أصحاب الفروض هم الورثة الذين حدد القرآن الكريم أنصبتهم بكسور معينة (النصف، الربع، الثمن، الثلثان، الثلث، السدس)، مثل الزوجة والأم والأب عند وجود فرع وارث. أما العصبة فهم الورثة الذين يأخذون ما تبقى بعد توزيع الفروض، وأقواهم الابن. وعند اجتماع الأبناء مع البنات يكون «لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ» كما في سورة النساء الآية 11.',
              },
            },
          ],
        }}
      />

      {/* SEO Content */}
      <section className="mt-16 space-y-8">
        <h2 className="font-arabic text-2xl font-bold text-gray-900 dark:text-white">
          فهم المواريث الإسلامية (علم الفرائض)
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="font-arabic">
            <strong>علم الفرائض</strong> هو العلم الذي يُعنى بتقسيم التركة بين المستحقين شرعاً وفق
            ما جاء في كتاب الله وسنة رسوله صلى الله عليه وسلم. ويتميز هذا العلم بأن أحكامه منصوص
            عليها بكسور دقيقة في القرآن الكريم، مما يجعله من أقل المجالات الفقهية خلافاً بين
            العلماء.
          </p>

          <h3 className="font-arabic">الأساس القرآني للمواريث</h3>
          <p className="font-arabic">
            تتضمن <strong>سورة النساء</strong> الآيات الرئيسية للمواريث. فالآيتان 11 و12 تفصّلان
            أنصبة الأبناء والآباء والأزواج، بينما تعالج الآية 176 (آية الكلالة) ميراث الإخوة
            والأخوات عند عدم وجود فرع وارث أو أصل ذكر. وقد بيّن النبي صلى الله عليه وسلم أهمية هذا
            العلم بقوله: «تعلموا الفرائض وعلّموها الناس فإنها نصف العلم» (رواه ابن ماجه).
          </p>

          <h3 className="font-arabic">أصحاب الفروض المقدّرة</h3>
          <p className="font-arabic">
            حدد القرآن الكريم ستة كسور هي أساس تقسيم المواريث: النصف (1/2)، والربع (1/4)، والثمن
            (1/8)، والثلثان (2/3)، والثلث (1/3)، والسدس (1/6). ويتحدد نصيب كل وارث بحسب قرابته
            للمتوفى ووجود ورثة آخرين. فالزوجة مثلاً ترث الثمن إذا كان للمتوفى ولد، والربع إذا لم يكن
            له ولد. والزوج يرث الربع مع وجود الولد، والنصف بدونه.
          </p>

          <h3 className="font-arabic">العصبة (الورثة بالتعصيب)</h3>
          <p className="font-arabic">
            بعد توزيع الفروض المقدرة، يُعطى الباقي للعصبة. والابن هو أقوى العصبة، فإذا اجتمع الأبناء
            مع البنات كان «لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ» كما في الآية 11 من سورة النساء.
            وإذا لم يكن هناك أبناء، فالأب (عند عدم وجود فرع وارث) أو الإخوة الأشقاء يأخذون الباقي.
            وهذه النسبة (2:1) تعكس المسؤوليات المالية الأكبر التي تقع على الرجل في الإسلام كالنفقة
            على الأسرة.
          </p>

          <h3 className="font-arabic">الدين قبل الميراث</h3>
          <p className="font-arabic">
            من المبادئ الجوهرية في الميراث الإسلامي أن <strong>الديون تُسدد أولاً</strong>. فالقرآن
            يقيّد أنصبة الميراث بعبارة «مِن بَعْدِ وَصِيَّةٍ يُوصِي بِهَا أَوْ دَيْنٍ» (النساء: 11).
            وترتيب الأولوية هو: مصاريف الجنازة والتجهيز، ثم سداد الديون، ثم تنفيذ الوصايا (في حدود
            الثلث)، وأخيراً توزيع التركة على الورثة.
          </p>

          <h3 className="font-arabic">العَوْل والرَّدّ</h3>
          <p className="font-arabic">
            قد تنشأ حالتان خاصتان في حساب المواريث. <strong>العَوْل</strong> يحدث عندما يتجاوز مجموع
            الفروض المقدرة أصل المسألة (أكثر من 100%)، فتُخفَّض جميع الأنصبة بنسبة متساوية.{' '}
            <strong>الرَّدّ</strong> يحدث عندما يقل مجموع الفروض عن أصل المسألة ولا يوجد عاصب،
            فيُعاد الفائض نسبياً على أصحاب الفروض (ما عدا الزوجين في قول الجمهور). وكلا المبدأين
            يضمنان توزيعاً عادلاً وكاملاً للتركة.
          </p>

          <h3 className="font-arabic">لماذا تستخدم حاسبة المواريث؟</h3>
          <p className="font-arabic">
            قد تصبح حسابات الميراث الإسلامي معقدة، خاصة عند تعدد الورثة أو حدوث حالات خاصة كالعول.
            هذه الحاسبة المجانية تؤدي العمليات الحسابية على الكسور تلقائياً وتطبق جميع الأحكام
            القرآنية لتعطيك توزيعاً دقيقاً. ومع ذلك، فإن حالات الميراث الواقعية قد تتضمن اعتبارات
            إضافية — كوجود أحفاد أو إخوة لأم أو أصول وقفية — تستلزم استشارة عالم إسلامي مؤهل أو مفتٍ
            متخصص.
          </p>
        </div>
      </section>

      <CrossToolLinks currentTool="inheritance-calculator" lang="ar" />
    </div>
  )
}
