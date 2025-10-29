# Utils - Shared Utility Functions

## Overview

This directory contains shared utility functions that can be used throughout the application. These utilities provide common functionality needed across different layers and modules.

## Available Utilities

### Environment Detection

**Location:** `src/lib/utils/environment.ts`

Provides functions to detect the runtime environment.

#### `isProduction(): boolean`

Determines if the code is running in production (Cloud Run) or local development.

**Logic:**
- Checks for the presence of `gcp-key.json` file in the project root
- If `gcp-key.json` exists → Local development → Returns `false`
- If `gcp-key.json` doesn't exist → Production (Cloud Run) → Returns `true`

**This is the single source of truth for production detection in the codebase.**

**Usage:**
```typescript
import { isProduction } from '@/lib/utils/environment';

if (isProduction()) {
  // Production logic - use Application Default Credentials, Cloud Run service account, etc.
} else {
  // Development logic - use service account key file, local configuration, etc.
}
```

#### `isDevelopment(): boolean`

Convenience function that returns the inverse of `isProduction()`.

**Usage:**
```typescript
import { isDevelopment } from '@/lib/utils/environment';

if (isDevelopment()) {
  // Local development logic
}
```

## Usage Guidelines

1. **Always use the shared utilities** - Don't create custom environment detection logic
2. **Import from the utility file** - Use `@/lib/utils/environment` for environment detection
3. **Single source of truth** - `isProduction()` is the only way to detect production environment
4. **File-based detection** - The detection is based on file presence, not environment variables

## Integration

These utilities are used by:
- Firebase configuration (`src/infrastructure/adapters/database/firebase/FirebaseConfig.ts`)
- Any module that needs to differentiate between production and development behavior

