# SEO Blog Generator for Fapulous

This tool generates high-quality SEO blog posts for the Fapulous recovery app using OpenAI's GPT-5-mini and GPT Image 1 models.

## Features

- 🤖 **AI-Powered Content**: Uses GPT-5-mini-2025-08-07 for content generation
- 🖼️ **Auto Image Generation**: Creates hero images with GPT Image 1
- 🎥 **YouTube Integration**: Finds relevant recovery videos via AI
- 📝 **SEOBot Compliance**: Follows all SEOBot guidelines and best practices
- 🎯 **Target Audience**: Optimized for men struggling with porn addiction
- 📊 **6 FAQs**: Automatically generates FAQ schema for rich snippets
- 🏷️ **Complete Metadata**: SEO titles, descriptions, and tags

## Setup

1. **Install Dependencies**

   ```bash
   cd seo-blog-generator
   npm install
   ```

2. **Configure Environment**

   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

3. **Set API Key**
   ```bash
   # In .env file:
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Usage

### From Project Root

```bash
npm run generate-blog
```

### From Generator Directory

```bash
cd seo-blog-generator
npm run generate
```

### Interactive Menu

The tool will guide you through:

1. **Topic Selection**: Choose from categories or enter custom topic
2. **Article Type**: How-to, Guide, Comparison, or List
3. **Image Generation**: Create hero image with GPT Image 1
4. **YouTube Search**: Find relevant recovery videos
5. **Content Generation**: Full SEO blog post creation

## Generated Content Structure

```mdx
---
title: 'SEO-optimized title'
date: '2025-01-XX'
updated: '2025-01-XX'
description: '50-160 character meta description'
author: 'Fapulous Team'
reviewedBy: 'AI Content Review'
tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
featured: false
draft: true
faqs:
  - question: 'Question 1'
    answer: 'Answer 1'
  # ... 6 total FAQs
---

## Title

<Image src="/images/blog/slug/hero.png" alt="..." width={800} height={600} />

Introduction with immediate value...

<div className="my-6 aspect-video">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID" ... />
</div>

## Main Content Sections

...

## Conclusion
```

## Topic Categories

- 🎯 **Recovery Strategies**: Overcoming addiction, building habits
- 🧠 **Brain Science**: Neuroplasticity, dopamine, withdrawal
- 🌱 **Mental Health**: Shame, guilt, confidence, anxiety
- 👥 **Relationships**: Dating, trust, social skills
- ⚡ **Healthy Habits**: Exercise, sleep, nutrition, hobbies
- 💪 **Common Challenges**: Urges, stress, boredom, triggers

## Output

Generated files are automatically saved to:

- **Main Blog Post**: `/content/blog/[number]-[slug].mdx` (ready to publish)
- **Backup Copy**: `./output/[number]-[slug].mdx`
- **Hero Image**: `../public/images/blog/[number]-[slug]/hero.webp`
- **Logs**: `./logs/generation-YYYY-MM-DD.log`

### Auto-Numbering System

The generator automatically:

- Scans `/content/blog/` for the highest numbered post (currently 98)
- Creates the next sequential number (99, 100, 101, etc.)
- Uses format: `99-how-to-overcome-addiction.mdx`

## Next Steps After Generation

1. Review the generated content in `/content/blog/`
2. Update `draft: false` when ready to publish
3. Run `npm run dev` to preview the blog post
4. Blog will be live at `/blog/[slug-without-number]`

## Configuration

Edit `config/settings.js` to customize:

- OpenAI model settings
- Output directories
- Default metadata
- Target audience details

## Troubleshooting

### API Key Issues

```bash
Error: OpenAI API key is required
```

**Solution**: Set `OPENAI_API_KEY` in your `.env` file

### Image Generation Fails

- Check if GPT Image 1 model is available in your account
- Verify sufficient API credits
- Review image prompt for inappropriate content

### YouTube Video Search

- AI-powered video search (no YouTube API key required)
- Falls back to motivational videos if search fails

## Models Used

- **Text Generation**: `gpt-5-mini-2025-08-07`
- **Image Generation**: `gpt-image-1`
- **Video Search**: `gpt-5-mini-2025-08-07` (AI-powered search)

## Content Guidelines

All generated content follows:

- Evidence-based information only
- Empathetic, non-judgmental tone
- No medical advice or diagnoses
- Focus on recovery and positive change
- SEOBot compliance for maximum SEO impact
