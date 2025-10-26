# AI Model Interface

## Overview

The AI Model Interface defines a standardized contract for interacting with different AI models (Gemini, OpenAI, Anthropic, etc.). This interface ensures consistency and allows for easy swapping of AI providers without changing application code.

## Purpose

This module provides the core interface (`IAIModel`) and supporting types that all AI model implementations must follow. This design pattern enables:

- Consistent API across different AI providers
- Easy switching between AI models
- Type-safe AI integrations
- Unified error handling and logging

## Interface Contract

### IAIModel

All AI model implementations must implement the following methods:

```typescript
interface IAIModel {
  generateContent(options: GenerateContentOptions): Promise<AIModelResponse>;
  initialize(config?: AIModelConfig): Promise<void>;
  isInitialized(): boolean;
  getModelName(): string;
}
```

## Type Definitions

### `AIModelConfig`

Configuration options for initializing an AI model:

```typescript
interface AIModelConfig {
  apiKey?: string;           // API key for the service
  modelName?: string;        // Model identifier
  [key: string]: unknown;    // Additional provider-specific options
}
```

### `GenerateContentOptions`

Options for generating content:

```typescript
interface GenerateContentOptions {
  prompt: string;            // Required: Input prompt
  maxTokens?: number;        // Optional: Max tokens to generate
  temperature?: number;      // Optional: Randomness (0-1)
  [key: string]: unknown;    // Additional generation parameters
}
```

### `AIModelResponse`

Response from the AI model:

```typescript
interface AIModelResponse {
  text: string;              // Generated text content
  usage?: {                  // Token usage information
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  metadata?: Record<string, unknown>;  // Additional metadata
}
```

## Usage Examples

### Using the Interface

```typescript
import type { IAIModel } from '@/lib/ai_model';

// Function that works with any AI model
async function generateExplanation(model: IAIModel, topic: string) {
  if (!model.isInitialized()) {
    await model.initialize();
  }
  
  return await model.generateContent({
    prompt: `Explain ${topic} in simple terms`,
    maxTokens: 500,
    temperature: 0.7
  });
}

// Works with any model implementation
import { GeminiModel } from '@/lib/ai_gemini_model';
const geminiModel = GeminiModel.create({ apiKey: '...' });
const response = await generateExplanation(geminiModel, 'quantum computing');
```

### Implementing a Custom Model

```typescript
import type { IAIModel, AIModelConfig, GenerateContentOptions, AIModelResponse } from '@/lib/ai_model';

class CustomAIModel implements IAIModel {
  private isInit = false;
  
  static create(config: AIModelConfig): CustomAIModel {
    return new CustomAIModel(config);
  }
  
  async initialize(config?: AIModelConfig): Promise<void> {
    // Initialize your AI model here
    this.isInit = true;
  }
  
  async generateContent(options: GenerateContentOptions): Promise<AIModelResponse> {
    // Generate content using your AI provider
    return { text: 'Generated response' };
  }
  
  isInitialized(): boolean {
    return this.isInit;
  }
  
  getModelName(): string {
    return 'custom-model';
  }
}
```

## Configuration

No configuration required for the interface itself. Individual implementations will require their own configuration (API keys, etc.).

## Integration Points

### Works With
- `GeminiModel` - Google Gemini implementation
- Future model implementations (OpenAI, Anthropic, etc.)
- AI services and workflows

### Used By
- AI service modules
- Flashcard generation
- Content creation workflows
- Application-level AI features

## Error Handling & Testing

### Error Handling

The interface doesn't prescribe specific error handling, but implementations should:
- Throw descriptive errors when operations fail
- Log errors with context
- Provide meaningful error messages

### Testing

When testing AI model implementations:
1. Test all interface methods
2. Verify error handling
3. Mock external API calls
4. Test initialization states
5. Verify response structures

### Testing Checklist

For any `IAIModel` implementation:

- [ ] Create method with valid and invalid configs
- [ ] Initialize method (success and failure)
- [ ] Generate content with various prompts
- [ ] Check initialization state
- [ ] Return correct model name
- [ ] Handle errors appropriately
- [ ] Include proper logging

## Extension Points

To add a new AI model provider:

1. Create a new class implementing `IAIModel`
2. Implement all required methods
3. Follow the factory pattern (`create()` method)
4. Add proper logging and error handling
5. Create tests in a `tests/` subfolder
6. Document in a `README.md` file
7. Export from the module's `index.ts`

## Best Practices

1. **Always use the interface** - Never depend on concrete implementations
2. **Factory pattern** - Use `create()` methods for instantiation
3. **Lazy initialization** - Initialize models when needed
4. **Error handling** - Wrap AI calls in try-catch blocks
5. **Logging** - Log all important operations
6. **Type safety** - Use TypeScript types throughout

## Related Modules

- `@/lib/ai_gemini_model` - Gemini AI implementation
- `@/lib/config` - Configuration management
- `@/lib/logging` - Structured logging
