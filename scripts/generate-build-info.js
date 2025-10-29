// UUID: 8a7f3e2d-1c9b-4f8a-b3e5-6d2c9a7f1e3b
// Build info generation script - Creates build ID and metadata at build time

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

/**
 * Generates build information including build ID, timestamp, and git commit SHA
 * This script runs during Docker build to embed build metadata into the application
 */
function generateBuildInfo() {
  const projectRoot = path.resolve(__dirname, '..');
  
  // Get git commit SHA if available (from environment or git command)
  let gitSha = process.env.GIT_COMMIT_SHA || 
               process.env.SHORT_SHA || 
               process.env.GITHUB_SHA || 
               'unknown';
  
  // Try to get from git directly if not in env (for local builds)
  if (gitSha === 'unknown') {
    try {
      const { execSync } = require('node:child_process');
      gitSha = execSync('git rev-parse HEAD', { encoding: 'utf-8', cwd: projectRoot }).trim();
    } catch {
      // Git not available or not a git repo - use fallback
      gitSha = 'local-build';
    }
  }
  
  // Generate short SHA (first 7 characters)
  const shortSha = gitSha.length >= 7 ? gitSha.substring(0, 7) : gitSha;
  
  // Generate unique build ID
  // Format: {shortSha}-{timestamp}-{random}
  const timestamp = new Date().toISOString();
  const randomSuffix = crypto.randomBytes(4).toString('hex').substring(0, 8);
  const buildId = `${shortSha}-${Date.now()}-${randomSuffix}`;
  
  // Create build info object
  const buildInfo = {
    buildId: buildId,
    gitSha: gitSha,
    shortSha: shortSha,
    buildTimestamp: timestamp,
    buildDate: new Date().toLocaleString('en-US', { timeZone: 'UTC' })
  };
  
  // Write to public directory (accessible at runtime)
  const publicDir = path.join(projectRoot, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  const publicBuildInfoPath = path.join(publicDir, 'build-info.json');
  fs.writeFileSync(
    publicBuildInfoPath,
    JSON.stringify(buildInfo, null, 2),
    'utf-8'
  );
  
  // Ensure src/lib directory exists
  const libDir = path.join(projectRoot, 'src', 'lib');
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }
  
  // Note: JSON file will be written to build-info subdirectory with TypeScript file
  
  // Also generate TypeScript constant file for type-safe access
  // Place in build-info subdirectory to match service import path
  const buildInfoDir = path.join(libDir, 'build-info');
  if (!fs.existsSync(buildInfoDir)) {
    fs.mkdirSync(buildInfoDir, { recursive: true });
  }

  const tsContent = `// UUID: 8a7f3e2d-1c9b-4f8a-b3e5-6d2c9a7f1e3b
// Auto-generated build info - DO NOT EDIT MANUALLY
// Generated at build time by scripts/generate-build-info.js

export interface BuildInfo {
  buildId: string;
  gitSha: string;
  shortSha: string;
  buildTimestamp: string;
  buildDate: string;
}

export const buildInfo: BuildInfo = ${JSON.stringify(buildInfo, null, 2)};

export const BUILD_ID = '${buildInfo.buildId}';
export const GIT_SHA = '${buildInfo.gitSha}';
export const SHORT_SHA = '${buildInfo.shortSha}';
export const BUILD_TIMESTAMP = '${buildInfo.buildTimestamp}';
export const BUILD_DATE = '${buildInfo.buildDate}';
`;
  
  const tsBuildInfoPath = path.join(buildInfoDir, 'build-info.ts');
  fs.writeFileSync(tsBuildInfoPath, tsContent, 'utf-8');
  
  // Also update JSON file location to be consistent
  const buildInfoJsonPath = path.join(buildInfoDir, 'build-info.json');
  fs.writeFileSync(
    buildInfoJsonPath,
    JSON.stringify(buildInfo, null, 2),
    'utf-8'
  );
  
  console.log('✅ Build info generated successfully:');
  console.log(`   Build ID: ${buildInfo.buildId}`);
  console.log(`   Git SHA: ${buildInfo.gitSha}`);
  console.log(`   Timestamp: ${buildInfo.buildTimestamp}`);
}

// Run if called directly
if (require.main === module) {
  try {
    generateBuildInfo();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to generate build info:', error);
    process.exit(1);
  }
}

module.exports = { generateBuildInfo };

