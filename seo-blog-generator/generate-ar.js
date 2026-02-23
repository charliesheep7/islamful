import fs from 'fs'
import path from 'path'
import { config } from './config/settings.js'
import { getTopicByNumber } from './utils/jsonl-parser.js'
import { generateBlogContent, generateHeroImage } from './utils/openai.js'
import { validateMDX } from './utils/formatter.js'
import { generateArabicPrompt } from './prompts/master-prompt-ar.js'
import { runContentQA } from './utils/content-qa.js'

async function generateArabicBlog(topicNumber = 1) {
  console.log(`\n🚀 بدء توليد مدونة عربية للموضوع رقم #${topicNumber}...\n`)

  try {
    // Step 1: Load topic
    console.log('📖 تحميل الموضوع من ملف JSONL...')
    const topic = getTopicByNumber(config.TOPICS_AR, topicNumber)
    console.log(`✅ تم التحميل: "${topic.title}"`)

    // Step 2: Generate blog content
    console.log('\n✍️  توليد محتوى المدونة باستخدام GPT-5-mini...')
    const prompt = generateArabicPrompt(topic)
    const generatedContent = await generateBlogContent(prompt)
    console.log('✅ تم توليد المحتوى بنجاح')

    // Step 3: Parse FAQs from generated content
    console.log('\n🔍 استخراج الأسئلة الشائعة...')
    const faqs = parseFAQsFromContent(generatedContent, topic)
    console.log(`✅ تم استخراج ${faqs.length} أسئلة`)

    // Step 4: Generate hero image
    console.log('\n🎨 توليد الصورة الرئيسية...')
    const imagePath = await generateHeroImage(topic.title, topic.slug, 'ar')
    console.log(`✅ تم حفظ الصورة: ${imagePath}`)

    // Step 5: Use generated content directly (it already has front matter from OpenAI)
    console.log('\n📝 استخدام محتوى MDX المولد...')
    let mdxContent = generatedContent

    // Step 6: Run automatic QA
    console.log('\n🛡️  تشغيل تدقيق الجودة (الروابط، الفيديو، سلامة اللغة)...')
    const qaResult = await runContentQA({ mdxContent, language: 'ar', topic })
    if (qaResult.success) {
      mdxContent = qaResult.mdx
      const invalidVideos =
        qaResult.youtubeStatus?.embeds?.filter((embed) => embed && !embed.valid)?.length || 0
      console.log(
        `✅ تم تطبيق التعديلات. الروابط المُصلحة: ${qaResult.brokenLinkCount}، الفيديوهات المُستبدلة/المحذوفة: ${invalidVideos}`
      )
    } else {
      console.warn(
        `⚠️ تعذر إتمام تدقيق الجودة: ${qaResult.error || 'خطأ غير معروف'}. سيتم استخدام المحتوى الأصلي.`
      )
    }

    // Step 7: Validate MDX
    console.log('🔍 التحقق من صحة MDX...')
    if (!validateMDX(mdxContent)) {
      throw new Error('فشل التحقق من صحة MDX')
    }
    console.log('✅ تم التحقق من صحة MDX')

    // Step 8: Save MDX file
    console.log('\n💾 حفظ ملف MDX...')
    const outputPath = path.join(config.OUTPUT_DIR_AR, `${topic.slug}.mdx`)

    // Create directory if it doesn't exist
    if (!fs.existsSync(config.OUTPUT_DIR_AR)) {
      fs.mkdirSync(config.OUTPUT_DIR_AR, { recursive: true })
    }

    fs.writeFileSync(outputPath, mdxContent)
    console.log(`✅ تم حفظ الملف: ${outputPath}`)

    console.log('\n🎉 تم توليد المقال بنجاح!\n')
    console.log(`📄 العنوان: ${topic.title}`)
    console.log(`🔗 الرابط المختصر: ${topic.slug}`)
    console.log(`📊 عدد الكلمات: ~${generatedContent.split(' ').length} كلمة`)
    console.log(`❓ الأسئلة الشائعة: ${faqs.length}`)
    console.log(`🖼️  الصورة: ${imagePath}`)
    console.log(`🌐 الرابط: https://www.deenback.com/ar/blog/${topic.slug}`)
  } catch (error) {
    console.error('\n❌ خطأ في توليد المدونة:', error.message)
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
    const faqSectionMatch = content.match(/##\s*(الأسئلة الشائعة|FAQ|أسئلة شائعة)/i)
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
      question: `سؤال إضافي عن ${topic.title}؟`,
      answer: 'يحتاج هذا السؤال الشائع إلى تعبئة يدوية.',
    })
  }

  return faqs.slice(0, 6)
}

// Run the script
const topicNumber = parseInt(process.argv[2]) || 1
generateArabicBlog(topicNumber)
