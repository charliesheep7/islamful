import { GoogleGenAI } from '@google/genai'

async function testImagen() {
  console.log('🧪 Testing Google GenAI with Imagen Model...')

  const apiKey = process.env.GOOGLE_GENAI_API_KEY || 'dummy_key'
  console.log(`🔑 Using API Key: ${apiKey.substring(0, 4)}...`)

  try {
    const googleAi = new GoogleGenAI({ apiKey: apiKey })

    // Try Imagen 3 model name
    const model = 'imagen-3.0-generate-001'
    console.log(`🤖 Initializing model: ${model}`)

    const result = await googleAi.models.generateContent({
      model: model,
      contents: 'A cute cat',
    })

    console.log('✅ Success! Response received.')
    console.log(result)
  } catch (error) {
    console.error('❌ Error caught:')
    console.error(error.message)

    if (error.message.includes('Could not load the default credentials')) {
      console.log(
        '\n🚨 DIAGNOSIS: This model requires ADC (Vertex AI) and does not support API Key (AI Studio).'
      )
    } else if (
      error.message.includes('API key not valid') ||
      error.status === 400 ||
      error.status === 401
    ) {
      console.log('\n✅ DIAGNOSIS: The SDK accepted the API Key for this model.')
    } else if (error.status === 404 || error.message.includes('not found')) {
      console.log('\n⚠️ DIAGNOSIS: Model not found.')
    }
  }
}

testImagen()
