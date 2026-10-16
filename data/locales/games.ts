import type { Game } from '@/data/games'
const catalog: Record<'fr' | 'de', Record<string, [string, string]>> = {
  fr: {
    'islamic-wordle': [
      'Mot islamique du jour',
      'Devinez le terme islamique en six essais. Un nouveau mot chaque jour.',
    ],
    'quran-verse-quiz': [
      'Quiz des versets du Coran',
      'Retrouvez la sourate d’un verset et testez vos connaissances du Coran.',
    ],
    'wudu-steps': [
      'Étapes des ablutions',
      'Placez les étapes des ablutions dans le bon ordre pour apprendre.',
    ],
    'salah-sequence': [
      'Ordre de la prière',
      'Remettez les positions de la prière dans le bon ordre.',
    ],
    'prophet-stories-quiz': [
      'Quiz sur les prophètes',
      'Testez vos connaissances sur les prophètes mentionnés dans le Coran.',
    ],
    'pillar-builder': [
      'Les piliers de l’islam',
      'Associez les cinq piliers de l’islam à leur description et à leurs conditions.',
    ],
    'hadith-or-not': ['Hadith ou non ?', 'Distinguez les hadiths des textes qui n’en sont pas.'],
    'ayah-scramble': [
      'Versets à remettre en ordre',
      'Remettez les mots d’un verset du Coran dans le bon ordre.',
    ],
  },
  de: {
    'islamic-wordle': [
      'Islamisches Worträtsel',
      'Errate den islamischen Begriff in sechs Versuchen. Jeden Tag ein neues Wort.',
    ],
    'quran-verse-quiz': [
      'Koranvers-Quiz',
      'Erkenne die Sure eines Verses und teste dein Koranwissen.',
    ],
    'wudu-steps': [
      'Schritte der Gebetswaschung',
      'Bringe die Schritte der Gebetswaschung zum Lernen in die richtige Reihenfolge.',
    ],
    'salah-sequence': ['Gebetsreihenfolge', 'Ordne die Positionen des Gebets richtig an.'],
    'prophet-stories-quiz': [
      'Propheten-Quiz',
      'Teste dein Wissen über die im Koran genannten Propheten.',
    ],
    'pillar-builder': [
      'Die Säulen des Islam',
      'Ordne den fünf Säulen des Islam ihre Beschreibungen und Voraussetzungen zu.',
    ],
    'hadith-or-not': ['Hadith oder nicht?', 'Unterscheide Hadithe von Texten, die keine sind.'],
    'ayah-scramble': [
      'Koranverse ordnen',
      'Bringe die Wörter eines Koranverses in die richtige Reihenfolge.',
    ],
  },
}
export function translatedGame(game: Game, locale: string) {
  const pair = locale === 'fr' || locale === 'de' ? catalog[locale][game.slug] : undefined
  return {
    name: pair?.[0] || (locale === 'ar' ? game.nameAr : game.name),
    description: pair?.[1] || (locale === 'ar' ? game.descriptionAr : game.description),
  }
}
