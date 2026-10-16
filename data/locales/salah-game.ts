export const salahArabic = [
  'قيام',
  'قراءة',
  'ركوع',
  'اعتدال',
  'سجود',
  'جلسة',
  'سجود',
  'تشهد',
  'تسليم',
] as const
export const salahGame = {
  en: {
    instruction:
      'Arrange the positions of salah in the correct sequence. Drag and drop or use arrows.',
    check: 'Check Sequence',
    shuffle: 'Shuffle',
    again: 'Play Again',
    success: 'Mashallah! You know the sequence of salah!',
    up: 'Move up',
    down: 'Move down',
    steps: [
      [
        'Standing (Qiyam)',
        'Stand upright facing the Qibla. Raise hands and say "Allahu Akbar" (Takbiratul Ihram).',
      ],
      [
        'Recitation (Qiraat)',
        'Recite Surah Al-Fatiha followed by another surah or verses from the Quran.',
      ],
      [
        'Bowing (Ruku)',
        'Bow down with hands on knees, back straight, saying "Subhana Rabbiyal Adheem."',
      ],
      [
        'Rising from Ruku',
        'Rise from bowing, saying "Sami Allahu liman hamidah, Rabbana lakal hamd."',
      ],
      [
        'First Prostration (Sujud)',
        'Prostrate with forehead, nose, palms, knees, and toes touching the ground. Say "Subhana Rabbiyal A\'la."',
      ],
      [
        'Sitting between Sujud',
        'Sit briefly between the two prostrations, saying "Rabbi ighfir li."',
      ],
      ['Second Prostration', 'Perform a second prostration the same as the first.'],
      [
        'Final Sitting (Tashahhud)',
        'Sit and recite At-Tahiyyat, Durood (salutations upon the Prophet), and dua.',
      ],
      [
        'Tasleem (Salaam)',
        'Turn head right then left saying "Assalamu alaikum wa rahmatullah" to end the prayer.',
      ],
    ],
  },
  ar: {
    instruction: 'رتّب وضعيات الصلاة بالتسلسل الصحيح. اسحب وأفلت أو استخدم الأسهم.',
    check: 'تحقق من التسلسل',
    shuffle: 'اخلط الخطوات',
    again: 'العب مجددًا',
    success: 'ما شاء الله! أنت تعرف تسلسل الصلاة!',
    up: 'انقل للأعلى',
    down: 'انقل للأسفل',
    steps: [
      ['القيام', 'قف مستقيمًا مستقبلًا القبلة. ارفع يديك وقل «الله أكبر» (تكبيرة الإحرام).'],
      ['القراءة', 'اقرأ سورة الفاتحة ثم سورة أخرى أو آيات من القرآن.'],
      ['الركوع', 'اركع واضعًا يديك على ركبتيك وظهرك مستقيم، وقل «سبحان ربي العظيم».'],
      ['الاعتدال من الركوع', 'ارفع من الركوع قائلًا «سمع الله لمن حمده، ربنا لك الحمد».'],
      [
        'السجدة الأولى',
        'اسجد بحيث تلامس الجبهة والأنف والكفان والركبتان وأصابع القدمين الأرض. قل «سبحان ربي الأعلى».',
      ],
      ['الجلوس بين السجدتين', 'اجلس قليلًا بين السجدتين وقل «رب اغفر لي».'],
      ['السجدة الثانية', 'اسجد مرة ثانية كما في السجدة الأولى.'],
      ['الجلوس الأخير (التشهد)', 'اجلس واقرأ التحيات والصلاة على النبي والدعاء.'],
      ['التسليم', 'أدر رأسك إلى اليمين ثم اليسار قائلًا «السلام عليكم ورحمة الله» لإنهاء الصلاة.'],
    ],
  },
  fr: {
    instruction:
      'Remettez les positions de la prière dans le bon ordre. Glissez-les ou utilisez les flèches.',
    check: 'Vérifier l’ordre',
    shuffle: 'Mélanger',
    again: 'Rejouer',
    success: 'Macha Allah ! Vous connaissez l’ordre des positions de la prière !',
    up: 'Monter',
    down: 'Descendre',
    steps: [
      [
        'La station debout (qiyam)',
        'Tenez-vous droit face à la qibla. Levez les mains et dites « Allahu Akbar » (takbir d’ouverture).',
      ],
      [
        'La récitation (qira’a)',
        'Récitez la sourate Al-Fatiha, puis une autre sourate ou des versets du Coran.',
      ],
      [
        'L’inclinaison (roukou‘)',
        'Inclinez-vous, les mains sur les genoux et le dos droit, en disant « Subhana Rabbiyal Adheem ».',
      ],
      [
        'Le redressement',
        'Redressez-vous après l’inclinaison en disant « Sami Allahu liman hamidah, Rabbana lakal hamd ».',
      ],
      [
        'La première prosternation (soudjoud)',
        'Prosternez-vous en posant le front, le nez, les paumes, les genoux et les orteils au sol. Dites « Subhana Rabbiyal A’la ».',
      ],
      [
        'L’assise entre les prosternations',
        'Asseyez-vous brièvement entre les deux prosternations en disant « Rabbi ighfir li ».',
      ],
      ['La deuxième prosternation', 'Effectuez une deuxième prosternation comme la première.'],
      [
        'L’assise finale (tachahhoud)',
        'Asseyez-vous et récitez At-Tahiyyat, les salutations sur le Prophète et une invocation.',
      ],
      [
        'Le salut final (taslim)',
        'Tournez la tête à droite puis à gauche en disant « Assalamu alaikum wa rahmatullah » pour terminer la prière.',
      ],
    ],
  },
  de: {
    instruction:
      'Bringe die Gebetshaltungen in die richtige Reihenfolge. Ziehe sie an die passende Stelle oder verwende die Pfeile.',
    check: 'Reihenfolge prüfen',
    shuffle: 'Mischen',
    again: 'Erneut spielen',
    success: 'Maschallah! Du kennst die Reihenfolge der Gebetshaltungen!',
    up: 'Nach oben',
    down: 'Nach unten',
    steps: [
      [
        'Stehen (Qiyam)',
        'Stehe aufrecht in Richtung Qibla. Hebe die Hände und sage „Allahu Akbar“ (Eröffnungstakbir).',
      ],
      [
        'Rezitation (Qira’a)',
        'Rezitiere die Sure Al-Fatiha und anschließend eine weitere Sure oder Verse aus dem Koran.',
      ],
      [
        'Verbeugung (Ruku)',
        'Verbeuge dich mit den Händen auf den Knien und geradem Rücken und sage „Subhana Rabbiyal Adheem“.',
      ],
      [
        'Aufrichten nach der Verbeugung',
        'Richte dich aus der Verbeugung auf und sage „Sami Allahu liman hamidah, Rabbana lakal hamd“.',
      ],
      [
        'Erste Niederwerfung (Sudschud)',
        'Wirf dich nieder, sodass Stirn, Nase, Handflächen, Knie und Zehen den Boden berühren. Sage „Subhana Rabbiyal A’la“.',
      ],
      [
        'Sitzen zwischen den Niederwerfungen',
        'Setze dich kurz zwischen die beiden Niederwerfungen und sage „Rabbi ighfir li“.',
      ],
      ['Zweite Niederwerfung', 'Führe eine zweite Niederwerfung wie die erste aus.'],
      [
        'Abschließendes Sitzen (Taschahhud)',
        'Setze dich und rezitiere At-Tahiyyat, die Segenswünsche für den Propheten und ein Bittgebet.',
      ],
      [
        'Abschlussgruß (Taslim)',
        'Drehe den Kopf nach rechts und dann nach links und sage „Assalamu alaikum wa rahmatullah“, um das Gebet zu beenden.',
      ],
    ],
  },
} as const
