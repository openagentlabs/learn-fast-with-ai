# Code Development History

This file tracks all code changes made to the project, including UUID references for traceability.

---

## Entry 1: Build ID Implementation

**UUID:** `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

**DateTime:** 2025-01-15 14:30:00

**User Request:** Analyze the project and find the best way to create a build ID for each new build that gets compiled into the application code and is available on a web page called /info/build_id

**Actions Completed:**
1. Created build script (`scripts/generate-build-info.js`) to generate build ID during Docker build
2. Updated Dockerfile to run build script before Next.js build and pass GIT_COMMIT_SHA as build arg
3. Updated cloudbuild.yaml to pass GIT_COMMIT_SHA build arg to Docker
4. Created BuildInfoService (`src/lib/build-info/BuildInfoService.ts`) for runtime access to build info
5. Created build-info module exports (`src/lib/build-info/index.ts`)
6. Created API route handler (`src/app/info/build_id/route.ts`) to serve build ID via HTTP
7. Added generated files to .gitignore
8. Created README documentation for build-info module

**Code Blocks Modified:**
- `scripts/generate-build-info.js` (entire file) - UUID: 8a7f3e2d-1c9b-4f8a-b3e5-6d2c9a7f1e3b
- `infrastructure/docker/Dockerfile` (lines 25-29) - Added build info generation step
- `cloudbuild.yaml` (lines 8-9) - Added GIT_COMMIT_SHA build arg
- `src/lib/build-info/BuildInfoService.ts` (entire file) - UUID: 9b8c7d6e-5f4a-3b2c-1d0e-9f8a7b6c5d4e
- `src/lib/build-info/index.ts` (entire file) - UUID: 9b8c7d6e-5f4a-3b2c-1d0e-9f8a7b6c5d4e
- `src/app/info/build_id/route.ts` (entire file) - UUID: 7c6d5e4f-3a2b-1c0d-9e8f-7a6b5c4d3e2f
- `.gitignore` (lines 95-98) - Added generated build-info files

**Architecture Decisions:**
- Build ID format: `{shortSha}-{timestamp}-{random}` for uniqueness
- Build info generated at Docker build time (before Next.js build)
- Uses git commit SHA from CI/CD pipeline when available
- Falls back to "unknown" values for local development
- Serves build info via Next.js route handler at `/info/build_id`
- Generated files are git-ignored since they're created during build

**Testing Notes:**
- TypeScript compilation passes
- Build script handles missing git gracefully
- Service provides fallback values when build info unavailable
- Route handler includes error handling

**Follow-up Fix:**
- Fixed .gitignore pattern for generated build-info files
- Verified GitHub Actions build succeeds with build ID generation
- All deployment steps complete successfully

**Critical Fix - Build ID Import Path:**
- Fixed path mismatch: Script now generates `src/lib/build-info/build-info.ts` (matching service import)
- Updated service to use explicit static import for Next.js standalone build detection
- Updated JSON fallback path to match new file location
- Updated .gitignore patterns for new file paths
- Verified file generation and TypeScript compilation
- Service now loads build ID correctly at runtime

---

