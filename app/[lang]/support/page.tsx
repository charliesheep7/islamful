import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
import SectionContainer from '@/components/SectionContainer'

export const metadata = genPageMetadata({
  title: 'الدعم',
  description: 'هل تحتاج مساعدة مع DeenBack؟ تواصل مع الدعم عبر vip@deenback.com.',
  alternates: buildLanguageAlternates('/support', { currentLanguage: 'ar' }),
})

export default function SupportPageAr() {
  return (
    <SectionContainer>
      <div className="prose dark:prose-invert max-w-none py-8" dir="rtl">
        <h1>الدعم</h1>
        <p>إذا كنت تحتاج مساعدة في الحساب أو الدفع أو مشاكل التطبيق، تواصل معنا عبر البريد.</p>

        <h2>التواصل</h2>
        <p>
          <strong>البريد الإلكتروني:</strong>{' '}
          <a href="mailto:vip@deenback.com" dir="ltr">
            vip@deenback.com
          </a>
        </p>

        <h2>ماذا ترسل في الرسالة</h2>
        <ul>
          <li>البريد الإلكتروني المرتبط بحسابك</li>
          <li>وصف مختصر للمشكلة</li>
          <li>صور للشاشة (إن وجدت)</li>
          <li>نوع الجهاز وإصدار التطبيق (إن توفر)</li>
        </ul>
      </div>
    </SectionContainer>
  )
}
