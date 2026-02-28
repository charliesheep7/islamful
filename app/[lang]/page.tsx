import Hero from '@/components/landing/Hero'
import ToolsGrid from '@/components/landing/ToolsGrid'
import CTA from '@/components/landing/CTA'
import FAQ from '@/components/landing/FAQ'
import { getDictionary } from './dictionaries'
import { buildLanguageAlternates, genPageMetadata } from 'app/seo'

export function generateStaticParams() {
  return [{ lang: 'ar' }]
}

export default async function LangHome({ params }: { params: Promise<{ lang: 'ar' }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="flex flex-col">
      <Hero lang={lang} dict={dict} />
      <ToolsGrid lang={lang} dict={dict} />
      <CTA lang={lang} dict={dict} />
      <FAQ lang={lang} dict={dict} />
    </div>
  )
}

export const metadata = genPageMetadata({
  title: 'إسلامفُل — رفيقك الإسلامي الشامل',
  description:
    'مواقيت الصلاة، فحص الحلال والحرام، القرآن، الأدعية، الأذكار، والمزيد — كل شيء في مكان واحد. أدوات إسلامية مجانية لكل مسلم.',
  alternates: buildLanguageAlternates('/', { currentLanguage: 'ar' }),
})
