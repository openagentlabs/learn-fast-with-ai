// UUID: 7c6d5e4f-3a2b-1c0d-9e8f-7a6b5c4d3e2f
// Build ID info route - Serves build information at /info/build_id

import { NextResponse } from 'next/server';
import { buildInfoService } from '@/lib/build-info/BuildInfoService';
import { logger } from '@/lib/logging';

/**
 * GET /info/build_id
 * 
 * Returns the build ID and build information for this application instance.
 * Useful for tracking which version/build is currently deployed.
 * 
 * @returns JSON response with build information
 */
export async function GET() {
  const routeLogger = logger.child({ route: '/info/build_id' });

  try {
    routeLogger.info('Build info requested');

    const buildInfo = buildInfoService.getBuildInfo();

    // Return JSON response with build information
    return NextResponse.json(
      {
        buildId: buildInfo.buildId,
        gitSha: buildInfo.gitSha,
        shortSha: buildInfo.shortSha,
        buildTimestamp: buildInfo.buildTimestamp,
        buildDate: buildInfo.buildDate
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    );
  } catch (error) {
    routeLogger.error('Failed to retrieve build info', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    // Return error response
    return NextResponse.json(
      {
        error: 'Failed to retrieve build information',
        buildId: 'error'
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

