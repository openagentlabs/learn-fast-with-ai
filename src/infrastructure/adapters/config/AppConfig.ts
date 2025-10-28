// UUID: c18c8282-6685-4aab-87e5-b4558035f647
// AppConfig - Singleton configuration class using dotenv

import dotenv from 'dotenv';
import path from 'node:path';

/**
 * AppConfig - Singleton configuration class that loads and manages environment variables
 * 
 * This class uses dotenv to load configuration from the .env file at the project root.
 * It follows the singleton pattern to ensure only one instance exists throughout the application.
 */
class AppConfig {
  private static instance: AppConfig;
  private configLoaded = false;

  // Configuration properties
  public readonly GEMINI_API_KEY: string;

  /**
   * Private constructor - use getInstance() or the exported appConfig instance
   */
  private constructor() {
    this.loadConfig();
    
    // Expose configuration properties
    this.GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
  }

  /**
   * Load configuration from .env file
   * @private
   */
  private loadConfig(): void {
    if (this.configLoaded) {
      return;
    }

    try {
      // Load environment variables from .env file at project root
      const envPath = path.resolve(process.cwd(), '.env');
      
      const result = dotenv.config({ path: envPath });

      if (result.error) {
        console.warn('Failed to load .env file:', result.error.message);
      }

      this.configLoaded = true;
    } catch (error) {
      console.error('Error loading configuration:', error);
      throw error;
    }
  }

  /**
   * Get the singleton instance of AppConfig
   * @returns The AppConfig instance
   */
  public static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  /**
   * Reload configuration from .env file
   * This method reloads the environment variables from the .env file
   */
  public reload(): void {
    console.log('Reloading configuration');
    this.configLoaded = false;
    this.loadConfig();
  }

  /**
   * Get all configuration as an object
   * @returns Object containing all configuration values
   */
  public getAll(): Record<string, string> {
    return {
      GEMINI_API_KEY: this.GEMINI_API_KEY,
    };
  }

  /**
   * Check if configuration is valid
   * @returns True if required configuration is present
   */
  public isValid(): boolean {
    const hasRequiredConfig = !!this.GEMINI_API_KEY;
    
    if (!hasRequiredConfig) {
      console.warn('Configuration validation failed: GEMINI_API_KEY is missing');
    }

    return hasRequiredConfig;
  }
}

// Export singleton instance
export const appConfig = AppConfig.getInstance();

// Also export the class for advanced usage
export { AppConfig };
