import CalendarGuideTranslated from './CalendarGuideTranslated'
import JsonLd from '@/components/seo/JsonLd'

export const calendarQuestions = {
  en: [
    [
      'How do I convert a Hijri date to Gregorian?',
      'Choose Hijri to Gregorian, enter the year, month and day, then select Convert date. The result gives the daytime Gregorian date and the previous evening when its Islamic night begins. Invalid dates, including day 30 of a 29-day month, are rejected.',
    ],
    [
      'Why can two Hijri calendars show different dates?',
      'Umm al-Qura and the tabular Islamic civil calendar are different calculated calendars. Local moon-sighting decisions may differ from either. Choose the method and, if needed, a small day adjustment that matches your trusted local calendar; an adjustment is not a moon-sighting confirmation.',
    ],
    [
      'Does the date change at midnight or sunset?',
      'The tool uses your selected time zone to identify the civil day and refreshes it after midnight. It also shows the coming night separately. Islamic nights begin at local sunset; this page does not locate you or detect sunset, so it does not claim to switch the current religious date at Maghrib.',
    ],
    [
      'Can this calendar confirm Ramadan, Eid or Laylat al-Qadr?',
      'No. The key dates are planning estimates under the selected calculation method. Follow the appropriate local announcements for Ramadan and Eid. Laylat al-Qadr is sought in the last ten nights; this calendar does not label the 27th as a confirmed date.',
    ],
    [
      'Are the 13th, 14th and 15th always fasting recommendations?',
      'No. A numbered calendar day is not a personal fasting ruling. The white-day practice has a hadith basis, but the days of Tashriq have distinct fasting restrictions. This calendar marks dates without automatically recommending fasting on every 13th, 14th and 15th.',
    ],
    [
      'What happens when I download the dates?',
      'The .ics file contains the upcoming dates shown on the page as all-day Gregorian events, with the calculation method and adjustment in their descriptions. They are not live announcements, recurring updates or automatic alarms. Recheck local announcements and update imported dates when needed.',
    ],
  ],
  ar: [
    [
      'كيف أحوّل التاريخ الهجري إلى الميلادي؟',
      'اختر التحويل من الهجري إلى الميلادي، وأدخل السنة والشهر واليوم، ثم اضغط تحويل التاريخ. تعرض النتيجة تاريخ النهار الميلادي والمساء السابق الذي تبدأ عند غروبه ليلته الشرعية. تُرفض التواريخ غير الصحيحة، ومنها اليوم الثلاثون في شهر من تسعة وعشرين يومًا.',
    ],
    [
      'لماذا يختلف التاريخ بين تقويمين هجريين؟',
      'أم القرى والتقويم الهجري المدني الجدولي طريقتان مختلفتان للحساب، وقد تخالفهما قرارات رؤية الهلال المحلية. اختر الطريقة، وعند الحاجة تعديلًا يسيرًا للأيام يوافق تقويمك المحلي الموثوق. التعديل ليس إثباتًا لرؤية الهلال.',
    ],
    [
      'هل يتغيّر التاريخ عند منتصف الليل أم الغروب؟',
      'تستخدم الأداة المنطقة الزمنية المختارة لتحديد اليوم المدني وتحدّثه بعد منتصف الليل، وتعرض الليلة القادمة بصورة منفصلة. تبدأ الليلة الشرعية عند الغروب المحلي. لا تحدّد هذه الصفحة موقعك أو الغروب، لذلك لا تدّعي تغيير التاريخ الشرعي الحالي تلقائيًا عند المغرب.',
    ],
    [
      'هل يؤكد التقويم دخول رمضان أو العيد أو موعد ليلة القدر؟',
      'لا. التواريخ تقديرات للتخطيط وفق طريقة الحساب المختارة. اتبع الإعلانات المحلية المعتبرة لدخول رمضان والعيد. تُلتمس ليلة القدر في العشر الأواخر، ولا يعيّن هذا التقويم ليلة السابع والعشرين موعدًا مؤكدًا لها.',
    ],
    [
      'هل يُنصح دائمًا بصيام الثالث عشر والرابع عشر والخامس عشر؟',
      'لا. رقم اليوم في التقويم ليس حكمًا شخصيًا بالصيام. لأيام البيض أصل في الحديث، ولأيام التشريق أحكام خاصة تتعلق بمنع الصيام. يحدّد هذا التقويم التواريخ دون توصية تلقائية بصيام كل يوم ثالث عشر ورابع عشر وخامس عشر.',
    ],
    [
      'ماذا يتضمن تنزيل التواريخ؟',
      'يتضمن ملف .ics التواريخ القادمة المعروضة كأحداث ميلادية ليوم كامل، مع طريقة الحساب والتعديل في وصفها. ليست إعلانات مباشرة أو تحديثات دورية أو منبّهات تلقائية. راجع الإعلانات المحلية وعدّل الأحداث المستوردة عند الحاجة.',
    ],
  ],
}

export default function CalendarGuide({ lang }: { lang: 'en' | 'ar' | 'fr' | 'de' }) {
  if (lang === 'fr' || lang === 'de') return <CalendarGuideTranslated lang={lang} />
  const ar = lang === 'ar'
  const questions = calendarQuestions[lang]
  return (
    <section
      className="mt-12 space-y-7 border-t border-gray-200 pt-9 dark:border-gray-800"
      lang={lang}
      dir={ar ? 'rtl' : 'ltr'}
    >
      <h2 className="text-2xl font-bold">
        {ar ? 'فهم التقويم الهجري واستخدامه' : 'Understanding and using the Hijri calendar'}
      </h2>
      <p className="leading-relaxed text-gray-600 dark:text-gray-300">
        {ar
          ? 'استخدم التحويل للتخطيط والمقارنة، وراجع الجهة المحلية الموثوقة لتواريخ العبادات. تعمل الحسابات في المتصفح بعد تحميل الصفحة، وتُحفظ تفضيلاتك محليًا دون طلب موقع الجهاز.'
          : 'Use the converter for planning and comparison, and consult trusted local guidance for worship dates. Calculations work in the browser once the page is loaded, with preferences saved locally and no request for device location.'}
      </p>
      {questions.map(([question, answer]) => (
        <div key={question}>
          <h3 className="text-lg font-semibold">{question}</h3>
          <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-300">{answer}</p>
        </div>
      ))}
      <div className="rounded-xl bg-gray-50 p-5 text-sm dark:bg-gray-900">
        <h3 className="font-semibold">{ar ? 'الطريقة والمصادر' : 'Method and sources'}</h3>
        <p className="mt-3 leading-relaxed">
          {ar
            ? 'يستخدم المحوّل دعم التقويم في المتصفح (Intl)، ويتحقق من توفر الطريقة المختارة بدل استبدالها بصمت. النطاق الميلادي هنا ١٩٠٠–٢١٠٠؛ تقويم أم القرى المحسوب ليس سجلًا لإعلانات الرؤية المحلية.'
            : 'Conversion uses the browser’s calendar support (Intl), checking that the chosen method is available instead of silently substituting another. The Gregorian range is 1900–2100; computed Umm al-Qura dates are not a record of local sighting announcements.'}
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <a
              className="underline"
              href="https://unicode-org.github.io/icu/userguide/format_parse/datetime/"
            >
              {ar
                ? 'توثيق Unicode ICU للتقاويم والتواريخ'
                : 'Unicode ICU calendar and date documentation'}
            </a>
          </li>
          <li>
            <a className="underline" href="https://sunnah.com/bukhari:1909">
              {ar ? 'البخاري ١٩٠٩: رؤية الهلال' : 'Bukhari 1909: moon sighting'}
            </a>
          </li>
          <li>
            <a className="underline" href="https://sunnah.com/bukhari:2017">
              {ar ? 'البخاري ٢٠١٧: تحري ليلة القدر' : 'Bukhari 2017: seeking Laylat al-Qadr'}
            </a>
          </li>
          <li>
            <a className="underline" href="https://sunnah.com/tirmidhi:761">
              {ar ? 'الترمذي ٧٦١: أيام البيض' : 'Tirmidhi 761: the white days'}
            </a>
          </li>
          <li>
            <a className="underline" href="https://sunnah.com/muslim:1141a">
              {ar ? 'مسلم ١١٤١: أيام التشريق' : 'Muslim 1141a: days of Tashriq'}
            </a>
          </li>
        </ul>
      </div>
      <p>
        <a className="underline" href={`${ar ? '/ar' : ''}/prayer-times`}>
          {ar ? 'مواقيت الصلاة لمدينتك' : 'Prayer times for your city'}
        </a>{' '}
        ·{' '}
        <a className="underline" href={`${ar ? '/ar' : ''}/last-third-of-night`}>
          {ar ? 'خطط لأوقات ليلتك' : 'Plan your night'}
        </a>
      </p>
      <JsonLd
        data={{
          '@type': 'FAQPage',
          inLanguage: lang,
          mainEntity: questions.map(([name, text]) => ({
            '@type': 'Question',
            name,
            acceptedAnswer: { '@type': 'Answer', text },
          })),
        }}
      />
    </section>
  )
}
