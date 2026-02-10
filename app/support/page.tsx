import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
import SectionContainer from '@/components/SectionContainer'

export const metadata = genPageMetadata({
  title: 'Support',
  description: 'Need help with DeenBack? Contact support at vip@deenup.app.',
  alternates: buildLanguageAlternates('/support'),
})

export default function SupportPage() {
  return (
    <SectionContainer>
      <div className="prose dark:prose-invert max-w-none py-8">
        <h1>Support</h1>
        <p>
          If you need help with your account, billing, or app issues, contact our support team by
          email.
        </p>

        <h2>Contact</h2>
        <p>
          <strong>Email:</strong> <a href="mailto:vip@deenup.app">vip@deenup.app</a>
        </p>

        <h2>What to Include</h2>
        <ul>
          <li>Your account email address</li>
          <li>A short description of the issue</li>
          <li>Screenshots (if applicable)</li>
          <li>Your device and app version (if known)</li>
        </ul>
      </div>
    </SectionContainer>
  )
}
