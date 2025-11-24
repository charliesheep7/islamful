import slugify from 'slugify'
import fs from 'fs-extra'
import path from 'path'
import { globSync } from 'glob'

export class BlogFormatter {
  static getNextBlogNumber() {
    try {
      // Get all MDX files from content/blog directory
      const blogDir = path.resolve('../content/blog')
      const blogFiles = globSync('*.mdx', { cwd: blogDir })

      let maxNumber = 0 // Will be calculated from existing files

      // Extract numbers from filenames like "98-some-title.mdx"
      blogFiles.forEach((file) => {
        const match = file.match(/^(\d+)-/)
        if (match) {
          const num = parseInt(match[1], 10)
          if (num > maxNumber) {
            maxNumber = num
          }
        }
      })

      return maxNumber + 1
    } catch (error) {
      console.warn('Could not determine next blog number, defaulting to 99:', error.message)
      return 99
    }
  }

  static createSlug(title) {
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    })

    const blogNumber = this.getNextBlogNumber()
    return `${blogNumber}-${baseSlug}`
  }

  static getCurrentDate() {
    return new Date().toISOString().split('T')[0]
  }

  static formatMDXContent(content, slug, youtubeVideo) {
    // Replace placeholder values in the content
    let formattedContent = content

    // Replace image src with correct slug - handle multiple possible patterns
    formattedContent = formattedContent.replace(
      /src="\/images\/blog\/[^"]+\/hero\.png"/g,
      `src="/images/blog/${slug}/hero.png"`
    )

    // Replace YouTube video ID - handle multiple possible patterns
    if (youtubeVideo && youtubeVideo.videoId) {
      formattedContent = formattedContent.replace(
        /src="https:\/\/www\.youtube\.com\/embed\/VIDEO_ID"/g,
        `src="https://www.youtube.com/embed/${youtubeVideo.videoId}"`
      )
      formattedContent = formattedContent.replace(
        /src="https:\/\/www\.youtube\.com\/embed\/\[VIDEO_ID\]"/g,
        `src="https://www.youtube.com/embed/${youtubeVideo.videoId}"`
      )
      formattedContent = formattedContent.replace(
        /title="\[Video title\]"/g,
        `title="${youtubeVideo.title}"`
      )
    }

    // Replace date placeholders
    const currentDate = this.getCurrentDate()
    formattedContent = formattedContent.replace(/date: "\[YYYY-MM-DD\]"/g, `date: "${currentDate}"`)
    formattedContent = formattedContent.replace(
      /updated: "\[YYYY-MM-DD\]"/g,
      `updated: "${currentDate}"`
    )

    return formattedContent
  }

  static async saveBlogPost(content, slug, outputDir) {
    try {
      // Save to both output directory and content/blog
      const filename = `${slug}.mdx`

      // Save to output directory (for backup/review)
      await fs.ensureDir(outputDir)
      const outputPath = path.join(outputDir, filename)
      await fs.writeFile(outputPath, content, 'utf8')

      // Save to content/blog (main location)
      const contentBlogDir = path.resolve('../content/blog')
      await fs.ensureDir(contentBlogDir)
      const contentPath = path.join(contentBlogDir, filename)
      await fs.writeFile(contentPath, content, 'utf8')

      return {
        success: true,
        filepath: contentPath, // Return the main content path
        backupPath: outputPath,
        filename,
      }
    } catch (error) {
      console.error('Error saving blog post:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  static extractTitle(content) {
    // Extract title from frontmatter
    const titleMatch = content.match(/title:\s*["']([^"']+)["']/)
    return titleMatch ? titleMatch[1] : 'Untitled Blog Post'
  }

  static extractDescription(content) {
    // Extract description from frontmatter
    const descMatch = content.match(/description:\s*["']([^"']+)["']/)
    return descMatch ? descMatch[1] : ''
  }

  static logGeneration(topic, articleType, slug, success, error = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      topic,
      articleType,
      slug,
      success,
      error: error ? error.message : null,
    }

    const logDir = './logs'
    fs.ensureDirSync(logDir)

    const logFile = path.join(logDir, `generation-${this.getCurrentDate()}.log`)
    const logLine = JSON.stringify(logEntry) + '\n'

    fs.appendFileSync(logFile, logLine)
  }
}

// Named exports for generate-en.js compatibility
export function formatMDX({ topic, content, faqs, imagePath, date }) {
  const faqsYaml = faqs
    .map(
      (faq) =>
        `  - question: "${faq.question.replace(/"/g, '\\"')}"\n    answer: "${faq.answer.replace(/"/g, '\\"')}"`
    )
    .join('\n')

  return `---
title: "${topic.title}"
date: "${date}"
lastmod: "${date}"
summary: "${topic.description}"
tags: ${JSON.stringify(topic.keywords)}
authors: ["mathias-yussif"]
draft: false
images: ["${imagePath}"]
layout: "PostLayout"
faqs:
${faqsYaml}
---

${content}
`
}

export function validateMDX(content) {
  // Basic MDX validation
  if (!content || typeof content !== 'string') return false
  if (!content.includes('---')) return false
  if (!content.includes('title:')) return false
  return true
}
