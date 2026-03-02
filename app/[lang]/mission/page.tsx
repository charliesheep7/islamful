import { buildLanguageAlternates } from 'app/seo'
import { metadata as englishMetadata } from '../../mission/page'

export const metadata = {
  ...englishMetadata,
  alternates: buildLanguageAlternates('/mission', { currentLanguage: 'ar' }),
}

export { default } from '../../mission/page'
