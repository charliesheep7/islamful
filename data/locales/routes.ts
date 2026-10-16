export const translatedContentPaths = [
  '/',
  '/blog',
  '/haram-check',
  '/fasting-times',
  '/ramadan-calendar',
  '/dhikr',
  '/dua',
  '/hijri-birthday',
  '/muslim-names',
  '/islamic-calendar',
  '/last-third-of-night',
  '/adhkar',
  '/quran',
  '/mission',
  '/support',
  '/privacy',
  '/terms',
  '/games',
  '/games/wudu-steps',
  '/games/salah-sequence',
  '/games/pillar-builder',
  '/games/prophet-stories-quiz',
  '/games/quran-verse-quiz',
  '/games/islamic-wordle',
  '/games/hadith-or-not',
  '/games/ayah-scramble',
  '/islamic-mortgage',
  '/answers',
  '/inheritance-calculator',
  '/adhkar/morning',
  '/adhkar/evening',
  '/adhkar/after-prayer',
  '/prayer-times',
  '/qibla-finder',
  '/names-of-allah',
  '/zakat-calculator',
  '/zakat-calculator/gold',
]

export const hasTranslatedContent = (path: string) =>
  translatedContentPaths.includes(path) ||
  path.startsWith('/prayer-times/') ||
  path.startsWith('/quran/') ||
  path.startsWith('/blog/') ||
  path.startsWith('/ramadan-calendar/')
