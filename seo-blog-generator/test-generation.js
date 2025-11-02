#!/usr/bin/env node

import OpenAIClient from './utils/openai.js'
import { BlogFormatter } from './utils/formatter.js'
import { config } from './config/settings.js'
import chalk from 'chalk'
import ora from 'ora'

async function runTestGeneration() {
  console.log(chalk.cyan.bold('\n🧪 Running Test Blog Generation\n'))

  const testTopic = 'How to overcome porn addiction in 30 days'
  const testType = 'how-to'

  console.log(chalk.blue(`📝 Topic: ${testTopic}`))
  console.log(chalk.blue(`📋 Type: ${testType}\n`))

  try {
    const openai = new OpenAIClient()

    // Test 1: Generate blog content
    const contentSpinner = ora('Testing blog content generation...').start()
    const content = await openai.generateBlogContent(testTopic, testType)
    contentSpinner.succeed('✅ Blog content generated successfully!')

    // Extract title and create slug
    const title = BlogFormatter.extractTitle(content)
    const slug = BlogFormatter.createSlug(title)

    console.log(chalk.green(`📄 Generated Title: ${title}`))
    console.log(chalk.gray(`🔗 Slug: ${slug}`))

    // Test 2: YouTube video search
    const videoSpinner = ora('Testing YouTube video search...').start()
    const youtubeVideo = await openai.searchYouTubeVideo(testTopic)
    videoSpinner.succeed(`✅ YouTube video found: ${youtubeVideo.title}`)

    // Test 3: Image generation
    const imageSpinner = ora('Testing image generation...').start()
    const imageResult = await openai.generateImage(testTopic, testType, slug)
    if (imageResult.success) {
      imageSpinner.succeed(`✅ Image generated: ${imageResult.imagePath}`)
    } else {
      imageSpinner.warn(`⚠️  Image generation failed: ${imageResult.error}`)
    }

    // Test 4: Format and save
    const saveSpinner = ora('Testing content formatting and saving...').start()
    const formattedContent = BlogFormatter.formatMDXContent(content, slug, youtubeVideo)
    const saveResult = await BlogFormatter.saveBlogPost(
      formattedContent,
      slug,
      config.generation.outputDir
    )

    if (saveResult.success) {
      saveSpinner.succeed('✅ Blog post saved successfully!')

      console.log(chalk.green('\n🎉 Test Generation Complete!\n'))
      console.log(chalk.cyan('📁 Output Files:'))
      console.log(`   ${chalk.gray('Main File:')} ${saveResult.filepath}`)
      console.log(`   ${chalk.gray('Backup:')} ${saveResult.backupPath}`)
      if (imageResult.success) {
        console.log(`   ${chalk.gray('Hero Image:')} ${imageResult.imagePath}`)
      }
      console.log(`   ${chalk.gray('YouTube Video:')} ${youtubeVideo.videoId}`)

      console.log(chalk.yellow('\n📋 Generated Content Preview:'))
      console.log(chalk.gray('─'.repeat(50)))
      console.log(formattedContent.split('\n').slice(0, 20).join('\n'))
      console.log(chalk.gray('─'.repeat(50)))
      console.log(chalk.gray(`[... ${formattedContent.split('\n').length - 20} more lines]`))
    } else {
      saveSpinner.fail('❌ Failed to save blog post')
      throw new Error(saveResult.error)
    }
  } catch (error) {
    console.error(chalk.red('\n❌ Test Generation Failed:'), error.message)
    console.error(chalk.gray(error.stack))
    process.exit(1)
  }
}

runTestGeneration()
