export interface QuranVerse {
  arabic: string
  english: string
  reference: string
}

// Curated for maximum Barnum effect: every verse should feel like a personal,
// direct answer to ANY question — vague yet emotionally specific, hopeful yet mysterious.
const quranVerses: QuranVerse[] = [
  // === TIER 1: "YES" ENERGY — hopeful, forward-looking, feels like permission ===
  {
    arabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ',
    english: 'And your Lord will give you so much that you will be pleased.',
    reference: 'Ad-Duha 93:5',
  },
  {
    arabic: 'سَيَجْعَلُ اللَّهُ بَعْدَ عُسْرٍ يُسْرًا',
    english: 'Allah will bring about ease after hardship.',
    reference: 'At-Talaq 65:7',
  },
  {
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    english: 'Surely with hardship comes ease.',
    reference: 'Ash-Sharh 94:6',
  },
  {
    arabic: 'ادْعُونِي أَسْتَجِبْ لَكُمْ',
    english: 'Call upon Me, I will respond to you.',
    reference: 'Ghafir 40:60',
  },
  {
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ',
    english:
      'Whoever is mindful of Allah, He will make a way out for them and provide from sources they never imagined.',
    reference: 'At-Talaq 65:2-3',
  },
  {
    arabic: 'إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا',
    english: 'Indeed, We have given you a clear victory.',
    reference: 'Al-Fath 48:1',
  },
  {
    arabic: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
    english: 'If you are grateful, I will surely give you more.',
    reference: 'Ibrahim 14:7',
  },
  {
    arabic: 'كُن فَيَكُونُ',
    english: 'Be — and it is.',
    reference: 'Ya-Sin 36:82',
  },
  {
    arabic: 'إِن تَنصُرُوا اللَّهَ يَنصُرْكُمْ وَيُثَبِّتْ أَقْدَامَكُمْ',
    english: 'If you support Allah, He will support you and plant your feet firmly.',
    reference: 'Muhammad 47:7',
  },
  {
    arabic: 'هَلْ جَزَاءُ الْإِحْسَانِ إِلَّا الْإِحْسَانُ',
    english: 'Is the reward of goodness anything but goodness?',
    reference: 'Ar-Rahman 55:60',
  },

  // === TIER 2: "TRUST THE PROCESS" — patience, hidden wisdom, things aren't what they seem ===
  {
    arabic: 'وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ',
    english: 'Perhaps you dislike something which is good for you.',
    reference: 'Al-Baqarah 2:216',
  },
  {
    arabic: 'وَعَسَىٰ أَن تُحِبُّوا شَيْئًا وَهُوَ شَرٌّ لَّكُمْ',
    english: 'And perhaps you love something which is bad for you.',
    reference: 'Al-Baqarah 2:216',
  },
  {
    arabic: 'وَاللَّهُ يَعْلَمُ وَأَنتُمْ لَا تَعْلَمُونَ',
    english: 'And Allah knows while you do not know.',
    reference: 'Al-Baqarah 2:216',
  },
  {
    arabic: 'وَيَمْكُرُونَ وَيَمْكُرُ اللَّهُ وَاللَّهُ خَيْرُ الْمَاكِرِينَ',
    english: 'They plan, and Allah plans. And Allah is the best of planners.',
    reference: 'Al-Anfal 8:30',
  },
  {
    arabic: 'وَمَا تَدْرِي نَفْسٌ مَّاذَا تَكْسِبُ غَدًا',
    english: 'No soul knows what it will earn tomorrow.',
    reference: 'Luqman 31:34',
  },
  {
    arabic: 'فَصَبْرٌ جَمِيلٌ',
    english: 'So patience is most fitting.',
    reference: 'Yusuf 12:18',
  },
  {
    arabic: 'إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ',
    english:
      'Allah will not change the condition of a people until they change what is in themselves.',
    reference: "Ar-Ra'd 13:11",
  },
  {
    arabic: 'وَفَوْقَ كُلِّ ذِي عِلْمٍ عَلِيمٌ',
    english: 'And above every knowledgeable one is the All-Knowing.',
    reference: 'Yusuf 12:76',
  },
  {
    arabic: 'وَعِندَهُ مَفَاتِحُ الْغَيْبِ لَا يَعْلَمُهَا إِلَّا هُوَ',
    english: 'And with Him are the keys of the unseen; none knows them except Him.',
    reference: "Al-An'am 6:59",
  },
  {
    arabic: 'إِنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    english: 'Indeed, Allah is capable of all things.',
    reference: 'Al-Baqarah 2:20',
  },

  // === TIER 3: "YOU ARE NOT ALONE" — comfort, closeness, reassurance ===
  {
    arabic: 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ',
    english: 'Your Lord has not abandoned you, nor has He become hateful.',
    reference: 'Ad-Duha 93:3',
  },
  {
    arabic: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ',
    english: 'And He is with you wherever you are.',
    reference: 'Al-Hadid 57:4',
  },
  {
    arabic: 'وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ',
    english: 'And We are closer to him than his jugular vein.',
    reference: 'Qaf 50:16',
  },
  {
    arabic: 'لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا',
    english: 'Do not grieve, indeed Allah is with us.',
    reference: 'At-Tawbah 9:40',
  },
  {
    arabic: 'لَا تَخَفْ إِنَّنِي مَعَكُمَا أَسْمَعُ وَأَرَىٰ',
    english: 'Do not fear. Indeed, I am with you; I hear and I see.',
    reference: 'Ta-Ha 20:46',
  },
  {
    arabic: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ',
    english: 'When My servants ask about Me, I am truly near.',
    reference: 'Al-Baqarah 2:186',
  },
  {
    arabic: 'أَلَيْسَ اللَّهُ بِكَافٍ عَبْدَهُ',
    english: 'Is not Allah sufficient for His servant?',
    reference: 'Az-Zumar 39:36',
  },
  {
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    english: 'Allah is sufficient for us and He is the best disposer of affairs.',
    reference: 'Aal-Imran 3:173',
  },
  {
    arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    english: 'And whoever puts their trust in Allah, He will be enough for them.',
    reference: 'At-Talaq 65:3',
  },
  {
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ',
    english: 'So remember Me, and I will remember you.',
    reference: 'Al-Baqarah 2:152',
  },

  // === TIER 4: "LET GO" — surrender, acceptance, inner peace ===
  {
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    english: 'Verily, in the remembrance of Allah do hearts find rest.',
    reference: "Ar-Ra'd 13:28",
  },
  {
    arabic: 'يُرِيدُ اللَّهُ بِكُمُ الْيُسْرَ وَلَا يُرِيدُ بِكُمُ الْعُسْرَ',
    english: 'Allah intends for you ease and does not intend for you hardship.',
    reference: 'Al-Baqarah 2:185',
  },
  {
    arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    english: 'Allah does not burden a soul beyond that it can bear.',
    reference: 'Al-Baqarah 2:286',
  },
  {
    arabic: 'سَلَامٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ',
    english: 'Peace — a word from a Merciful Lord.',
    reference: 'Ya-Sin 36:58',
  },
  {
    arabic: 'هُوَ الَّذِي أَنزَلَ السَّكِينَةَ فِي قُلُوبِ الْمُؤْمِنِينَ',
    english: 'It is He who sent down tranquility into the hearts of the believers.',
    reference: 'Al-Fath 48:4',
  },
  {
    arabic:
      'يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً',
    english: 'O tranquil soul, return to your Lord, well-pleased and pleasing to Him.',
    reference: 'Al-Fajr 89:27-28',
  },
  {
    arabic: 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ',
    english: 'And do not despair of the mercy of Allah.',
    reference: 'Yusuf 12:87',
  },
  {
    arabic: 'وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ',
    english: 'My mercy encompasses all things.',
    reference: "Al-A'raf 7:156",
  },
  {
    arabic: 'إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ',
    english: 'Indeed, the mercy of Allah is near to those who do good.',
    reference: "Al-A'raf 7:56",
  },
  {
    arabic:
      'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ',
    english:
      'Say: O My servants who have wronged themselves, do not despair of the mercy of Allah.',
    reference: 'Az-Zumar 39:53',
  },

  // === TIER 5: "SOMETHING IS COMING" — mystery, anticipation, the unseen ===
  {
    arabic: 'وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ',
    english: 'And what is to come will be better for you than what has passed.',
    reference: 'Ad-Duha 93:4',
  },
  {
    arabic: 'وَفِي السَّمَاءِ رِزْقُكُمْ وَمَا تُوعَدُونَ',
    english: 'And in the heaven is your provision and whatever you are promised.',
    reference: 'Adh-Dhariyat 51:22',
  },
  {
    arabic: 'فَإِذَا فَرَغْتَ فَانصَبْ وَإِلَىٰ رَبِّكَ فَارْغَب',
    english: 'So when you have finished, then strive. And to your Lord direct your longing.',
    reference: 'Ash-Sharh 94:7-8',
  },
  {
    arabic: 'وَمَا النَّصْرُ إِلَّا مِنْ عِندِ اللَّهِ',
    english: 'And victory is only from Allah.',
    reference: 'Al-Anfal 8:10',
  },
  {
    arabic: 'جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ إِنَّ الْبَاطِلَ كَانَ زَهُوقًا',
    english: 'Truth has come and falsehood has vanished. Indeed, falsehood is bound to vanish.',
    reference: 'Al-Isra 17:81',
  },
  {
    arabic: 'وَالضُّحَىٰ وَاللَّيْلِ إِذَا سَجَىٰ',
    english: 'By the morning brightness, and by the night when it covers with stillness.',
    reference: 'Ad-Duha 93:1-2',
  },
  {
    arabic: 'هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ',
    english: 'He is the First and the Last, the Manifest and the Hidden.',
    reference: 'Al-Hadid 57:3',
  },

  // === TIER 6: "HE SEES YOU" — validation, being known, inner truth ===
  {
    arabic: 'يَعْلَمُ خَائِنَةَ الْأَعْيُنِ وَمَا تُخْفِي الصُّدُورُ',
    english: 'He knows the betrayal of the eyes and what the hearts conceal.',
    reference: 'Ghafir 40:19',
  },
  {
    arabic: 'وَفِي أَنفُسِكُمْ أَفَلَا تُبْصِرُونَ',
    english: 'And within yourselves — do you not see?',
    reference: 'Adh-Dhariyat 51:21',
  },
  {
    arabic: 'فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ',
    english: "Whoever does an atom's weight of good will see it.",
    reference: 'Az-Zalzalah 99:7',
  },
  {
    arabic: 'إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
    english: 'Indeed, Allah does not let the reward of the good-doers go to waste.',
    reference: 'Yusuf 12:90',
  },
  {
    arabic: 'وَمَن يُؤْمِن بِاللَّهِ يَهْدِ قَلْبَهُ',
    english: 'And whoever believes in Allah, He will guide their heart.',
    reference: 'At-Taghabun 64:11',
  },
  {
    arabic: 'إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ',
    english: 'Indeed in that are signs for a people who give thought.',
    reference: "Ar-Ra'd 13:3",
  },
  {
    arabic: 'وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ',
    english: 'And indeed, you are of a great moral character.',
    reference: 'Al-Qalam 68:4',
  },

  // === TIER 7: "STRENGTH" — courage, don't give up, you're stronger than you think ===
  {
    arabic: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ',
    english: 'Do not weaken and do not grieve, for you will be superior.',
    reference: 'Aal-Imran 3:139',
  },
  {
    arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    english: 'Indeed, Allah is with the patient.',
    reference: 'Al-Baqarah 2:153',
  },
  {
    arabic: 'وَاللَّهُ يُحِبُّ الصَّابِرِينَ',
    english: 'And Allah loves the steadfast.',
    reference: 'Aal-Imran 3:146',
  },
  {
    arabic: 'وَبَشِّرِ الصَّابِرِينَ',
    english: 'And give good news to the patient.',
    reference: 'Al-Baqarah 2:155',
  },
  {
    arabic: 'وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
    english: 'Be patient, for Allah does not let the reward of the good-doers go to waste.',
    reference: 'Hud 11:115',
  },
  {
    arabic: 'أَلَا إِنَّ أَوْلِيَاءَ اللَّهِ لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ',
    english: 'Indeed, the allies of Allah — no fear will there be upon them, nor will they grieve.',
    reference: 'Yunus 10:62',
  },

  // === TIER 8: "LOVE & RELATIONSHIPS" — connection, family, bonds ===
  {
    arabic:
      'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    english:
      'And among His signs is that He created for you mates that you may find tranquility in them, and He placed between you affection and mercy.',
    reference: 'Ar-Rum 30:21',
  },
  {
    arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ',
    english: 'Our Lord, grant us from our spouses and offspring comfort to our eyes.',
    reference: 'Al-Furqan 25:74',
  },
  {
    arabic: 'رَبِّ هَبْ لِي مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً',
    english: 'My Lord, grant me from Yourself a good offspring.',
    reference: 'Aal-Imran 3:38',
  },

  // === TIER 9: "HEALING & FORGIVENESS" — fresh starts, second chances ===
  {
    arabic: 'وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ',
    english: 'And We send down of the Quran that which is a healing and a mercy for the believers.',
    reference: 'Al-Isra 17:82',
  },
  {
    arabic: 'وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ',
    english: 'And when I am ill, it is He who cures me.',
    reference: "Ash-Shu'ara 26:80",
  },
  {
    arabic: 'إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا',
    english: 'Indeed, Allah forgives all sins.',
    reference: 'Az-Zumar 39:53',
  },
  {
    arabic: 'إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ',
    english: 'Indeed, Allah loves those who repent and loves those who purify themselves.',
    reference: 'Al-Baqarah 2:222',
  },
  {
    arabic: 'وَتُوبُوا إِلَى اللَّهِ جَمِيعًا أَيُّهَ الْمُؤْمِنُونَ لَعَلَّكُمْ تُفْلِحُونَ',
    english: 'Turn to Allah in repentance, all of you, that you might succeed.',
    reference: 'An-Nur 24:31',
  },

  // === TIER 10: "ABUNDANCE" — wealth, blessings, provision ===
  {
    arabic: 'إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ',
    english: 'Indeed, it is Allah who is the Provider, firm in strength.',
    reference: 'Adh-Dhariyat 51:58',
  },
  {
    arabic: 'وَإِن تَعُدُّوا نِعْمَةَ اللَّهِ لَا تُحْصُوهَا',
    english: 'And if you should count the favors of Allah, you could not enumerate them.',
    reference: 'Ibrahim 14:34',
  },
  {
    arabic: 'وَأَحْسِنُوا إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ',
    english: 'And do good; indeed, Allah loves the doers of good.',
    reference: 'Al-Baqarah 2:195',
  },
  {
    arabic: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ',
    english: 'Allah is the Light of the heavens and the earth.',
    reference: 'An-Nur 24:35',
  },
  {
    arabic: 'يَهْدِي اللَّهُ لِنُورِهِ مَن يَشَاءُ',
    english: 'Allah guides to His light whom He wills.',
    reference: 'An-Nur 24:35',
  },
  {
    arabic: 'وَاللَّهُ خَيْرٌ حَافِظًا وَهُوَ أَرْحَمُ الرَّاحِمِينَ',
    english: 'Allah is the best guardian, and He is the most merciful of the merciful.',
    reference: 'Yusuf 12:64',
  },
  {
    arabic: 'وَاعْلَمُوا أَنَّ اللَّهَ مَعَ الْمُتَّقِينَ',
    english: 'And know that Allah is with those who are mindful of Him.',
    reference: 'Al-Baqarah 2:194',
  },
]

export default quranVerses
