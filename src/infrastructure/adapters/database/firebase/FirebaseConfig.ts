// UUID: firebase-config-uuid-001
// Firebase configuration using GCP service account

import admin from 'firebase-admin';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { logger } from '@/infrastructure/adapters/logging';
import { isProduction } from '@/lib/utils/environment';

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

      const isProd = isProduction();
      const serviceAccountPath = path.join(process.cwd(), 'gcp-key.json');
      
      this.firebaseLogger.debug('Production environment detection', {
        isProd,
        cwd: process.cwd(),
        keyFileExists: existsSync(serviceAccountPath),
        keyFilePath: serviceAccountPath
      });
      
      if (isProd) {
        // Production (Cloud Run): Use Application Default Credentials (ADC)
        // Cloud Run automatically provides credentials via metadata server
        // The service account attached to Cloud Run has permissions to access Firestore
        this.firebaseLogger.info('Initializing Firebase in production mode with Application Default Credentials', {
          projectId: 'keithtest001',
          reason: 'gcp-key.json not found - using Cloud Run service account',
          credentialSource: 'Application Default Credentials (ADC)'
        });
        
        try {
          admin.initializeApp({
            projectId: 'keithtest001'
            // No credential specified - uses ADC automatically from Cloud Run service account
          });
          
          this.firebaseLogger.info('Firebase initialized successfully with Application Default Credentials');
        } catch (adcError) {
          this.firebaseLogger.error('Failed to initialize Firebase with ADC', {
            error: adcError instanceof Error ? adcError.message : String(adcError),
            hint: 'Ensure Cloud Run service account has Firestore permissions'
          });
          throw new Error(
            `Failed to initialize Firebase with Application Default Credentials: ${adcError instanceof Error ? adcError.message : String(adcError)}`
          );
        }
      } else {
        // Development (Local): Use service account key file
        // Verify file exists as a safety check
        if (!existsSync(serviceAccountPath)) {
          const errorMessage = `Service account key file not found at ${serviceAccountPath}. ` +
            'Required for local development. Make sure gcp-key.json exists in the project root.';
          this.firebaseLogger.error('Service account key file missing', {
            keyPath: serviceAccountPath,
            cwd: process.cwd()
          });
          throw new Error(errorMessage);
        }
        
        this.firebaseLogger.info('Initializing Firebase in development mode with service account key file', {
          keyPath: serviceAccountPath,
          projectId: 'keithtest001',
          credentialSource: 'Service Account Key File'
        });
        
        try {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccountPath),
            projectId: 'keithtest001'
          });
          
          this.firebaseLogger.info('Firebase initialized successfully with service account key file');
        } catch (certError) {
          this.firebaseLogger.error('Failed to initialize Firebase with service account key', {
            error: certError instanceof Error ? certError.message : String(certError),
            keyPath: serviceAccountPath,
            hint: 'Verify gcp-key.json is valid and has proper permissions'
          });
          throw new Error(
            `Failed to initialize Firebase with service account key: ${certError instanceof Error ? certError.message : String(certError)}`
          );
        }
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
   * Automatically initializes Firebase if not already initialized
   * Works in both production (ADC) and development (key file) modes
   * 
   * @returns Firestore instance
   * @throws Error if Firebase initialization fails
   */
  public getFirestore() {
    // Ensure Firebase is initialized before returning Firestore
    if (!this.initialized && admin.apps.length === 0) {
      this.firebaseLogger.debug('Firestore requested but Firebase not initialized - initializing now');
      this.initialize();
    }
    
    if (!this.initialized) {
      throw new Error('Firebase initialization failed - cannot get Firestore instance');
    }
    
    try {
      const firestore = admin.firestore();
      this.firebaseLogger.debug('Firestore instance retrieved successfully', {
        environment: isProduction() ? 'production' : 'development'
      });
      return firestore;
    } catch (error) {
      this.firebaseLogger.error('Failed to get Firestore instance', {
        error: error instanceof Error ? error.message : String(error),
        initialized: this.initialized,
        appsCount: admin.apps.length
      });
      throw new Error(
        `Failed to get Firestore instance: ${error instanceof Error ? error.message : String(error)}`
      );
    }
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

