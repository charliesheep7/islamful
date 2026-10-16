import type { City } from '@/data/cities'
import type { Locale } from './locale'
const cityNames: Record<string, Partial<Record<Locale, string>>> = {
  mecca: { fr: 'La Mecque', de: 'Mekka' },
  medina: { fr: 'Médine', de: 'Medina' },
  cairo: { fr: 'Le Caire', de: 'Kairo' },
  london: { fr: 'Londres', de: 'London' },
  paris: { fr: 'Paris', de: 'Paris' },
  munich: { fr: 'Munich', de: 'München' },
  vienna: { fr: 'Vienne', de: 'Wien' },
  cologne: { fr: 'Cologne', de: 'Köln' },
  moscow: { fr: 'Moscou', de: 'Moskau' },
  brussels: { fr: 'Bruxelles', de: 'Brüssel' },
  rome: { fr: 'Rome', de: 'Rom' },
  lisbon: { fr: 'Lisbonne', de: 'Lissabon' },
  athens: { fr: 'Athènes', de: 'Athen' },
  beijing: { fr: 'Pékin', de: 'Peking' },
  algiers: { fr: 'Alger', de: 'Algier' },
}
export function cityLabel(city: City, locale: Locale) {
  return locale === 'ar' ? city.nameAr : cityNames[city.slug]?.[locale] || city.name
}
export function countryLabel(city: City, locale: Locale) {
  return locale === 'ar'
    ? city.countryAr
    : new Intl.DisplayNames([locale], { type: 'region' }).of(city.countryCode) || city.country
}
