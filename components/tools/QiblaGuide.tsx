import { qiblaGuideTranslations } from '@/data/locales/qibla'
import type { Locale } from '@/utils/locale'
import JsonLd from '@/components/seo/JsonLd'

const questions = {
  ...qiblaGuideTranslations,
  en: [
    [
      'What is the Qibla?',
      'The Qibla is the direction of the Kaaba in Makkah, faced during prayer. Quran 2:144 describes turning toward the Sacred Mosque. For rulings about your particular circumstances, ask a qualified scholar.',
    ],
    [
      'How is the Qibla bearing calculated?',
      'The tool calculates the initial great-circle bearing from your coordinates to 21.4225° N, 39.8262° E on a spherical Earth. The angle runs clockwise from true north: 0° is north, 90° east, 180° south and 270° west. It is a geographical calculation, not a measurement of which way your phone is pointing.',
    ],
    [
      'Why does the arrow stay still?',
      'Without a recent valid heading, the diagram stays north-up. A desktop or unsupported phone can still calculate the bearing. Use trusted local guidance or a compass adjusted to true north to apply that angle; the top of your screen is not automatically north.',
    ],
    [
      'How do I use the phone compass?',
      'If asked, enable compass access, then hold the phone flat in portrait orientation away from magnets and metal. The tool ignores relative orientation and poor reported accuracy, and stops using readings after five seconds without an update. A displayed reading is still approximate: sensor calibration and magnetic-versus-true north can affect it.',
    ],
    [
      'Which location should I choose?',
      'Device location asks for browser permission and shows the accuracy reported by your device. Internet-location suggestions are approximate and can be wrong with a VPN. You can enter latitude and longitude instead. The calculation runs in your browser; location suggestions and place names use external services only after you choose a location action.',
    ],
    [
      'What if the direction seems wrong?',
      'Check the displayed coordinates, source and device accuracy. Try a better location fix, move away from magnetic interference and compare with a trusted local mosque. At the Kaaba, its antipode or the poles a unique useful compass bearing is not provided. The tool does not certify a prayer’s validity.',
    ],
  ],
  ar: [
    [
      'ما هي القبلة؟',
      'القبلة هي اتجاه الكعبة المشرفة في مكة الذي يستقبله المسلم في الصلاة. تذكر الآية 144 من سورة البقرة التوجه شطر المسجد الحرام. اسأل عالمًا مؤهلًا عن الأحكام المتعلقة بظروفك الخاصة.',
    ],
    [
      'كيف تُحسب زاوية اتجاه القبلة؟',
      'تحسب الأداة زاوية البداية لمسار الدائرة العظمى من إحداثياتك إلى 21.4225 درجة شمالًا و39.8262 درجة شرقًا على نموذج كروي للأرض. تُقاس الزاوية مع عقارب الساعة من الشمال الحقيقي: 0 للشمال و90 للشرق و180 للجنوب و270 للغرب. هذا حساب جغرافي، وليس قياسًا لاتجاه هاتفك.',
    ],
    [
      'لماذا يبقى السهم ثابتًا؟',
      'إذا لم تصل قراءة اتجاه حديثة وصالحة يبقى الرسم ثابتًا والشمال للأعلى. يمكن للحاسوب أو الهاتف غير المدعوم حساب الزاوية؛ استخدم توجيهًا محليًا موثوقًا أو بوصلة مضبوطة للشمال الحقيقي لتطبيقها. أعلى الشاشة لا يعني الشمال تلقائيًا.',
    ],
    [
      'كيف أستخدم بوصلة الهاتف؟',
      'فعّل إذن البوصلة إذا طُلب، وأمسك الهاتف مسطحًا بوضع رأسي بعيدًا عن المعادن والمغناطيس. تتجاهل الأداة الاتجاه النسبي والدقة الضعيفة المبلغ عنها، وتتوقف عن استخدام القراءة بعد خمس ثوانٍ دون تحديث. تظل القراءة تقريبية وتتأثر بالمعايرة وبالفرق بين الشمال المغناطيسي والحقيقي.',
    ],
    [
      'أي طريقة لتحديد الموقع أختار؟',
      'موقع الجهاز يحتاج إلى إذن المتصفح ويعرض الدقة التي يقدرها الجهاز. اقتراح الموقع عبر الإنترنت تقريبي وقد يخطئ عند استخدام شبكة افتراضية. يمكنك إدخال خط العرض والطول بدلًا من ذلك. تُحسب الزاوية في المتصفح، وتستخدم اقتراحات الموقع وأسماء الأماكن خدمات خارجية بعد اختيارك إجراءً لتحديد الموقع.',
    ],
    [
      'ماذا أفعل إذا بدا الاتجاه غير صحيح؟',
      'تحقق من الإحداثيات المعروضة ومصدرها ودقتها، وحاول تحسين تحديد الموقع والابتعاد عن التداخل المغناطيسي، وقارن بتوجيه مسجد محلي موثوق. لا تعطي الأداة زاوية فريدة مفيدة عند الكعبة نفسها أو النقطة المقابلة لها أو القطبين. ولا تحكم الأداة على صحة الصلاة.',
    ],
  ],
}

export default function QiblaGuide({ lang = 'en' }: { lang?: Locale }) {
  const ar = lang === 'ar'
  const faqs = questions[lang]
  return (
    <section className={`mt-12 space-y-6 ${ar ? 'font-arabic' : ''}`}>
      <h2 className="text-2xl font-bold">
        {ar
          ? 'استخدام محدد القبلة وفهم النتيجة'
          : lang === 'fr'
            ? 'Utiliser l’outil et comprendre le résultat'
            : lang === 'de'
              ? 'Das Tool verwenden und das Ergebnis verstehen'
              : 'Using the Qibla finder and understanding your result'}
      </h2>
      {faqs.map(([question, answer]) => (
        <div key={question}>
          <h3 className="mb-2 text-lg font-semibold">{question}</h3>
          <p className="text-gray-600 dark:text-gray-300">{answer}</p>
        </div>
      ))}
      <p className="text-sm">
        {{ en: 'References: ', ar: 'المراجع: ', fr: 'Références : ', de: 'Quellen: ' }[lang]}
        <a className="underline" href="https://quran.com/2/144">
          {{ en: 'Quran 2:144', ar: 'القرآن 2:144', fr: 'Coran 2:144', de: 'Koran 2:144' }[lang]}
        </a>
        {' · '}
        <a className="underline" href="https://www.ncei.noaa.gov/products/magnetic-declination">
          {
            {
              en: 'NOAA: true and magnetic north',
              ar: 'NOAA: الشمال الحقيقي والمغناطيسي',
              fr: 'NOAA : nord géographique et magnétique',
              de: 'NOAA: geografisch und magnetisch Nord',
            }[lang]
          }
        </a>
        {' · '}
        <a className="underline" href="https://www.w3.org/TR/orientation-event/">
          {
            {
              en: 'W3C: device orientation',
              ar: 'W3C: اتجاه الجهاز',
              fr: 'W3C : orientation de l’appareil',
              de: 'W3C: Geräteausrichtung',
            }[lang]
          }
        </a>
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
