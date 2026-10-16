import type { Tool } from '@/data/tools'
const translations: Record<'fr' | 'de', Record<string, [string, string]>> = {
  fr: {
    'fasting-times': [
      'Horaires du souhour et de l’iftar',
      'Trouvez le Fajr et le Maghrib pour votre ville ou saisissez votre horaire local, avec un compte à rebours.',
    ],
    'ramadan-calendar': [
      'Calendrier du Ramadan',
      'Préparez et téléchargez les horaires de jeûne de votre ville avec des dates calculées ou saisies localement.',
    ],
    'last-third-of-night': [
      'Planifier votre nuit',
      'Calculez le dernier tiers de la nuit, le milieu de la nuit islamique et le Fajr selon votre ville ou votre horaire local.',
    ],
    answers: [
      'Réponses du Coran',
      'Découvrez un verset du Coran pour nourrir votre réflexion et créez une carte à partager.',
    ],
    'prayer-times': [
      'Horaires de prière',
      'Consultez les horaires calculés du Fajr, Dhuhr, Asr, Maghrib et Isha pour votre ville.',
    ],
    'haram-check': [
      'Vérification halal',
      'Explorez les informations sur le caractère halal ou haram d’un aliment, d’un ingrédient ou d’une activité.',
    ],
    quran: ['Coran', 'Lisez et écoutez le Coran et retrouvez votre progression de lecture.'],
    dua: [
      'Recueil d’invocations',
      'Découvrez des invocations pour le quotidien, avec texte arabe, translittération et sens.',
    ],
    adhkar: ['Adhkar quotidiens', 'Suivez les évocations du matin, du soir et après la prière.'],
    dhikr: [
      'Compteur de dhikr',
      'Comptez vos évocations quotidiennes avec un compteur de tasbih simple.',
    ],
    'names-of-allah': ['Les 99 noms d’Allah', 'Découvrez les noms d’Allah et leur sens.'],
    'islamic-calendar': [
      'Calendrier hégirien',
      'Convertissez les dates hégiriennes et grégoriennes et consultez les événements islamiques.',
    ],
    'zakat-calculator/gold': [
      'Calculateur de zakat sur l’or',
      'Calculez la zakat de votre or selon les carats, le prix et le seuil de nissab choisis.',
    ],
    'zakat-calculator': [
      'Calculateur de zakat',
      'Estimez votre zakat à partir de vos biens et du seuil de nissab.',
    ],
    'qibla-finder': [
      'Direction de la Qibla',
      'Trouvez la direction de la Kaaba depuis votre position.',
    ],
    'inheritance-calculator': [
      'Calculateur d’héritage',
      'Explorez une estimation des parts successorales selon les héritiers indiqués.',
    ],
    'muslim-names': ['Prénoms musulmans', 'Explorez des prénoms musulmans et leur signification.'],
    'islamic-mortgage': [
      'Calculateur de financement immobilier islamique',
      'Comparez des estimations de mensualités pour un financement immobilier islamique.',
    ],
    'hijri-birthday': [
      'Anniversaire hégirien',
      'Retrouvez votre date d’anniversaire dans le calendrier hégirien.',
    ],
  },
  de: {
    'fasting-times': [
      'Suhoor- und Iftar-Zeiten',
      'Finde Fajr und Maghrib für deine Stadt oder gib deinen örtlichen Zeitplan ein, mit Countdown.',
    ],
    'ramadan-calendar': [
      'Ramadan-Kalender',
      'Plane und lade den Fastenzeitplan deiner Stadt mit berechneten oder örtlich eingegebenen Daten herunter.',
    ],
    'last-third-of-night': [
      'Deine Nacht planen',
      'Berechne das letzte Nachtdrittel, die islamische Mitternacht und Fajr für deine Stadt oder deinen örtlichen Zeitplan.',
    ],
    answers: [
      'Antworten aus dem Koran',
      'Entdecke einen Koranvers zum Nachdenken und erstelle eine Karte zum Teilen.',
    ],
    'prayer-times': [
      'Gebetszeiten',
      'Prüfe die berechneten Zeiten für Fajr, Dhuhr, Asr, Maghrib und Ischa in deiner Stadt.',
    ],
    'haram-check': [
      'Halal-Prüfung',
      'Informiere dich über die Halal- oder Haram-Einordnung von Lebensmitteln, Zutaten und Aktivitäten.',
    ],
    quran: [
      'Koran',
      'Lies und höre den Koran und setze an deiner gespeicherten Leseposition fort.',
    ],
    dua: [
      'Bittgebete',
      'Entdecke Bittgebete für den Alltag mit arabischem Text, Umschrift und Bedeutung.',
    ],
    adhkar: ['Tägliche Adhkar', 'Folge den Gedenkformeln am Morgen, am Abend und nach dem Gebet.'],
    dhikr: [
      'Dhikr-Zähler',
      'Zähle deine täglichen Gedenkformeln mit einem einfachen Tasbih-Zähler.',
    ],
    'names-of-allah': ['Die 99 Namen Allahs', 'Entdecke die Namen Allahs und ihre Bedeutung.'],
    'islamic-calendar': [
      'Islamischer Kalender',
      'Rechne zwischen Hidschri- und gregorianischen Daten um und entdecke islamische Ereignisse.',
    ],
    'zakat-calculator/gold': [
      'Gold-Zakat-Rechner',
      'Berechne die Zakat auf dein Gold anhand von Karat, Preis und gewählter Nisab-Grenze.',
    ],
    'zakat-calculator': [
      'Zakat-Rechner',
      'Schätze deine Zakat anhand deines Vermögens und der Nisab-Grenze.',
    ],
    'qibla-finder': ['Qibla-Richtung', 'Finde von deinem Standort aus die Richtung zur Kaaba.'],
    'inheritance-calculator': [
      'Erbschaftsrechner',
      'Erhalte eine Schätzung der Erbanteile anhand der angegebenen Erben.',
    ],
    'muslim-names': ['Muslimische Vornamen', 'Entdecke muslimische Vornamen und ihre Bedeutung.'],
    'islamic-mortgage': [
      'Rechner für islamische Immobilienfinanzierung',
      'Vergleiche geschätzte Monatsraten einer islamischen Immobilienfinanzierung.',
    ],
    'hijri-birthday': ['Hidschri-Geburtstag', 'Finde deinen Geburtstag im islamischen Kalender.'],
  },
}
export function translatedTool(tool: Tool, locale: string) {
  const pair = locale === 'fr' || locale === 'de' ? translations[locale][tool.slug] : undefined
  return {
    name: pair?.[0] || (locale === 'ar' ? tool.nameAr : tool.name),
    description: pair?.[1] || (locale === 'ar' ? tool.descriptionAr : tool.description),
  }
}
