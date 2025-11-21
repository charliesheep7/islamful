import fs from 'fs'
import path from 'path'
import { config } from './config/settings.js'
import { getTopicByNumber } from './utils/jsonl-parser.js'
import { generateBlogContent, generateHeroImage } from './utils/openai.js'
import { validateMDX } from './utils/formatter.js'
import { generateEnglishPrompt } from './prompts/master-prompt-en.js'
import { runContentQA } from './utils/content-qa.js'

async function generateEnglishBlog(topicNumber = 1) {
  console.log(`\n🚀 Starting English blog generation for topic #${topicNumber}...\n`)

  try {
    // Step 1: Load topic
    console.log('📖 Loading topic from JSONL...')
    const topic = getTopicByNumber(config.TOPICS_EN, topicNumber)
    console.log(`✅ Loaded: "${topic.title}"`)

    // Step 2: Generate blog content
    console.log('\n✍️  Generating blog content with GPT-5-mini...')
    const prompt = generateEnglishPrompt(topic)
    const generatedContent = await generateBlogContent(prompt)
    console.log('✅ Content generated successfully')

    // Step 3: Parse FAQs from generated content
    console.log('\n🔍 Extracting FAQs...')
    const faqs = parseFAQsFromContent(generatedContent, topic)
    console.log(`✅ Extracted ${faqs.length} FAQs`)

    // Step 4: Generate hero image
    console.log('\n🎨 Generating hero image...')
    const imagePath = await generateHeroImage(topic.title, topic.slug, 'en')
    console.log(`✅ Image saved: ${imagePath}`)

    // Step 5: Use generated content directly (it already has front matter from OpenAI)
    console.log('\n📝 Using generated MDX content...')
    let mdxContent = generatedContent

    // Step 6: Run automatic QA + repair pass
    console.log('\n🛡️  Running QA guardrail (links, video, tone)...')
    const qaResult = await runContentQA({ mdxContent, language: 'en', topic })
    if (qaResult.success) {
      mdxContent = qaResult.mdx
      const invalidVideos =
        qaResult.youtubeStatus?.embeds?.filter((embed) => embed && !embed.valid)?.length || 0
      console.log(
        `✅ QA applied. Broken links fixed: ${qaResult.brokenLinkCount}, Videos fixed/removed: ${invalidVideos}`
      )
    } else {
      console.warn(`⚠️ QA fallback: ${qaResult.error || 'unknown error'}. Using original content.`)
    }

    // Step 7: Validate MDX
    console.log('🔍 Validating MDX...')
    if (!validateMDX(mdxContent)) {
      throw new Error('MDX validation failed')
    }
    console.log('✅ MDX validated')

    // Step 8: Save MDX file
    console.log('\n💾 Saving MDX file...')
    const outputPath = path.join(config.OUTPUT_DIR_EN, `${topic.slug}.mdx`)

    // Create directory if it doesn't exist
    if (!fs.existsSync(config.OUTPUT_DIR_EN)) {
      fs.mkdirSync(config.OUTPUT_DIR_EN, { recursive: true })
    }

    fs.writeFileSync(outputPath, mdxContent)
    console.log(`✅ File saved: ${outputPath}`)

    console.log('\n🎉 Blog post generated successfully!\n')
    console.log(`📄 Title: ${topic.title}`)
    console.log(`🔗 Slug: ${topic.slug}`)
    console.log(`📊 Word count: ~${generatedContent.split(' ').length} words`)
    console.log(`❓ FAQs: ${faqs.length}`)
    console.log(`🖼️  Image: ${imagePath}`)
  } catch (error) {
    console.error('\n❌ Error generating blog:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

/**
 * Parse FAQs from AI-generated content
 * Expects FAQs in the frontmatter YAML format within the generated content
 */
function parseFAQsFromContent(content, topic) {
  const faqs = []

  // Look for YAML FAQ format in the content
  const faqMatch = content.match(/faqs:\s*\n((?:\s*-\s*question:[\s\S]*?answer:[\s\S]*?\n)+)/)

  if (faqMatch) {
    const faqBlock = faqMatch[1]
    const faqItems = faqBlock.split(/\s*-\s*question:/).filter(Boolean)

    for (const item of faqItems) {
      const questionMatch = item.match(/^(.+?)\n\s*answer:\s*(.+)/s)
      if (questionMatch) {
        faqs.push({
          question: questionMatch[1].trim().replace(/^["']|["']$/g, ''),
          answer: questionMatch[2].trim().replace(/^["']|["']$/g, ''),
        })
      }
    }
  }

  // Fallback: extract from FAQ section in content
  if (faqs.length === 0) {
    const faqSectionMatch = content.match(/##\s*(FAQ|Frequently Asked Questions)/i)
    if (faqSectionMatch) {
      const faqSection = content.substring(faqSectionMatch.index)
      const qaMatches = faqSection.matchAll(/###\s*(.+?)\n\n(.+?)(?=\n###|\n##|$)/gs)

      for (const match of qaMatches) {
        if (faqs.length < 6) {
          faqs.push({
            question: match[1].trim(),
            answer: match[2].trim().replace(/\n/g, ' '),
          })
        }
      }
    }
  }

  // Ensure we have exactly 6 FAQs
  while (faqs.length < 6) {
    faqs.push({
      question: `Additional question about ${topic.title}?`,
      answer: 'This FAQ needs to be filled manually.',
    })
  }

  return faqs.slice(0, 6)
}

// Run the script
const topicNumber = parseInt(process.argv[2]) || 1
generateEnglishBlog(topicNumber)
