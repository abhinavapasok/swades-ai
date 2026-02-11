import { type LanguageModel } from 'ai'
import { ollama } from 'ai-sdk-ollama'

/**
 * Centralized model configuration for all agents.
 * Using qwen2.5:7b for excellent tool-calling support.
 * Change MODEL_ID here to switch all agents at once.
 */
export const MODEL_ID = 'qwen2.5:7b'

export const getModel = (): LanguageModel => ollama(MODEL_ID)
