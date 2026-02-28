export interface Dua {
  id: number
  category: string
  categoryAr: string
  arabic: string
  transliteration: string
  translation: string
  translationAr: string
  source: string
}

export const categories = [
  { id: 'morning', name: 'Morning', nameAr: 'أذكار الصباح' },
  { id: 'evening', name: 'Evening', nameAr: 'أذكار المساء' },
  { id: 'prayer', name: 'Prayer', nameAr: 'الصلاة' },
  { id: 'food', name: 'Food & Drink', nameAr: 'الطعام والشراب' },
  { id: 'travel', name: 'Travel', nameAr: 'السفر' },
  { id: 'sleep', name: 'Sleep', nameAr: 'النوم' },
  { id: 'home', name: 'Home', nameAr: 'المنزل' },
  { id: 'mosque', name: 'Mosque', nameAr: 'المسجد' },
  { id: 'distress', name: 'Distress', nameAr: 'الكرب والضيق' },
  { id: 'protection', name: 'Protection', nameAr: 'الحماية' },
  { id: 'general', name: 'General', nameAr: 'عامة' },
]

const duas: Dua[] = [
  // === Morning ===
  {
    id: 1,
    category: 'morning',
    categoryAr: 'أذكار الصباح',
    arabic:
      'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration:
      "Asbahna wa asbahal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku walahul-hamd, wahuwa 'ala kulli shay'in qadeer",
    translation:
      'We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.',
    translationAr: 'دعاء الصباح - الحمد والملك لله',
    source: 'Abu Dawud 4:317',
  },
  {
    id: 2,
    category: 'morning',
    categoryAr: 'أذكار الصباح',
    arabic:
      'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    transliteration:
      'Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namootu, wa ilaykan-nushoor',
    translation:
      'O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die, and unto You is our resurrection.',
    translationAr: 'اللهم بك أصبحنا وبك أمسينا',
    source: 'At-Tirmidhi 5:466',
  },
  {
    id: 3,
    category: 'morning',
    categoryAr: 'أذكار الصباح',
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي',
    transliteration:
      "Allahumma inni as'alukal-'afiyah fid-dunya wal-akhirah. Allahumma inni as'alukal-'afwa wal-'afiyah fi deeni wa dunyaya wa ahli wa maali",
    translation:
      'O Allah, I ask You for well-being in this world and the next. O Allah, I ask You for pardon and well-being in my religious and worldly affairs, and my family and my wealth.',
    translationAr: 'اللهم إني أسألك العافية في الدنيا والآخرة',
    source: 'Abu Dawud 4:316, Ibn Majah 2:332',
  },
  {
    id: 4,
    category: 'morning',
    categoryAr: 'أذكار الصباح',
    arabic:
      'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration:
      "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-Samee'ul-'Aleem",
    translation:
      'In the Name of Allah, with whose Name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
    translationAr: 'بسم الله الذي لا يضر مع اسمه شيء',
    source: 'Abu Dawud 4:323, At-Tirmidhi 5:465',
  },
  {
    id: 5,
    category: 'morning',
    categoryAr: 'أذكار الصباح',
    arabic:
      'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    transliteration:
      "Radheetu billahi rabba, wa bil-islami deena, wa bi-Muhammadin sallallahu 'alayhi wa sallama nabiyya",
    translation:
      'I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad (peace be upon him) as my Prophet.',
    translationAr: 'رضيت بالله ربا وبالإسلام دينا وبمحمد نبيا',
    source: 'Abu Dawud 4:318',
  },

  // === Evening ===
  {
    id: 6,
    category: 'evening',
    categoryAr: 'أذكار المساء',
    arabic:
      'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration:
      "Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku walahul-hamd, wahuwa 'ala kulli shay'in qadeer",
    translation:
      'We have reached the evening and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah alone, without partner.',
    translationAr: 'دعاء المساء - الحمد والملك لله',
    source: 'Abu Dawud 4:317',
  },
  {
    id: 7,
    category: 'evening',
    categoryAr: 'أذكار المساء',
    arabic:
      'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    transliteration:
      'Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namootu, wa ilaykal-maseer',
    translation:
      'O Allah, by Your leave we have reached the evening, by Your leave we have reached the morning, by Your leave we live and die, and unto You is our return.',
    translationAr: 'اللهم بك أمسينا وبك أصبحنا',
    source: 'At-Tirmidhi 5:466',
  },
  {
    id: 8,
    category: 'evening',
    categoryAr: 'أذكار المساء',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'oodhu bi kalimatil-lahit-tammati min sharri ma khalaq",
    translation:
      'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    translationAr: 'أعوذ بكلمات الله التامات من شر ما خلق',
    source: 'Muslim 4:2081',
  },

  // === Prayer ===
  {
    id: 9,
    category: 'prayer',
    categoryAr: 'الصلاة',
    arabic:
      'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ، اللَّهُمَّ نَقِّنِي مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ',
    transliteration:
      "Allahumma ba'id bayni wa bayna khatayaya kama ba'adta baynal-mashriqi wal-maghrib. Allahumma naqqini minal-khataya kama yunaqqa-thawbul-abyadu minad-danas",
    translation:
      'O Allah, distance me from my sins as You have distanced the east from the west. O Allah, purify me from my sins as a white garment is purified from filth.',
    translationAr: 'اللهم باعد بيني وبين خطاياي',
    source: 'Bukhari 1:181, Muslim 1:419',
  },
  {
    id: 10,
    category: 'prayer',
    categoryAr: 'الصلاة',
    arabic:
      'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration:
      "Rabbana atina fid-dunya hasanah, wa fil-akhirati hasanah, wa qina 'adhaban-nar",
    translation:
      'Our Lord, give us in this world that which is good and in the Hereafter that which is good, and protect us from the punishment of the Fire.',
    translationAr: 'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة',
    source: 'Quran 2:201',
  },
  {
    id: 11,
    category: 'prayer',
    categoryAr: 'الصلاة',
    arabic:
      'اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ، وَارْحَمْنِي، إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ',
    transliteration:
      "Allahumma inni dhalamtu nafsi dhulman katheera, wa la yaghfirudh-dhunooba illa anta, faghfir li maghfiratan min 'indika, warhamni, innaka antal-Ghafoor-ur-Raheem",
    translation:
      'O Allah, I have greatly wronged myself, and none forgives sins but You. Grant me forgiveness from You and have mercy on me. You are the Forgiving, the Merciful.',
    translationAr: 'اللهم إني ظلمت نفسي ظلمًا كثيرًا',
    source: 'Bukhari 8:168, Muslim 4:2078',
  },

  // === Food & Drink ===
  {
    id: 12,
    category: 'food',
    categoryAr: 'الطعام والشراب',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translation: 'In the Name of Allah.',
    translationAr: 'قبل الطعام',
    source: 'Abu Dawud 3:347, At-Tirmidhi 4:288',
  },
  {
    id: 13,
    category: 'food',
    categoryAr: 'الطعام والشراب',
    arabic:
      'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration:
      "Alhamdu lillahil-ladhi at'amani hadha wa razaqaneehi min ghayri hawlin minni wa la quwwah",
    translation:
      'All praise is for Allah who fed me this and provided it for me without any might or power from myself.',
    translationAr: 'بعد الطعام',
    source: 'Abu Dawud 4:207, At-Tirmidhi 5:507',
  },
  {
    id: 14,
    category: 'food',
    categoryAr: 'الطعام والشراب',
    arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَأَطْعِمْنَا خَيْرًا مِنْهُ',
    transliteration: "Allahumma barik lana feehi wa at'imna khayran minhu",
    translation: 'O Allah, bless it for us and feed us something better than it.',
    translationAr: 'عند شرب اللبن',
    source: 'At-Tirmidhi 5:506',
  },

  // === Travel ===
  {
    id: 15,
    category: 'travel',
    categoryAr: 'السفر',
    arabic:
      'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration:
      'Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrineen. Wa inna ila Rabbina lamunqaliboon',
    translation:
      'Glory to Him who has subjected this to us, and we could never have it by our efforts. And unto our Lord we shall return.',
    translationAr: 'دعاء السفر',
    source: 'Quran 43:13-14, Muslim 2:978',
  },
  {
    id: 16,
    category: 'travel',
    categoryAr: 'السفر',
    arabic:
      'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى',
    transliteration:
      "Allahumma inna nas'aluka fi safarina hadhal-birra wat-taqwa, wa minal-'amali ma tarda",
    translation:
      'O Allah, we ask You in this journey for righteousness, piety, and deeds that please You.',
    translationAr: 'اللهم إنا نسألك في سفرنا هذا البر والتقوى',
    source: 'Muslim 2:978',
  },

  // === Sleep ===
  {
    id: 17,
    category: 'sleep',
    categoryAr: 'النوم',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amootu wa ahya',
    translation: 'In Your Name, O Allah, I die and I live.',
    translationAr: 'دعاء النوم',
    source: 'Bukhari 11:113',
  },
  {
    id: 18,
    category: 'sleep',
    categoryAr: 'النوم',
    arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
    transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
    translation: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants.',
    translationAr: 'اللهم قني عذابك يوم تبعث عبادك',
    source: 'Abu Dawud 4:311',
  },
  {
    id: 19,
    category: 'sleep',
    categoryAr: 'النوم',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushoor",
    translation:
      'All praise is for Allah who gave us life after having taken it from us, and unto Him is the resurrection.',
    translationAr: 'دعاء الاستيقاظ من النوم',
    source: 'Bukhari 11:113',
  },

  // === Protection ===
  {
    id: 20,
    category: 'protection',
    categoryAr: 'الحماية',
    arabic:
      'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ',
    transliteration:
      "Allahumma inni a'oodhu bika minal-hammi wal-hazan, wa a'oodhu bika minal-'ajzi wal-kasal, wa a'oodhu bika minal-jubni wal-bukhl, wa a'oodhu bika min ghalabatid-dayni wa qahrir-rijal",
    translation:
      'O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men.',
    translationAr: 'اللهم إني أعوذ بك من الهم والحزن',
    source: 'Bukhari 7:158',
  },
  {
    id: 21,
    category: 'protection',
    categoryAr: 'الحماية',
    arabic:
      'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration:
      "Hasbiyallahu la ilaha illa Huwa, 'alayhi tawakkaltu, wa Huwa Rabbul-'Arshil-'Adheem",
    translation:
      'Allah is sufficient for me. There is no god but He. I have placed my trust in Him and He is the Lord of the Majestic Throne.',
    translationAr: 'حسبي الله لا إله إلا هو',
    source: 'Quran 9:129, Abu Dawud 4:321',
  },
  {
    id: 22,
    category: 'protection',
    categoryAr: 'الحماية',
    arabic:
      'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',
    transliteration:
      "La ilaha illallahul-'Adheemul-Haleem, la ilaha illallahu Rabbul-'Arshil-'Adheem, la ilaha illallahu Rabbus-samawati wa Rabbul-ardi wa Rabbul-'Arshil-Kareem",
    translation:
      'There is no god but Allah, the Mighty, the Forbearing. There is no god but Allah, Lord of the Majestic Throne. There is no god but Allah, Lord of the heavens and Lord of the earth, and Lord of the Noble Throne.',
    translationAr: 'لا إله إلا الله العظيم الحليم - دعاء الكرب',
    source: 'Bukhari 8:154, Muslim 4:2092',
  },

  // === General ===
  {
    id: 23,
    category: 'general',
    categoryAr: 'عامة',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    transliteration: 'Rabbish-rahli sadri, wa yassir li amri',
    translation: 'My Lord, expand for me my chest and ease for me my task.',
    translationAr: 'رب اشرح لي صدري ويسر لي أمري',
    source: 'Quran 20:25-26',
  },
  {
    id: 24,
    category: 'general',
    categoryAr: 'عامة',
    arabic:
      'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ',
    transliteration:
      "Rabbana la tuzigh quloobana ba'da idh hadaytana wa hab lana min ladunka rahma innaka antal-Wahhab",
    translation:
      'Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.',
    translationAr: 'ربنا لا تزغ قلوبنا بعد إذ هديتنا',
    source: 'Quran 3:8',
  },
  {
    id: 25,
    category: 'general',
    categoryAr: 'عامة',
    arabic: 'اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي',
    transliteration: "Allahummaghfir li, warhamni, wahdini, wa 'afini, warzuqni",
    translation:
      'O Allah, forgive me, have mercy on me, guide me, grant me well-being, and provide for me.',
    translationAr: 'اللهم اغفر لي وارحمني واهدني',
    source: 'Muslim 4:2073',
  },
  {
    id: 26,
    category: 'general',
    categoryAr: 'عامة',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'La hawla wa la quwwata illa billah',
    translation: 'There is no might nor power except with Allah.',
    translationAr: 'لا حول ولا قوة إلا بالله',
    source: 'Bukhari 11:213, Muslim 4:2076',
  },
  {
    id: 27,
    category: 'general',
    categoryAr: 'عامة',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: "SubhanAllahi wa bihamdihi, SubhanAllahil-'Adheem",
    translation: 'Glory be to Allah and His is the praise. Glory be to Allah, the Supreme.',
    translationAr: 'سبحان الله وبحمده سبحان الله العظيم',
    source: 'Bukhari 7:168, Muslim 4:2072',
  },
  {
    id: 28,
    category: 'general',
    categoryAr: 'عامة',
    arabic:
      'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    transliteration:
      "Astaghfirullaha al-'Adheema alladhi la ilaha illa Huwal-Hayyul-Qayyoomu wa atoobu ilayh",
    translation:
      'I seek the forgiveness of Allah the Mighty, whom there is no god but He, the Living, the Sustainer, and I repent to Him.',
    translationAr: 'أستغفر الله العظيم وأتوب إليه',
    source: 'Abu Dawud 2:85, At-Tirmidhi 5:569',
  },

  // === More Morning ===
  {
    id: 29,
    category: 'morning',
    categoryAr: 'أذكار الصباح',
    arabic:
      'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ',
    transliteration:
      "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari, la ilaha illa anta",
    translation:
      'O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight. None has the right to be worshipped except You.',
    translationAr: 'اللهم عافني في بدني وسمعي وبصري',
    source: 'Abu Dawud 4:319',
  },
  {
    id: 30,
    category: 'morning',
    categoryAr: 'أذكار الصباح',
    arabic:
      'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
    transliteration:
      "Allahumma inni asbahtu ushhiduka wa ushhidu hamalata 'arshika wa mala'ikataka wa jamee'a khalqika annaka antallahu la ilaha illa anta wa anna Muhammadan 'abduka wa rasooluk",
    translation:
      'O Allah, I have reached the morning and call on You, the bearers of Your Throne, Your angels, and all of Your creation to witness that You are Allah, none has the right to be worshipped except You, alone, without partner, and that Muhammad is Your servant and Messenger.',
    translationAr: 'اللهم إني أصبحت أشهدك وأشهد حملة عرشك',
    source: 'Abu Dawud 4:317',
  },
  {
    id: 31,
    category: 'morning',
    categoryAr: 'أذكار الصباح',
    arabic:
      'اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
    transliteration:
      "Allahumma ma asbaha bi min ni'matin aw bi-ahadin min khalqika faminka wahdaka la shareeka lak, falakal-hamdu wa lakash-shukr",
    translation:
      'O Allah, whatever blessing I or any of Your creation have risen upon, is from You alone, without partner. So for You is all praise and unto You all thanks.',
    translationAr: 'اللهم ما أصبح بي من نعمة فمنك وحدك',
    source: 'Abu Dawud 4:318',
  },
  {
    id: 32,
    category: 'morning',
    categoryAr: 'أذكار الصباح',
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي',
    transliteration:
      "Allahumma inni as'alukal-'afwa wal-'afiyata fid-dunya wal-akhirah. Allahum-mastur 'awrati wa amin raw'ati",
    translation:
      'O Allah, I ask You for pardon and well-being in this life and the next. O Allah, conceal my faults and calm my fears.',
    translationAr: 'اللهم إني أسألك العفو والعافية، اللهم استر عوراتي',
    source: 'Abu Dawud 4:316',
  },

  // === More Evening ===
  {
    id: 33,
    category: 'evening',
    categoryAr: 'أذكار المساء',
    arabic:
      'اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
    transliteration:
      "Allahumma inni amsaytu ushhiduka wa ushhidu hamalata 'arshika wa mala'ikataka wa jamee'a khalqika annaka antallahu la ilaha illa anta wa anna Muhammadan 'abduka wa rasooluk",
    translation:
      'O Allah, I have reached the evening and call on You, the bearers of Your Throne, Your angels, and all of Your creation to witness that You are Allah, none has the right to be worshipped except You, and that Muhammad is Your servant and Messenger.',
    translationAr: 'اللهم إني أمسيت أشهدك وأشهد حملة عرشك',
    source: 'Abu Dawud 4:317',
  },
  {
    id: 34,
    category: 'evening',
    categoryAr: 'أذكار المساء',
    arabic:
      'اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
    transliteration:
      "Allahumma ma amsa bi min ni'matin aw bi-ahadin min khalqika faminka wahdaka la shareeka lak, falakal-hamdu wa lakash-shukr",
    translation:
      'O Allah, whatever blessing I or any of Your creation have come upon this evening, is from You alone, without partner. So for You is all praise and unto You all thanks.',
    translationAr: 'اللهم ما أمسى بي من نعمة فمنك وحدك',
    source: 'Abu Dawud 4:318',
  },
  {
    id: 35,
    category: 'evening',
    categoryAr: 'أذكار المساء',
    arabic:
      'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
    transliteration:
      "Ya Hayyu ya Qayyoomu birahmatika astagheethu aslih li sha'ni kullahu wa la takilni ila nafsi tarfata 'ayn",
    translation:
      'O Ever-Living, O Sustainer, in Your mercy I seek relief. Rectify for me all my affairs and do not leave me to myself even for the blink of an eye.',
    translationAr: 'يا حي يا قيوم برحمتك أستغيث',
    source: 'Al-Hakim 1:545',
  },

  // === More Prayer ===
  {
    id: 36,
    category: 'prayer',
    categoryAr: 'الصلاة',
    arabic:
      'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ',
    transliteration:
      "Subhanakal-lahumma wa bihamdika wa tabarakas-muka wa ta'ala jadduka wa la ilaha ghayruk",
    translation:
      'Glory be to You, O Allah, and praise be to You. Blessed is Your name and exalted is Your majesty. There is no god but You.',
    translationAr: 'دعاء الاستفتاح',
    source: 'Abu Dawud 1:775, At-Tirmidhi 2:242',
  },
  {
    id: 37,
    category: 'prayer',
    categoryAr: 'الصلاة',
    arabic:
      'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ، رَبَّنَا وَلَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
    transliteration:
      "Sami'allahu liman hamidah. Rabbana wa lakal-hamdu hamdan katheeran tayyiban mubarakan feeh",
    translation:
      'Allah hears the one who praises Him. Our Lord, to You belongs all praise — abundant, pure, and blessed praise.',
    translationAr: 'سمع الله لمن حمده ربنا ولك الحمد',
    source: 'Bukhari 1:295',
  },
  {
    id: 38,
    category: 'prayer',
    categoryAr: 'الصلاة',
    arabic:
      'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَاجْبُرْنِي وَعَافِنِي وَارْزُقْنِي وَارْفَعْنِي',
    transliteration: "Rabbighfir li warhamni wahdini wajburni wa 'afini warzuqni warfa'ni",
    translation:
      'My Lord, forgive me, have mercy on me, guide me, support me, grant me well-being, provide for me, and elevate me.',
    translationAr: 'دعاء بين السجدتين',
    source: 'Abu Dawud 1:850, At-Tirmidhi 2:284',
  },
  {
    id: 39,
    category: 'prayer',
    categoryAr: 'الصلاة',
    arabic:
      'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ',
    transliteration:
      'Allahummaghfir li dhanbi kullahu, diqqahu wa jillahu, wa awwalahu wa akhirahu, wa alaniyyatahu wa sirrahu',
    translation:
      'O Allah, forgive me all of my sins, the small and the great, the first and the last, the public and the private.',
    translationAr: 'اللهم اغفر لي ذنبي كله',
    source: 'Muslim 1:350',
  },
  {
    id: 40,
    category: 'prayer',
    categoryAr: 'الصلاة',
    arabic:
      'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
    transliteration:
      "Allahumma inni a'oodhu bika min 'adhabi jahannam, wa min 'adhabil-qabr, wa min fitnatil-mahya wal-mamat, wa min sharri fitnatil-maseehid-dajjal",
    translation:
      'O Allah, I seek refuge in You from the punishment of Hell, the punishment of the grave, the trials of life and death, and the evil of the trial of the False Messiah.',
    translationAr: 'اللهم إني أعوذ بك من عذاب جهنم',
    source: 'Bukhari 2:102, Muslim 1:412',
  },

  // === More Food & Drink ===
  {
    id: 41,
    category: 'food',
    categoryAr: 'الطعام والشراب',
    arabic: 'بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ',
    transliteration: 'Bismillahi awwalahu wa akhirah',
    translation: 'In the Name of Allah, at its beginning and at its end.',
    translationAr: 'إذا نسيت التسمية في أول الطعام',
    source: 'Abu Dawud 3:347, At-Tirmidhi 4:288',
  },
  {
    id: 42,
    category: 'food',
    categoryAr: 'الطعام والشراب',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    transliteration: "Alhamdu lillahil-ladhi at'amana wa saqana wa ja'alana muslimeen",
    translation: 'All praise is for Allah who fed us and gave us drink and made us Muslims.',
    translationAr: 'الحمد لله الذي أطعمنا وسقانا وجعلنا مسلمين',
    source: 'Abu Dawud 3:365, At-Tirmidhi 5:507',
  },
  {
    id: 43,
    category: 'food',
    categoryAr: 'الطعام والشراب',
    arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
    transliteration: "Allahumma barik lana feema razaqtana wa qina 'adhaban-nar",
    translation:
      'O Allah, bless us in what You have provided for us and protect us from the punishment of the Fire.',
    translationAr: 'اللهم بارك لنا فيما رزقتنا',
    source: 'Ibn As-Sunni',
  },

  // === More Travel ===
  {
    id: 44,
    category: 'travel',
    categoryAr: 'السفر',
    arabic:
      'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration:
      'Allahu Akbar, Allahu Akbar, Allahu Akbar. Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrineen. Wa inna ila Rabbina lamunqaliboon',
    translation:
      'Allah is the Greatest (3x). Glory to Him who has subjected this to us, and we could never have it by our efforts. And unto our Lord we shall return.',
    translationAr: 'دعاء ركوب الدابة - التكبير',
    source: 'Muslim 2:978',
  },
  {
    id: 45,
    category: 'travel',
    categoryAr: 'السفر',
    arabic: 'أَسْتَوْدِعُكُمُ اللَّهَ الَّذِي لَا تَضِيعُ وَدَائِعُهُ',
    transliteration: "Astawdi'ukumullaha alladhi la tadee'u wada'i'uhu",
    translation: 'I place you in the trust of Allah, whose trust is never lost.',
    translationAr: 'دعاء توديع المسافر',
    source: 'Ibn Majah 2:943',
  },
  {
    id: 46,
    category: 'travel',
    categoryAr: 'السفر',
    arabic: 'اللَّهُمَّ اطْوِ لَنَا الْأَرْضَ وَهَوِّنْ عَلَيْنَا السَّفَرَ',
    transliteration: "AllahummaTwi lanal-arda wa hawwin 'alaynas-safar",
    translation:
      'O Allah, shorten the distance of this earth for us and make the journey easy for us.',
    translationAr: 'اللهم اطو لنا الأرض وهون علينا السفر',
    source: 'At-Tirmidhi 5:501',
  },

  // === More Sleep ===
  {
    id: 47,
    category: 'sleep',
    categoryAr: 'النوم',
    arabic: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا',
    transliteration: 'Allahumma bismika amootu wa ahya',
    translation: 'O Allah, in Your Name I die and I live.',
    translationAr: 'اللهم باسمك أموت وأحيا',
    source: 'Bukhari 11:113',
  },
  {
    id: 48,
    category: 'sleep',
    categoryAr: 'النوم',
    arabic:
      'اللَّهُمَّ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ',
    transliteration:
      "Allahumma khalaqta nafsi wa anta tawaffaha, laka mamatuha wa mahyaha, in ahyaytaha fahfadhha, wa in amattaha faghfir laha. Allahumma inni as'alukal-'afiyah",
    translation:
      'O Allah, You created my soul and You take it back. To You belongs its death and its life. If You keep it alive then protect it, and if You cause it to die then forgive it. O Allah, I ask You for well-being.',
    translationAr: 'اللهم خلقت نفسي وأنت توفاها',
    source: 'Muslim 4:2083',
  },
  {
    id: 49,
    category: 'sleep',
    categoryAr: 'النوم',
    arabic:
      'اللَّهُمَّ رَبَّ السَّمَاوَاتِ وَرَبَّ الْأَرْضِ وَرَبَّ الْعَرْشِ الْعَظِيمِ، رَبَّنَا وَرَبَّ كُلِّ شَيْءٍ، فَالِقَ الْحَبِّ وَالنَّوَى، وَمُنْزِلَ التَّوْرَاةِ وَالْإِنْجِيلِ وَالْفُرْقَانِ، أَعُوذُ بِكَ مِنْ شَرِّ كُلِّ شَيْءٍ أَنْتَ آخِذٌ بِنَاصِيَتِهِ',
    transliteration:
      "Allahumma Rabbas-samawati wa Rabbal-ardi wa Rabbal-'Arshil-'Adheem, Rabbana wa Rabba kulli shay', faliqal-habbi wan-nawa, wa munzilat-Tawrati wal-Injeeli wal-Furqan, a'oodhu bika min sharri kulli shay'in anta akhidhun binasiyatih",
    translation:
      'O Allah, Lord of the heavens and earth and Lord of the Majestic Throne, our Lord and Lord of all things. Splitter of the seed and the date-stone, Revealer of the Torah, the Gospel, and the Criterion. I seek refuge in You from the evil of all things You shall seize by the forelock.',
    translationAr: 'اللهم رب السماوات ورب الأرض - دعاء النوم المطول',
    source: 'Muslim 4:2084',
  },

  // === Home ===
  {
    id: 50,
    category: 'home',
    categoryAr: 'المنزل',
    arabic:
      'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
    transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa 'alallahi Rabbina tawakkalna",
    translation:
      'In the Name of Allah we enter and in the Name of Allah we leave, and upon Allah our Lord we place our trust.',
    translationAr: 'دعاء دخول المنزل',
    source: 'Abu Dawud 4:325',
  },
  {
    id: 51,
    category: 'home',
    categoryAr: 'المنزل',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: "Bismillah, tawakkaltu 'alallah, wa la hawla wa la quwwata illa billah",
    translation:
      'In the Name of Allah. I place my trust in Allah. There is no might or power except with Allah.',
    translationAr: 'دعاء الخروج من المنزل',
    source: 'Abu Dawud 4:325, At-Tirmidhi 5:490',
  },
  {
    id: 52,
    category: 'home',
    categoryAr: 'المنزل',
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ، بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
    transliteration:
      "Allahumma inni as'aluka khayral-mawliji wa khayral-makhraji, bismillahi walajna wa bismillahi kharajna wa 'alallahi Rabbina tawakkalna",
    translation:
      'O Allah, I ask You for the best of entering and the best of leaving. In the Name of Allah we enter and leave, and upon Allah our Lord we rely.',
    translationAr: 'اللهم إني أسألك خير المولج وخير المخرج',
    source: 'Abu Dawud 4:325',
  },

  // === Mosque ===
  {
    id: 53,
    category: 'mosque',
    categoryAr: 'المسجد',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: 'Allahummaf-tah li abwaba rahmatik',
    translation: 'O Allah, open for me the doors of Your mercy.',
    translationAr: 'دعاء دخول المسجد',
    source: 'Muslim 1:494',
  },
  {
    id: 54,
    category: 'mosque',
    categoryAr: 'المسجد',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    transliteration: "Allahumma inni as'aluka min fadlik",
    translation: 'O Allah, I ask You of Your bounty.',
    translationAr: 'دعاء الخروج من المسجد',
    source: 'Muslim 1:494',
  },
  {
    id: 55,
    category: 'mosque',
    categoryAr: 'المسجد',
    arabic:
      'أَعُوذُ بِاللَّهِ الْعَظِيمِ وَبِوَجْهِهِ الْكَرِيمِ وَسُلْطَانِهِ الْقَدِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    transliteration:
      "A'oodhu billahil-'Adheemi wa biwajhihil-kareemi wa sultanihil-qadeemi minash-shaytanir-rajeem",
    translation:
      'I seek refuge with Allah the Supreme, with His Noble Face and His eternal authority, from the accursed Satan.',
    translationAr: 'أعوذ بالله العظيم من الشيطان الرجيم - عند دخول المسجد',
    source: 'Abu Dawud 1:466',
  },

  // === Distress ===
  {
    id: 56,
    category: 'distress',
    categoryAr: 'الكرب والضيق',
    arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'La ilaha illa anta subhanaka inni kuntu minadh-dhalimeen',
    translation:
      'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
    translationAr: 'دعاء يونس عليه السلام',
    source: 'Quran 21:87, At-Tirmidhi 5:529',
  },
  {
    id: 57,
    category: 'distress',
    categoryAr: 'الكرب والضيق',
    arabic: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
    transliteration: "Inna lillahi wa inna ilayhi raji'oon",
    translation: 'Indeed we belong to Allah, and indeed to Him we will return.',
    translationAr: 'الاسترجاع عند المصيبة',
    source: 'Quran 2:156',
  },
  {
    id: 58,
    category: 'distress',
    categoryAr: 'الكرب والضيق',
    arabic:
      'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
    transliteration:
      "Allahumma la sahla illa ma ja'altahu sahla, wa anta taj'alul-hazna idha shi'ta sahla",
    translation:
      'O Allah, nothing is easy except what You make easy, and You can make grief easy if You wish.',
    translationAr: 'اللهم لا سهل إلا ما جعلته سهلا',
    source: 'Ibn Hibban',
  },
  {
    id: 59,
    category: 'distress',
    categoryAr: 'الكرب والضيق',
    arabic:
      'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',
    transliteration:
      "La ilaha illallahul-'Adheemul-Haleem, la ilaha illallahu Rabbul-'Arshil-'Adheem, la ilaha illallahu Rabbus-samawati wa Rabbul-ardi wa Rabbul-'Arshil-Kareem",
    translation:
      'There is no god but Allah, the Great, the Forbearing. There is no god but Allah, Lord of the Majestic Throne. There is no god but Allah, Lord of the heavens, Lord of the earth, and Lord of the Noble Throne.',
    translationAr: 'دعاء الكرب',
    source: 'Bukhari 8:154, Muslim 4:2092',
  },
  {
    id: 60,
    category: 'distress',
    categoryAr: 'الكرب والضيق',
    arabic:
      'اللَّهُمَّ رَحْمَتَكَ أَرْجُو فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ وَأَصْلِحْ لِي شَأْنِي كُلَّهُ لَا إِلَهَ إِلَّا أَنْتَ',
    transliteration:
      "Allahumma rahmataka arju fala takilni ila nafsi tarfata 'aynin wa aslih li sha'ni kullahu la ilaha illa ant",
    translation:
      'O Allah, it is Your mercy that I hope for, so do not leave me to myself even for the blink of an eye, and rectify for me all of my affairs. None has the right to be worshipped except You.',
    translationAr: 'اللهم رحمتك أرجو',
    source: 'Abu Dawud 4:324',
  },
  {
    id: 61,
    category: 'distress',
    categoryAr: 'الكرب والضيق',
    arabic:
      'اللَّهُمَّ إِنِّي عَبْدُكَ ابْنُ عَبْدِكَ ابْنُ أَمَتِكَ نَاصِيَتِي بِيَدِكَ مَاضٍ فِيَّ حُكْمُكَ عَدْلٌ فِيَّ قَضَاؤُكَ أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ أَوْ عَلَّمْتَهُ أَحَدًا مِنْ خَلْقِكَ أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي وَنُورَ صَدْرِي وَجَلَاءَ حُزْنِي وَذَهَابَ هَمِّي',
    transliteration:
      "Allahumma inni 'abduka ibnu 'abdika ibnu amatika nasiyati biyadika madin fiyya hukmuka 'adlun fiyya qada'uka as'aluka bikulli ismin huwa laka sammayta bihi nafsaka aw anzaltahu fi kitabika aw 'allamtahu ahadan min khalqika awista'tharta bihi fi 'ilmil-ghaybi 'indaka an taj'alal-Qur'ana rabee'a qalbi wa noora sadri wa jala'a huzni wa dhahaba hammi",
    translation:
      'O Allah, I am Your servant, son of Your servant, son of Your maidservant. My forelock is in Your hand, Your command over me is forever executed, and Your decree over me is just. I ask You by every name belonging to You which You named Yourself with, or revealed in Your Book, or You taught to any of Your creation, or You have preserved in the knowledge of the unseen with You, that You make the Quran the life of my heart and the light of my chest, and a departure for my sorrow and a release for my anxiety.',
    translationAr: 'اللهم إني عبدك ابن عبدك - دعاء الهم والحزن',
    source: 'Ahmad 1:391',
  },

  // === More Protection ===
  {
    id: 62,
    category: 'protection',
    categoryAr: 'الحماية',
    arabic:
      'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبَرَصِ وَالْجُنُونِ وَالْجُذَامِ وَمِنْ سَيِّئِ الْأَسْقَامِ',
    transliteration:
      "Allahumma inni a'oodhu bika minal-barasi wal-junooni wal-judhami wa min sayyi'il-asqam",
    translation:
      'O Allah, I seek refuge in You from leprosy, madness, elephantiasis, and evil sicknesses.',
    translationAr: 'اللهم إني أعوذ بك من البرص والجنون',
    source: 'Abu Dawud 2:89',
  },
  {
    id: 63,
    category: 'protection',
    categoryAr: 'الحماية',
    arabic:
      'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ وَتَحَوُّلِ عَافِيَتِكَ وَفُجَاءَةِ نِقْمَتِكَ وَجَمِيعِ سَخَطِكَ',
    transliteration:
      "Allahumma inni a'oodhu bika min zawali ni'matika wa tahawwuli 'afiyatika wa fuja'ati niqmatika wa jamee'i sakhatik",
    translation:
      'O Allah, I seek refuge in You from the decline of Your blessings, the passing of safety, the suddenness of Your punishment, and all that displeases You.',
    translationAr: 'اللهم إني أعوذ بك من زوال نعمتك',
    source: 'Muslim 4:2097',
  },
  {
    id: 64,
    category: 'protection',
    categoryAr: 'الحماية',
    arabic:
      'اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي',
    transliteration:
      "Allahummahfadhni min bayni yadayya wa min khalfi wa 'an yameeni wa 'an shimali wa min fawqi wa a'oodhu bi'adhamatika an ughtala min tahti",
    translation:
      'O Allah, protect me from the front and from behind and from my right and from my left and from above, and I take refuge in Your greatness from being swallowed up by the earth.',
    translationAr: 'اللهم احفظني من بين يدي ومن خلفي',
    source: 'Abu Dawud 4:322, Ibn Majah',
  },

  // === More General ===
  {
    id: 65,
    category: 'general',
    categoryAr: 'عامة',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    transliteration: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik",
    translation:
      'O Allah, help me to remember You, to thank You, and to worship You in the best way.',
    translationAr: 'اللهم أعني على ذكرك وشكرك وحسن عبادتك',
    source: "Abu Dawud 2:86, An-Nasa'i",
  },
  {
    id: 66,
    category: 'general',
    categoryAr: 'عامة',
    arabic:
      'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    transliteration:
      "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqeena imama",
    translation:
      'Our Lord, grant us from among our spouses and offspring comfort to our eyes and make us leaders for the righteous.',
    translationAr: 'ربنا هب لنا من أزواجنا وذرياتنا قرة أعين',
    source: 'Quran 25:74',
  },
  {
    id: 67,
    category: 'general',
    categoryAr: 'عامة',
    arabic:
      'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ',
    transliteration:
      "Rabbi awzi'ni an ashkura ni'matakal-lati an'amta 'alayya wa 'ala walidayya wa an a'mala salihan tardahu wa adkhilni birahmatika fi 'ibadikass-saliheen",
    translation:
      'My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents, and to work righteousness of which You approve. And admit me by Your mercy into the ranks of Your righteous servants.',
    translationAr: 'رب أوزعني أن أشكر نعمتك',
    source: 'Quran 27:19',
  },
  {
    id: 68,
    category: 'general',
    categoryAr: 'عامة',
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    transliteration: "Rabbi zidni 'ilma",
    translation: 'My Lord, increase me in knowledge.',
    translationAr: 'رب زدني علمًا',
    source: 'Quran 20:114',
  },
  {
    id: 69,
    category: 'general',
    categoryAr: 'عامة',
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا',
    transliteration:
      "Allahumma inni as'aluka 'ilman nafi'an wa rizqan tayyiban wa 'amalan mutaqabbala",
    translation: 'O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.',
    translationAr: 'اللهم إني أسألك علمًا نافعًا ورزقًا طيبًا',
    source: 'Ibn Majah 1:925',
  },
  {
    id: 70,
    category: 'general',
    categoryAr: 'عامة',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
    transliteration: "Allahumma inni as'alukal-huda wat-tuqa wal-'afafa wal-ghina",
    translation: 'O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.',
    translationAr: 'اللهم إني أسألك الهدى والتقى والعفاف والغنى',
    source: 'Muslim 4:2087',
  },
  {
    id: 71,
    category: 'general',
    categoryAr: 'عامة',
    arabic:
      'اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي وَاجْعَلِ الْحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ وَاجْعَلِ الْمَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ',
    transliteration:
      "Allahumma aslih li deeniyal-ladhi huwa 'ismatu amri, wa aslih li dunyayal-lati feeha ma'ashi, wa aslih li akhiratiyal-lati feeha ma'adi. Waj'alil-hayata ziyadatan li fi kulli khayrin waj'alil-mawta rahatan li min kulli sharr",
    translation:
      'O Allah, rectify for me my religion which is the safeguard of my affairs. Rectify for me my worldly affairs wherein is my living. Rectify for me my Hereafter to which is my return. Make life an increase for me in every good, and make death a relief for me from every evil.',
    translationAr: 'اللهم أصلح لي ديني ودنياي وآخرتي',
    source: 'Muslim 4:2088',
  },
  {
    id: 72,
    category: 'general',
    categoryAr: 'عامة',
    arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
    translation: 'O Allah, You are Pardoning and You love to pardon, so pardon me.',
    translationAr: 'اللهم إنك عفو تحب العفو فاعف عني',
    source: 'At-Tirmidhi 5:534, Ibn Majah',
  },
  {
    id: 73,
    category: 'general',
    categoryAr: 'عامة',
    arabic: 'اللَّهُمَّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ',
    transliteration: "Allahummaghfir li wa liwalidayya wa lil-mu'mineena wal-mu'minat",
    translation: 'O Allah, forgive me, my parents, and all the believing men and women.',
    translationAr: 'اللهم اغفر لي ولوالدي وللمؤمنين',
    source: 'Quran 71:28',
  },
  {
    id: 74,
    category: 'general',
    categoryAr: 'عامة',
    arabic:
      'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَنْ دَخَلَ بَيْتِيَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ',
    transliteration:
      "Rabbighfir li wa liwalidayya wa liman dakhala baytiya mu'minan wa lil-mu'mineena wal-mu'minat",
    translation:
      'My Lord, forgive me and my parents and whoever enters my house as a believer, and all the believing men and believing women.',
    translationAr: 'رب اغفر لي ولوالدي ولمن دخل بيتي مؤمنًا',
    source: 'Quran 71:28',
  },
  {
    id: 75,
    category: 'general',
    categoryAr: 'عامة',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ مَا عَمِلْتُ وَمِنْ شَرِّ مَا لَمْ أَعْمَلْ',
    transliteration: "Allahumma inni a'oodhu bika min sharri ma 'amiltu wa min sharri ma lam a'mal",
    translation:
      'O Allah, I seek refuge in You from the evil of what I have done and from the evil of what I have not done.',
    translationAr: 'اللهم إني أعوذ بك من شر ما عملت',
    source: 'Muslim 4:2085',
  },
  {
    id: 76,
    category: 'morning',
    categoryAr: 'أذكار الصباح',
    arabic:
      'اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ',
    transliteration:
      "Allahumma 'alimal-ghaybi wash-shahadah, fatiras-samawati wal-ard, Rabba kulli shay'in wa maleekah, ash-hadu an la ilaha illa anta, a'oodhu bika min sharri nafsi wa min sharrish-shaytani wa shirkihi",
    translation:
      'O Allah, Knower of the unseen and the seen, Creator of the heavens and the earth, Lord and Sovereign of all things. I bear witness that none has the right to be worshipped except You. I seek refuge in You from the evil of my soul and from the evil and traps of Satan.',
    translationAr: 'اللهم عالم الغيب والشهادة فاطر السماوات والأرض',
    source: 'At-Tirmidhi 5:465, Abu Dawud 4:317',
  },
  {
    id: 77,
    category: 'morning',
    categoryAr: 'أذكار الصباح',
    arabic:
      'سَيِّدُ الِاسْتِغْفَارِ: اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration:
      "Sayyidul-istighfar: Allahumma anta Rabbi la ilaha illa anta khalaqtani wa ana 'abduka wa ana 'ala 'ahdika wa wa'dika masta-ta'tu a'oodhu bika min sharri ma sana'tu aboo'u laka bini'matika 'alayya wa aboo'u bidhanbi faghfir li fa-innahu la yaghfirudh-dhunooba illa ant",
    translation:
      'The master of seeking forgiveness: O Allah, You are my Lord. None has the right to be worshipped except You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge before You Your blessings upon me, and I acknowledge my sins. So forgive me, for none forgives sins except You.',
    translationAr: 'سيد الاستغفار',
    source: 'Bukhari 8:75',
  },
]

export default duas
