// UUID: 9b8c7d6e-5f4a-3b2c-1d0e-9f8a7b6c5d4e
// BuildInfoService - Service for accessing build information

import { logger } from '@/lib/logging';

/**
 * BuildInfo - Interface for build information
 */
export interface BuildInfo {
  buildId: string;
  gitSha: string;
  shortSha: string;
  buildTimestamp: string;
  buildDate: string;
}

/**
 * BuildInfoService - Service for accessing build-time information
 * 
 * This service provides access to build metadata including build ID,
 * git commit SHA, and build timestamp. The build info is generated
 * at build time and embedded into the application.
 */
class BuildInfoService {
  private buildInfo: BuildInfo | null = null;
  private readonly serviceLogger = logger.child({ service: 'BuildInfoService' });

  /**
   * Load build information from the generated build-info file
   * @returns BuildInfo object or null if not available
   */
  private loadBuildInfo(): BuildInfo | null {
    if (this.buildInfo !== null) {
      return this.buildInfo;
    }

    // Try to import the generated build-info.ts file
    // During Next.js build, this file may not exist yet, which is fine
    // We'll fall back to JSON file or default values
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const buildInfoModule = require('../build-info/build-info');
      
      if (buildInfoModule?.buildInfo) {
        this.buildInfo = buildInfoModule.buildInfo;
        if (this.buildInfo) {
          this.serviceLogger.debug('Build info loaded successfully', {
            buildId: this.buildInfo.buildId,
            shortSha: this.buildInfo.shortSha
          });
          return this.buildInfo;
        }
      }
    } catch {
      // build-info.ts doesn't exist (e.g., during Next.js build or development)
      // This is expected - continue to JSON fallback
    }

    // Fallback: Try to read from JSON file
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('node:fs');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require('node:path');
      const buildInfoPath = path.join(process.cwd(), 'src', 'lib', 'build-info.json');
      
      if (fs.existsSync(buildInfoPath)) {
        const fileContent = fs.readFileSync(buildInfoPath, 'utf-8');
        this.buildInfo = JSON.parse(fileContent);
        this.serviceLogger.debug('Build info loaded from JSON file');
        return this.buildInfo;
      }
    } catch (error) {
      this.serviceLogger.warn('Failed to load build info from JSON file', {
        error: error instanceof Error ? error.message : String(error)
      });
    }

    // Fallback: Return default values if build info is not available
    this.serviceLogger.warn('Build info not available, using default values');
    this.buildInfo = {
      buildId: 'unknown',
      gitSha: 'unknown',
      shortSha: 'unknown',
      buildTimestamp: new Date().toISOString(),
      buildDate: new Date().toLocaleString('en-US', { timeZone: 'UTC' })
    };

    return this.buildInfo;
  }

  /**
   * Get the complete build information
   * @returns BuildInfo object
   */
  public getBuildInfo(): BuildInfo {
    const info = this.loadBuildInfo();
    return info || {
      buildId: 'unknown',
      gitSha: 'unknown',
      shortSha: 'unknown',
      buildTimestamp: new Date().toISOString(),
      buildDate: new Date().toLocaleString('en-US', { timeZone: 'UTC' })
    };
  }

  /**
   * Get the build ID
   * @returns Build ID string
   */
  public getBuildId(): string {
    return this.getBuildInfo().buildId;
  }

  /**
   * Get the git commit SHA
   * @returns Full git commit SHA
   */
  public getGitSha(): string {
    return this.getBuildInfo().gitSha;
  }

  /**
   * Get the short git commit SHA (first 7 characters)
   * @returns Short git commit SHA
   */
  public getShortSha(): string {
    return this.getBuildInfo().shortSha;
  }

  /**
   * Get the build timestamp
   * @returns ISO timestamp string
   */
  public getBuildTimestamp(): string {
    return this.getBuildInfo().buildTimestamp;
  }

  /**
   * Static factory method to create BuildInfoService instance
   * @returns BuildInfoService instance
   */
  public static create(): BuildInfoService {
    return new BuildInfoService();
  }
}

// Export singleton instance
export const buildInfoService = BuildInfoService.create();

// Export class for testing
export { BuildInfoService };

