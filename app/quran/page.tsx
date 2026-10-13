import { QuranHome, quranMetadata } from '@/components/quran/QuranPages'
export const metadata = quranMetadata('en')
export default function Page() {
  return <QuranHome lang="en" />
}
