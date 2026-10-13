import type { City } from '@/data/cities'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
export function fastingCityMetadata(city: City, lang: 'en' | 'ar') {
  const ar = lang === 'ar'
  return genPageMetadata({
    title: ar
      ? `تقويم رمضان في ${city.nameAr} — السحور والإفطار`
      : `Ramadan Calendar in ${city.name} — Suhoor & Iftar Times`,
    description: ar
      ? `جدول الفجر والمغرب لرمضان في ${city.nameAr}، ${city.countryAr}. اختر طريقة الحساب وتواريخ رمضان المحلية ونزّل الجدول.`
      : `Ramadan Fajr and Maghrib timetable for ${city.name}, ${city.country}. Choose your calculation method, enter local Ramadan dates and download the schedule.`,
    alternates: buildLanguageAlternates(`/ramadan-calendar/${city.slug}`, {
      currentLanguage: lang,
    }),
  })
}
