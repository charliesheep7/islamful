import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  const t = (key: string) => key.charAt(0).toUpperCase() + key.slice(1)
  return (
    <footer className="mt-24 border-t border-gray-200/50 bg-[--color-surface] dark:border-gray-800/50 dark:bg-gray-900">
      <div className="flex flex-col items-center py-12">
        <div className="mb-4 flex space-x-4">
          {/* Social links - placeholders for X and Instagram (TikTok to be added later) */}
          {siteMetadata.x && <SocialIcon kind="x" href={siteMetadata.x} size={6} />}
          {siteMetadata.instagram && (
            <SocialIcon kind="instagram" href={siteMetadata.instagram} size={6} />
          )}
        </div>{' '}
        <div className="mb-3 text-sm font-medium text-[--color-text] dark:text-gray-300">
          <div>{`© ${new Date().getFullYear()} ${siteMetadata.author}`}</div>
        </div>
        <div className="mb-2 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <Link
            href="/privacy"
            className="transition-colors hover:text-[--color-accent-600] dark:hover:text-[--color-accent-400]"
          >
            {t('privacy')}
          </Link>
          <span>•</span>
          <Link
            href="/terms"
            className="transition-colors hover:text-[--color-accent-600] dark:hover:text-[--color-accent-400]"
          >
            {t('terms')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
