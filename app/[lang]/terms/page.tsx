import { buildLanguageAlternates } from 'app/seo'
import { metadata as englishMetadata } from '../../terms/page'

export const metadata = {
  ...englishMetadata,
  alternates: buildLanguageAlternates('/terms', { currentLanguage: 'ar' }),
}

export { default } from '../../terms/page'
