export type Dictionary = {
  nav: {
    home: string
    blog: string
    prayerTimes: string
    haramCheck: string
  }
  footer: {
    privacy: string
    terms: string
  }
  home: {
    latest: string
    noPosts: string
    readMore: string
    allPosts: string
    publishedOn: string
  }
  hero: {
    badge: string
    tagline: string
    subtitle: string
    exploreCta: string
  }
  tools: {
    heading: string
    subtitle: string
    explore: string
    comingSoon: string
  }
  cta: {
    heading: string
    subtitle: string
    exploreCta: string
  }
  faq: {
    badge: string
    heading: string
    subtitle: string
    stillHaveQuestions: string
    contactSupport: string
    items: Array<{
      question: string
      answer: string
    }>
  }
}
