import OpenAI from 'openai'
import { config } from '../config/settings.js'
import { masterPrompt, youtubeSearchPrompt } from '../prompts/masterPrompt.js'
import { imagePrompt } from '../prompts/master-prompt-en.js'
import fs from 'fs-extra'
import path from 'path'

class OpenAIClient {
  constructor() {
    if (!config.openai.apiKey) {
      throw new Error('OpenAI API key is required. Please set OPENAI_API_KEY in your .env file.')
    }

    this.client = new OpenAI({
      apiKey: config.openai.apiKey,
      organization: config.openai.orgId,
    })
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
      // First, generate the image prompt
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

      // Generate the image using gpt-image-1
      console.log('🖼️  Calling gpt-image-1...')

      const imageResponse = await this.client.images.generate({
        model: 'gpt-image-1',
        prompt: imagePromptText,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
      })

      console.log('📊 API response received')

      if (imageResponse.data && imageResponse.data.length > 0) {
        const imageBase64 = imageResponse.data[0].b64_json
        console.log(`📏 Image data length: ${imageBase64?.length || 0} characters`)

        // Save the image (use relative path from public/images/blog)
        const imageDir = path.join(config.generation.imageDir, slug)
        await fs.ensureDir(imageDir)

        const imagePath = path.join(imageDir, 'hero.webp')
        console.log(`💾 Saving image to: ${imagePath}`)

        await fs.writeFile(imagePath, Buffer.from(imageBase64, 'base64'))
        console.log('✅ Image saved successfully!')

        return {
          success: true,
          imagePath,
          prompt: imagePromptText,
          model: 'gpt-image-1',
        }
      } else {
        const errorMsg = 'No image data found in response'
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
        model: 'gpt-image-1',
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
