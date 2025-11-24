#!/usr/bin/env node

import OpenAI from 'openai'
import { config } from './config/settings.js'
import fs from 'fs-extra'
import path from 'path'

async function testImageGeneration() {
  console.log('🧪 Testing GPT-5 Image Generation Only\n')

  const openai = new OpenAI({
    apiKey: config.openai.apiKey,
    organization: config.openai.orgId,
  })

  try {
    const testPrompt =
      'A young man looking confident and hopeful, standing by a bright window at sunrise, modern clean room'
    console.log(`📝 Prompt: ${testPrompt}`)

    console.log('🖼️  Calling gpt-image-1...')

    const startTime = Date.now()

    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: testPrompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    })

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`⏱️  Response time: ${elapsed} seconds`)

    console.log('📊 API Response Structure:')
    console.log(`   Output array length: ${response.output?.length || 0}`)
    console.log(`   Output types: ${response.output?.map((o) => o.type).join(', ')}`)

    // Extract image data
    const imageData = response.output
      ?.filter((output) => output.type === 'image_generation_call')
      ?.map((output) => output.result)

    if (imageData && imageData.length > 0) {
      const imageBase64 = imageData[0]
      console.log(`📏 Image data length: ${imageBase64.length} characters`)

      // Save test image
      const testPath = './test-image.png'
      await fs.writeFile(testPath, Buffer.from(imageBase64, 'base64'))

      console.log('✅ SUCCESS: Image generated and saved!')
      console.log(`📁 Saved to: ${testPath}`)

      // Get file size
      const stats = await fs.stat(testPath)
      console.log(`📦 File size: ${(stats.size / 1024).toFixed(2)} KB`)
    } else {
      console.log('❌ No image data found in response')
      console.log('📋 Full response:', JSON.stringify(response, null, 2))
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.status) console.error(`   Status: ${error.status}`)
    if (error.code) console.error(`   Code: ${error.code}`)
  }
}

testImageGeneration()
