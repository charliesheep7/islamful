import { Metadata } from 'next'
import HaramChecker from '@/components/tools/HaramChecker'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'
import CrossToolLinks from '@/components/seo/CrossToolLinks'

export function generateStaticParams() {
  return [{ lang: 'ar' }]
}

export const metadata: Metadata = {
  title: 'هل هذا حرام؟ — فاحص الأحكام الإسلامية المجاني',
  description:
    'تحقق من حكم أي شيء في الإسلام — طعام، أنشطة، أسلوب حياة، معاملات مالية، والمزيد. فاحص مجاني بالذكاء الاصطناعي مع مراجع من القرآن والحديث.',
  alternates: buildLanguageAlternates('/haram-check', { currentLanguage: 'ar' }),
}

export default async function HaramCheckPageAr() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" dir="rtl">
      <Breadcrumbs items={[{ name: 'هل هذا حرام؟', href: '/ar/haram-check' }]} />

      <JsonLd
        data={{
          '@type': 'WebApplication',
          name: 'إسلامفُل - فاحص الأحكام الإسلامية',
          description:
            'تحقق من حكم أي شيء — طعام، أنشطة، أسلوب حياة، والمزيد. فاحص مجاني بالذكاء الاصطناعي مع مراجع علمية.',
          url: 'https://www.islamful.com/ar/haram-check',
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
          هل هذا حرام؟
        </h1>
        <p className="font-arabic mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          هل تتساءل عن حكم شيء ما؟ ابحث عن أي شيء — طعام، أنشطة، معاملات مالية، أسلوب حياة، والمزيد.
        </p>
      </div>

      <HaramChecker lang="ar" standalone />

      <JsonLd
        data={{
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'ما الذي يجعل شيئاً حراماً في الإسلام؟',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'المصادر الأساسية لتحديد الحلال والحرام هي القرآن الكريم والسنة النبوية وإجماع العلماء. يحرم القرآن صراحة أشياء مثل لحم الخنزير والخمر والدم.',
              },
            },
            {
              '@type': 'Question',
              name: 'ما معنى مشبوه؟',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'المشبوه يشير إلى أشياء حكمها غير واضح أو اختلف فيها العلماء. قال النبي صلى الله عليه وسلم: «دع ما يريبك إلى ما لا يريبك» (رواه الترمذي).',
              },
            },
            {
              '@type': 'Question',
              name: 'ما المكونات الشائعة التي يجب على المسلم الانتباه لها؟',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'من المكونات الشائعة التي يجب التحقق منها: الجيلاتين والجلسرين والسيستين (E920) والكارمين (E120) والمستحلبات الحيوانية المصدر. ابحث دائماً عن شهادة الحلال أو تحقق من مصدر هذه المكونات.',
              },
            },
            {
              '@type': 'Question',
              name: 'هل يمكنني التحقق من الأنشطة وأسلوب الحياة وليس فقط الطعام؟',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'نعم! هذه الأداة تغطي جميع جوانب الحياة اليومية — وليس فقط الطعام. يمكنك التحقق من الأنشطة (الموسيقى، اليوغا، الوشم)، والمعاملات المالية (الأسهم، العملات الرقمية، التأمين)، وخيارات الحياة (المواعدة، الاحتفالات)، والمزيد. كل حكم يتضمن مراجع علمية.',
              },
            },
          ],
        }}
      />

      {/* SEO Content */}
      <section className="mt-16 space-y-8">
        <h2 className="font-arabic text-2xl font-bold text-gray-900 dark:text-white">
          فهم الحلال والحرام في الإسلام
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="font-arabic">
            في الإسلام، <strong>الحلال</strong> (المباح) و<strong>الحرام</strong> (المحظور) مفهومان
            أساسيان يوجهان خيارات المسلم اليومية — من الطعام والشراب إلى المعاملات المالية وقرارات
            الحياة.
          </p>
          <h3 className="font-arabic">ما الذي يجعل شيئاً حراماً؟</h3>
          <p className="font-arabic">المصادر الأساسية لتحديد الحلال والحرام هي:</p>
          <ul className="font-arabic">
            <li>
              <strong>القرآن الكريم</strong> — كلام الله المنزل، الذي يحرم صراحة أشياء مثل لحم
              الخنزير (البقرة: 173) والخمر (المائدة: 90) والدم.
            </li>
            <li>
              <strong>السنة النبوية</strong> — تعاليم وأعمال النبي محمد صلى الله عليه وسلم، التي
              توفر إرشادات إضافية حول الحلال والحرام.
            </li>
            <li>
              <strong>إجماع العلماء</strong> — الأحكام المتفق عليها من قبل العلماء المؤهلين.
            </li>
          </ul>
          <h3 className="font-arabic">ما معنى «مشبوه»؟</h3>
          <p className="font-arabic">
            <strong>المشبوه</strong> يشير إلى أشياء حكمها غير واضح أو اختلف فيها العلماء. قال النبي
            صلى الله عليه وسلم: «دع ما يريبك إلى ما لا يريبك» (رواه الترمذي).
          </p>
          <h3 className="font-arabic">مكونات شائعة يجب الانتباه لها</h3>
          <p className="font-arabic">
            تحتوي كثير من الأطعمة المصنعة على مكونات قد تكون مشتقة من مصادر حرام. من أبرزها:
            الجيلاتين والجلسرين والسيستين (E920) والكارمين (E120) والمستحلبات الحيوانية المصدر. ابحث
            دائماً عن شهادة الحلال أو تحقق من مصدر هذه المكونات.
          </p>
          <h3 className="font-arabic">ما وراء الطعام: الأنشطة والمعاملات وأسلوب الحياة</h3>
          <p className="font-arabic">
            الحلال والحرام يمتدان إلى ما هو أبعد من الطعام. يبحث المسلمون بانتظام عن حكم أمور يومية
            مثل الموسيقى والوشم وتربية الكلاب. كما تحتاج المسائل المالية كالربا وتداول الأسهم
            والعملات الرقمية والتأمين إلى توجيه إسلامي. هذه الأداة تغطي كل هذه المجالات مع مراجع من
            القرآن والحديث والهيئات العلمية المعتمدة.
          </p>
        </div>
      </section>

      <CrossToolLinks currentTool="haram-check" lang="ar" />
    </div>
  )
}
