
import { classifyIntent } from '../src/agents/routerAgent.js'
import { supportAgent } from '../src/agents/supportAgent.js'
import { orderAgent } from '../src/agents/orderAgent.js'

async function main() {
  console.log('Testing Ollama integration...')
  
  // Test 1: Classification
  try {
    const start = Date.now()
    console.log('\n1. Testing Classification...')
    const result = await classifyIntent('Track my order ORD-2024-002')
    console.log('Result:', JSON.stringify(result, null, 2))
    console.log(`Time taken: ${(Date.now() - start) / 1000}s`)
  } catch (error) {
    console.error('Classification Error:', error)
  }

  // Test 2: Support Agent stream
  try {
    console.log('\n2. Testing Support Agent Stream ("Hi")...')
    const start = Date.now()
    const result = await supportAgent.run('Hi', 'test-user', 'test-conv', [])
    
    let text = ''
    for await (const chunk of result.textStream) {
      process.stdout.write(chunk)
      text += chunk
    }
    console.log(`\nFull response: "${text}"`)
    console.log(`Time taken: ${(Date.now() - start) / 1000}s`)
  } catch (error) {
    console.error('Support Agent Error:', error)
  }

  // Test 3: Order Agent stream
  try {
    console.log('\n3. Testing Order Agent Stream ("Track my order ORD-2024-002")...')
    const start = Date.now()
    const result = await orderAgent.run('Track my order ORD-2024-002', 'test-user', 'test-conv', [])
    
    let text = ''
    for await (const chunk of result.textStream) {
      process.stdout.write(chunk)
      text += chunk
    }
    console.log(`\nFull response: "${text}"`)
    console.log(`Time taken: ${(Date.now() - start) / 1000}s`)
  } catch (error) {
    console.error('Order Agent Error:', error)
  }

  // Test 4: Simple streamText
  try {
    console.log('\n4. Testing Simple streamText ("Why is the sky blue?")...')
    const { streamText } = await import('ai')
    const { ollama } = await import('ai-sdk-ollama')
    
    const start = Date.now()
    const result = streamText({
      model: ollama('llama3.2:3b'),
      prompt: 'Why is the sky blue?',
    })
    
    let text = ''
    for await (const chunk of result.textStream) {
      process.stdout.write(chunk)
      text += chunk
    }
    console.log(`\nFull response: "${text}"`)
    console.log(`Time taken: ${(Date.now() - start) / 1000}s`)
  } catch (error) {
    console.error('Simple Stream Error:', error)
  }
}

main()
