export const inheritanceUi: Record<string, Record<string, string>> = {
  fr: {
    'Sahih al-Bukhari 6736': 'Sahih al-Bukhari 6736',
    Amount: 'Montant',
    Bequests: 'Legs',
    'Bequests are limited to 1/3 after debts and funeral expenses':
      'Le modèle plafonne les legs au tiers après les dettes et frais funéraires.',
    'Clear all': 'Tout effacer',
    Currency: 'Devise',
    'Debts & Expenses': 'Dettes et frais',
    'Debts & Funeral Expenses': 'Dettes et frais funéraires',
    Deceased: 'Personne décédée',
    'Distributable Estate': 'Succession à répartir',
    Estate: 'Succession',
    Father: 'Père',
    Female: 'Femme',
    Heir: 'Héritier',
    Husband: 'Époux',
    Male: 'Homme',
    Mother: 'Mère',
    Wife: 'Épouse',
    'Quranic Ref': 'Référence coranique',
    'Select the gender of the deceased': 'Indiquez le sexe de la personne décédée',
    'Select which heirs are present and their count':
      'Indiquez les héritiers survivants et leur nombre',
    Share: 'Part',
    'Share Distribution': 'Répartition des parts',
    'Shares exceeded 100% and were proportionally reduced (Awl)':
      'Les parts dépassaient 100 % et ont été réduites proportionnellement (awl).',
    'Surplus redistributed proportionally to fixed-share heirs (Radd)':
      'Le reliquat a été redistribué proportionnellement selon le modèle de radd.',
    'Surviving Heirs': 'Héritiers survivants',
    'This calculator is for guidance only. Consult a qualified Islamic scholar for your specific case.':
      'Ce calculateur est indicatif. Consultez un spécialiste qualifié du droit successoral islamique pour votre situation.',
    'Total Estate': 'Succession totale',
    'Total Estate Value': 'Valeur totale de la succession',
    'Total estate value, debts, and bequests': 'Valeur totale, dettes et legs',
    Son: 'Fils',
    Sons: 'Fils',
    Daughter: 'Fille',
    Daughters: 'Filles',
    'Full Brother': 'Frère germain',
    'Full Brothers': 'Frères germains',
    'Full Sister': 'Sœur germaine',
    'Full Sisters': 'Sœurs germaines',
    Residual: 'Reliquat',
    'Quran 4:11': 'Coran 4:11',
    'Quran 4:12': 'Coran 4:12',
    'Quran 4:176': 'Coran 4:176',
  },
  de: {
    'Sahih al-Bukhari 6736': 'Sahih al-Buchari 6736',
    Amount: 'Betrag',
    Bequests: 'Vermächtnisse',
    'Bequests are limited to 1/3 after debts and funeral expenses':
      'Das Modell begrenzt Vermächtnisse auf ein Drittel nach Schulden und Bestattungskosten.',
    'Clear all': 'Alles löschen',
    Currency: 'Währung',
    'Debts & Expenses': 'Schulden und Kosten',
    'Debts & Funeral Expenses': 'Schulden und Bestattungskosten',
    Deceased: 'Verstorbene Person',
    'Distributable Estate': 'Zu verteilender Nachlass',
    Estate: 'Nachlass',
    Father: 'Vater',
    Female: 'Weiblich',
    Heir: 'Erbe',
    Husband: 'Ehemann',
    Male: 'Männlich',
    Mother: 'Mutter',
    Wife: 'Ehefrau',
    'Quranic Ref': 'Koranverweis',
    'Select the gender of the deceased': 'Wähle das Geschlecht der verstorbenen Person',
    'Select which heirs are present and their count':
      'Wähle die überlebenden Erben und ihre Anzahl',
    Share: 'Anteil',
    'Share Distribution': 'Verteilung der Anteile',
    'Shares exceeded 100% and were proportionally reduced (Awl)':
      'Die Anteile überstiegen 100 % und wurden proportional gekürzt (Awl).',
    'Surplus redistributed proportionally to fixed-share heirs (Radd)':
      'Der Rest wurde entsprechend dem Radd-Modell proportional zurückverteilt.',
    'Surviving Heirs': 'Überlebende Erben',
    'This calculator is for guidance only. Consult a qualified Islamic scholar for your specific case.':
      'Dieser Rechner dient der Orientierung. Wende dich für deinen konkreten Fall an eine qualifizierte Fachperson für islamisches Erbrecht.',
    'Total Estate': 'Gesamter Nachlass',
    'Total Estate Value': 'Gesamtwert des Nachlasses',
    'Total estate value, debts, and bequests': 'Gesamtwert, Schulden und Vermächtnisse',
    Son: 'Sohn',
    Sons: 'Söhne',
    Daughter: 'Tochter',
    Daughters: 'Töchter',
    'Full Brother': 'Vollbruder',
    'Full Brothers': 'Vollbrüder',
    'Full Sister': 'Vollschwester',
    'Full Sisters': 'Vollschwestern',
    Residual: 'Restanteil',
    'Quran 4:11': 'Koran 4:11',
    'Quran 4:12': 'Koran 4:12',
    'Quran 4:176': 'Koran 4:176',
  },
}
export const inheritanceHelp: Record<string, { invalid: string; group: string; residual: string }> =
  {
    en: {
      invalid:
        'Enter an estate above 0 and non-negative debts and bequests (maximum 1 trillion each).',
      group: 'Each row shows the total for that group of heirs, not the amount per person.',
      residual: 'Residual',
    },
    ar: {
      invalid: 'أدخل تركة أكبر من صفر وديوناً ووصايا غير سالبة (بحد أقصى تريليون لكل مبلغ).',
      group: 'يعرض كل صف مجموع نصيب مجموعة الورثة، وليس نصيب الفرد.',
      residual: 'الباقي',
    },
    fr: {
      invalid:
        'Saisissez une succession supérieure à 0 et des dettes et legs non négatifs (mille milliards au maximum par montant).',
      group:
        'Chaque ligne indique le total pour ce groupe d’héritiers, et non le montant par personne.',
      residual: 'Reliquat',
    },
    de: {
      invalid:
        'Gib einen Nachlass über 0 sowie nicht negative Schulden und Vermächtnisse ein (höchstens eine Billion je Betrag).',
      group:
        'Jede Zeile zeigt den Gesamtbetrag für diese Erbengruppe, nicht den Betrag pro Person.',
      residual: 'Restanteil',
    },
  }

export const inheritanceModel: Record<
  string,
  { scope: string; cap: string; unallocated: string; mixed: string; reference: string }
> = {
  en: {
    scope:
      'This simplified Sunni model covers one spouse, parents, children and full siblings only. It applies awl and returns surplus to eligible non-spouse heirs (radd). A remainder with only a spouse stays unallocated for specialist review. Other relatives and local inheritance law can change the outcome. Amounts are rounded to cents; any rounding cents are assigned to the largest fractional remainders.',
    cap: 'The requested bequest was capped at one third of the estate remaining after debts and funeral expenses.',
    unallocated: 'Unallocated remainder — specialist review needed',
    mixed: 'Fixed + residual',
    reference: 'Source',
  },
  ar: {
    scope:
      'يغطي هذا النموذج السني المبسط زوجاً واحداً أو زوجة واحدة، والوالدين، والأبناء والبنات، والأشقاء فقط. يطبق العول والرد على المستحقين غير الزوجين. يبقى الباقي عند وجود الزوج أو الزوجة وحده غير موزع لمراجعة مختص. قد يغير الورثة الآخرون والقانون المحلي النتيجة. تُقرب المبالغ إلى أجزاء المائة، وتُضاف فروق التقريب إلى أكبر البواقي الكسرية.',
    cap: 'حُددت الوصية المطلوبة بثلث ما بقي من التركة بعد الديون ومصاريف الجنازة.',
    unallocated: 'باقٍ غير موزع — يحتاج إلى مراجعة مختص',
    mixed: 'فرض وباقٍ',
    reference: 'المرجع',
  },
  fr: {
    scope:
      'Ce modèle sunnite simplifié couvre un conjoint, les parents, les enfants et les frères et sœurs germains. Il applique l’awl et le radd aux héritiers admissibles autres que le conjoint. Si seul un conjoint est présent, le reliquat reste non attribué pour examen spécialisé. Les autres parents et le droit local peuvent modifier le résultat. Les montants sont arrondis au centime ; les centimes résiduels sont attribués aux plus grands restes fractionnaires.',
    cap: 'Le legs demandé a été plafonné au tiers de la succession restante après les dettes et frais funéraires.',
    unallocated: 'Reliquat non attribué — examen spécialisé nécessaire',
    mixed: 'Part fixe + reliquat',
    reference: 'Référence',
  },
  de: {
    scope:
      'Dieses vereinfachte sunnitische Modell umfasst einen Ehepartner, Eltern, Kinder und Vollgeschwister. Es wendet Awl und Radd für berechtigte Erben außer dem Ehepartner an. Ist nur ein Ehepartner vorhanden, bleibt ein Rest zur fachkundigen Prüfung unverteilt. Andere Verwandte und örtliches Recht können das Ergebnis verändern. Beträge werden auf Cent gerundet; verbleibende Cent erhalten die größten Bruchreste.',
    cap: 'Das gewünschte Vermächtnis wurde auf ein Drittel des nach Schulden und Bestattungskosten verbleibenden Nachlasses begrenzt.',
    unallocated: 'Nicht verteilter Rest — fachkundige Prüfung erforderlich',
    mixed: 'Fester Anteil + Restanteil',
    reference: 'Quelle',
  },
}
