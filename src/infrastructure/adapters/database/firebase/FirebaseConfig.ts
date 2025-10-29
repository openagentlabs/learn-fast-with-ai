// UUID: firebase-config-uuid-001
// Firebase configuration using GCP service account

import admin from 'firebase-admin';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { logger } from '@/infrastructure/adapters/logging';

/**
 * Firebase configuration class
 * Uses Application Default Credentials in production (Cloud Run)
 * Uses service account key file in development (local)
 */
export class FirebaseConfig {
  private static instance: FirebaseConfig;
  private initialized = false;
  private readonly firebaseLogger = logger.child({ module: 'FirebaseConfig' });

  private constructor() {}

  /**
   * Get singleton instance
   * @returns FirebaseConfig instance
   */
  public static getInstance(): FirebaseConfig {
    if (!FirebaseConfig.instance) {
      FirebaseConfig.instance = new FirebaseConfig();
    }
    return FirebaseConfig.instance;
  }

  /**
   * Check if running in production environment
   * Detects Cloud Run by checking for K_SERVICE environment variable
   * Also checks NODE_ENV for additional safety
   * @returns True if in production
   */
  private isProduction(): boolean {
    // Cloud Run sets K_SERVICE environment variable
    const isCloudRun = !!process.env.K_SERVICE;
    // Also check NODE_ENV
    const isNodeEnvProduction = process.env.NODE_ENV === 'production';
    
    return isCloudRun || isNodeEnvProduction;
  }

  /**
   * Initialize Firebase Admin SDK
   * In production: Uses Application Default Credentials (ADC)
   * In development: Uses service account key file
   */
  public initialize(): void {
    if (this.initialized) {
      this.firebaseLogger.info('Firebase already initialized');
      return;
    }

    try {
      // Check if Firebase is already initialized
      if (admin.apps.length > 0) {
        this.initialized = true;
        this.firebaseLogger.info('Firebase already initialized by another module');
        return;
      }

      const isProd = this.isProduction();
      
      if (isProd) {
        // Production: Use Application Default Credentials (ADC)
        // Cloud Run automatically provides credentials via metadata server
        this.firebaseLogger.info('Initializing Firebase in production mode with Application Default Credentials');
        
        admin.initializeApp({
          projectId: 'keithtest001'
          // No credential specified - uses ADC automatically
        });
        
        this.firebaseLogger.info('Firebase initialized with Application Default Credentials');
      } else {
        // Development: Use service account key file
        const serviceAccountPath = path.join(process.cwd(), 'gcp-key.json');
        
        if (!existsSync(serviceAccountPath)) {
          throw new Error(
            `Service account key file not found at ${serviceAccountPath}. ` +
            'Required for local development. Make sure gcp-key.json exists in the project root.'
          );
        }
        
        this.firebaseLogger.info('Initializing Firebase in development mode with service account key', {
          keyPath: serviceAccountPath
        });
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccountPath),
          projectId: 'keithtest001'
        });
        
        this.firebaseLogger.info('Firebase initialized with service account key');
      }

      this.initialized = true;
      this.firebaseLogger.info('Firebase Admin SDK initialized successfully', {
        environment: isProd ? 'production' : 'development'
      });
    } catch (error) {
      this.firebaseLogger.error('Failed to initialize Firebase', { error });
      throw error; // Re-throw to make initialization failures visible
    }
  }

  /**
   * Get Firestore instance
   * @returns Firestore instance
   */
  public getFirestore() {
    if (!this.initialized && admin.apps.length === 0) {
      this.initialize();
    }
    return admin.firestore();
  }

  /**
   * Check if Firebase is initialized
   * @returns True if initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }
}

export const firebaseConfig = FirebaseConfig.getInstance();

