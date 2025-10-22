export type Dictionary = {
  nav: {
    home: string
    blog: string
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
    ctaPrimary: string
    ctaSecondary: string
    comingSoon: string
    appStatus: string
  }
  features: {
    heading: string
    subtitle: string
    learnMore: string
    aiCompanion: {
      title: string
      description: string
    }
    dailyChecklist: {
      title: string
      description: string
    }
    letters: {
      title: string
      description: string
    }
  }
  cta: {
    badge: string
    heading: string
    subtitle: string
    downloadIOS: string
    downloadAndroid: string
    comingSoonText: string
  }
  testimonials: {
    heading: string
    subtitle: string
    readMore: string
    showLess: string
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
