import type { Locale } from './locale'
// Use explicit UTC date parts and fixed month names so Node and browser ICU versions
// cannot produce different Arabic numerals during hydration.
const months = {
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  ar: [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ],
  fr: [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ],
  de: [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ],
}
export function formatBlogDate(value: string, locale: Locale) {
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return ''
  const day = date.getUTCDate(),
    year = date.getUTCFullYear(),
    month = months[locale][date.getUTCMonth()]
  const text =
    locale === 'en'
      ? `${month} ${day}, ${year}`
      : `${day}${locale === 'de' ? '.' : ''} ${month} ${year}`
  return locale === 'ar' ? text.replace(/[0-9]/g, (digit) => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]) : text
}
