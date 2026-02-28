import { Clock, ShieldCheck, HandHeart, Repeat, Star, Calendar, Calculator } from 'lucide-react'
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
      'Check whether food, ingredients, or everyday items are halal or haram according to Islamic guidelines.',
    descriptionAr:
      'تحقق مما إذا كانت الأطعمة أو المكونات أو المنتجات حلالاً أم حراماً وفقاً للإسلام.',
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
]

export default tools
