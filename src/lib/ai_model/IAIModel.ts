// UUID: 331faae3-9ff1-4627-9e0d-4e5d22fdf2b2
// AI Model Interface - Defines the contract for all AI model implementations

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
 * Core interface for AI model implementations
 * 
 * All AI model wrappers must implement this interface to ensure
 * consistent behavior across different model providers (Gemini, OpenAI, etc.)
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
