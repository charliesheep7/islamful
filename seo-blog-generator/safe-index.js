#!/usr/bin/env node

import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import OpenAIClient from './utils/openai.js'
import { BlogFormatter } from './utils/formatter.js'
import { defaultTopics, articleTypes } from './config/topics.js'
import { config } from './config/settings.js'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class SafeSEOBlogGenerator {
  constructor() {
    this.openai = new OpenAIClient()
    this.outputDir = path.resolve(config.generation.outputDir)
    this.imageDir = path.resolve(config.generation.imageDir)
    this.reservedTopicPath = path.join(__dirname, 'reserved-topic.txt')
  }

  async run() {
    console.log(chalk.cyan.bold('\n🚀 SAFE SEO Blog Generator for Fapulous\n'))
    console.log(chalk.gray('Generating high-quality SEO blogs with cost protection\n'))

    try {
      // Reserve topic BEFORE any expensive operations
      const reservation = await this.reserveNextTopic()

      if (!reservation.success) {
        console.log(chalk.red('❌ Could not reserve topic:'), reservation.error)
        process.exit(1)
      }

      console.log(
        chalk.green(`✅ Reserved topic #${reservation.topicNumber}: "${reservation.topic}"`)
      )
      console.log(chalk.gray(`   Reservation ID: ${reservation.reservationId}`))
      console.log(
        chalk.gray(`   Counter updated: ${reservation.oldNumber} → ${reservation.newNumber}\n`)
      )

      // Create answers object with reservation
      const answers = {
        topic: reservation.topic,
        articleType: reservation.articleType,
        generateImage: true,
        searchVideo: true,
        confirm: true,
        topicSource: 'auto',
        reservation: reservation, // Include reservation for rollback if needed
      }

      // Generate content with reservation protection
      await this.generateBlogWithReservation(answers)
    } catch (error) {
      console.error(chalk.red('\n❌ Error:'), error.message)

      // Attempt to rollback reservation on error
      await this.rollbackReservation()

      process.exit(1)
    }
  }

  async reserveNextTopic() {
    const currentTopicPath = path.join(__dirname, 'current-topic.txt')
    const topicsListPath = path.join(__dirname, 'topics.txt')

    try {
      // Create lock file to prevent concurrent access
      const lockPath = path.join(__dirname, '.topic-lock')

      // Check if locked
      if (await fs.pathExists(lockPath)) {
        const lockAge = Date.now() - (await fs.stat(lockPath)).mtimeMs
        if (lockAge < 60000) {
          // Less than 1 minute old
          return { success: false, error: 'Another generation is in progress (lock file exists)' }
        }
        // Remove stale lock
        await fs.remove(lockPath)
      }

      // Create lock
      await fs.writeFile(lockPath, Date.now().toString())

      try {
        // Read current state
        const currentNumber = parseInt(await fs.readFile(currentTopicPath, 'utf8'))
        const topicsList = (await fs.readFile(topicsListPath, 'utf8')).trim().split('\n')

        // Validate current number
        if (isNaN(currentNumber) || currentNumber < 1) {
          throw new Error(`Invalid topic number: ${currentNumber}`)
        }

        // Find current topic
        const topicLine = topicsList.find((line) => line.startsWith(`${currentNumber}.`))
        if (!topicLine) {
          throw new Error(`No topic found for number ${currentNumber}`)
        }

        // Extract topic
        const topic = topicLine.replace(/^\d+\.\s*/, '').trim()
        if (!topic) {
          throw new Error(`Empty topic at number ${currentNumber}`)
        }

        // Determine article type
        const articleType = this.getArticleType(topic)

        // Calculate next number (with wrap-around)
        const nextNumber = currentNumber >= topicsList.length ? 1 : currentNumber + 1

        // UPDATE COUNTER IMMEDIATELY - BEFORE ANY API CALLS
        await fs.writeFile(currentTopicPath, nextNumber.toString())

        // Save reservation info for potential rollback
        const reservationId = `${currentNumber}-${Date.now()}`
        const reservation = {
          topicNumber: currentNumber,
          topic: topic,
          articleType: articleType,
          timestamp: new Date().toISOString(),
          nextNumber: nextNumber,
        }

        await fs.writeJSON(this.reservedTopicPath, reservation)

        // Remove lock
        await fs.remove(lockPath)

        console.log(chalk.blue('🔒 Topic reservation successful:'))
        console.log(chalk.gray(`   Topic #${currentNumber}: "${topic}"`))
        console.log(chalk.gray(`   Counter updated: ${currentNumber} → ${nextNumber}`))
        console.log(chalk.yellow(`   ⚠️  API calls can now proceed safely\n`))

        return {
          success: true,
          topicNumber: currentNumber,
          topic: topic,
          articleType: articleType,
          oldNumber: currentNumber,
          newNumber: nextNumber,
          reservationId: reservationId,
        }
      } finally {
        // Always remove lock
        await fs.remove(lockPath).catch(() => {})
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  async rollbackReservation() {
    try {
      if (!(await fs.pathExists(this.reservedTopicPath))) {
        return
      }

      const reservation = await fs.readJSON(this.reservedTopicPath)
      const currentTopicPath = path.join(__dirname, 'current-topic.txt')

      // Rollback to original number
      await fs.writeFile(currentTopicPath, reservation.topicNumber.toString())

      console.log(
        chalk.yellow(
          `⚠️  Rolled back topic counter: ${reservation.nextNumber} → ${reservation.topicNumber}`
        )
      )

      // Clean up reservation file
      await fs.remove(this.reservedTopicPath)
    } catch (error) {
      console.error(chalk.red('Could not rollback reservation:'), error.message)
    }
  }

  getArticleType(topic) {
    if (topic.includes('How to') || topic.includes('Step-by-Step')) return 'how-to'
    if (topic.includes('7 ') || topic.includes('Top ') || topic.includes('Best ')) return 'listicle'
    if (topic.includes('vs') || topic.includes('Compare')) return 'vs'
    return 'guide'
  }

  async generateBlogWithReservation(answers) {
    const { topic, articleType, generateImage, searchVideo, reservation } = answers

    console.log(chalk.blue('📝 Starting blog generation with reserved topic...\n'))
    console.log(chalk.green('✅ Topic is reserved - safe to make API calls\n'))

    // Step 1: Generate blog content
    const contentSpinner = ora('Generating blog content with GPT-5-mini...').start()
    try {
      const content = await this.openai.generateBlogContent(topic, articleType)
      contentSpinner.succeed('Blog content generated!')

      // Extract title for slug creation
      const title = BlogFormatter.extractTitle(content)
      const slug = BlogFormatter.createSlug(title)

      console.log(chalk.green(`📄 Title: ${title}`))
      console.log(chalk.gray(`🔗 Slug: ${slug}\n`))

      let youtubeVideo = null
      let imageResult = null

      // Step 2: Search for YouTube video
      if (searchVideo) {
        const videoSpinner = ora('Searching for relevant YouTube video...').start()
        try {
          youtubeVideo = await this.openai.searchYouTubeVideo(topic)
          videoSpinner.succeed(`YouTube video found: ${youtubeVideo.title}`)
        } catch (error) {
          videoSpinner.warn('Could not find YouTube video, using fallback')
        }
      }

      // Step 3: Generate image
      if (generateImage) {
        const imageSpinner = ora('Generating hero image with GPT Image 1...').start()
        try {
          imageResult = await this.openai.generateImage(topic, articleType, slug)
          if (imageResult.success) {
            imageSpinner.succeed(`Hero image generated: ${imageResult.imagePath}`)
          } else {
            imageSpinner.warn(`Image generation failed: ${imageResult.error}`)
          }
        } catch (error) {
          imageSpinner.warn('Could not generate image')
        }
      }

      // Step 4: Format and save content
      const saveSpinner = ora('Formatting and saving blog post...').start()

      const formattedContent = BlogFormatter.formatMDXContent(content, slug, youtubeVideo)
      const saveResult = await BlogFormatter.saveBlogPost(formattedContent, slug, this.outputDir)

      if (saveResult.success) {
        saveSpinner.succeed('Blog post saved successfully!')

        // Log the generation
        BlogFormatter.logGeneration(topic, articleType, slug, true)

        // Clean up reservation file (success)
        await fs.remove(this.reservedTopicPath).catch(() => {})

        // Show summary
        console.log(chalk.green('\n✅ Blog post generated successfully!\n'))
        console.log(chalk.cyan('📁 Output Details:'))
        console.log(`   ${chalk.gray('Topic #:')} ${reservation.topicNumber}`)
        console.log(`   ${chalk.gray('Main File:')} ${saveResult.filepath}`)
        console.log(`   ${chalk.gray('Backup:')} ${saveResult.backupPath}`)
        console.log(`   ${chalk.gray('Slug:')} ${slug}`)
        console.log(`   ${chalk.gray('Type:')} ${articleType}`)
        console.log(`   ${chalk.gray('Next Topic #:')} ${reservation.newNumber}`)

        if (imageResult && imageResult.success) {
          console.log(`   ${chalk.gray('Image:')} ${imageResult.imagePath}`)
        }

        if (youtubeVideo) {
          console.log(`   ${chalk.gray('Video:')} ${youtubeVideo.title} (${youtubeVideo.videoId})`)
        }

        console.log(chalk.yellow('\n📝 Counter already updated - no duplicates possible!'))
      } else {
        saveSpinner.fail('Failed to save blog post')
        throw new Error(saveResult.error)
      }
    } catch (error) {
      contentSpinner.fail('Failed to generate blog content')
      BlogFormatter.logGeneration(topic, articleType, '', false, error)
      throw error
    }
  }
}

// Run the generator
async function main() {
  const generator = new SafeSEOBlogGenerator()
  await generator.run()
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export default SafeSEOBlogGenerator
