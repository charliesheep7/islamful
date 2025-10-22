import 'server-only'
import type { Dictionary } from '@/types/dictionary'

const dictionaries = {
  en: () => import('../../dictionaries/en.json').then((module) => module.default as Dictionary),
  ar: () => import('../../dictionaries/ar.json').then((module) => module.default as Dictionary),
}

export const getDictionary = async (locale: 'en' | 'ar'): Promise<Dictionary> =>
  dictionaries[locale]?.() ?? dictionaries.en()
