import { buildLanguageAlternates } from 'app/seo'
import { metadata as englishMetadata } from '../../about/page'

export const metadata = {
  ...englishMetadata,
  alternates: buildLanguageAlternates('/about', { currentLanguage: 'ar' }),
}

export { default } from '../../about/page'
