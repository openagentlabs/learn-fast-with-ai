// UUID: ef456789-0abc-def1-2345-67890abcdef1
// Gemini AI Model adapter implementing IAIModelService

import { injectable } from 'tsyringe';
import { IAIModelService, GenerateContentOptions, AIModelResponse } from '@/domain/interfaces/services/IAIModelService';
import { appConfig } from '@/infrastructure/adapters/config/AppConfig';
import { logger } from '@/infrastructure/adapters/logging';

/**
 * Gemini AI Model adapter
 * Implements IAIModelService interface
 */
@injectable()
export class GeminiAIModel implements IAIModelService {
  private readonly modelLogger = logger.child({ module: 'GeminiAIModel' });
  private readonly isInitialized = true;

  constructor() {
    this.modelLogger.info('Initializing Gemini AI Model adapter');
    // Set initialized immediately (actual initialization happens in generateContent)
  }

  /**
   * Generate content using AI model
   * @param options Generation options
   * @returns AI model response
   */
  async generateContent(options: GenerateContentOptions): Promise<AIModelResponse> {
    this.modelLogger.debug('Generating content', { 
      promptLength: options.prompt.length 
    });

    if (!this.isInitialized) {
      throw new Error('AI Model not initialized');
    }

    try {
      // Import GeminiModelImpl for actual AI generation
      const { GeminiModelImpl } = await import('./GeminiModelImpl');
      const geminiModel = GeminiModelImpl.create({
        apiKey: appConfig.GEMINI_API_KEY,
        modelName: 'gemini-2.0-flash-exp'
      });

      await geminiModel.initialize();
      const response = await geminiModel.generateContent(options);

      this.modelLogger.info('Content generated successfully');
      return response;
    } catch (error) {
      this.modelLogger.error('Failed to generate content', { error });
      throw error;
    }
  }
}

