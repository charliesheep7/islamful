import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Privacy Policy' })

export default function PrivacyPage() {
  return (
    <div className="prose dark:prose-invert max-w-none py-8">
      <h1>Privacy Policy</h1>
      <p>
        This is a placeholder Privacy Policy for the VisaCalm MVP. We respect your privacy and will
        update this page with full details before launch.
      </p>
    </div>
  )
}
