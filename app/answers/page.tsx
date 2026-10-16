import { Metadata } from 'next'
import QuranAnswersPage from '@/components/tools/QuranAnswersPage'
import { answersCopy } from '@/data/locales/answers'
import { buildLanguageAlternates } from 'app/seo'
export const metadata: Metadata = {
  title: answersCopy.en.title,
  description: answersCopy.en.description,
  alternates: buildLanguageAlternates('/answers'),
}
export default function Page() {
  return <QuranAnswersPage />
}
