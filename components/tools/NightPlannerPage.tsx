import RelatedReading from '@/components/seo/RelatedReading'
import NightPlannerPageTranslated from './NightPlannerPageTranslated'
import Link from 'next/link'
import NightPlanner from './NightPlanner'
import CrossToolLinks from '@/components/seo/CrossToolLinks'

export default function NightPlannerPage({ lang = 'en' }: { lang?: 'en' | 'ar' | 'fr' | 'de' }) {
  if (lang === 'fr' || lang === 'de') return <NightPlannerPageTranslated lang={lang} />
  const ar = lang === 'ar'
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12" dir={ar ? 'rtl' : 'ltr'}>
      <header className="space-y-4">
        <h1 className="text-3xl font-bold sm:text-4xl">
          {ar ? 'حاسبة الثلث الأخير من الليل' : 'Last Third of the Night Calculator'}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {ar
            ? 'خطط لقيام الليل: اعرف بداية الثلث الأخير ومنتصف الليل وموعد الفجر حسب مدينتك أو جدولك المحلي.'
            : 'Plan your night worship: find the last third, Islamic midnight and Fajr using your city or local timetable.'}
        </p>
      </header>
      <NightPlanner lang={lang} />
      <section className="prose dark:prose-invert max-w-none">
        <h2>{ar ? 'كيف نحسب الثلث الأخير؟' : 'How is the last third calculated?'}</h2>
        <p>
          {ar
            ? 'نحسب المدة الفعلية من المغرب إلى فجر اليوم التالي. منتصف الليل هو نصف هذه المدة، ويبدأ الثلث الأخير بعد مرور ثلثيها. ليس منتصف الليل الشرعي بالضرورة الساعة 00:00، ونستخدم الفجر لا الشروق لنهاية الليل.'
            : 'We measure the elapsed time from Maghrib to the following Fajr. The midpoint is halfway through that interval; the last third starts two-thirds of the way through. Islamic midnight is not necessarily 00:00. The night ends at Fajr, not sunrise.'}
        </p>
        <p>
          {ar
            ? 'مثال: من المغرب عند 18:00 إلى الفجر عند 06:00 مدة اثنتي عشرة ساعة، إذا لم تتغير الساعة. منتصف الليل 00:00، والثلث الأخير يبدأ 02:00. عند تغيير التوقيت الصيفي نحسب المدة الفعلية باستخدام المنطقة الزمنية.'
            : 'For example, Maghrib at 18:00 and Fajr at 06:00 make a 12-hour night when the clocks do not change. Its midpoint is 00:00 and its last third begins at 02:00. On clock-change nights, this calculator uses elapsed time in the selected timezone.'}
        </p>
        <h2>{ar ? 'هل التهجد مقصور على الثلث الأخير؟' : 'Is Tahajjud only in the last third?'}</h2>
        <p>
          {ar
            ? 'قيام الليل يكون بعد صلاة العشاء وقبل الفجر، ولا يقتصر على الثلث الأخير. يُستعمل اسم التهجد غالبًا للصلاة بعد النوم. ورد فضل الدعاء في الثلث الأخير في صحيح البخاري 1145. منتصف الليل هنا علامة حسابية؛ لا نقدمه حكمًا موحدًا لنهاية وقت العشاء، إذ في ذلك تفصيل فقهي.'
            : 'Night prayer is offered after Isha and before Fajr; it is not restricted to the last third. Tahajjud commonly refers to prayer after sleeping. Sahih al-Bukhari 1145 describes the virtue of supplication in the last third. The midpoint here is a calculation, not a universal ruling on the end of Isha time; scholarly details differ.'}
        </p>
        <h2>{ar ? 'المصادر وحدود الحساب' : 'Sources and calculation limits'}</h2>
        <p>
          {ar
            ? 'مواقيت المدن من خدمة الأذان وفق طريقة الحساب المختارة. أوقات بدء الصلاة ليست أوقات الإقامة. قد تختلف طرق حساب الفجر، خاصة في خطوط العرض العليا. اتبع توجيهات مسجدك، أو أدخل مواقيت جدول محلي موثوق. إذا غاب المغرب أو الفجر فلا نختلق وقتًا بديلًا.'
            : 'City times come from Aladhan using your selected calculation method. Prayer start times are not congregation times. Fajr methods can differ, particularly at high latitudes. Follow your local mosque’s guidance or enter a trusted local timetable. If Maghrib or Fajr is unavailable, we do not invent a replacement.'}
        </p>
        <ul>
          <li>
            <a href="https://www.aliftaa.jo/QuestionPrintEn.aspx?QuestionId=1047">
              {ar
                ? 'دائرة الإفتاء الأردنية: حساب الثلث الأخير'
                : 'Jordan Iftaa Department: calculating the last third'}
            </a>
          </li>
          <li>
            <a href="https://sunnah.com/bukhari:1145">
              {ar ? 'صحيح البخاري 1145' : 'Sahih al-Bukhari 1145'}
            </a>
          </li>
          <li>
            <a href="https://islamqa.org/hanafi/qibla-hanafi/36297/">
              {ar ? 'بيان وقت صلاة الليل' : 'Explanation of the night-prayer period'}
            </a>
          </li>
          <li>
            <a href="https://aladhan.com/prayer-times-api">
              {ar ? 'خدمة الأذان لمواقيت الصلاة' : 'Aladhan prayer-times service'}
            </a>
          </li>
        </ul>
        <Link href={ar ? '/ar/prayer-times' : '/prayer-times'}>
          {ar ? 'عرض مواقيت الصلاة اليومية' : 'See daily prayer times'}
        </Link>
      </section>
      <RelatedReading path="/last-third-of-night" lang={lang} />
      <CrossToolLinks currentTool="last-third-of-night" lang={lang} />
    </div>
  )
}
