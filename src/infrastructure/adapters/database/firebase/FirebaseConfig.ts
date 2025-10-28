// UUID: firebase-config-uuid-001
// Firebase configuration using GCP service account

import admin from 'firebase-admin';
import path from 'node:path';
import { logger } from '@/infrastructure/adapters/logging';

/**
 * Firebase configuration class
 * Uses GCP service account key for authentication
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
   * Initialize Firebase Admin SDK with service account
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

      const serviceAccountPath = path.join(process.cwd(), 'gcp-key.json');
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
        projectId: 'keithtest001'
      });

      this.initialized = true;
      this.firebaseLogger.info('Firebase Admin SDK initialized successfully');
    } catch (error) {
      this.firebaseLogger.error('Failed to initialize Firebase', { error });
      // Don't throw, just log the error - Firebase might already be initialized
      console.error('Firebase initialization error:', error);
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

