export const quranPages = {
  fr: {
    title: 'Lire le Coran',
    metadataTitle: 'Lire le Coran — 114 sourates, traduction française et audio',
    description:
      'Lisez les 114 sourates en arabe avec leur traduction française, la récitation, les répétitions et les positions de lecture enregistrées. Aucun compte nécessaire.',
    intro:
      'Les 114 sourates, avec le texte arabe, la traduction française et la récitation. Lisez à votre rythme, répétez les versets et enregistrez votre position sans compte.',
    home: 'Accueil',
    quran: 'Coran',
    breadcrumb: 'Fil d’Ariane',
    surah: 'Sourate',
    verses: 'versets',
    adjacent: 'Sourates voisines',
    previous: 'Précédente :',
    next: 'Suivante :',
    suffix: 'Texte arabe, traduction française et audio',
    chapterIntro:
      'Lisez la sourate complète, écoutez sa récitation ou choisissez un court passage à répéter.',
    noScript:
      'Le texte complet est disponible ci-dessous. Activez JavaScript pour l’audio, les favoris et les réglages de lecture.',
    chapterDescription: (name: string, count: number) =>
      `Lisez les ${count} versets de la sourate ${name} en arabe avec la traduction française de Rachid Maach. Écoutez, répétez un passage et enregistrez des favoris et votre position.`,
  },
  de: {
    title: 'Den Koran lesen',
    metadataTitle: 'Koran lesen — 114 Suren, deutsche Übersetzung und Audio',
    description:
      'Lies alle 114 Suren auf Arabisch mit deutscher Übersetzung, Rezitation, Wiederholungen und gespeicherten Lesestellen. Kein Konto erforderlich.',
    intro:
      'Alle 114 Suren mit arabischem Text, deutscher Übersetzung und Rezitation. Lies in deinem Tempo, wiederhole Verse und speichere deine Stelle ohne Konto.',
    home: 'Startseite',
    quran: 'Koran',
    breadcrumb: 'Navigationspfad',
    surah: 'Sure',
    verses: 'Verse',
    adjacent: 'Benachbarte Suren',
    previous: 'Vorherige:',
    next: 'Nächste:',
    suffix: 'Arabischer Text, deutsche Übersetzung und Audio',
    chapterIntro:
      'Lies die vollständige Sure, höre ihre Rezitation oder wähle einen kurzen Bereich zum Wiederholen.',
    noScript:
      'Der vollständige Text ist unten verfügbar. Aktiviere JavaScript für Audio, Lesezeichen und Leseeinstellungen.',
    chapterDescription: (name: string, count: number) =>
      `Lies alle ${count} Verse der Sure ${name} auf Arabisch mit der deutschen Übersetzung des Rowwad Translation Center. Höre zu, wiederhole einen Bereich und speichere Lesezeichen und deine Stelle.`,
  },
}
