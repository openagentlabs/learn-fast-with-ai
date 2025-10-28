# Cloud Deploy Pipeline for learn-fast-with-ai

## Overview

This directory contains the Google Cloud Deploy configuration for automatically deploying the learn-fast-with-ai application to Cloud Run using Cloud Deploy pipelines.

## Pipeline Structure

The pipeline consists of a single stage that deploys to the `dev` target:

1. **Cloud Build** builds and pushes the container image to Artifact Registry
2. **Cloud Deploy** creates a release and automatically deploys to Cloud Run

## Configuration Files

### `clouddeploy.yaml`

Defines the delivery pipeline with:
- Pipeline name: `learn-fast-with-ai-pipeline`
- Target: `dev` (single stage, no approvals)
- Automatic progression (no manual approvals)

### `target-dev.yaml`

Defines the Cloud Run target:
- Target name: `dev`
- Service name: `learn-fast-with-ai`
- Region: `europe-west2`
- Project: `keithtest001`
- Execution: Cloud Run with default service account

## How It Works

### Automatic Deployment via GitHub Actions

When code is pushed to `main`:

1. GitHub Actions builds the Docker image using Cloud Build
2. Cloud Build pushes the image to Artifact Registry
3. GitHub Actions calls `gcloud deploy releases create`
4. Cloud Deploy creates a release targeting the `dev` target
5. Cloud Deploy automatically deploys to Cloud Run
6. The application becomes available at the Cloud Run URL

### Manual Deployment

To manually trigger a deployment:

```bash
# Set environment variables
export PROJECT_ID=keithtest001
export REGION=europe-west2
export SERVICE_NAME=learn-fast-with-ai
export ARTIFACT_REPO=nextjs-containers
export IMAGE_SHA=$(git rev-parse HEAD)
export IMAGE_TAG="${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REPO}/${SERVICE_NAME}:${IMAGE_SHA}"

# Create a Cloud Deploy release
gcloud deploy releases create release-$(date +%s) \
  --delivery-pipeline=learn-fast-with-ai-pipeline \
  --region=${REGION} \
  --source=./infrastructure/deploy \
  --images=app=${IMAGE_TAG} \
  --project=${PROJECT_ID}
```

## Prerequisites

Before using Cloud Deploy, ensure:

1. **Cloud Deploy API is enabled** on the GCP project:
   ```bash
   gcloud services enable clouddeploy.googleapis.com \
     --project=keithtest001
   ```

2. **Initial pipeline registration** (one-time setup):
   ```bash
   gcloud deploy apply --file=infrastructure/deploy/clouddeploy.yaml --region=europe-west2 --project=keithtest001
   gcloud deploy apply --file=infrastructure/deploy/target-dev.yaml --region=europe-west2 --project=keithtest001
   ```

3. **Required permissions**: The service account needs:
   - `clouddeploy.operator`
   - `run.developer`
   - `artifactregistry.reader`

## Troubleshooting

### Check Pipeline Status

```bash
# List recent releases
gcloud deploy releases list \
  --delivery-pipeline=learn-fast-with-ai-pipeline \
  --region=europe-west2 \
  --project=keithtest001

# Get release details
gcloud deploy releases describe RELEASE_NAME \
  --delivery-pipeline=learn-fast-with-ai-pipeline \
  --region=europe-west2 \
  --project=keithtest001
```

### View Deployment Logs

```bash
# Get Cloud Run service status
gcloud run services describe learn-fast-with-ai \
  --region=europe-west2 \
  --project=keithtest001

# View logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=learn-fast-with-ai" \
  --limit=50 \
  --project=keithtest001
```

### Rollback

To rollback to a previous deployment:

```bash
# List releases to find the version to rollback to
gcloud deploy releases list \
  --delivery-pipeline=learn-fast-with-ai-pipeline \
  --region=europe-west2

# Promote a previous release
gcloud deploy releases promote PREVIOUS_RELEASE_NAME \
  --delivery-pipeline=learn-fast-with-ai-pipeline \
  --region=europe-west2 \
  --to-target=dev
```

## Adding Additional Targets

To add staging or production targets:

1. Create `target-staging.yaml` or `target-production.yaml`
2. Add the new stage to `clouddeploy.yaml`
3. Optionally add approval gates for production
4. Apply the new target: `gcloud deploy apply --file=infrastructure/deploy/target-production.yaml`

## Related Documentation

- [Cloud Deploy Documentation](https://cloud.google.com/deploy/docs)
- [Cloud Run with Cloud Deploy](https://cloud.google.com/deploy/docs/deploy-app-run)
- [Delivery Pipeline Configuration](https://cloud.google.com/deploy/docs/application)

