#!/usr/bin/env node

import OpenAI from 'openai'
import { config } from './config/settings.js'

async function checkAvailableModels() {
  const openai = new OpenAI({
    apiKey: config.openai.apiKey,
    organization: config.openai.orgId,
  })

  try {
    console.log('🔍 Checking available models...\n')

    const models = await openai.models.list()

    console.log('📋 All Available Models:')
    console.log('─'.repeat(50))

    const imageModels = []
    const textModels = []

    models.data.forEach((model) => {
      if (
        model.id.includes('image') ||
        model.id.includes('dall-e') ||
        model.id.includes('gpt-image')
      ) {
        imageModels.push(model.id)
      } else if (model.id.includes('gpt')) {
        textModels.push(model.id)
      }
    })

    console.log('\n🖼️  IMAGE MODELS:')
    if (imageModels.length > 0) {
      imageModels.forEach((model) => console.log(`   ✅ ${model}`))
    } else {
      console.log('   ❌ No image models found')
    }

    console.log('\n📝 GPT TEXT MODELS:')
    textModels.slice(0, 10).forEach((model) => console.log(`   ✅ ${model}`))
    if (textModels.length > 10) {
      console.log(`   ... and ${textModels.length - 10} more`)
    }

    console.log('\n🔍 SEARCHING FOR GPT IMAGE 1:')
    const gptImageModels = models.data.filter(
      (m) => m.id.toLowerCase().includes('gpt') && m.id.toLowerCase().includes('image')
    )

    if (gptImageModels.length > 0) {
      console.log('   Found GPT Image models:')
      gptImageModels.forEach((model) => {
        console.log(`   ✅ ${model.id} (${model.object})`)
      })
    } else {
      console.log('   ❌ No GPT Image models found')
      console.log('   💡 GPT Image 1 might not be available in your account yet')
    }
  } catch (error) {
    console.error('❌ Error checking models:', error.message)
  }
}

checkAvailableModels()
