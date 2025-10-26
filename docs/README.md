# Deployment Documentation

## Overview

This project uses Google Cloud Platform (GCP) for hosting a Next.js application deployed as a containerized service on Cloud Run. The deployment is fully automated through GitHub Actions CI/CD pipeline.

## Architecture

### Components Involved

1. **GitHub Repository** - Source code repository
2. **GitHub Actions** - CI/CD orchestration
3. **Google Cloud Build** - Container image build service
4. **Google Artifact Registry** - Container image storage
5. **Google Cloud Run** - Serverless container runtime
6. **Google Cloud IAM** - Authentication and permissions

## Deployment Flow (ASCII Diagram)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DEPLOYMENT PIPELINE                                │
└─────────────────────────────────────────────────────────────────────────────┘

Step 1: Developer pushes code to GitHub
    │
    ▼
┌─────────────────────┐
│   GitHub Repo       │
│   (main branch)     │ ────┐
└─────────────────────┘     │
                            │ Push event triggers
                            ▼
Step 2: GitHub Actions Workflow Starts
┌─────────────────────────────────────────────────────────┐
│  GitHub Actions (.github/workflows/deploy.yml)          │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Step 2.1: Checkout code                            │  │
│  │ Step 2.2: Authenticate to GCP using Service Key   │  │
│  │ Step 2.3: Set up gcloud SDK                        │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
Step 3: Trigger Cloud Build
┌─────────────────────────────────────────────────────────┐
│  Google Cloud Build                                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Reads: cloudbuild.yaml                            │  │
│  │  • Build Docker image from docker/Dockerfile      │  │
│  │  • Multi-stage build process:                     │  │
│  │    1. Install dependencies (deps stage)           │  │
│  │    2. Build Next.js app (builder stage)           │  │
│  │    3. Create production image (runner stage)      │  │
│  │  • Tag image with commit SHA                      │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
Step 4: Push to Artifact Registry
┌─────────────────────────────────────────────────────────┐
│  Google Artifact Registry                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Repository: nextjs-containers                     │  │
│  │ Image: learn-fast-with-ai:{commit-sha}            │  │
│  │ Location: europe-west2                            │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
Step 5: Deploy to Cloud Run
┌─────────────────────────────────────────────────────────┐
│  Google Cloud Run                                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Service: learn-fast-with-ai                       │  │
│  │ URL: https://learn-fast-with-ai-xxxxx.run.app    │  │
│  │ Region: europe-west2                              │  │
│  │ Public Access: Enabled                            │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Configuration Files

### 1. GitHub Actions Workflow (`.github/workflows/deploy.yml`)

**Purpose**: Orchestrates the entire deployment pipeline

**Key Components**:
```yaml
# Trigger
on:
  push:
    branches: [main]

# Environment Variables
env:
  PROJECT_ID: 'keithtest001'
  SERVICE_NAME: 'learn-fast-with-ai'
  REGION: 'europe-west2'
  ARTIFACT_REPO: 'nextjs-containers'
```

**Workflow Steps**:
1. **Checkout Code**: Downloads source code from GitHub
2. **Authenticate to GCP**: Uses Service Account key from GitHub Secrets
3. **Set up Cloud SDK**: Installs and configures gcloud CLI
4. **Build and Push Image**: Calls Cloud Build to create container
5. **Deploy to Cloud Run**: Deploys the built image as a service

**Authentication**: Uses `GCP_SA_KEY` secret containing Service Account JSON credentials

### 2. Cloud Build Configuration (`cloudbuild.yaml`)

**Purpose**: Defines how to build the Docker container

**Key Components**:
```yaml
steps:
  # Step 1: Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t', '${IMAGE_TAG}'
      - '-f', 'docker/Dockerfile'
      - '.'

  # Step 2: Push to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - '${IMAGE_TAG}'
```

**Substitutions**:
- `_PROJECT_ID`: GCP project ID
- `_SERVICE_NAME`: Application service name
- `_REGION`: GCP region for artifacts
- `_ARTIFACT_REPO`: Artifact Registry repository name
- `SHORT_SHA`: Git commit SHA (passed from GitHub Actions)

### 3. Dockerfile (`docker/Dockerfile`)

**Purpose**: Defines the container image build process

**Multi-Stage Build Process**:

**Stage 1: Base**
```dockerfile
FROM node:20-alpine AS base
```
- Creates base image with Node.js

**Stage 2: Dependencies**
```dockerfile
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci
```
- Installs all dependencies (including dev dependencies for building)

**Stage 3: Builder**
```dockerfile
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
```
- Builds the Next.js application
- Creates the `.next` directory with optimized production code

**Stage 4: Runner (Production)**
```dockerfile
FROM base AS runner
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
CMD ["node", "server.js"]
```
- Creates minimal production image
- Only includes built artifacts
- Runs in non-root user mode for security

**Security Features**:
- Runs as non-root user (`nextjs:nodejs`)
- Includes health check endpoint
- Minimal attack surface (no dev dependencies in final image)

### 4. Next.js Configuration (`next.config.js`)

**Purpose**: Configures Next.js for Docker deployment

**Key Setting**:
```javascript
const nextConfig = {
  output: 'standalone',
};
```

**Why Standalone?**:
- Creates a minimal production bundle
- Includes only essential files needed to run
- Reduces container image size significantly
- Generates `server.js` entry point for container runtime

## Build Sequence Details

### Detailed Build Process

```
┌────────────────────────────────────────────────────────┐
│  Build Phase Breakdown                                  │
└────────────────────────────────────────────────────────┘

[GitHub Actions]                    [Cloud Build]
      │                                  │
      ├─ Step 1: Detect push to main     │
      │                                  │
      ├─ Step 2: Authenticate            │
      │     └─ Uses GCP_SA_KEY secret    │
      │                                  │
      ├─ Step 3: Setup Environment       │
      │     └─ Install gcloud SDK        │
      │                                  │
      └─ Step 4: Submit Build ───────────>│
                                          │
                            [Reads cloudbuild.yaml]
                                          │
                            ┌─────────────▼──────────────┐
                            │  Docker Build Process      │
                            ├────────────────────────────┤
                            │ Stage 1: Install deps      │
                            │   • npm ci                 │
                            │   • All dependencies       │
                            ├────────────────────────────┤
                            │ Stage 2: Build app         │
                            │   • Copy source code       │
                            │   • npm run build          │
                            │   • Create .next/          │
                            ├────────────────────────────┤
                            │ Stage 3: Final image       │
                            │   • Copy built artifacts   │
                            │   • Minimal size           │
                            └─────────────┬──────────────┘
                                          │
                            [Tag with commit SHA]
                                          │
      Step 5: Push to Registry <──────────┘
      └─ Artifact Registry
         └─ europe-west2-docker.pkg.dev/...
                                          │
      Step 6: Deploy to Cloud Run ────────┘
      └─ Updates/runs service
         └─ Public URL accessible
```

## Environment Variables

### Required GitHub Secrets

| Secret Name | Description | Where Used |
|------------|-------------|-----------|
| `GCP_SA_KEY` | Service Account JSON key with Cloud Build and Cloud Run permissions | Authentication step |

### Required GCP Resources

1. **Project**: `keithtest001`
2. **Artifact Registry**: Repository `nextjs-containers` in region `europe-west2`
3. **Cloud Run**: Service `learn-fast-with-ai` in region `europe-west2`
4. **Service Account**: With permissions for:
   - Cloud Build Service Account
   - Storage Admin (for Artifact Registry)
   - Cloud Run Admin (for deployment)

## Image Tagging Strategy

Images are tagged with the full git commit SHA for traceability:

```
europe-west2-docker.pkg.dev/keithtest001/nextjs-containers/learn-fast-with-ai:{COMMIT_SHA}
```

**Benefits**:
- Each deployment is uniquely identifiable
- Easy rollback to previous versions
- Full audit trail
- No version conflicts

## Security Considerations

1. **Non-Root Container**: Application runs as user `nextjs` (UID 1001)
2. **Minimal Image**: Only production dependencies in final image
3. **Secrets Management**: Service Account key stored in GitHub Secrets
4. **Public Access**: Controlled via Cloud Run `--allow-unauthenticated` flag
5. **Health Checks**: Container includes built-in health check endpoint

## Monitoring and Debugging

### View Build Logs
```bash
gcloud builds list --project keithtest001
gcloud builds log [BUILD_ID] --project keithtest001
```

### View Cloud Run Logs
```bash
gcloud run services logs read learn-fast-with-ai \
  --region europe-west2 \
  --project keithtest001
```

### Local Build Testing
```bash
# Build locally
docker build -f docker/Dockerfile -t test-image .

# Run locally
docker run -p 3000:3000 test-image

# Test health check
curl http://localhost:3000
```

## Rollback Procedure

If a deployment fails:

1. **Identify Last Working Build**:
   ```bash
   gcloud builds list --project keithtest001 --limit 10
   ```

2. **Deploy Previous Image**:
   ```bash
   gcloud run deploy learn-fast-with-ai \
     --image europe-west2-docker.pkg.dev/keithtest001/nextjs-containers/learn-fast-with-ai:{WORKING_SHA} \
     --region europe-west2 \
     --project keithtest001
   ```

## Troubleshooting

### Common Issues

**Issue**: `Error: unrecognized arguments: --file`
- **Solution**: The `--file` flag is not supported. Use `cloudbuild.yaml` instead.

**Issue**: `.next directory not found`
- **Solution**: Ensure `output: 'standalone'` is set in `next.config.js` and build process runs `npm run build`.

**Issue**: Permission denied during push
- **Solution**: Verify Service Account has `Artifact Registry Writer` role.

**Issue**: Cloud Run deployment fails
- **Solution**: Check Cloud Run logs for runtime errors. Ensure health check endpoint returns 200.

## Additional Resources

- [Google Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Docker Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
