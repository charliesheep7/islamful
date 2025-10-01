import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Terms of Service' })

export default function TermsPage() {
  return (
    <div className="prose dark:prose-invert max-w-none py-8">
      <h1>Terms of Service</h1>
      <p>
        These are placeholder Terms for the VisaCalm MVP. Full terms and conditions will be added
        prior to launch.
      </p>
    </div>
  )
}
