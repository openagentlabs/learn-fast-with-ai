# Configuration Module

## Overview

The Configuration Module provides centralized environment variable management using the dotenv library. It follows the singleton pattern to ensure consistent access to configuration throughout the application.

## Purpose

This module loads and manages all environment variables from the `.env` file at the project root, providing a type-safe and validated way to access configuration values throughout the application.

## Usage Examples

### Basic Usage

```typescript
import { appConfig } from '@/lib/config';

// Access configuration properties
const apiKey = appConfig.GEMINI_API_KEY;

// Check if configuration is valid
if (!appConfig.isValid()) {
  console.error('Invalid configuration');
}

// Get all configuration as an object
const allConfig = appConfig.getAll();
```

### Advanced Usage

```typescript
import { AppConfig } from '@/lib/config';

// Reload configuration if needed
appConfig.reload();

// Validate configuration
if (!appConfig.isValid()) {
  throw new Error('Configuration is invalid');
}

// Access configuration
const geminiApiKey = appConfig.GEMINI_API_KEY;
```

### In Service Classes

```typescript
import { appConfig } from '@/lib/config';

class MyService {
  private apiKey = appConfig.GEMINI_API_KEY;
  
  async initialize() {
    if (!appConfig.isValid()) {
      throw new Error('Configuration is invalid');
    }
    // Use the API key
  }
}
```

## API Reference

### `appConfig.GEMINI_API_KEY`

The Gemini API key loaded from the environment variables.

**Type:** `string`

**Example:**
```typescript
const apiKey = appConfig.GEMINI_API_KEY;
```

### `appConfig.isValid(): boolean`

Check if the configuration is valid (has all required values).

**Returns:** True if configuration is valid

**Example:**
```typescript
if (!appConfig.isValid()) {
  console.error('Missing required configuration');
}
```

### `appConfig.getAll(): Record<string, string>`

Get all configuration values as an object.

**Returns:** Object containing all configuration values

**Example:**
```typescript
const config = appConfig.getAll();
console.log(config.GEMINI_API_KEY);
```

### `appConfig.reload(): void`

Reload configuration from the .env file.

**Example:**
```typescript
appConfig.reload();
```

## Configuration

### Environment Variables

Create a `.env` file at the project root with the following variables:

```env
# Gemini API Key
GEMINI_API_KEY=your-gemini-api-key-here
```

### Required Variables

- `GEMINI_API_KEY` - API key for Google Gemini AI service

### Adding New Configuration

To add a new configuration parameter:

1. Add the variable to the `.env` file
2. Add a public readonly property to the `AppConfig` class
3. Initialize it in the constructor from `process.env`
4. Add it to the `getAll()` method
5. Update validation logic in `isValid()` if required
6. Update this documentation

**Example:**

```typescript
// 1. Add to .env file
// NEW_CONFIG_VALUE=some-value

// 2. Add to AppConfig class
public readonly NEW_CONFIG_VALUE: string;

// 3. Initialize in constructor
this.NEW_CONFIG_VALUE = process.env.NEW_CONFIG_VALUE || '';

// 4. Add to getAll()
public getAll(): Record<string, string> {
  return {
    GEMINI_API_KEY: this.GEMINI_API_KEY,
    NEW_CONFIG_VALUE: this.NEW_CONFIG_VALUE, // Add here
  };
}
```

## Integration Points

### Works With
- All service modules that need configuration
- AI model implementations
- External service integrations
- Database connections

### Used By
- GeminiModel for API key
- Future service implementations
- Application initialization logic

## Error Handling

The configuration module handles errors gracefully:

1. **Missing .env file** - Logs warning and continues with empty values
2. **Invalid .env format** - Logs warning and continues
3. **Missing required values** - `isValid()` returns false

All errors are logged using the structured logger.

## Testing

### Testing with Environment Variables

```typescript
import { appConfig } from '@/lib/config';

// Test configuration access
test('should load GEMINI_API_KEY', () => {
  expect(appConfig.GEMINI_API_KEY).toBeDefined();
});

// Test validation
test('should validate configuration', () => {
  expect(appConfig.isValid()).toBe(true);
});
```

### Mocking Configuration in Tests

```typescript
// In test files, you can mock the configuration
jest.mock('@/lib/config', () => ({
  appConfig: {
    GEMINI_API_KEY: 'test-api-key',
    isValid: jest.fn(() => true),
  }
}));
```

## Security Best Practices

1. **Never commit .env file** - Add `.env` to `.gitignore`
2. **Use .env.example** - Provide a template with placeholder values
3. **Validate in production** - Check `isValid()` at application startup
4. **Use environment variables in production** - Set variables in hosting platform
5. **Never log sensitive values** - Configuration logger never logs actual API keys

## Troubleshooting

### Configuration not loading

**Problem:** Configuration values are empty

**Solutions:**
1. Check if `.env` file exists at project root
2. Verify file format (key=value pairs)
3. Check console for dotenv errors
4. Try calling `appConfig.reload()`

### TypeScript errors

**Problem:** Property does not exist on appConfig

**Solution:** Ensure you've added the property to the `AppConfig` class

### Validation failing

**Problem:** `isValid()` returns false

**Solutions:**
1. Check all required environment variables are set
2. Verify no extra spaces in .env file values
3. Ensure no quotes around values (unless needed)

## Related Modules

- `@/lib/logging` - Structured logging for configuration events
- `@/lib/ai_gemini_model` - Uses GEMINI_API_KEY configuration

## Migration Guide

### From Direct process.env Access

**Before:**
```typescript
const apiKey = process.env.GEMINI_API_KEY;
```

**After:**
```typescript
import { appConfig } from '@/lib/config';
const apiKey = appConfig.GEMINI_API_KEY;
```

### Benefits of Using AppConfig

1. **Centralized** - All configuration in one place
2. **Type-safe** - TypeScript knows available properties
3. **Validated** - Built-in validation with `isValid()`
4. **Logged** - Loading events are automatically logged
5. **Testable** - Easy to mock in tests
6. **Consistent** - Same API across all services
