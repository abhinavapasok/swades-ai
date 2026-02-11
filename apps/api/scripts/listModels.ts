import { google } from '@ai-sdk/google'

async function listModels() {
  try {
    // Create a simple request to list available models
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GOOGLE_GENERATIVE_AI_API_KEY)
    const data = await response.json()
    
    console.log('Available Google Generative AI Models:')
    console.log('=====================================\n')
    
    if (data.models) {
      data.models.forEach((model: any) => {
        console.log(`Model: ${model.name}`)
        console.log(`  Display Name: ${model.displayName}`)
        console.log(`  Supported Methods: ${model.supportedGenerationMethods?.join(', ')}`)
        console.log('')
      })
    } else {
      console.error('Error:', data)
    }
  } catch (error) {
    console.error('Error listing models:', error)
  }
}

listModels()
