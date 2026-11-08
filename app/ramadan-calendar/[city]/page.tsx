import FastingPage from '@/components/fasting/FastingPage'
import { fastingCityMetadata } from '@/components/fasting/metadata'
import cities, { getCityBySlug } from '@/data/cities'
import { notFound } from 'next/navigation'

// Every city, prebuilt; any other slug is a 404 (as getCityBySlug decides).
export const dynamicParams = false
export function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }))
}
type Props = { params: Promise<{ city: string }> }
export async function generateMetadata({ params }: Props) {
  const city = getCityBySlug((await params).city)
  return city ? fastingCityMetadata(city, 'en') : {}
}
export default async function Page({ params }: Props) {
  const city = getCityBySlug((await params).city)
  if (!city) notFound()
  return <FastingPage lang="en" ramadan city={city} />
}

// Refresh the dated server snapshot; the browser follows the city clock live.
export const revalidate = 3600
