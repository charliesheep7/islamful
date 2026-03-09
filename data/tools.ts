import {
  Clock,
  ShieldCheck,
  HandHeart,
  Repeat,
  Star,
  Calendar,
  Calculator,
  Compass,
  Scale,
  Landmark,
  Baby,
  Cake,
  BookOpen,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Tool {
  slug: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
  status: 'live' | 'coming-soon'
}

const tools: Tool[] = [
  {
    slug: 'answers',
    name: 'Quran Answers',
    nameAr: 'إجابات القرآن',
    description:
      'Ask any question and receive a beautiful Quran verse as your answer. Generate and share stunning verse cards.',
    descriptionAr:
      'اسأل أي سؤال واحصل على آية جميلة من القرآن الكريم كإجابة. أنشئ وشارك بطاقات آيات رائعة.',
    icon: BookOpen,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    status: 'live',
  },
  {
    slug: 'prayer-times',
    name: 'Prayer Times',
    nameAr: 'مواقيت الصلاة',
    description:
      'Accurate prayer times for any location worldwide. Never miss Fajr, Dhuhr, Asr, Maghrib, or Isha again.',
    descriptionAr:
      'مواقيت صلاة دقيقة لأي موقع حول العالم. لا تفوّت الفجر أو الظهر أو العصر أو المغرب أو العشاء.',
    icon: Clock,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    status: 'live',
  },
  {
    slug: 'haram-check',
    name: 'Is This Haram?',
    nameAr: 'هل هذا حرام؟',
    description:
      'Check whether anything is halal or haram — food, activities, lifestyle choices, finance, and more.',
    descriptionAr: 'تحقق من حكم أي شيء — طعام، أنشطة، أسلوب حياة، معاملات مالية، والمزيد.',
    icon: ShieldCheck,
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-600 dark:text-orange-400',
    status: 'live',
  },
  {
    slug: 'dua',
    name: 'Dua Collection',
    nameAr: 'مجموعة الأدعية',
    description:
      'A curated collection of authentic duas for every occasion — morning, evening, travel, meals, and more.',
    descriptionAr:
      'مجموعة منتقاة من الأدعية الصحيحة لكل مناسبة — الصباح والمساء والسفر والطعام وغيرها.',
    icon: HandHeart,
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    status: 'live',
  },
  {
    slug: 'dhikr',
    name: 'Dhikr Counter',
    nameAr: 'عداد الأذكار',
    description:
      'Digital tasbeeh counter for your daily dhikr. Track SubhanAllah, Alhamdulillah, Allahu Akbar, and custom dhikr.',
    descriptionAr:
      'عداد تسبيح رقمي لأذكارك اليومية. تتبّع سبحان الله والحمد لله والله أكبر وأذكار مخصصة.',
    icon: Repeat,
    iconBg: 'bg-teal-100 dark:bg-teal-900/30',
    iconColor: 'text-teal-600 dark:text-teal-400',
    status: 'live',
  },
  {
    slug: 'names-of-allah',
    name: '99 Names of Allah',
    nameAr: 'أسماء الله الحسنى',
    description:
      'Learn and memorize the 99 beautiful names of Allah with meanings, audio, and explanations.',
    descriptionAr: 'تعلّم واحفظ أسماء الله الحسنى التسعة والتسعين مع المعاني والصوت والشرح.',
    icon: Star,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
    status: 'live',
  },
  {
    slug: 'islamic-calendar',
    name: 'Islamic Calendar',
    nameAr: 'التقويم الهجري',
    description: 'Hijri to Gregorian calendar converter with important Islamic dates and events.',
    descriptionAr: 'محول التقويم الهجري إلى الميلادي مع التواريخ والمناسبات الإسلامية المهمة.',
    icon: Calendar,
    iconBg: 'bg-rose-100 dark:bg-rose-900/30',
    iconColor: 'text-rose-600 dark:text-rose-400',
    status: 'live',
  },
  {
    slug: 'zakat-calculator',
    name: 'Zakat Calculator',
    nameAr: 'حاسبة الزكاة',
    description:
      'Calculate your zakat obligation accurately based on your savings, gold, silver, and investments.',
    descriptionAr: 'احسب زكاتك بدقة بناءً على مدخراتك وذهبك وفضتك واستثماراتك.',
    icon: Calculator,
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    status: 'live',
  },
  {
    slug: 'qibla-finder',
    name: 'Qibla Finder',
    nameAr: 'محدد القبلة',
    description:
      'Find the exact Qibla direction from anywhere in the world. Live compass for mobile, bearing angle for desktop.',
    descriptionAr:
      'حدد اتجاه القبلة من أي مكان في العالم. بوصلة حية للجوال وزاوية الاتجاه لسطح المكتب.',
    icon: Compass,
    iconBg: 'bg-cyan-100 dark:bg-cyan-900/30',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    status: 'live',
  },
  {
    slug: 'inheritance-calculator',
    name: 'Inheritance Calculator',
    nameAr: 'حاسبة المواريث',
    description:
      "Calculate Islamic inheritance shares (Faraid) per Quran 4:11-12. See each heir's share with Quranic references.",
    descriptionAr:
      'احسب أنصبة الميراث الشرعية (الفرائض) وفق القرآن الكريم. اطلع على نصيب كل وارث مع المراجع القرآنية.',
    icon: Scale,
    iconBg: 'bg-violet-100 dark:bg-violet-900/30',
    iconColor: 'text-violet-600 dark:text-violet-400',
    status: 'live',
  },
  {
    slug: 'muslim-names',
    name: 'Muslim Baby Names',
    nameAr: 'أسماء إسلامية',
    description:
      'Search 265+ Islamic baby names with Arabic script, meanings, and origins. Filter by gender, category, and more.',
    descriptionAr:
      'ابحث في أكثر من 265 اسمًا إسلاميًا مع الكتابة العربية والمعاني والأصول. فلتر حسب الجنس والفئة والمزيد.',
    icon: Baby,
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    status: 'live',
  },
  {
    slug: 'islamic-mortgage',
    name: 'Islamic Mortgage Calculator',
    nameAr: 'حاسبة التمويل الإسلامي',
    description:
      'Compare Murabaha, Ijara, and Diminishing Musharaka against conventional mortgages. See total costs side by side.',
    descriptionAr:
      'قارن بين المرابحة والإجارة والمشاركة المتناقصة والرهن التقليدي. شاهد التكاليف الإجمالية جنباً إلى جنب.',
    icon: Landmark,
    iconBg: 'bg-sky-100 dark:bg-sky-900/30',
    iconColor: 'text-sky-600 dark:text-sky-400',
    status: 'live',
  },
  {
    slug: 'hijri-birthday',
    name: 'Hijri Birthday Calculator',
    nameAr: 'حاسبة عيد الميلاد الهجري',
    description:
      'Find your Islamic birthday in the Hijri calendar, your age in lunar years, and when your next Hijri birthday falls.',
    descriptionAr:
      'اكتشف تاريخ ميلادك الهجري وعمرك بالسنوات القمرية وموعد عيد ميلادك الهجري القادم.',
    icon: Cake,
    iconBg: 'bg-pink-100 dark:bg-pink-900/30',
    iconColor: 'text-pink-600 dark:text-pink-400',
    status: 'live',
  },
]

export default tools
