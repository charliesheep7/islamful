import { QuranHome, quranMetadata } from '@/components/quran/QuranPages'
export const metadata = quranMetadata('ar')
export default function Page() {
  return <QuranHome lang="ar" />
}
