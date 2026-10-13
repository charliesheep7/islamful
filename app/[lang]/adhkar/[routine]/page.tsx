import { AdhkarPage, adhkarMetadata } from '@/components/adhkar/AdhkarPages'
import { routines } from '@/data/adhkar'
export const dynamicParams = false
export function generateStaticParams() {
  return routines.map((r) => ({ routine: r.id }))
}
export async function generateMetadata({ params }: { params: Promise<{ routine: string }> }) {
  const { routine } = await params
  return adhkarMetadata('ar', routine)
}
export default async function Page({ params }: { params: Promise<{ routine: string }> }) {
  const { routine } = await params
  return <AdhkarPage lang="ar" id={routine} />
}
