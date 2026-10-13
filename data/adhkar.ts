export type RoutineId = 'morning' | 'evening' | 'after-prayer'
export type TasbihVariant = '33-tahlil' | '34'
export type DhikrEntry = {
  id: string
  title: string
  titleAr: string
  arabic?: string
  meaning?: string
  surah?: number
  target: number
  countedInSource: boolean
  source: string
  sourceAr: string
  href: string
  grade?: string
  gradeAr?: string
}
export const routines = [
  {
    id: 'morning' as const,
    title: 'Morning Adhkar',
    titleAr: 'أذكار الصباح',
    description:
      'Begin the day with sourced remembrance, readable Arabic, English meanings and a counter that saves your place.',
    descriptionAr: 'ابدأ يومك بأذكار موثقة، مع نص عربي واضح ومعاني إنجليزية وعداد يحفظ تقدمك.',
  },
  {
    id: 'evening' as const,
    title: 'Evening Adhkar',
    titleAr: 'أذكار المساء',
    description:
      'Make room for evening remembrance with sourced Arabic texts, meanings and progress you can resume.',
    descriptionAr:
      'خصص وقتًا لأذكار المساء مع النصوص العربية والمصادر والمعاني وتقدم يمكنك استئنافه.',
  },
  {
    id: 'after-prayer' as const,
    title: 'Adhkar After Prayer',
    titleAr: 'أذكار بعد الصلاة',
    description:
      'Read and count remembrance after salah, choose a narrated tasbih sequence and keep each prayer session separate.',
    descriptionAr:
      'اقرأ أذكار ما بعد الصلاة وعدّها، واختر صيغة تسبيح مأثورة واحفظ تقدم كل صلاة على حدة.',
  },
]
const source = (id: string, en: string, ar: string, grade?: string, gradeAr?: string) => ({
  href: `https://sunnah.com/${id}`,
  source: en,
  sourceAr: ar,
  grade,
  gradeAr,
})
const sayyid: DhikrEntry = {
  id: 'sayyid-istighfar',
  title: 'Sayyid al-Istighfar',
  titleAr: 'سيد الاستغفار',
  target: 1,
  countedInSource: false,
  arabic:
    'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي، فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
  meaning:
    'Allah, You are my Lord and my Creator; I worship You alone. I am Your servant and keep Your covenant as far as I can. Protect me from the wrong I have done. I acknowledge Your favour and my sin. Grant me forgiveness, which only You can give.',
  ...source('bukhari:6306', 'Sahih al-Bukhari 6306', 'صحيح البخاري ٦٣٠٦'),
}
const protection: DhikrEntry = {
  id: 'bismillah-protection',
  title: 'Remembering Allah’s name',
  titleAr: 'بسم الله الذي لا يضر',
  target: 3,
  countedInSource: true,
  arabic:
    'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
  meaning:
    'In Allah’s name, with whose name nothing on earth or in heaven can cause harm. He hears all and knows all.',
  ...source(
    'abudawud:5088',
    'Sunan Abi Dawud 5088',
    'سنن أبي داود ٥٠٨٨',
    'Sahih — al-Albani',
    'صحيح — الألباني'
  ),
}
const wellbeing: DhikrEntry = {
  id: 'wellbeing',
  title: 'Asking for pardon and wellbeing',
  titleAr: 'سؤال العفو والعافية',
  target: 1,
  countedInSource: false,
  arabic:
    'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي',
  meaning:
    'Allah, grant me wellbeing here and in the life to come. Pardon and protect me in my faith, daily affairs, family and possessions. Cover my faults and calm my fears. Guard me from every direction; by Your greatness, protect me from harm beneath me.',
  ...source(
    'abudawud:5074',
    'Sunan Abi Dawud 5074',
    'سنن أبي داود ٥٠٧٤',
    'Sahih — al-Albani',
    'صحيح — الألباني'
  ),
}
const knower: DhikrEntry = {
  id: 'knower',
  title: 'Seeking refuge from evil',
  titleAr: 'الاستعاذة من الشر',
  target: 1,
  countedInSource: false,
  arabic:
    'اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ',
  meaning:
    'Allah, You know the unseen and the seen and created the heavens and earth. You rule and own everything. I testify that You alone deserve worship. Protect me from my own evil and from Satan’s evil and his call to associate partners with You.',
  ...source(
    'tirmidhi:3392',
    'Jami at-Tirmidhi 3392',
    'جامع الترمذي ٣٣٩٢',
    'Hasan sahih — at-Tirmidhi',
    'حسن صحيح — الترمذي'
  ),
}
export const tahlilText =
  'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ'
const tahlilMeaning =
  'Allah alone deserves worship, without partner. All dominion and praise belong to Him, and His power encompasses everything.'
function surahs(after: boolean): DhikrEntry[] {
  return [
    { id: 'ikhlas', title: 'Surah Al-Ikhlas', titleAr: 'سورة الإخلاص', surah: 112 },
    { id: 'falaq', title: 'Surah Al-Falaq', titleAr: 'سورة الفلق', surah: 113 },
    { id: 'nas', title: 'Surah An-Nas', titleAr: 'سورة الناس', surah: 114 },
  ].map((c) => ({
    ...c,
    target: after ? 1 : 3,
    countedInSource: !after,
    ...(after
      ? source(
          'abudawud:1523',
          'Sunan Abi Dawud 1523',
          'سنن أبي داود ١٥٢٣',
          'Sahih — al-Albani',
          'صحيح — الألباني'
        )
      : source(
          'abudawud:5082',
          'Sunan Abi Dawud 5082',
          'سنن أبي داود ٥٠٨٢',
          'Hasan — al-Albani',
          'حسن — الألباني'
        )),
  }))
}
export function tasbihEntries(variant: TasbihVariant): DhikrEntry[] {
  const src =
    variant === '34'
      ? source('muslim:596a', 'Sahih Muslim 596a', 'صحيح مسلم ٥٩٦ أ')
      : source('muslim:597a', 'Sahih Muslim 597a', 'صحيح مسلم ٥٩٧ أ')
  const entries: DhikrEntry[] = [
    {
      id: 'tasbih',
      title: 'SubhanAllah',
      titleAr: 'سبحان الله',
      arabic: 'سُبْحَانَ اللَّهِ',
      meaning: 'Allah is free from every imperfection.',
      target: 33,
      countedInSource: true,
      ...src,
    },
    {
      id: 'tahmid',
      title: 'Alhamdulillah',
      titleAr: 'الحمد لله',
      arabic: 'الْحَمْدُ لِلَّهِ',
      meaning: 'Every praise belongs to Allah.',
      target: 33,
      countedInSource: true,
      ...src,
    },
    {
      id: 'takbir',
      title: 'Allahu Akbar',
      titleAr: 'الله أكبر',
      arabic: 'اللَّهُ أَكْبَرُ',
      meaning: 'Allah is greater than all.',
      target: variant === '34' ? 34 : 33,
      countedInSource: true,
      ...src,
    },
  ]
  if (variant === '33-tahlil')
    entries.push({
      id: 'tahlil',
      title: 'Complete the hundred',
      titleAr: 'تمام المائة',
      arabic: tahlilText,
      meaning: tahlilMeaning,
      target: 1,
      countedInSource: true,
      ...src,
    })
  return entries
}
export function routineEntries(id: RoutineId, variant: TasbihVariant = '33-tahlil'): DhikrEntry[] {
  if (id === 'after-prayer')
    return [
      {
        id: 'istighfar',
        title: 'Ask Allah’s forgiveness',
        titleAr: 'الاستغفار',
        arabic: 'أَسْتَغْفِرُ اللَّهَ',
        meaning: 'I ask Allah to forgive me.',
        target: 3,
        countedInSource: true,
        ...source('muslim:591', 'Sahih Muslim 591', 'صحيح مسلم ٥٩١'),
      },
      {
        id: 'peace',
        title: 'Allahumma anta as-Salam',
        titleAr: 'اللهم أنت السلام',
        arabic:
          'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ ذَا الْجَلَالِ وَالْإِكْرَامِ',
        meaning:
          'Allah, You are Peace and the source of peace. Blessed are You, Lord of majesty and honour.',
        target: 1,
        countedInSource: false,
        ...source('muslim:591', 'Sahih Muslim 591', 'صحيح مسلم ٥٩١'),
      },
      {
        id: 'none-withhold',
        title: 'To Allah belongs all giving',
        titleAr: 'اللهم لا مانع لما أعطيت',
        arabic:
          tahlilText +
          '، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ وَلَا مُعْطِيَ لِمَا مَنَعْتَ وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
        meaning:
          tahlilMeaning +
          ' Allah, none can hold back Your gifts or give what You withhold. Wealth and status cannot benefit their owner against You.',
        target: 1,
        countedInSource: false,
        ...source('muslim:593a', 'Sahih Muslim 593a', 'صحيح مسلم ٥٩٣ أ'),
      },
      ...tasbihEntries(variant),
      ...surahs(true),
    ]
  const morning = id === 'morning'
  return [
    ...surahs(false),
    sayyid,
    {
      id: 'by-you',
      title: morning ? 'Entering the morning' : 'Entering the evening',
      titleAr: morning ? 'اللهم بك أصبحنا' : 'اللهم بك أمسينا',
      target: 1,
      countedInSource: false,
      arabic: morning
        ? 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ'
        : 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَى وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
      meaning: morning
        ? 'Allah, through You we reach morning and evening; through You we live and die, and to You we will be raised.'
        : 'Allah, through You we reach evening and morning; through You we live and die, and to You we return.',
      ...(morning
        ? source(
            'abudawud:5068',
            'Sunan Abi Dawud 5068',
            'سنن أبي داود ٥٠٦٨',
            'Sahih — al-Albani',
            'صحيح — الألباني'
          )
        : source(
            'ibnmajah:3868',
            'Sunan Ibn Majah 3868',
            'سنن ابن ماجه ٣٨٦٨',
            'Sahih — Darussalam',
            'صحيح — دار السلام'
          )),
    },
    {
      id: 'sovereignty',
      title: morning ? 'A new day in Allah’s dominion' : 'An evening in Allah’s dominion',
      titleAr: morning ? 'أصبحنا وأصبح الملك لله' : 'أمسينا وأمسى الملك لله',
      target: 1,
      countedInSource: false,
      arabic:
        (morning ? 'أَصْبَحْنَا وَأَصْبَحَ' : 'أَمْسَيْنَا وَأَمْسَى') +
        ' الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، ' +
        tahlilText +
        '، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي ' +
        (morning ? 'هَذَا الْيَوْمِ' : 'هَذِهِ اللَّيْلَةِ') +
        (morning
          ? ' وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي '
          : ' وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي ') +
        (morning ? 'هَذَا الْيَوْمِ' : 'هَذِهِ اللَّيْلَةِ') +
        (morning ? ' وَشَرِّ مَا بَعْدَهُ' : ' وَشَرِّ مَا بَعْدَهَا') +
        '، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
      meaning: `We have reached ${morning ? 'morning' : 'evening'}, and all dominion belongs to Allah, to whom we give praise. ${tahlilMeaning} My Lord, grant me the good of this ${morning ? 'day' : 'night'} and what follows, and guard me from their evil. Protect me from laziness, the hardships of old age, and punishment in the Fire and the grave.`,
      ...source('muslim:2723b', 'Sahih Muslim 2723b', 'صحيح مسلم ٢٧٢٣ ب'),
    },
    protection,
    wellbeing,
    knower,
    {
      id: 'subhan-bihamdih',
      title: 'SubhanAllahi wa bihamdih',
      titleAr: 'سبحان الله وبحمده',
      arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
      meaning: 'Allah is free from imperfection; I glorify Him with praise.',
      target: 100,
      countedInSource: true,
      ...source('muslim:2692', 'Sahih Muslim 2692', 'صحيح مسلم ٢٦٩٢'),
    },
    morning
      ? {
          id: 'creation',
          title: 'Praise beyond counting',
          titleAr: 'سبحان الله وبحمده عدد خلقه',
          arabic:
            'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ',
          meaning:
            'I glorify Allah with praise as abundant as His creation, as befits His pleasure, as weighty as His Throne, and as boundless as the ink for His words.',
          target: 3,
          countedInSource: true,
          ...source('muslim:2726a', 'Sahih Muslim 2726a', 'صحيح مسلم ٢٧٢٦ أ'),
        }
      : {
          id: 'perfect-words',
          title: 'Refuge in Allah’s perfect words',
          titleAr: 'الاستعاذة بكلمات الله التامات',
          arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
          meaning: 'I seek shelter in Allah’s perfect words against the evil of His creation.',
          target: 3,
          countedInSource: true,
          ...source(
            'tirmidhi:3604b',
            'Jami at-Tirmidhi 3604b',
            'جامع الترمذي ٣٦٠٤ ب',
            'Sahih — Darussalam; at-Tirmidhi calls it hasan',
            'صحيح — دار السلام؛ قال الترمذي: حسن'
          ),
        },
  ]
}
