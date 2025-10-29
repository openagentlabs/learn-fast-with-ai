// UUID: app-start-hook-uuid-001
// Application startup hook - initializes services at application bootstrap

import { logger } from '@/infrastructure/adapters/logging';
import { firebaseConfig } from '@/infrastructure/adapters/database/firebase/FirebaseConfig';

/**
 * App Start Hook - Called when Next.js application initializes
 * 
 * Purpose:
 * - Initialize application-wide services and configurations
 * - Perform startup validations (config, environment, dependencies)
 * - Set up global state or singleton instances
 * - Log application startup events
 * - Verify required environment variables and API keys
 * - Initialize external service connections
 * 
 * @returns {void}
 */
export function appStartHook(): void {
  const hookLogger = logger.child({ hook: 'appStartHook' });
  
  hookLogger.info('Application startup hook invoked');
  
  try {
    // Initialize Firebase early - required for database operations
    firebaseConfig.initialize();
    
    hookLogger.info('Application initialized successfully');
  } catch (error) {
    hookLogger.error('Application startup hook failed', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    // Don't throw - allow application to start even if some services fail
    // This prevents the entire app from crashing due to initialization issues
  }
}

// Auto-initialize when module is imported (Next.js server-side)
// Only run on server-side (not in browser)
if (globalThis.window === undefined) {
  appStartHook();
}

