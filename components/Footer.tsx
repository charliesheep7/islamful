import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  const t = (key: string) => key.charAt(0).toUpperCase() + key.slice(1)
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          {/* Show only X if provided */}
          <SocialIcon kind="x" href={siteMetadata.x} size={6} />
        </div>
        <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{`© ${new Date().getFullYear()} ${siteMetadata.title}`}</div>
        </div>
        <div className="mb-8 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/privacy">{t('privacy')}</Link>
          <span>•</span>
          <Link href="/terms">{t('terms')}</Link>
        </div>
      </div>
    </footer>
  )
}
