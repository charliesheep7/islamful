import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
import SectionContainer from '@/components/SectionContainer'

export const metadata = genPageMetadata({
  title: 'Support',
  description: 'Need help with Islamful? Find support information here.',
  alternates: buildLanguageAlternates('/support'),
})

export default function SupportPage() {
  return (
    <SectionContainer>
      <div className="prose dark:prose-invert max-w-none py-8">
        <h1>Support</h1>
        <p>
          If you need help with any of our Islamic tools, please check the FAQ section on our
          homepage for common questions and answers.
        </p>

        <h2>What to Include When Reporting Issues</h2>
        <ul>
          <li>A short description of the issue</li>
          <li>Screenshots (if applicable)</li>
          <li>Your device and browser (if known)</li>
        </ul>
      </div>
    </SectionContainer>
  )
}
