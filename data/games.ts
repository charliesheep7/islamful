import {
  LetterText,
  BookOpen,
  Droplets,
  PersonStanding,
  ScrollText,
  Columns3,
  Quote,
  Shuffle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Game {
  slug: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

const games: Game[] = [
  {
    slug: 'islamic-wordle',
    name: 'Islamic Wordle',
    nameAr: 'وردل إسلامي',
    description: 'Guess the Islamic term in 6 tries. A new word every day.',
    descriptionAr: 'خمّن المصطلح الإسلامي في 6 محاولات. كلمة جديدة كل يوم.',
    icon: LetterText,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    slug: 'quran-verse-quiz',
    name: 'Quran Verse Quiz',
    nameAr: 'اختبار الآيات القرآنية',
    description: 'Can you guess which surah a verse is from? Test your Quran knowledge.',
    descriptionAr: 'هل تستطيع تخمين من أي سورة هذه الآية؟ اختبر معرفتك بالقرآن.',
    icon: BookOpen,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    slug: 'wudu-steps',
    name: 'Wudu Steps',
    nameAr: 'خطوات الوضوء',
    description: 'Put the steps of wudu in the correct order. Perfect for learners.',
    descriptionAr: 'رتّب خطوات الوضوء بالترتيب الصحيح. مثالي للمتعلمين.',
    icon: Droplets,
    iconBg: 'bg-sky-100 dark:bg-sky-900/30',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
  {
    slug: 'salah-sequence',
    name: 'Salah Sequence',
    nameAr: 'ترتيب الصلاة',
    description: 'Order the positions of salah correctly. Learn the prayer sequence.',
    descriptionAr: 'رتّب أركان الصلاة بالترتيب الصحيح. تعلّم تسلسل الصلاة.',
    icon: PersonStanding,
    iconBg: 'bg-violet-100 dark:bg-violet-900/30',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    slug: 'prophet-stories-quiz',
    name: 'Prophet Stories Quiz',
    nameAr: 'اختبار قصص الأنبياء',
    description: 'Test your knowledge of the prophets mentioned in the Quran.',
    descriptionAr: 'اختبر معرفتك بالأنبياء المذكورين في القرآن الكريم.',
    icon: ScrollText,
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    slug: 'pillar-builder',
    name: 'Pillar Builder',
    nameAr: 'بناء الأركان',
    description: 'Match the 5 pillars of Islam with their descriptions and requirements.',
    descriptionAr: 'طابق أركان الإسلام الخمسة مع أوصافها ومتطلباتها.',
    icon: Columns3,
    iconBg: 'bg-teal-100 dark:bg-teal-900/30',
    iconColor: 'text-teal-600 dark:text-teal-400',
  },
  {
    slug: 'hadith-or-not',
    name: 'Hadith or Not?',
    nameAr: 'حديث أم لا؟',
    description: 'Is this a real hadith or a fabricated one? Test your knowledge.',
    descriptionAr: 'هل هذا حديث صحيح أم موضوع؟ اختبر معرفتك.',
    icon: Quote,
    iconBg: 'bg-rose-100 dark:bg-rose-900/30',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    slug: 'ayah-scramble',
    name: 'Ayah Scramble',
    nameAr: 'ترتيب الآية',
    description: 'Unscramble the words of a Quran verse and put them in the right order.',
    descriptionAr: 'أعد ترتيب كلمات الآية القرآنية بالترتيب الصحيح.',
    icon: Shuffle,
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
]

export default games
