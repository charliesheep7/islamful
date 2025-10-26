/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'DeenUp - Your Islamic Companion',
  author: 'DeenUp',
  headerTitle: 'DeenUp',
  description:
    'Track your daily Deen, get Quranic-cited answers 24/7, and connect with Muslim brothers and sisters worldwide. Your AI-powered Islamic companion.',
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: 'https://deenup.app',
  siteRepo: '',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/Apple/App_store_1024_1x.svg`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  mastodon: '',
  email: '',
  github: '',
  x: '', // Placeholder - to be added later
  // twitter: 'https://twitter.com/Twitter',
  facebook: '',
  youtube: '',
  linkedin: '',
  threads: '',
  instagram: '', // Placeholder - to be added later
  tiktok: '', // Placeholder - to be added later
  medium: '',
  bluesky: '',
  locale: 'en-US',
  // set to true if you want a navbar fixed to the top
  stickyNav: false,
  analytics: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // supports Plausible, Simple Analytics, Umami, Posthog or Google Analytics.
    umamiAnalytics: {
      // We use an env variable for this site to avoid other users cloning our analytics ID
      umamiWebsiteId: process.env.NEXT_UMAMI_ID, // e.g. 123e4567-e89b-12d3-a456-426614174000
      // You may also need to overwrite the script if you're storing data in the US - ex:
      // src: 'https://us.umami.is/script.js'
      // Remember to add 'us.umami.is' in `next.config.js` as a permitted domain for the CSP
    },
    // plausibleAnalytics: {
    //   plausibleDataDomain: '', // e.g. tailwind-nextjs-starter-blog.vercel.app
    // If you are hosting your own Plausible.
    //   src: '', // e.g. https://plausible.my-domain.com/js/script.js
    // },
    // simpleAnalytics: {},
    // posthogAnalytics: {
    //   posthogProjectApiKey: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
    // },
    // googleAnalytics: {
    //   googleAnalyticsId: '', // e.g. G-XXXXXXX
    // },
  },
  newsletter: {
    // Disabled for MVP
    provider: '',
  },
  comments: {
    // Disabled for MVP - can be enabled later
    provider: '',
  },
  search: {
    provider: '',
  },
}

module.exports = siteMetadata
