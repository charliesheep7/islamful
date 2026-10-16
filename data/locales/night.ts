export const nightTranslations: Record<'fr' | 'de', Record<string, string>> = {
  fr: {
    'Your entered timetable': 'Vos horaires saisis',
    'Use a city or your own timetable': 'Choisissez une ville ou saisissez vos horaires',
    'Input method': 'Mode de saisie',
    'City prayer times': 'Horaires d’une ville',
    'Enter Maghrib and Fajr': 'Saisir Maghrib et Fajr',
    City: 'Ville',
    'Calculation method': 'Méthode de calcul',
    'Time zone (for example Europe/London)': 'Fuseau horaire (par exemple Europe/Paris)',
    'Time zone': 'Fuseau horaire',
    'Maghrib on the selected date': 'Maghrib à la date choisie',
    Maghrib: 'Maghrib',
    'Fajr the following morning': 'Fajr du lendemain matin',
    'Next morning Fajr': 'Fajr du lendemain',
    'Night beginning on': 'Nuit commençant le',
    'The selected evening’s Maghrib to the next morning’s Fajr. After midnight, choose yesterday for the night still in progress.':
      'Du Maghrib du soir choisi au Fajr du lendemain matin. Après minuit, choisissez la veille pour la nuit encore en cours.',
    'Calculating…': 'Calcul en cours…',
    'Calculate my night': 'Calculer les horaires de ma nuit',
    'We could not calculate this night. Check the date, time zone and both times, or try manual entry if city times are unavailable. Clock-change times that are missing or ambiguous cannot be used.':
      'Impossible de calculer cette nuit. Vérifiez la date, le fuseau et les deux horaires, ou saisissez-les manuellement si ceux de la ville sont indisponibles. Les heures inexistantes ou ambiguës lors d’un changement d’heure ne peuvent pas être utilisées.',
    'Your night results': 'Résultats de votre nuit',
    'Your night at a glance': 'Votre nuit en un coup d’œil',
    'Islamic midnight (night midpoint)': 'Minuit islamique (milieu de la nuit)',
    'Last third begins': 'Début du dernier tiers',
    'Fajr — night ends': 'Fajr — fin de la nuit',
    'This night has ended. Choose another date above.':
      'Cette nuit est terminée. Choisissez une autre date ci-dessus.',
    'The last third is now in progress.': 'Le dernier tiers de la nuit est en cours.',
    'Next prayer': 'Prochaine prière',
    'Download calendar event': 'Télécharger l’événement du calendrier',
    'The calendar event covers this one last-third window. It does not set an alarm or repeat on later nights.':
      'L’événement couvre uniquement le dernier tiers de cette nuit. Il ne crée pas d’alarme et ne se répète pas les nuits suivantes.',
  },
  de: {
    'Your entered timetable': 'Deine eingegebenen Zeiten',
    'Use a city or your own timetable': 'Wähle eine Stadt oder gib deine eigenen Zeiten ein',
    'Input method': 'Eingabemethode',
    'City prayer times': 'Gebetszeiten einer Stadt',
    'Enter Maghrib and Fajr': 'Maghrib und Fajr eingeben',
    City: 'Stadt',
    'Calculation method': 'Berechnungsmethode',
    'Time zone (for example Europe/London)': 'Zeitzone (zum Beispiel Europe/Berlin)',
    'Time zone': 'Zeitzone',
    'Maghrib on the selected date': 'Maghrib am gewählten Datum',
    Maghrib: 'Maghrib',
    'Fajr the following morning': 'Fajr am nächsten Morgen',
    'Next morning Fajr': 'Fajr am nächsten Morgen',
    'Night beginning on': 'Nacht beginnend am',
    'The selected evening’s Maghrib to the next morning’s Fajr. After midnight, choose yesterday for the night still in progress.':
      'Vom Maghrib des gewählten Abends bis zum Fajr am nächsten Morgen. Wähle nach Mitternacht das gestrige Datum für die noch laufende Nacht.',
    'Calculating…': 'Wird berechnet…',
    'Calculate my night': 'Meine Nacht berechnen',
    'We could not calculate this night. Check the date, time zone and both times, or try manual entry if city times are unavailable. Clock-change times that are missing or ambiguous cannot be used.':
      'Diese Nacht konnte nicht berechnet werden. Prüfe Datum, Zeitzone und beide Uhrzeiten oder gib sie manuell ein, falls die Stadtzeiten nicht verfügbar sind. Nicht vorhandene oder mehrdeutige Uhrzeiten bei einer Zeitumstellung können nicht verwendet werden.',
    'Your night results': 'Ergebnisse für deine Nacht',
    'Your night at a glance': 'Deine Nacht auf einen Blick',
    'Islamic midnight (night midpoint)': 'Islamische Mitternacht (Mitte der Nacht)',
    'Last third begins': 'Beginn des letzten Drittels',
    'Fajr — night ends': 'Fajr — Ende der Nacht',
    'This night has ended. Choose another date above.':
      'Diese Nacht ist vorbei. Wähle oben ein anderes Datum.',
    'The last third is now in progress.': 'Das letzte Drittel der Nacht hat begonnen.',
    'Next prayer': 'Nächstes Gebet',
    'Download calendar event': 'Kalendertermin herunterladen',
    'The calendar event covers this one last-third window. It does not set an alarm or repeat on later nights.':
      'Der Kalendertermin umfasst nur das letzte Drittel dieser einen Nacht. Er stellt keinen Wecker und wiederholt sich nicht in späteren Nächten.',
  },
}
export const nightPages = {
  fr: {
    title: 'Calculateur du dernier tiers de la nuit',
    description:
      'Planifiez vos prières nocturnes : trouvez le dernier tiers, le minuit islamique et le Fajr à partir de votre ville ou de vos horaires locaux.',
    calculationTitle: 'Comment le dernier tiers est-il calculé ?',
    calculation:
      'Nous mesurons le temps écoulé entre Maghrib et le Fajr suivant. Le milieu de la nuit se situe à la moitié de cet intervalle ; le dernier tiers commence aux deux tiers. Le minuit islamique n’est pas forcément à 00:00. La nuit se termine au Fajr, et non au lever du soleil.',
    example:
      'Par exemple, un Maghrib à 18:00 et un Fajr à 06:00 donnent une nuit de 12 heures si l’heure ne change pas. Son milieu est à 00:00 et son dernier tiers commence à 02:00. Les nuits de changement d’heure, ce calculateur utilise la durée réelle dans le fuseau choisi.',
    tahajjudTitle: 'Le tahajjud se limite-t-il au dernier tiers ?',
    tahajjud:
      'La prière nocturne s’accomplit après Isha et avant Fajr ; elle ne se limite pas au dernier tiers. Le tahajjud désigne généralement une prière après avoir dormi. Sahih al-Boukhari 1145 décrit le mérite de l’invocation dans le dernier tiers. Le milieu indiqué ici est un calcul, et non une règle universelle sur la fin du temps d’Isha ; les précisions juridiques varient.',
    sourcesTitle: 'Sources et limites du calcul',
    limits:
      'Les horaires des villes proviennent d’Aladhan selon la méthode choisie. Les débuts des prières ne sont pas les horaires de prière en groupe. Les méthodes de Fajr peuvent différer, particulièrement aux hautes latitudes. Suivez les recommandations de votre mosquée ou saisissez des horaires locaux fiables. Si Maghrib ou Fajr est indisponible, aucun horaire de remplacement n’est inventé.',
    sources: [
      'Département jordanien de l’Iftaa : calcul du dernier tiers',
      'Sahih al-Boukhari 1145',
      'Explication de la période de prière nocturne',
      'Service Aladhan des horaires de prière',
    ],
    prayer: 'Consulter les horaires de prière quotidiens',
  },
  de: {
    title: 'Rechner für das letzte Drittel der Nacht',
    description:
      'Plane dein Nachtgebet: Ermittle das letzte Drittel, die islamische Mitternacht und Fajr anhand deiner Stadt oder deines örtlichen Zeitplans.',
    calculationTitle: 'Wie wird das letzte Drittel berechnet?',
    calculation:
      'Wir messen die verstrichene Zeit von Maghrib bis zum folgenden Fajr. Die Nachtmitte liegt bei der Hälfte dieses Zeitraums; das letzte Drittel beginnt nach zwei Dritteln. Die islamische Mitternacht ist nicht unbedingt um 00:00 Uhr. Die Nacht endet bei Fajr, nicht bei Sonnenaufgang.',
    example:
      'Zum Beispiel ergeben Maghrib um 18:00 Uhr und Fajr um 06:00 Uhr eine zwölfstündige Nacht, wenn sich die Uhrzeit nicht ändert. Ihre Mitte liegt um 00:00 Uhr und ihr letztes Drittel beginnt um 02:00 Uhr. In Nächten mit Zeitumstellung verwendet dieser Rechner die tatsächlich verstrichene Zeit in der gewählten Zeitzone.',
    tahajjudTitle: 'Ist Tahadschud auf das letzte Drittel beschränkt?',
    tahajjud:
      'Das Nachtgebet wird nach Ischa und vor Fajr verrichtet; es ist nicht auf das letzte Drittel beschränkt. Tahadschud bezeichnet üblicherweise das Gebet nach dem Schlafen. Sahih al-Bukhari 1145 beschreibt den Vorzug des Bittgebets im letzten Drittel. Die hier angegebene Nachtmitte ist eine Berechnung und keine allgemeingültige Regel zum Ende der Ischa-Zeit; die gelehrten Erläuterungen unterscheiden sich.',
    sourcesTitle: 'Quellen und Berechnungsgrenzen',
    limits:
      'Die Stadtzeiten stammen von Aladhan und verwenden deine gewählte Berechnungsmethode. Gebetsbeginn und Gemeinschaftsgebetszeit sind nicht dasselbe. Fajr-Methoden können besonders in hohen Breitengraden abweichen. Folge den Hinweisen deiner örtlichen Moschee oder gib einen verlässlichen örtlichen Zeitplan ein. Fehlt Maghrib oder Fajr, wird keine Ersatzzeit erfunden.',
    sources: [
      'Jordanische Iftaa-Behörde: Berechnung des letzten Drittels',
      'Sahih al-Bukhari 1145',
      'Erläuterung des Zeitraums für das Nachtgebet',
      'Aladhan-Gebetszeitendienst',
    ],
    prayer: 'Tägliche Gebetszeiten ansehen',
  },
}
