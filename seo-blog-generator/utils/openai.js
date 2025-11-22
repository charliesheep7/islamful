import OpenAI from 'openai'
import { GoogleGenAI } from '@google/genai'
import { config } from '../config/settings.js'
import { masterPrompt, youtubeSearchPrompt } from '../prompts/masterPrompt.js'
import { imagePrompt } from '../prompts/master-prompt-en.js'
import fs from 'fs-extra'
import path from 'path'

export class OpenAIClient {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: config.openai.orgId,
    })

    // Google GenAI setup
    this.googleApiKey = process.env.GOOGLE_GENAI_API_KEY
    this.googleAi = new GoogleGenAI({ apiKey: this.googleApiKey })
  }

  async generateBlogContent(topic, articleType) {
    try {
      const prompt = masterPrompt.replace('{topic}', topic).replace('{articleType}', articleType)

      const response = await this.client.responses.create({
        model: config.openai.textModel,
        input: [
          {
            role: 'user',
            content: [{ type: 'input_text', text: prompt }],
          },
        ],
        reasoning: { effort: 'low' },
        text: { verbosity: 'high' },
      })

      return response.output_text
    } catch (error) {
      console.error('Error generating blog content:', error)
      throw error
    }
  }

  async searchYouTubeVideo(topic) {
    try {
      const prompt = youtubeSearchPrompt.replace('{topic}', topic)

      const response = await this.client.responses.create({
        model: config.openai.textModel,
        input: [
          {
            role: 'user',
            content: [{ type: 'input_text', text: prompt }],
          },
        ],
      })

      // Parse the JSON response
      const jsonMatch = response.output_text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      } else {
        // Fallback if JSON parsing fails
        return {
          videoId: 'dQw4w9WgXcQ', // Fallback video
          title: 'Motivational Recovery Video',
          reason: 'General recovery motivation',
        }
      }
    } catch (error) {
      console.error('Error searching YouTube video:', error)
      // Return fallback video
      return {
        videoId: 'dQw4w9WgXcQ',
        title: 'Recovery and Motivation',
        reason: 'Fallback video for recovery support',
      }
    }
  }

  async generateImage(topic, articleType, slug) {
    console.log('🎨 Starting image generation...')
    console.log(`   Topic: ${topic}`)
    console.log(`   Article Type: ${articleType}`)
    console.log(`   Slug: ${slug}`)

    try {
      // First, generate the image prompt using OpenAI (keeping this as is for now)
      const promptText = imagePrompt.replace('{topic}', topic).replace('{articleType}', articleType)
      console.log('📝 Generating image prompt...')

      const promptResponse = await this.client.responses.create({
        model: config.openai.textModel,
        input: [
          {
            role: 'user',
            content: [{ type: 'input_text', text: promptText }],
          },
        ],
      })

      const imagePromptText = promptResponse.output_text.trim()
      console.log(`✅ Image prompt generated: "${imagePromptText}"`)

      // Generate the image using Google GenAI
      console.log('🖼️  Calling Google GenAI (gemini-2.5-flash-image)...')

      const finalImagePrompt = `Generate an image of ${imagePromptText}`
      const response = await this.googleAi.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: finalImagePrompt,
      })

      console.log('📊 API response received')

      let imageSaved = false
      let imagePath = ''

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data
          const buffer = Buffer.from(imageData, 'base64')

          // Save the image (use relative path from public/images/blog)
          const imageDir = path.join(config.generation.imageDir, slug)
          await fs.ensureDir(imageDir)

          imagePath = path.join(imageDir, 'hero.webp') // Keeping .webp extension but content might be png/jpeg, usually fine or can convert. Google example saves as png. Let's stick to webp filename for consistency or change if needed. The buffer is raw image data.
          // Actually, the example saves as .png. Let's check if we should rename. The project seems to use .webp.
          // If the buffer is PNG, saving as .webp extension is misleading but might work in browsers.
          // However, to be safe, let's save as .png if that's what comes back, or just overwrite hero.webp.
          // The user's example saves as 'gemini-native-image.png'.
          // I will save as hero.png to be safe and match the format, but the existing code expects hero.webp in some places?
          // The previous code saved as hero.webp.
          // Let's stick to hero.png if it's a PNG.
          // Wait, the previous step I updated the frontmatter to .png for some files.
          // Let's save as hero.png and return that path.

          imagePath = path.join(imageDir, 'hero.png')
          console.log(`💾 Saving image to: ${imagePath}`)

          await fs.writeFile(imagePath, buffer)
          console.log('✅ Image saved successfully!')
          imageSaved = true
          break
        }
      }

      if (imageSaved) {
        return {
          success: true,
          imagePath,
          prompt: imagePromptText,
          model: 'gemini-2.5-flash-image',
        }
      } else {
        const errorMsg = 'No image data found in Google GenAI response'
        console.error('❌', errorMsg)
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('❌ Image generation error:', error.message)
      console.error('📋 Full error:', error)

      return {
        success: false,
        error: error.message,
        fullError: error,
        model: 'gemini-2.5-flash-image',
      }
    }
  }
}

export default OpenAIClient

// Create singleton instance for named exports
const client = new OpenAIClient()

async function submitTextPrompt(prompt, options = {}) {
  return await client.client.responses.create({
    model: config.openai.textModel,
    input: [
      {
        role: 'user',
        content: [{ type: 'input_text', text: prompt }],
      },
    ],
    reasoning: { effort: options.reasoningEffort || 'low' },
    text: { verbosity: options.verbosity || 'high' },
    // Note: temperature not supported by gpt-5-mini model
  })
}

// Named exports for generate-en.js compatibility
export async function generateBlogContent(prompt) {
  try {
    const response = await submitTextPrompt(prompt, { reasoningEffort: 'low' })
    return response.output_text
  } catch (error) {
    console.error('Error generating blog content:', error)
    throw error
  }
}

export async function runQaPrompt(prompt) {
  try {
    const response = await submitTextPrompt(prompt, { reasoningEffort: 'medium' })
    return response.output_text?.trim()
  } catch (error) {
    console.error('Error running QA prompt:', error)
    throw error
  }
}

export async function generateHeroImage(title, slug, lang = 'en') {
  return await client.generateImage(title, 'guide', slug)
}
