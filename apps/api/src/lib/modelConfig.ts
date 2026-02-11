import { type LanguageModel } from 'ai'
import { google } from '@ai-sdk/google'

/**
 * Centralized model configuration for all agents.
 * Using gemini-1.5-flash for high reliability and quota availability.
 * Change MODEL_ID here to switch all agents at once.
 */
export const MODEL_ID = 'gemini-flash-latest'

export const getModel = (): LanguageModel => google(MODEL_ID)
