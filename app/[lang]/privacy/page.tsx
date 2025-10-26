import { buildLanguageAlternates } from 'app/seo'
import { metadata as englishMetadata } from '../../privacy/page'

export const metadata = {
  ...englishMetadata,
  alternates: buildLanguageAlternates('/privacy', { currentLanguage: 'ar' }),
}

export { default } from '../../privacy/page'
