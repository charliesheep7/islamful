export const adhkarUi: Record<'fr' | 'de', Record<string, string>> = {
  fr: {
    'Prayer session': 'Session de prière',
    'Unassigned session': 'Session non attribuée',
    Fajr: 'Fajr',
    Dhuhr: 'Dhuhr',
    Asr: 'Asr',
    Maghrib: 'Maghrib',
    Isha: 'Isha',
    'Tasbih sequence': 'Formule de tasbih',
    '33 / 33 / 33 + tahlil': '33 / 33 / 33 + tahlil',
    '33 / 33 / 34': '33 / 33 / 34',
    'These are two narrated alternatives, not two required rounds. Each prayer and sequence has separate saved counts. Selecting a prayer does not record that you prayed it.':
      'Il s’agit de deux variantes rapportées, et non de deux séries à effectuer ensemble. Chaque prière et chaque formule ont leurs propres compteurs enregistrés. Choisir une prière ne signifie pas que vous l’avez accomplie.',
    'Routine progress': 'Progression des adhkar',
    'Marked complete:': 'Marqués comme terminés :',
    'Continue where I left off': 'Reprendre où je me suis arrêté',
    'Today on this device': 'Aujourd’hui sur cet appareil',
    'Counts stay in this browser and start fresh at your device’s local midnight. They are your manual record. No account is needed.':
      'Les compteurs restent dans ce navigateur et repartent à zéro à minuit selon l’heure locale de votre appareil. Ils reflètent vos saisies manuelles. Aucun compte n’est nécessaire.',
    'You have marked this selected routine complete. You can return to any card or start again.':
      'Vous avez marqué cette sélection comme terminée. Vous pouvez revenir à une fiche ou recommencer.',
    'This browser cannot save your counts. They remain available for this open session only.':
      'Ce navigateur ne peut pas enregistrer vos compteurs. Ils restent disponibles uniquement pendant cette session ouverte.',
    'English meanings': 'Sens en français',
    'Arabic size': 'Taille du texte arabe',
    Large: 'Grande',
    'Extra large': 'Très grande',
    'Reset this session': 'Réinitialiser cette session',
    'Clear every count in this session? Other sessions are kept.':
      'Effacer tous les compteurs de cette session ? Les autres sessions sont conservées.',
    'Confirm reset': 'Confirmer la réinitialisation',
    Cancel: 'Annuler',
    'Remembrance list': 'Liste des invocations',
    'Read once in this checklist. The source does not prescribe a repeated count here.':
      'Lisez une fois dans cette liste. La source n’indique pas de nombre de répétitions ici.',
    'Count one complete surah, not each verse.':
      'Comptez une sourate entière, et non chaque verset.',
    'Count reached': 'Nombre atteint',
    'I recited the surah': 'J’ai récité la sourate',
    'I recited once': 'J’ai récité une fois',
    'Undo one': 'Annuler une récitation',
    'Listen once': 'Écouter une fois',
    'Open in Quran reader': 'Ouvrir dans le lecteur du Coran',
  },
  de: {
    'Prayer session': 'Gebetssitzung',
    'Unassigned session': 'Nicht zugeordnete Sitzung',
    Fajr: 'Fajr',
    Dhuhr: 'Dhuhr',
    Asr: 'Asr',
    Maghrib: 'Maghrib',
    Isha: 'Ischa',
    'Tasbih sequence': 'Tasbih-Abfolge',
    '33 / 33 / 33 + tahlil': '33 / 33 / 33 + Tahlil',
    '33 / 33 / 34': '33 / 33 / 34',
    'These are two narrated alternatives, not two required rounds. Each prayer and sequence has separate saved counts. Selecting a prayer does not record that you prayed it.':
      'Dies sind zwei überlieferte Alternativen, keine zwei gemeinsam erforderlichen Durchgänge. Jedes Gebet und jede Abfolge haben eigene gespeicherte Zähler. Die Auswahl eines Gebets hält nicht fest, dass du es verrichtet hast.',
    'Routine progress': 'Fortschritt der Adhkar',
    'Marked complete:': 'Als abgeschlossen markiert:',
    'Continue where I left off': 'An letzter Stelle fortsetzen',
    'Today on this device': 'Heute auf diesem Gerät',
    'Counts stay in this browser and start fresh at your device’s local midnight. They are your manual record. No account is needed.':
      'Die Zähler bleiben in diesem Browser und beginnen um Mitternacht nach der Ortszeit deines Geräts neu. Sie sind deine manuelle Aufzeichnung. Ein Konto ist nicht erforderlich.',
    'You have marked this selected routine complete. You can return to any card or start again.':
      'Du hast diese ausgewählte Sammlung als abgeschlossen markiert. Du kannst zu jeder Karte zurückkehren oder neu beginnen.',
    'This browser cannot save your counts. They remain available for this open session only.':
      'Dieser Browser kann deine Zähler nicht speichern. Sie bleiben nur während dieser geöffneten Sitzung verfügbar.',
    'English meanings': 'Deutsche Bedeutungen',
    'Arabic size': 'Arabische Schriftgröße',
    Large: 'Groß',
    'Extra large': 'Sehr groß',
    'Reset this session': 'Diese Sitzung zurücksetzen',
    'Clear every count in this session? Other sessions are kept.':
      'Alle Zähler dieser Sitzung löschen? Andere Sitzungen bleiben erhalten.',
    'Confirm reset': 'Zurücksetzen bestätigen',
    Cancel: 'Abbrechen',
    'Remembrance list': 'Liste der Adhkar',
    'Read once in this checklist. The source does not prescribe a repeated count here.':
      'In dieser Checkliste einmal lesen. Die Quelle schreibt hier keine Wiederholungszahl vor.',
    'Count one complete surah, not each verse.': 'Zähle eine vollständige Sure, nicht jeden Vers.',
    'Count reached': 'Anzahl erreicht',
    'I recited the surah': 'Ich habe die Sure rezitiert',
    'I recited once': 'Ich habe einmal rezitiert',
    'Undo one': 'Eine Rezitation rückgängig machen',
    'Listen once': 'Einmal anhören',
    'Open in Quran reader': 'Im Koranleser öffnen',
  },
}
export const adhkarDynamic = {
  fr: {
    count: (title: string) => `Compter : ${title}`,
    undo: (title: string) => `Annuler : ${title}`,
    mark: (target: number, title: string) => `Marquer les ${target} récitations de ${title}`,
    recited: (target: number) => `J’ai déjà récité les ${target}`,
    sourceCount: (target: number) => `${target} récitations dans le récit cité.`,
  },
  de: {
    count: (title: string) => `Zählen: ${title}`,
    undo: (title: string) => `Rückgängig: ${title}`,
    mark: (target: number, title: string) => `Alle ${target} für ${title} markieren`,
    recited: (target: number) => `Ich habe bereits alle ${target} rezitiert`,
    sourceCount: (target: number) => `${target} Rezitationen in der angegebenen Überlieferung.`,
  },
}
