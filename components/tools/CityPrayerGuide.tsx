import type { City } from '@/data/cities'
import {
  PRAYER_METHODS,
  ARABIC_PRAYER_METHODS,
  FRENCH_PRAYER_METHODS,
  GERMAN_PRAYER_METHODS,
} from '@/data/prayer-methods'
import { cityLabel } from '@/utils/city-label'
import type { Locale } from '@/utils/locale'
import RelatedReading from '@/components/seo/RelatedReading'

export default function CityPrayerGuide({ city, lang = 'en' }: { city: City; lang?: Locale }) {
  const name = cityLabel(city, lang)
  const method = {
    en: PRAYER_METHODS,
    ar: ARABIC_PRAYER_METHODS,
    fr: FRENCH_PRAYER_METHODS,
    de: GERMAN_PRAYER_METHODS,
  }[lang][String(city.method)]
  const copy = {
    en: {
      title: `Using the ${name} prayer timetable`,
      zone: 'Local time zone',
      method: 'Default calculation method',
      time: `Times use ${city.timezone}, including its seasonal clock changes where applicable. Check the date shown in the timetable, especially when travelling across time zones.`,
      difference: 'Why can mosque times differ?',
      detail:
        'Calculation methods and the Asr setting can produce different times. These are calculated prayer start times, not a mosque’s congregation (iqamah) schedule. Compare the method and Asr setting with your local mosque before following its timetable.',
      night:
        'Planning Tahajjud? Use the night calculator with the same local Maghrib and next-day Fajr times.',
    },
    ar: {
      title: `استخدام جدول الصلاة في ${name}`,
      zone: 'المنطقة الزمنية المحلية',
      method: 'طريقة الحساب الافتراضية',
      time: `تُعرض الأوقات وفق ${city.timezone} مع التغييرات الموسمية للساعة حيث تُطبّق. تحقّق من تاريخ الجدول، خاصة عند السفر بين مناطق زمنية مختلفة.`,
      difference: 'لماذا قد تختلف أوقات المسجد؟',
      detail:
        'قد تختلف النتائج باختلاف طريقة الحساب وإعداد العصر. هذه أوقات محسوبة لدخول الصلاة وليست مواعيد إقامة الجماعة في المسجد. قارن طريقة الحساب وإعداد العصر بجدول مسجدك المحلي.',
      night: 'لتخطيط التهجد، استخدم حاسبة الليل مع وقت المغرب المحلي وفجر اليوم التالي نفسيهما.',
    },
    fr: {
      title: `Utiliser les horaires de prière à ${name}`,
      zone: 'Fuseau horaire local',
      method: 'Méthode de calcul par défaut',
      time: `Les heures suivent ${city.timezone}, avec les changements saisonniers applicables. Vérifiez la date du tableau, surtout lorsque vous voyagez entre plusieurs fuseaux horaires.`,
      difference: 'Pourquoi les horaires de la mosquée peuvent-ils différer ?',
      detail:
        'La méthode de calcul et le réglage de Asr peuvent modifier les résultats. Il s’agit des débuts calculés des prières, pas des horaires de prière en groupe (iqama). Comparez ces paramètres avec ceux de votre mosquée.',
      night:
        'Pour le tahajjud, utilisez le calculateur de nuit avec les mêmes heures locales de Maghrib et du Fajr du lendemain.',
    },
    de: {
      title: `Gebetszeiten für ${name} verwenden`,
      zone: 'Lokale Zeitzone',
      method: 'Standardberechnungsmethode',
      time: `Die Zeiten verwenden ${city.timezone} einschließlich geltender saisonaler Zeitumstellungen. Prüfe das Datum der Tabelle, besonders bei Reisen zwischen Zeitzonen.`,
      difference: 'Warum können Moscheezeiten abweichen?',
      detail:
        'Berechnungsmethode und Asr-Einstellung können unterschiedliche Ergebnisse liefern. Dies sind berechnete Gebetsbeginnzeiten, keine Zeiten für das Gemeinschaftsgebet (Iqama). Vergleiche diese Einstellungen mit dem Plan deiner Moschee.',
      night:
        'Verwende für Tahajjud den Nachtrechner mit denselben lokalen Maghrib- und Fajr-Zeiten des folgenden Morgens.',
    },
  }[lang]
  return (
    <>
      <section className="mt-10 space-y-4 rounded-xl border border-gray-200 p-5 dark:border-gray-700">
        <h2 className="text-xl font-semibold">{copy.title}</h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-gray-500">{copy.zone}</dt>
            <dd dir="ltr">{city.timezone}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">{copy.method}</dt>
            <dd>{method}</dd>
          </div>
        </dl>
        <p>{copy.time}</p>
        <h3 className="font-semibold">{copy.difference}</h3>
        <p>{copy.detail}</p>
        <p>{copy.night}</p>
      </section>
      <RelatedReading path={`/prayer-times/${city.slug}`} lang={lang} />
    </>
  )
}
