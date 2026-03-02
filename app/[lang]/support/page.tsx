import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
import SectionContainer from '@/components/SectionContainer'

export const metadata = genPageMetadata({
  title: 'الدعم',
  description: 'هل تحتاج مساعدة مع إسلامفُل؟ تجد هنا معلومات الدعم.',
  alternates: buildLanguageAlternates('/support', { currentLanguage: 'ar' }),
})

export default function SupportPageAr() {
  return (
    <SectionContainer>
      <div className="prose dark:prose-invert max-w-none py-8" dir="rtl">
        <h1>الدعم</h1>
        <p>
          إذا كنت تحتاج مساعدة في أي من أدواتنا الإسلامية، يرجى مراجعة قسم الأسئلة الشائعة في الصفحة
          الرئيسية.
        </p>

        <h2>ماذا ترسل عند الإبلاغ عن مشكلة</h2>
        <ul>
          <li>وصف مختصر للمشكلة</li>
          <li>صور للشاشة (إن وجدت)</li>
          <li>نوع الجهاز والمتصفح (إن توفر)</li>
        </ul>
      </div>
    </SectionContainer>
  )
}
