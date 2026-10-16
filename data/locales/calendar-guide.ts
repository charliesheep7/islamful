export const calendarGuides = {
  fr: {
    title: 'Comprendre et utiliser le calendrier hégirien',
    intro:
      'Utilisez le convertisseur pour planifier et comparer, puis consultez les autorités locales de confiance pour les dates des pratiques religieuses. Les calculs s’effectuent dans le navigateur après le chargement de la page. Vos préférences sont enregistrées localement, sans demander la position de votre appareil.',
    methodTitle: 'Méthode et sources',
    method:
      'La conversion utilise les calendriers du navigateur (Intl) et vérifie que la méthode choisie est disponible, sans la remplacer silencieusement. La plage grégorienne va de 1900 à 2100. Les dates calculées d’Umm al-Qura ne constituent pas un relevé des annonces locales d’observation lunaire.',
    sources: [
      'Documentation Unicode ICU sur les calendriers et les dates',
      'Boukhari 1909 : observation lunaire',
      'Boukhari 2017 : rechercher Laylat al-Qadr',
      'Tirmidhi 761 : les jours blancs',
      'Muslim 1141a : les jours de Tachriq',
    ],
    prayer: 'Horaires de prière de votre ville',
    night: 'Planifier votre nuit',
    questions: [
      [
        'Comment convertir une date hégirienne en date grégorienne ?',
        'Choisissez Hégirien vers grégorien, saisissez l’année, le mois et le jour, puis sélectionnez Convertir la date. Le résultat indique la date grégorienne de la journée et la veille au soir, dont le coucher du soleil marque le début de sa nuit islamique. Les dates invalides, notamment le 30 d’un mois de 29 jours, sont refusées.',
      ],
      [
        'Pourquoi deux calendriers hégiriens peuvent-ils afficher des dates différentes ?',
        'Umm al-Qura et le calendrier islamique civil tabulaire sont deux calendriers calculés différents. Les décisions locales d’observation lunaire peuvent différer des deux. Choisissez la méthode et, si nécessaire, un léger ajustement des jours pour correspondre à votre calendrier local de confiance. Un ajustement ne confirme pas une observation lunaire.',
      ],
      [
        'La date change-t-elle à minuit ou au coucher du soleil ?',
        'L’outil utilise le fuseau choisi pour déterminer le jour civil et l’actualise après minuit. Il affiche aussi séparément la nuit à venir. Les nuits islamiques commencent au coucher du soleil local. Cette page ne vous localise pas et ne détecte pas le coucher du soleil ; elle ne prétend donc pas changer automatiquement la date religieuse à Maghrib.',
      ],
      [
        'Ce calendrier peut-il confirmer le Ramadan, l’Aïd ou Laylat al-Qadr ?',
        'Non. Les dates importantes sont des estimations de planification selon la méthode choisie. Suivez les annonces locales appropriées pour le Ramadan et l’Aïd. Laylat al-Qadr se recherche durant les dix dernières nuits ; ce calendrier ne présente pas la 27e nuit comme une date confirmée.',
      ],
      [
        'Le jeûne est-il toujours recommandé les 13, 14 et 15 du mois ?',
        'Non. Un numéro de jour n’est pas un avis religieux personnel sur le jeûne. La pratique des jours blancs repose sur un hadith, mais les jours de Tachriq font l’objet de restrictions particulières. Le calendrier marque des dates sans recommander automatiquement le jeûne tous les 13, 14 et 15.',
      ],
      [
        'Que contient le téléchargement des dates ?',
        'Le fichier .ics contient les prochaines dates affichées sous forme d’événements grégoriens sur une journée entière. Leur description précise la méthode et l’ajustement. Ce ne sont ni des annonces en direct, ni des mises à jour récurrentes, ni des alarmes automatiques. Vérifiez les annonces locales et modifiez les dates importées si nécessaire.',
      ],
    ],
  },
  de: {
    title: 'Den Hidschri-Kalender verstehen und nutzen',
    intro:
      'Nutze den Umrechner zum Planen und Vergleichen. Orientiere dich bei religiösen Terminen an vertrauenswürdigen örtlichen Stellen. Nach dem Laden der Seite erfolgen die Berechnungen im Browser. Deine Einstellungen werden lokal gespeichert; der Gerätestandort wird nicht abgefragt.',
    methodTitle: 'Methode und Quellen',
    method:
      'Die Umrechnung verwendet die Kalenderunterstützung des Browsers (Intl) und prüft, ob die gewählte Methode verfügbar ist, statt unbemerkt eine andere zu verwenden. Der gregorianische Bereich reicht von 1900 bis 2100. Berechnete Umm-al-Qura-Daten sind keine Aufzeichnung örtlicher Mondsichtungsbekanntgaben.',
    sources: [
      'Unicode-ICU-Dokumentation zu Kalendern und Datumsangaben',
      'Bukhari 1909: Mondsichtung',
      'Bukhari 2017: Laylat al-Qadr suchen',
      'Tirmidhi 761: die weißen Tage',
      'Muslim 1141a: die Tage von Taschriq',
    ],
    prayer: 'Gebetszeiten für deine Stadt',
    night: 'Deine Nacht planen',
    questions: [
      [
        'Wie rechne ich ein Hidschri-Datum in ein gregorianisches Datum um?',
        'Wähle Hidschri zu gregorianisch, gib Jahr, Monat und Tag ein und wähle Datum umrechnen. Das Ergebnis zeigt das gregorianische Tagesdatum und den Vorabend, an dessen Sonnenuntergang die zugehörige islamische Nacht beginnt. Ungültige Daten, etwa Tag 30 in einem Monat mit 29 Tagen, werden abgelehnt.',
      ],
      [
        'Warum können zwei Hidschri-Kalender unterschiedliche Daten anzeigen?',
        'Umm al-Qura und der tabellarische islamische Zivilkalender sind unterschiedliche berechnete Kalender. Örtliche Mondsichtungsentscheidungen können von beiden abweichen. Wähle die Methode und bei Bedarf eine kleine Tagesanpassung, die deinem vertrauenswürdigen örtlichen Kalender entspricht. Eine Anpassung bestätigt keine Mondsichtung.',
      ],
      [
        'Wechselt das Datum um Mitternacht oder bei Sonnenuntergang?',
        'Das Werkzeug bestimmt den bürgerlichen Tag anhand deiner gewählten Zeitzone und aktualisiert ihn nach Mitternacht. Es zeigt die kommende Nacht gesondert. Islamische Nächte beginnen beim örtlichen Sonnenuntergang. Diese Seite ermittelt weder deinen Standort noch den Sonnenuntergang und beansprucht daher nicht, das aktuelle religiöse Datum bei Maghrib automatisch umzustellen.',
      ],
      [
        'Kann dieser Kalender Ramadan, Eid oder Laylat al-Qadr bestätigen?',
        'Nein. Die wichtigen Daten sind Planungsschätzungen nach der gewählten Berechnungsmethode. Beachte für Ramadan und Eid die zuständigen örtlichen Bekanntgaben. Laylat al-Qadr wird in den letzten zehn Nächten gesucht; dieser Kalender bezeichnet die 27. Nacht nicht als bestätigten Termin.',
      ],
      [
        'Wird am 13., 14. und 15. immer zum Fasten geraten?',
        'Nein. Eine Tagesnummer im Kalender ist keine persönliche religiöse Fastenauskunft. Die Praxis der weißen Tage hat eine Grundlage im Hadith; für die Tage von Taschriq gelten jedoch besondere Fastenbeschränkungen. Dieser Kalender markiert Daten, ohne automatisch an jedem 13., 14. und 15. zum Fasten zu raten.',
      ],
      [
        'Was enthält der Download der Daten?',
        'Die .ics-Datei enthält die angezeigten kommenden Daten als ganztägige gregorianische Ereignisse. In den Beschreibungen stehen Berechnungsmethode und Anpassung. Es handelt sich nicht um aktuelle Bekanntgaben, wiederkehrende Aktualisierungen oder automatische Alarme. Prüfe örtliche Bekanntgaben und passe importierte Daten bei Bedarf an.',
      ],
    ],
  },
}
