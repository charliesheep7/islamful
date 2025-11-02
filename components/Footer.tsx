'use client'

import { Fragment, useState } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  const [showPartnersModal, setShowPartnersModal] = useState(false)
  const t = (key: string) => key.charAt(0).toUpperCase() + key.slice(1)

  const partners = [
    {
      name: 'Good AI Tools',
      url: 'https://goodaitools.com',
      type: 'image',
      imageSrc: 'https://goodaitools.com/assets/images/badge.png',
      height: 54,
    },
    {
      name: 'AIStage',
      url: 'https://aistage.net',
      type: 'text',
    },
    {
      name: 'Acid Tools',
      url: 'https://acidtools.com',
      type: 'image',
      imageSrc: 'https://acidtools.com/assets/images/badge.png',
      height: 54,
    },
    {
      name: 'Software Bolt',
      url: 'https://softwarebolt.com',
      type: 'image',
      imageSrc: 'https://softwarebolt.com/assets/images/badge.png',
      height: 54,
    },
    {
      name: 'Solver Tools',
      url: 'https://solvertools.com',
      type: 'image',
      imageSrc: 'https://solvertools.com/assets/images/badge.png',
      height: 54,
    },
  ]

  return (
    <>
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
            <span>•</span>
            <button
              onClick={() => setShowPartnersModal(true)}
              className="transition-colors hover:text-[--color-accent-600] dark:hover:text-[--color-accent-400]"
            >
              {t('partners')}
            </button>
          </div>
        </div>
      </footer>

      {/* Partners Modal */}
      <Transition appear show={showPartnersModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowPartnersModal(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl transition-all dark:border-gray-800 dark:bg-gray-900">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Our Partners
                    </h2>
                    <button
                      onClick={() => setShowPartnersModal(false)}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                      aria-label="Close modal"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                    Check out our amazing partners and discover more useful tools and resources.
                  </p>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {partners.map((partner) => (
                      <a
                        key={partner.name}
                        href={partner.url}
                        target="_blank"
                        title={partner.name}
                        className="group flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-6 transition-all hover:border-[--color-accent-400] hover:bg-[--color-accent-50] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-[--color-accent-600] dark:hover:bg-gray-800"
                      >
                        {partner.type === 'image' ? (
                          <img
                            src={partner.imageSrc}
                            alt={partner.name}
                            height={partner.height}
                            className="max-h-[54px] transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <span className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-[--color-accent-600] dark:text-white dark:group-hover:text-[--color-accent-400]">
                            {partner.name}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>

                  <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong className="font-semibold text-gray-900 dark:text-white">
                        Want to be featured here?
                      </strong>{' '}
                      Contact us to discuss partnership opportunities.
                    </p>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
