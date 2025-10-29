# Build Info Module

## Overview

The Build Info module provides access to build-time metadata including build ID, git commit SHA, and build timestamp. This information is generated during the Docker build process and embedded into the application.

## Purpose

- **Build Tracking**: Identify which build version is running in production
- **Deployment Verification**: Confirm which code version is deployed
- **Debugging**: Track build information for troubleshooting
- **Auditing**: Maintain a record of build metadata

## Usage

### Access Build Info via Service

```typescript
import { buildInfoService } from '@/lib/build-info';

// Get complete build information
const buildInfo = buildInfoService.getBuildInfo();
console.log(buildInfo.buildId);      // e.g., "abc1234-1234567890-a1b2c3d4"
console.log(buildInfo.gitSha);       // Full git commit SHA
console.log(buildInfo.shortSha);     // Short SHA (first 7 chars)
console.log(buildInfo.buildTimestamp); // ISO timestamp
console.log(buildInfo.buildDate);    // Human-readable date

// Or get specific values
const buildId = buildInfoService.getBuildId();
const gitSha = buildInfoService.getGitSha();
const shortSha = buildInfoService.getShortSha();
```

### Access via HTTP Endpoint

The build ID is available at:

```
GET /info/build_id
```

**Response:**
```json
{
  "buildId": "abc1234-1234567890-a1b2c3d4",
  "gitSha": "abc1234def5678...",
  "shortSha": "abc1234",
  "buildTimestamp": "2025-01-15T10:30:00.000Z",
  "buildDate": "1/15/2025, 10:30:00 AM"
}
```

## How It Works

1. **Build Time**: During Docker build (in `builder` stage), the `generate-build-info.js` script runs
2. **Generation**: The script creates:
   - `src/lib/build-info/build-info.ts` - TypeScript module with build info
   - `src/lib/build-info/build-info.json` - JSON file with build info
   - `public/build-info.json` - Public JSON file
3. **Runtime**: `BuildInfoService` loads the build info from these files
4. **Access**: Build info is available via the service or HTTP endpoint

## Build ID Format

The build ID follows this format:
```
{shortSha}-{timestamp}-{random}
```

Example: `abc1234-1737029400000-a1b2c3d4`

- `shortSha`: First 7 characters of git commit SHA
- `timestamp`: Unix timestamp in milliseconds
- `random`: 8-character hexadecimal random string

## Git SHA Sources

The script tries to get the git commit SHA in this order:
1. `GIT_COMMIT_SHA` environment variable (from Docker build arg)
2. `SHORT_SHA` environment variable (from Cloud Build)
3. `GITHUB_SHA` environment variable (from GitHub Actions)
4. Git command (`git rev-parse HEAD`) for local builds
5. Fallback: `"local-build"` or `"unknown"`

## Files

- `BuildInfoService.ts` - Service class for accessing build info
- `index.ts` - Module exports
- `build-info.ts` - Auto-generated TypeScript file (created at build time)
- `build-info.json` - Auto-generated JSON file (created at build time)

## Integration with CI/CD

The build info is automatically generated during the Docker build process:

1. **GitHub Actions** passes `github.sha` as `SHORT_SHA` substitution
2. **Cloud Build** receives `SHORT_SHA` and passes it as `GIT_COMMIT_SHA` build arg
3. **Dockerfile** runs `generate-build-info.js` with `GIT_COMMIT_SHA` environment variable
4. **Build Script** generates build info files with git SHA embedded

## Testing

When running locally without a build, the service returns default values:
- `buildId`: `"unknown"`
- `gitSha`: `"unknown"`
- `shortSha`: `"unknown"`
- `buildTimestamp`: Current timestamp
- `buildDate`: Current date

This allows the application to run in development even without generated build info.

## Dependencies

- Node.js `node:fs`, `node:path`, `node:crypto` modules
- Available during Docker build process
- Used at runtime by `BuildInfoService`

