import Anthropic from '@anthropic-ai/sdk'

function createAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY is not configured. Please set it in your environment variables.'
    )
  }

  return new Anthropic({ apiKey })
}

let clientInstance: Anthropic | null = null

export function getAnthropicClient(): Anthropic {
  if (!clientInstance) {
    clientInstance = createAnthropicClient()
  }
  return clientInstance
}
