// Order tools by the task the visitor is already doing, not catalog insertion order.
export function relatedToolSlugs(pathname: string): string[] {
  const path = pathname.replace(/^\/(en|ar|fr|de)(?=\/|$)/, '').split(/[?#]/)[0]
  if (/tahajjud|last-third|qiyam|witr/.test(path))
    return ['last-third-of-night', 'prayer-times', 'qibla-finder', 'quran']
  if (/zakat|nisab|inheritance|mortgage/.test(path))
    return [
      'zakat-calculator/gold',
      'zakat-calculator',
      'inheritance-calculator',
      'islamic-calendar',
    ]
  if (/fast|ramadan|kaffarah|fidya/.test(path))
    return ['fasting-times', 'ramadan-calendar', 'islamic-calendar', 'dua']
  if (/dua|adhkar|dhikr/.test(path)) return ['dua', 'adhkar', 'dhikr', 'quran']
  if (/quran|surah|memorize|games/.test(path)) return ['quran', 'adhkar', 'dhikr', 'prayer-times']
  if (/haram|halal|lobster|sushi/.test(path))
    return ['haram-check', 'prayer-times', 'qibla-finder', 'quran']
  if (/prayer|salah|wudu|ghusl|qibla/.test(path))
    return ['prayer-times', 'qibla-finder', 'last-third-of-night', 'adhkar']
  return ['prayer-times', 'quran', 'adhkar', 'qibla-finder']
}
