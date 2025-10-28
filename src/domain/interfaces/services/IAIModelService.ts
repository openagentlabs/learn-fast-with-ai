// UUID: 5a6b7c8d-9e0f-1234-5678-90abcdef1234
// AI model service interface - domain layer

/**
 * Configuration options for AI model initialization
 */
export interface AIModelConfig {
  /** API key for the AI service */
  apiKey?: string;
  /** Model name or identifier */
  modelName?: string;
  /** Additional configuration options */
  [key: string]: unknown;
}

/**
 * Request options for generating content
 */
export interface GenerateContentOptions {
  /** The prompt or input text */
  prompt: string;
  /** Maximum number of tokens to generate */
  maxTokens?: number;
  /** Temperature for randomness (0-1) */
  temperature?: number;
  /** Additional generation parameters */
  [key: string]: unknown;
}

/**
 * Response from the AI model
 */
export interface AIModelResponse {
  /** Generated content text */
  text: string;
  /** Token usage information */
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Lower-level AI model interface for direct AI provider implementations
 */
export interface IAIModel {
  /**
   * Generate content based on a prompt
   * @param options Generation options including prompt and parameters
   * @returns Promise resolving to the model's response
   * @throws Error if generation fails
   */
  generateContent(options: GenerateContentOptions): Promise<AIModelResponse>;

  /**
   * Initialize the model with configuration
   * @param config Configuration object with API keys and settings
   * @returns Promise resolving when initialization is complete
   * @throws Error if initialization fails
   */
  initialize(config?: AIModelConfig): Promise<void>;

  /**
   * Check if the model is properly initialized
   * @returns True if model is ready to use, false otherwise
   */
  isInitialized(): boolean;

  /**
   * Get the model name/identifier
   * @returns Model identifier string
   */
  getModelName(): string;
}

/**
 * AI model service interface
 * Defines the contract for AI model services at the application layer
 */
export interface IAIModelService {
  /**
   * Generate content using AI model
   * @param options Generation options
   * @returns AI model response
   */
  generateContent(options: GenerateContentOptions): Promise<AIModelResponse>;
}


