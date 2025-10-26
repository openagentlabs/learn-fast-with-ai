# Gemini Model Wrapper

## Overview

The Gemini Model Wrapper provides a standardized interface for interacting with Google's Gemini AI models using the GenKit framework. It implements the `IAIModel` interface, ensuring consistency across different AI model implementations.

## Purpose

This module wraps Google's Gemini AI models with a consistent, type-safe interface that can be easily swapped with other AI model implementations (OpenAI, Anthropic, etc.).

## Usage Examples

### Basic Usage

```typescript
import { GeminiModel } from '@/lib/ai_gemini_model';
import { appConfig } from '@/lib/config';

// Create and initialize the model
const model = GeminiModel.create({
  apiKey: appConfig.GEMINI_API_KEY,
  modelName: 'gemini-2.0-flash-exp'
});

await model.initialize();

// Generate content
const response = await model.generateContent({
  prompt: 'Explain quantum computing in simple terms',
  maxTokens: 500,
  temperature: 0.7
});

console.log(response.text);
```

### Advanced Usage

```typescript
import { GeminiModel } from '@/lib/ai_gemini_model';

// Create with custom model name
const model = GeminiModel.create({
  apiKey: process.env.GEMINI_API_KEY || '',
  modelName: 'gemini-1.5-pro'
});

// Initialize with validation
try {
  await model.initialize();
  
  if (!model.isInitialized()) {
    throw new Error('Model initialization failed');
  }
  
  console.log(`Model ready: ${model.getModelName()}`);
} catch (error) {
  console.error('Failed to initialize model:', error);
}

// Generate with custom parameters
const response = await model.generateContent({
  prompt: 'Write a haiku about programming',
  maxTokens: 100,
  temperature: 0.9
});

console.log('Generated text:', response.text);
console.log('Token usage:', response.usage);
```

## API Reference

### `GeminiModel.create(config: AIModelConfig): GeminiModel`

Factory method to create a new GeminiModel instance.

**Parameters:**
- `config.apiKey` (required): Gemini API key
- `config.modelName` (optional): Model name (defaults to 'gemini-2.0-flash-exp')

**Returns:** New GeminiModel instance

**Throws:** Error if API key is not provided

### `initialize(config?: AIModelConfig): Promise<void>`

Initialize the Gemini model with GenKit configuration.

**Returns:** Promise that resolves when initialization is complete

**Throws:** Error if initialization fails

### `generateContent(options: GenerateContentOptions): Promise<AIModelResponse>`

Generate content using the Gemini model.

**Parameters:**
- `options.prompt` (required): Input prompt text
- `options.maxTokens` (optional): Maximum tokens to generate
- `options.temperature` (optional): Temperature for randomness (0-1)

**Returns:** Promise resolving to AI model response with text and usage info

**Throws:** Error if generation fails or model not initialized

### `isInitialized(): boolean`

Check if the model is properly initialized.

**Returns:** True if model is ready to use

### `getModelName(): string`

Get the model name/identifier.

**Returns:** Model name string

## Configuration

### Environment Variables

- `GEMINI_API_KEY`: Google Gemini API key (required)

### Supported Models

- `gemini-2.0-flash-exp` (default)
- `gemini-1.5-pro`
- `gemini-1.5-flash`

## Integration Points

### Works With
- `IAIModel` interface from `@/lib/ai_model`
- AppConfig for API key management
- Logger for structured logging

### Used By
- AI service modules
- Flashcard generation services
- Content generation workflows

## Error Handling

The model throws errors in the following cases:
- API key not provided during creation
- Model initialization fails
- Model not initialized before generating content
- Content generation fails

All errors are logged with context using the structured logger.

## Testing

Tests should be created in `tests/` subfolder following the project conventions.

### Testing Checklist
- [ ] Model creation with valid API key
- [ ] Model creation without API key (should throw)
- [ ] Initialization success and failure scenarios
- [ ] Content generation with various prompts
- [ ] Error handling for all failure cases

## Error Handling & Testing

### Common Errors

1. **API key not provided**
   - Error: "API key is required for GeminiModel"
   - Solution: Provide API key in config

2. **Model not initialized**
   - Error: "GeminiModel must be initialized before generating content"
   - Solution: Call `initialize()` before generating content

3. **Initialization failure**
   - Error: "Failed to initialize GeminiModel: [details]"
   - Solution: Check API key validity and network connectivity

### Testing Guidelines

- Mock the GenKit API for unit tests
- Test with invalid API keys
- Test initialization failures
- Test content generation with various inputs
- Verify logging is working correctly
