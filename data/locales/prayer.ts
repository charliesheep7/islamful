export const prayerTranslations: Record<'fr' | 'de', Record<string, string>> = {
  fr: {
    City: 'Ville',
    Country: 'Pays',
    'Search calculation method': 'Méthode de calcul pour la recherche',
    'Show prayer times': 'Afficher les horaires',
    'Use approximate location': 'Utiliser ma position approximative',
    'Loading prayer times…': 'Chargement des horaires…',
    'Prayer time results': 'Résultats des horaires de prière',
    'Enter a city and country to see its local timetable.':
      'Saisissez une ville et un pays pour consulter les horaires locaux.',
    'Could not load prayer times. Check the city and country or try again. You can also use the city links below.':
      'Impossible de charger les horaires. Vérifiez la ville et le pays ou réessayez. Vous pouvez aussi utiliser les liens vers les villes ci-dessous.',
  },
  de: {
    City: 'Stadt',
    Country: 'Land',
    'Search calculation method': 'Berechnungsmethode für die Suche',
    'Show prayer times': 'Gebetszeiten anzeigen',
    'Use approximate location': 'Ungefähren Standort verwenden',
    'Loading prayer times…': 'Gebetszeiten werden geladen…',
    'Prayer time results': 'Ergebnisse der Gebetszeitensuche',
    'Enter a city and country to see its local timetable.':
      'Gib eine Stadt und ein Land ein, um den örtlichen Zeitplan zu sehen.',
    'Could not load prayer times. Check the city and country or try again. You can also use the city links below.':
      'Die Gebetszeiten konnten nicht geladen werden. Prüfe Stadt und Land oder versuche es erneut. Du kannst auch die Städte-Links unten verwenden.',
  },
}
export const prayerPageCopy = {
  fr: {
    title: 'Horaires de prière',
    description:
      'Consultez les horaires calculés du Fajr, Dhuhr, Asr, Maghrib et Isha pour votre ville, avec plusieurs méthodes de calcul.',
    intro:
      'Recherchez votre ville ou choisissez-la ci-dessous. Utilisez la méthode de calcul recommandée par votre mosquée.',
    cities: 'Horaires par ville',
    otherCities: 'Autres villes',
    allCities: 'Voir toutes les villes',
    home: 'Accueil',
    today: 'aujourd’hui',
    cityTitle: (name: string) => `Horaires de prière à ${name}`,
    ramadan: (name: string) => `Calendrier du Ramadan, souhour et iftar à ${name}`,
    about: (name: string) => `À propos des horaires de prière à ${name}`,
    coordinates: 'Coordonnées',
    method: 'Méthode de calcul',
    calculation:
      'Les horaires sont calculés à partir de la latitude et de la longitude de la ville. Ils changent chaque jour selon la position du soleil. Choisissez la méthode recommandée localement ; les horaires affichés indiquent le début de la prière, pas la prière en groupe.',
    regions: {
      'Middle East': 'Moyen-Orient',
      'North Africa': 'Afrique du Nord',
      'South & Southeast Asia': 'Asie du Sud et du Sud-Est',
      Turkey: 'Turquie',
      Europe: 'Europe',
      Americas: 'Amériques',
      'Africa & Oceania': 'Afrique et Océanie',
    },
    faqs: [
      {
        question: 'Quelles sont les cinq prières quotidiennes ?',
        answer:
          'Les cinq prières sont le Fajr (à l’aube, avant le lever du soleil), le Dhuhr (après le zénith), l’Asr (l’après-midi), le Maghrib (après le coucher du soleil) et l’Isha (après la disparition du crépuscule). La prière est l’un des cinq piliers de l’islam.',
      },
      {
        question: 'Comment les horaires sont-ils calculés ?',
        answer:
          'Ils dépendent de la position du soleil par rapport à votre emplacement. Les organismes islamiques utilisent des angles ou des intervalles différents pour le Fajr et l’Isha. Plusieurs méthodes sont proposées, dont la Ligue islamique mondiale, Oumm al-Qoura et l’ISNA. Suivez les indications de votre mosquée.',
      },
      {
        question: 'Pourquoi varient-ils selon le lieu ?',
        answer:
          'La latitude, la longitude et la saison modifient la position du soleil. Les horaires varient généralement moins près de l’équateur et davantage aux hautes latitudes. Certains horaires peuvent être indisponibles ; consultez alors un calendrier local plutôt que de supposer une heure.',
      },
    ],
  },
  de: {
    title: 'Gebetszeiten',
    description:
      'Prüfe die berechneten Zeiten für Fajr, Dhuhr, Asr, Maghrib und Ischa in deiner Stadt mit verschiedenen Berechnungsmethoden.',
    intro:
      'Suche deine Stadt oder wähle sie unten aus. Verwende die von deiner Moschee empfohlene Berechnungsmethode.',
    cities: 'Gebetszeiten nach Stadt',
    otherCities: 'Weitere Städte',
    allCities: 'Alle Städte ansehen',
    home: 'Startseite',
    today: 'heute',
    cityTitle: (name: string) => `Gebetszeiten in ${name}`,
    ramadan: (name: string) => `Ramadan-Kalender, Suhoor und Iftar in ${name}`,
    about: (name: string) => `Über die Gebetszeiten in ${name}`,
    coordinates: 'Koordinaten',
    method: 'Berechnungsmethode',
    calculation:
      'Die Zeiten werden anhand der geografischen Breite und Länge der Stadt berechnet. Sie ändern sich täglich mit dem Sonnenstand. Wähle die vor Ort empfohlene Methode; die angezeigten Zeiten bezeichnen den Gebetsbeginn, nicht das Gemeinschaftsgebet.',
    regions: {
      'Middle East': 'Naher Osten',
      'North Africa': 'Nordafrika',
      'South & Southeast Asia': 'Süd- und Südostasien',
      Turkey: 'Türkei',
      Europe: 'Europa',
      Americas: 'Amerika',
      'Africa & Oceania': 'Afrika und Ozeanien',
    },
    faqs: [
      {
        question: 'Welche fünf täglichen Gebete gibt es?',
        answer:
          'Die fünf Gebete sind Fajr (in der Morgendämmerung vor Sonnenaufgang), Dhuhr (nach dem Sonnenhöchststand), Asr (am Nachmittag), Maghrib (nach Sonnenuntergang) und Ischa (nach Ende der Abenddämmerung). Das Gebet ist eine der fünf Säulen des Islam.',
      },
      {
        question: 'Wie werden die Zeiten berechnet?',
        answer:
          'Sie richten sich nach dem Sonnenstand an deinem Standort. Islamische Organisationen verwenden für Fajr und Ischa unterschiedliche Winkel oder Zeitabstände. Es stehen mehrere Methoden zur Auswahl, darunter die Islamische Weltliga, Umm al-Qura und ISNA. Folge den Empfehlungen deiner Moschee.',
      },
      {
        question: 'Warum unterscheiden sich die Zeiten je nach Ort?',
        answer:
          'Breitengrad, Längengrad und Jahreszeit beeinflussen den Sonnenstand. Nahe dem Äquator schwanken die Zeiten meist weniger, in hohen Breitengraden stärker. Manche Zeiten können fehlen; prüfe dann einen örtlichen Zeitplan, statt eine Uhrzeit anzunehmen.',
      },
    ],
  },
}
