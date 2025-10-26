import { genPageMetadata, buildLanguageAlternates } from 'app/seo'
import SectionContainer from '@/components/SectionContainer'

export const metadata = genPageMetadata({
  title: 'Privacy Policy',
  description:
    'Understand what personal data DeenUp collects, how it is used, and the safeguards that protect it.',
  alternates: buildLanguageAlternates('/privacy'),
})

export default function PrivacyPage() {
  return (
    <SectionContainer>
      <div className="prose dark:prose-invert max-w-none py-8">
        <h1>Privacy Policy</h1>
        <p>
          <strong>Last updated: [Oct 25, 2025]</strong>
        </p>
        <p>
          DeenUp ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy
          explains how we collect, use, and protect your information when you use our mobile
          application or related services ("Services").
        </p>
        <p>
          <strong>If you do not agree with this Privacy Policy, please do not use DeenUp.</strong>
        </p>

        <h2>Information We Collect</h2>
        <p>We collect the following types of information:</p>

        <h3>1. Information You Provide</h3>
        <ul>
          <li>Email address for account creation and authentication</li>
          <li>Display name</li>
        </ul>
        <p>We do not collect profile photos or images uploaded by users.</p>

        <h3>2. Conversation Data</h3>
        <ul>
          <li>Messages you send to the AI assistant</li>
        </ul>
        <p>
          Conversation history is stored privately for up to 30 days or until you clear it in the
          app.
        </p>
        <p>
          We do not access or read your conversations. They are processed only to provide the
          service.
        </p>

        <h3>3. Device Information</h3>
        <ul>
          <li>
            Device model, OS version, and related technical information (for security and core
            functionality)
          </li>
        </ul>
        <p>We do not collect precise location, behavioral analytics, or advertising identifiers.</p>

        <h2>How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide, improve, and personalize the Services</li>
          <li>Authenticate users and secure accounts</li>
          <li>Maintain app functionality and prevent abuse</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p>
          We do not sell your data. We do not use your content to train machine learning models.
        </p>

        <h2>AI Processing</h2>
        <p>
          User input may be processed by trusted AI service providers such as OpenAI solely for
          real-time responses. According to their policies, your data is not used for model
          training.
        </p>

        <h2>Data Retention</h2>
        <ul>
          <li>Account data is kept until you delete your account</li>
          <li>Chat history is kept for 30 days or until you delete it manually</li>
          <li>Technical security data may be kept briefly to maintain service integrity</li>
        </ul>

        <h2>Data Sharing</h2>
        <p>We may share data only with:</p>
        <ul>
          <li>Service providers who support app functionality (e.g., Supabase, OpenAI API)</li>
          <li>Authorities if required for legal compliance or safety</li>
        </ul>
        <p>We never share your personal data for advertising purposes.</p>

        <h2>Security</h2>
        <p>We use industry-standard safeguards, including:</p>
        <ul>
          <li>Encryption in transit (HTTPS)</li>
          <li>Encryption at rest via our service providers</li>
        </ul>
        <p>No system can be fully secure, though we work hard to protect your data.</p>

        <h2>Children's Privacy</h2>
        <p>DeenUp is for users 13 years and older.</p>
        <p>
          We do not knowingly collect personal data from children under 13. If we discover such
          data, we will delete it quickly.
        </p>

        <h2>Your Data Rights</h2>
        <p>You can exercise the following rights:</p>
        <ul>
          <li>Delete your account (and all associated data) via the in-app delete feature</li>
          <li>Request help by contacting us if needed</li>
        </ul>
        <p>
          <strong>Email:</strong> vip@deenup.app
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy as needed. Continued use of DeenUp means you accept the
          updated policy.
        </p>

        <h2>Contact Us</h2>
        <p>If you have any questions, please contact:</p>
        <p>📩 vip@deenup.app</p>
      </div>
    </SectionContainer>
  )
}
