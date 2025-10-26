// UUID: a1b2c3d4-5678-90ab-cdef-123456789012
// IAIModel Interface Tests - Structural validation tests

import test from 'ava';
import type { IAIModel, AIModelConfig, GenerateContentOptions, AIModelResponse } from '../IAIModel';

/**
 * Simple mock implementation of IAIModel for testing
 */
class MockAIModel implements IAIModel {
  private initialized = false;
  private readonly apiKey: string;
  private readonly modelName: string;

  constructor(apiKey: string, modelName: string) {
    this.apiKey = apiKey;
    this.modelName = modelName;
  }

  async initialize(config?: AIModelConfig): Promise<void> {
    this.initialized = true;
  }

  async generateContent(options: GenerateContentOptions): Promise<AIModelResponse> {
    if (!this.initialized) {
      throw new Error('Model not initialized');
    }
    return {
      text: 'Mock response',
      usage: {
        promptTokens: 10,
        completionTokens: 20,
        totalTokens: 30
      },
      metadata: {
        model: this.modelName
      }
    };
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getModelName(): string {
    return this.modelName;
  }
}

test('should implement all required IAIModel methods', t => {
  // Arrange & Act
  const model = new MockAIModel('test-key', 'test-model');

  // Assert
  t.is(typeof model.initialize, 'function', 'initialize method exists');
  t.is(typeof model.generateContent, 'function', 'generateContent method exists');
  t.is(typeof model.isInitialized, 'function', 'isInitialized method exists');
  t.is(typeof model.getModelName, 'function', 'getModelName method exists');
});

test('should initialize successfully with config', async t => {
  // Arrange
  const model = new MockAIModel('test-key', 'test-model');

  // Act
  await model.initialize({ apiKey: 'test-key' });

  // Assert
  t.true(model.isInitialized(), 'Model should be initialized');
});

test('should throw error when generating content before initialization', async t => {
  // Arrange
  const model = new MockAIModel('test-key', 'test-model');

  // Act & Assert
  await t.throwsAsync(
    async () => model.generateContent({ prompt: 'test' }),
    { message: 'Model not initialized' }
  );
});

test('should generate content successfully after initialization', async t => {
  // Arrange
  const model = new MockAIModel('test-key', 'test-model');
  await model.initialize();

  // Act
  const response = await model.generateContent({ prompt: 'test prompt' });

  // Assert
  t.truthy(response, 'Response should exist');
  t.is(response.text, 'Mock response', 'Response text should match');
  t.truthy(response.usage, 'Usage info should exist');
  t.is(response.usage?.promptTokens, 10, 'Prompt tokens should be correct');
  t.is(response.usage?.completionTokens, 20, 'Completion tokens should be correct');
  t.is(response.usage?.totalTokens, 30, 'Total tokens should be correct');
});

test('should return model name correctly', t => {
  // Arrange
  const model = new MockAIModel('test-key', 'test-model-name');

  // Act
  const name = model.getModelName();

  // Assert
  t.is(name, 'test-model-name', 'Model name should match');
});

test('should track initialization state correctly', async t => {
  // Arrange
  const model = new MockAIModel('test-key', 'test-model');

  // Act & Assert
  t.false(model.isInitialized(), 'Should be false before initialization');
  await model.initialize();
  t.true(model.isInitialized(), 'Should be true after initialization');
});

test('should accept various prompt options', async t => {
  // Arrange
  const model = new MockAIModel('test-key', 'test-model');
  await model.initialize();

  // Act
  const response1 = await model.generateContent({ 
    prompt: 'test',
    maxTokens: 100,
    temperature: 0.7 
  });

  // Assert
  t.truthy(response1, 'Should handle all prompt options');
});

