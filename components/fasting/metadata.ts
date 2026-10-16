import type { Locale } from '@/utils/locale'
import { cityLabel, countryLabel } from '@/utils/city-label'
import type { City } from '@/data/cities'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
export function fastingCityMetadata(city: City, lang: Locale) {
  const ar = lang === 'ar'
  return genPageMetadata({
    title:
      lang === 'fr'
        ? `Calendrier du Ramadan à ${cityLabel(city, lang)} — Suhoor et Iftar`
        : lang === 'de'
          ? `Ramadan-Kalender für ${cityLabel(city, lang)} — Suhur und Iftar`
          : ar
            ? `تقويم رمضان في ${city.nameAr} — السحور والإفطار`
            : `Ramadan Calendar in ${city.name} — Suhoor & Iftar Times`,
    description:
      lang === 'fr'
        ? `Horaires du Fajr et du Maghrib pour ${cityLabel(city, lang)}, ${countryLabel(city, lang)}. Choisissez la méthode de calcul et les dates locales, puis téléchargez le calendrier.`
        : lang === 'de'
          ? `Fajr- und Maghrib-Zeiten für ${cityLabel(city, lang)}, ${countryLabel(city, lang)}. Wähle die Berechnungsmethode und örtlichen Ramadan-Daten und lade den Kalender herunter.`
          : ar
            ? `جدول الفجر والمغرب لرمضان في ${city.nameAr}، ${city.countryAr}. اختر طريقة الحساب وتواريخ رمضان المحلية ونزّل الجدول.`
            : `Ramadan Fajr and Maghrib timetable for ${city.name}, ${city.country}. Choose your calculation method, enter local Ramadan dates and download the schedule.`,
    alternates: buildLanguageAlternates(`/ramadan-calendar/${city.slug}`, {
      currentLanguage: lang,
    }),
  })
}
