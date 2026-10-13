import NightPlannerPage from '@/components/tools/NightPlannerPage'
import { genPageMetadata, buildLanguageAlternates } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'حاسبة الثلث الأخير من الليل ووقت التهجد',
  description:
    'احسب الثلث الأخير من الليل ومنتصف الليل من مواقيت مدينتك أو أدخل المغرب والفجر يدويًا، ونزّل حدثًا للتقويم.',
  alternates: buildLanguageAlternates('/last-third-of-night', { currentLanguage: 'ar' }),
})

export default function Page() {
  return <NightPlannerPage lang="ar" />
}
