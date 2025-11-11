import dotenv from 'dotenv'

dotenv.config()

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    orgId: process.env.OPENAI_ORG_ID,
    textModel: 'gpt-5-mini-2025-08-07',
    imageModel: 'gpt-5',
    maxTokens: parseInt(process.env.MAX_TOKENS) || 4000,
    temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
  },
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY,
  },
  generation: {
    outputDir: './output',
    imageDir: '../public/images/blog',
    logDir: './logs',
    defaultAuthor: 'Fapulous Team',
    defaultReviewer: 'AI Content Review',
    faqCount: 6,
  },
  audience: {
    demographics: 'English-speaking men aged 10s-20s in the US',
    painPoints: [
      'Porn addiction struggles',
      'Shame and guilt',
      'Brain fog and fatigue',
      'Lack of self-control',
      'Social/emotional difficulties',
    ],
    productUsage: 'Daily journaling, trigger tracking, community support',
  },
  TOPICS_EN: './data/topics-en.jsonl',
  OUTPUT_DIR_EN: '../data/blog/en',
  TOPICS_AR: './data/topics-ar.jsonl',
  OUTPUT_DIR_AR: '../data/blog/ar',
}
