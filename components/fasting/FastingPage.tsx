import Link from 'next/link'
import FastingPlanner from './FastingPlanner'
import cities, { getRelatedCities, type City } from '@/data/cities'
import { fastingCopy } from '@/data/fasting'
import { PRAYER_METHODS, ARABIC_PRAYER_METHODS } from '@/data/prayer-methods'
import {
  fetchFastingTable,
  nextRamadanYear,
  ramadanDates,
  type FastingTable,
} from '@/utils/fasting'
import { localDateISO } from '@/utils/prayer-schedule'
import JsonLd from '@/components/seo/JsonLd'
import CrossToolLinks from '@/components/seo/CrossToolLinks'

export default async function FastingPage({
  lang,
  ramadan,
  city,
}: {
  lang: 'en' | 'ar'
  ramadan: boolean
  city?: City
}) {
  const ar = lang === 'ar',
    t = (en: string, arabic: string) => (ar ? arabic : en)
  const prefix = ar ? '/ar' : '',
    copy = fastingCopy[lang]
  const today = localDateISO(city?.timezone || 'UTC')
  const year = nextRamadanYear(today)
  const dates = ramadan ? ramadanDates(year) : [today]
  let table: FastingTable | null = null
  if (city) {
    try {
      table = await fetchFastingTable(city, String(city.method), dates, {
        signal: AbortSignal.timeout(12000),
        next: { revalidate: 3600 },
      })
    } catch {
      /* Show dated estimates and a retry when the timing service is unavailable. */
    }
  }
  const title = city
    ? t(`Ramadan Calendar in ${city.name}`, `تقويم رمضان في ${city.nameAr}`)
    : ramadan
      ? copy.ramadanTitle
      : copy.dailyTitle
  const related = city ? getRelatedCities(city.slug) : cities
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-12" dir={ar ? 'rtl' : 'ltr'}>
      <header className="space-y-4">
        {city && (
          <Link className="text-sm underline" href={`${prefix}/ramadan-calendar`}>
            {copy.ramadanTitle}
          </Link>
        )}
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {ramadan ? copy.ramadanDescription : copy.dailyDescription}
        </p>
        {city && (
          <p className="text-sm">
            {t(`${city.name}, ${city.country}`, `${city.nameAr}، ${city.countryAr}`)} ·{' '}
            <bdi>{city.timezone}</bdi> · {t('Default prayer method: ', 'طريقة الصلاة الافتراضية: ')}
            {(ar ? ARABIC_PRAYER_METHODS : PRAYER_METHODS)[String(city.method)]}
          </p>
        )}
        <div className="flex flex-wrap gap-4 text-sm print:hidden">
          <Link
            className="underline"
            href={`${prefix}/${ramadan ? 'fasting-times' : 'ramadan-calendar'}`}
          >
            {ramadan ? copy.dailyTitle : copy.ramadanTitle}
          </Link>
          <Link className="underline" href={`${prefix}/prayer-times${city ? `/${city.slug}` : ''}`}>
            {t('All prayer times', 'مواقيت الصلاة كاملة')}
          </Link>
          <Link className="underline" href={`${prefix}/last-third-of-night`}>
            {t('Plan your night prayer', 'خطط لقيام الليل')}
          </Link>
        </div>
      </header>
      <FastingPlanner
        lang={lang}
        ramadan={ramadan}
        initialCity={city?.slug}
        initialToday={today}
        initialYear={year}
        initialDates={dates}
        initialTable={table}
      />
      <section className="prose dark:prose-invert max-w-none">
        <h2>{t('Using the timetable', 'كيفية استخدام الجدول')}</h2>
        <p>
          {t(
            'Suhoor (also called sehri) is the meal before the fast. The Quran describes the fasting interval as dawn to nightfall (2:187). This timetable uses Fajr and Maghrib from the selected prayer method; it does not use sunrise as the start or replace Fajr with an earlier “imsak” time.',
            'السحور وجبة ما قبل الصيام. يبيّن القرآن وقت الصوم من الفجر إلى الليل (البقرة ١٨٧). يستخدم هذا الجدول الفجر والمغرب وفق طريقة الصلاة المختارة، ولا يجعل الشروق بداية الصوم ولا يستبدل الفجر بوقت إمساك أبكر.'
          )}
        </p>
        <p>
          {t(
            'Ramadan’s first and last fasting days follow the decision observed by your community. Sahih al-Bukhari 1909 describes the crescent’s role in beginning and ending the month. The calendar here is a planning estimate; a local start-date entry records your choice and is not an independently verified announcement.',
            'يتبع أول أيام صيام رمضان وآخرها القرار المعتمد لدى جماعتك. يبيّن صحيح البخاري ١٩٠٩ دور رؤية الهلال في بداية الشهر ونهايته. التقويم هنا تقديري للتخطيط؛ وإدخال تاريخ بداية محلي يعكس اختيارك ولا يعني تحقق الأداة من الإعلان.'
          )}
        </p>
        <p>
          {t(
            'City timings are supplied by Aladhan for the city coordinates, timezone and prayer method. Check your mosque’s guidance, particularly for high latitudes or local adjustments. Missing times remain blank. Duration uses elapsed time, including clock changes. To use different daily times, open Suhoor & Iftar Times and choose the manual timetable.',
            'تأتي مواقيت المدن من خدمة الأذان حسب إحداثيات المدينة والمنطقة الزمنية وطريقة الصلاة. راجع توجيه مسجدك، خاصة في خطوط العرض العليا أو عند وجود تعديلات محلية. تظل المواقيت الناقصة بلا قيمة. تُحسب المدة الفعلية مع مراعاة تغيير الساعة. لإدخال مواقيت يومية مختلفة افتح أداة السحور والإفطار واختر الجدول اليدوي.'
          )}
        </p>
        <ul>
          <li>
            <a href="https://quran.com/2/187">
              {t('Quran 2:187 — fasting times', 'القرآن ٢:١٨٧ — وقت الصيام')}
            </a>
          </li>
          <li>
            <a href="https://sunnah.com/bukhari:1909">
              {t(
                'Sahih al-Bukhari 1909 — beginning and ending Ramadan',
                'صحيح البخاري ١٩٠٩ — بداية رمضان ونهايته'
              )}
            </a>
          </li>
          <li>
            <a href="https://aladhan.com/prayer-times-api">
              {t('Aladhan prayer-times service', 'خدمة الأذان لمواقيت الصلاة')}
            </a>
          </li>
        </ul>
      </section>
      <section className="space-y-5">
        <h2 className="text-2xl font-bold">{t('Common questions', 'أسئلة شائعة')}</h2>
        {copy.faqs.map((faq) => (
          <div key={faq.question}>
            <h3 className="font-semibold">{faq.question}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{faq.answer}</p>
          </div>
        ))}
      </section>
      <JsonLd
        data={{
          '@type': 'FAQPage',
          mainEntity: copy.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }}
      />
      <section className="print:hidden">
        <h2 className="mb-4 text-2xl font-bold">
          {t(
            city ? 'Ramadan in nearby cities' : 'Ramadan calendars by city',
            city ? 'رمضان في مدن أخرى' : 'تقويم رمضان حسب المدينة'
          )}
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {related.map((c) => (
            <li key={c.slug}>
              <Link className="underline" href={`${prefix}/ramadan-calendar/${c.slug}`}>
                {ar ? c.nameAr : c.name}
              </Link>
            </li>
          ))}
        </ul>
        {city && (
          <Link className="mt-4 inline-block underline" href={`${prefix}/ramadan-calendar`}>
            {t('All cities', 'كل المدن')}
          </Link>
        )}
      </section>
      <CrossToolLinks currentTool={ramadan ? 'ramadan-calendar' : 'fasting-times'} lang={lang} />
    </div>
  )
}
