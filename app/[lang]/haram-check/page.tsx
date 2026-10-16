import HaramPage, { haramMetadata } from '@/components/tools/HaramPage'
import type { Locale } from '@/utils/locale'
type Props = { params: Promise<{ lang: Locale }> }
export async function generateMetadata({ params }: Props) {
  return haramMetadata((await params).lang)
}
export default async function Page({ params }: Props) {
  return <HaramPage lang={(await params).lang} />
}
