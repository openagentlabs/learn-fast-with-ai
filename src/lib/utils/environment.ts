// UUID: environment-utils-uuid-001
// Shared environment utility functions

import path from 'node:path';
import { existsSync } from 'node:fs';

/**
 * Check if running in production environment
 * 
 * Simple file-based detection:
 * - If gcp-key.json exists → Local development → Returns false
 * - If gcp-key.json doesn't exist → Production (Cloud Run) → Returns true
 * 
 * This is the single source of truth for production detection in the codebase.
 * All production detection should use this function.
 * 
 * @returns {boolean} True if in production (gcp-key.json doesn't exist), false if in local development
 * 
 * @example
 * ```typescript
 * import { isProduction } from '@/lib/utils/environment';
 * 
 * if (isProduction()) {
 *   // Use Application Default Credentials
 * } else {
 *   // Use service account key file
 * }
 * ```
 */
export function isProduction(): boolean {
  const serviceAccountPath = path.join(process.cwd(), 'gcp-key.json');
  const keyFileExists = existsSync(serviceAccountPath);
  return !keyFileExists;
}

/**
 * Check if running in development environment
 * 
 * @returns {boolean} True if in local development (gcp-key.json exists), false if in production
 * 
 * @example
 * ```typescript
 * import { isDevelopment } from '@/lib/utils/environment';
 * 
 * if (isDevelopment()) {
 *   // Use service account key file
 * } else {
 *   // Use Application Default Credentials
 * }
 * ```
 */
export function isDevelopment(): boolean {
  return !isProduction();
}

