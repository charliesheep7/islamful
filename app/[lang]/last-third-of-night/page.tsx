import { notFound } from 'next/navigation'
import { nightPages } from '@/data/locales/night'
import NightPlannerPage from '@/components/tools/NightPlannerPage'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'

const arabic = {
  title: 'حاسبة الثلث الأخير من الليل ووقت التهجد',
  description:
    'احسب الثلث الأخير من الليل ومنتصف الليل من مواقيت مدينتك أو أدخل المغرب والفجر يدويًا، ونزّل حدثًا للتقويم.',
}

export function generateStaticParams() {
  return ['ar', 'fr', 'de'].map((lang) => ({ lang }))
}
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  const c = lang === 'ar' ? arabic : nightPages[lang]
  return genPageMetadata({
    title: c.title,
    description: c.description,
    alternates: buildLanguageAlternates('/last-third-of-night', { currentLanguage: lang }),
  })
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (lang !== 'ar' && lang !== 'fr' && lang !== 'de') notFound()
  return <NightPlannerPage lang={lang} />
}
