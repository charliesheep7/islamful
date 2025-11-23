import { GoogleGenAI } from '@google/genai'

async function testAuth() {
  console.log('🧪 Testing Google GenAI Auth...')

  const apiKey = process.env.GOOGLE_GENAI_API_KEY || 'dummy_key'
  console.log(`🔑 Using API Key: ${apiKey.substring(0, 4)}...`)

  try {
    const googleAi = new GoogleGenAI({ apiKey: apiKey })

    // Try a simple generation to trigger the auth check
    // Using a known valid model for AI Studio
    const model = 'gemini-1.5-flash'
    console.log(`🤖 Initializing model: ${model}`)

    const result = await googleAi.models.generateContent({
      model: model,
      contents: 'Hello, world!',
    })

    console.log('✅ Success! Response received.')
    console.log(result)
  } catch (error) {
    console.error('❌ Error caught:')
    console.error(error.message)

    if (error.message.includes('Could not load the default credentials')) {
      console.log(
        '\n🚨 DIAGNOSIS: The SDK is trying to use Application Default Credentials (ADC) instead of the API Key.'
      )
    } else if (
      error.message.includes('API key not valid') ||
      error.status === 400 ||
      error.status === 401
    ) {
      console.log(
        '\n✅ DIAGNOSIS: The SDK accepted the API Key (even if it was invalid). The code structure is correct, but the key might be wrong or missing in the environment.'
      )
    }
  }
}

testAuth()
