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

class SEOBlogGenerator {
  constructor() {
    this.openai = new OpenAIClient()
    this.outputDir = path.resolve(config.generation.outputDir)
    this.imageDir = path.resolve(config.generation.imageDir)
  }

  async run() {
    console.log(chalk.cyan.bold('\n🚀 SEO Blog Generator for Fapulous\n'))
    console.log(chalk.gray('Generating high-quality SEO blogs with AI\n'))

    try {
      // Get user input
      const answers = await this.promptUser()

      // Generate content
      await this.generateBlog(answers)
    } catch (error) {
      console.error(chalk.red('\n❌ Error:'), error.message)
      process.exit(1)
    }
  }

  async promptUser() {
    // Auto-select next topic sequentially - no prompts needed
    const topicData = this.getNextTopic()
    const { topic, articleType, topicNumber, currentTopicPath, topicsList } = topicData

    console.log(chalk.blue(`📝 Topic #${topicNumber}: "${chalk.cyan(topic)}"`))
    console.log(chalk.blue(`📋 Article type: "${chalk.yellow(articleType)}"`))
    console.log(chalk.green('🚀 Starting automatic generation...\n'))

    // Return automatic settings - no user input required
    // IMPORTANT: Include all data needed for topic counter update
    return {
      topic,
      articleType,
      generateImage: true,
      searchVideo: true,
      confirm: true,
      topicSource: 'auto',
      topicNumber, // Pass through for counter update
      currentTopicPath, // Pass through for counter update
      topicsList, // Pass through for counter update
    }
  }

  getNextTopic() {
    try {
      // Read current topic number
      const currentTopicPath = path.join(__dirname, 'current-topic.txt')
      const topicsListPath = path.join(__dirname, 'topics.txt')

      const currentNumber = parseInt(fs.readFileSync(currentTopicPath, 'utf8').trim())
      const topicsList = fs.readFileSync(topicsListPath, 'utf8').trim().split('\n')

      console.log(chalk.gray(`🔍 Reading current topic number: ${currentNumber}`))
      console.log(chalk.gray(`📄 Total topics available: ${topicsList.length}`))

      // Find the topic line that starts with current number
      const topicLine = topicsList.find((line) => line.startsWith(`${currentNumber}.`))

      if (!topicLine) {
        console.log(chalk.yellow(`⚠️  No topic found for #${currentNumber}, resetting to #1`))
        fs.writeFileSync(currentTopicPath, '1')
        return this.getNextTopic()
      }

      // Extract topic title (remove "1. " prefix)
      const topic = topicLine.replace(/^\d+\.\s*/, '')

      // Auto-select article type based on topic keywords
      const getArticleType = (topic) => {
        if (topic.includes('How to') || topic.includes('Step-by-Step')) return 'how-to'
        if (topic.includes('7 ') || topic.includes('Top ') || topic.includes('Best '))
          return 'listicle'
        if (topic.includes('vs') || topic.includes('Compare')) return 'vs'
        return 'guide'
      }

      // DON'T update counter here - wait until after successful generation
      console.log(
        chalk.gray(
          `ℹ️ Will update to topic #${currentNumber >= topicsList.length ? 1 : currentNumber + 1} after successful generation`
        )
      )

      return {
        topic,
        articleType: getArticleType(topic),
        topicNumber: currentNumber,
        currentTopicPath, // Pass path so we can update after success
        topicsList, // Pass list so we can calculate next number
      }
    } catch (error) {
      console.error(chalk.red('Error reading topic files:', error.message))
      // Fallback to first topic
      fs.writeFileSync(path.join(__dirname, 'current-topic.txt'), '1')
      return {
        topic: "7 Signs You're Ready to Quit Porn for Good",
        articleType: 'listicle',
        topicNumber: 1,
      }
    }
  }

  buildTopicChoices() {
    const choices = []
    for (const [category, topics] of Object.entries(defaultTopics)) {
      choices.push(new inquirer.Separator(`--- ${this.formatCategoryName(category)} ---`))
      topics.forEach((topic) => {
        choices.push({ name: topic, value: topic })
      })
    }
    return choices
  }

  getCategoryIcon(category) {
    const icons = {
      recovery: '🎯',
      brainScience: '🧠',
      mentalHealth: '🌱',
      technology: '📱',
      lifestyle: '⚡',
      challenges: '💪',
    }
    return icons[category] || '📝'
  }

  formatCategoryName(category) {
    const names = {
      recovery: 'Recovery Strategies',
      brainScience: 'Brain Science',
      mentalHealth: 'Mental Health',
      technology: 'Technology & Apps',
      lifestyle: 'Lifestyle & Habits',
      challenges: 'Common Challenges',
    }
    return names[category] || category
  }

  updateTopicCounter(answers) {
    try {
      if (answers.currentTopicPath && answers.topicsList) {
        const currentNumber = answers.topicNumber
        const topicsList = answers.topicsList

        console.log(chalk.yellow(`🔄 Updating topic counter...`))
        console.log(chalk.gray(`  Current file path: ${answers.currentTopicPath}`))
        console.log(chalk.gray(`  Current topic number: ${currentNumber}`))

        // Calculate next number (wrap around if we reach the end)
        const nextNumber = currentNumber >= topicsList.length ? 1 : currentNumber + 1

        // Read file before update to verify
        const beforeValue = fs.readFileSync(answers.currentTopicPath, 'utf8').trim()
        console.log(chalk.gray(`  Value before update: ${beforeValue}`))

        // Write the next number to file
        fs.writeFileSync(answers.currentTopicPath, nextNumber.toString())

        // Read file after update to confirm
        const afterValue = fs.readFileSync(answers.currentTopicPath, 'utf8').trim()
        console.log(chalk.gray(`  Value after update: ${afterValue}`))

        if (afterValue === nextNumber.toString()) {
          console.log(
            chalk.green(`✅ Topic counter successfully updated: ${currentNumber} → ${nextNumber}`)
          )
        } else {
          console.log(chalk.red(`❌ Topic counter update verification failed!`))
          console.log(chalk.red(`  Expected: ${nextNumber}, Got: ${afterValue}`))
        }
      } else {
        console.log(chalk.yellow('⚠️ Missing required data for topic counter update'))
        if (!answers.currentTopicPath) console.log(chalk.gray('  - currentTopicPath is missing'))
        if (!answers.topicsList) console.log(chalk.gray('  - topicsList is missing'))
      }
    } catch (error) {
      console.error(chalk.red('❌ Error updating topic counter:'), error.message)
      console.error(chalk.gray(error.stack))
    }
  }

  async generateBlog(answers) {
    const { topic, articleType, generateImage, searchVideo } = answers

    console.log(chalk.blue('\n📝 Starting blog generation...\n'))

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

        // Update topic counter only after successful generation
        console.log(
          chalk.cyan('\n🎯 Initiating topic counter update after successful generation...')
        )
        this.updateTopicCounter(answers)

        // Show summary
        console.log(chalk.green('\n✅ Blog post generated successfully!\n'))
        console.log(chalk.cyan('📁 Output Details:'))
        console.log(`   ${chalk.gray('Main File:')} ${saveResult.filepath}`)
        console.log(`   ${chalk.gray('Backup:')} ${saveResult.backupPath}`)
        console.log(`   ${chalk.gray('Slug:')} ${slug}`)
        console.log(`   ${chalk.gray('Type:')} ${articleType}`)

        if (imageResult && imageResult.success) {
          console.log(`   ${chalk.gray('Image:')} ${imageResult.imagePath}`)
        }

        if (youtubeVideo) {
          console.log(`   ${chalk.gray('Video:')} ${youtubeVideo.title} (${youtubeVideo.videoId})`)
        }

        console.log(chalk.yellow('\n📝 Next steps:'))
        console.log('   1. Review the generated content in /content/blog/')
        console.log('   2. Update draft: false when ready to publish')
        console.log('   3. Run npm run dev to preview')
        console.log('   4. Blog will be available at /blog/' + slug.replace(/^\d+-/, ''))
      } else {
        saveSpinner.fail('Failed to save blog post')
        throw new Error(saveResult.error)
      }
    } catch (error) {
      contentSpinner.fail('Failed to generate blog content')
      BlogFormatter.logGeneration(topic, articleType, '', false, error)
      console.log(chalk.yellow('\n⚠️ Topic counter will NOT be updated due to generation failure'))
      throw error
    }
  }
}

// Run the generator
async function main() {
  const generator = new SEOBlogGenerator()
  await generator.run()
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export default SEOBlogGenerator
