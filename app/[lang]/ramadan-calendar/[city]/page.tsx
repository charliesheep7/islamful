import FastingPage from '@/components/fasting/FastingPage'
import { fastingCityMetadata } from '@/components/fasting/metadata'
import { getCityBySlug } from '@/data/cities'
import { notFound } from 'next/navigation'
type Props = { params: Promise<{ city: string }> }
export async function generateMetadata({ params }: Props) {
  const city = getCityBySlug((await params).city)
  return city ? fastingCityMetadata(city, 'ar') : {}
}
export default async function Page({ params }: Props) {
  const city = getCityBySlug((await params).city)
  if (!city) notFound()
  return <FastingPage lang="ar" ramadan city={city} />
}

// Refresh the dated server snapshot; the browser follows the city clock live.
export const revalidate = 3600
