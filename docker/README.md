# Docker Setup for Learn Fast with AI

This directory contains Docker configuration files for containerizing the Learn Fast with AI application.

## Files Overview

- **Dockerfile**: Multi-stage production-ready container definition
- **docker-compose.yml**: Local development orchestration with hot-reload
- **.dockerignore**: Excludes unnecessary files from Docker builds

## Prerequisites

Before using Docker with this project, ensure you have:

1. **Docker installed** (version 20.10 or later)
   ```bash
   docker --version
   ```

2. **Docker Compose installed** (version 2.0 or later)
   ```bash
   docker-compose --version
   ```

3. **Docker daemon running**
   ```bash
   docker ps
   ```

If not installed, see installation instructions below.

## Installation

### Docker Installation

**For Ubuntu/Debian:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt-get update && sudo apt-get install docker-compose

# Verify installation
docker --version
docker-compose --version
```

**For macOS:**
Install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)

**For Windows:**
Install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)

## Environment Setup

1. **Create `.env` file** in the project root:
   ```bash
   cp .env.example .env
   ```

2. **Add required environment variables** to `.env`:
   ```env
   GEMINI_API_KEY=your-gemini-api-key-here
   NODE_ENV=development
   PORT=3000
   ```

## Usage

### Development Mode (with hot-reload)

From the project root directory:

```bash
# Start the application
cd docker
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop the application
docker-compose down

# Stop and remove volumes (clean state)
docker-compose down -v
```

The application will be available at: http://localhost:3000

### Building the Docker Image

```bash
# Build the image
docker build -t learn-fast-with-ai -f docker/Dockerfile .

# Run the container
docker run -d \
  --name learn-fast-with-ai \
  -p 3000:3000 \
  --env-file .env \
  learn-fast-with-ai
```

### Accessing the Container

```bash
# Get container ID
docker ps

# Access container shell
docker exec -it learn-fast-with-ai sh

# View container logs
docker logs -f learn-fast-with-ai
```

## Container Information

- **Base Image**: node:20-alpine
- **Port**: 3000 (HTTP)
- **Health Check**: Enabled (checks / endpoint every 30s)
- **User**: Runs as non-root user (nextjs)
- **Working Directory**: /app
- **Build**: Multi-stage build for optimized image size

## Development Workflow

### Making Changes

The docker-compose.yml is configured for hot-reload during development:
- Source code changes in `src/` are reflected automatically
- No need to rebuild the container
- Restart only when changing dependencies or configuration

### Rebuilding After Changes

If you change dependencies or configuration:

```bash
docker-compose build --no-cache
docker-compose up -d
```

### Updating Dependencies

```bash
# After updating package.json, rebuild
docker-compose build --no-cache
docker-compose up -d
```

## Testing the Container

```bash
# Check container is running
docker ps

# Test HTTP endpoint
curl http://localhost:3000

# Check container health
docker inspect learn-fast-with-ai | grep -A 10 Health
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs app

# Check environment variables
docker-compose config
```

### Port already in use

```bash
# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Use port 3001 instead
```

### Permission issues

```bash
# Fix ownership of data directory
sudo chown -R $USER:$USER ../data
```

### Clean up

```bash
# Remove containers and volumes
docker-compose down -v

# Remove images
docker rmi learn-fast-with-ai

# Clean system (remove unused data)
docker system prune -a
```

## Security Best Practices

1. ✅ Never commit `.env` file with secrets
2. ✅ Use environment variables for sensitive data
3. ✅ Container runs as non-root user
4. ✅ Regular base image updates
5. ✅ Scan images for vulnerabilities

### Scanning for Vulnerabilities

```bash
docker scan learn-fast-with-ai
```

## File Structure

```
learn-fast-with-ai/
├── docker/
│   ├── Dockerfile           # Production container definition
│   ├── docker-compose.yml   # Development orchestration
│   ├── .dockerignore        # Build exclusions
│   └── README.md            # This file
├── src/                     # Application source
├── data/                    # Database files
├── .env                     # Environment variables
└── package.json             # Dependencies
```

## Health Checks

The container includes automatic health checks:
- **Interval**: Every 30 seconds
- **Timeout**: 10 seconds
- **Start Period**: 40 seconds (allows app to start)
- **Retries**: 3 failures before marking unhealthy

Check health status:
```bash
docker inspect learn-fast-with-ai | grep Health -A 10
```

## Production Deployment

For production deployment:

1. Build the image:
   ```bash
   docker build -t learn-fast-with-ai:latest -f docker/Dockerfile .
   ```

2. Tag for registry:
   ```bash
   docker tag learn-fast-with-ai:latest your-registry/learn-fast-with-ai:v1.0.0
   ```

3. Push to registry:
   ```bash
   docker push your-registry/learn-fast-with-ai:v1.0.0
   ```

4. Run in production with environment variables:
   ```bash
   docker run -d \
     --name learn-fast-with-ai \
     -p 3000:3000 \
     -e NODE_ENV=production \
     -e GEMINI_API_KEY=your-key \
     your-registry/learn-fast-with-ai:v1.0.0
   ```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

