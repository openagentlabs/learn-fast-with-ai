# Deploy to GCP via GitHub Actions

## Overview

This command deploys the project to Google Cloud Platform (GCP) by committing changes, pushing to GitHub, monitoring the CI/CD pipeline (GitHub Actions), and verifying the deployment using Chrome MCP browser automation.

## Steps

### 1. Pre-Deployment Plan (CRITICAL - User Approval Required)

**ALWAYS create a deployment plan first and present it to the user for approval before executing any deployment steps.**

The plan should include:
- Summary of changes to be deployed
- Current git status (branch, uncommitted changes)
- Deployment target (Cloud Run service, region)
- Expected deployment steps
- Risk assessment if applicable

**DO NOT proceed with deployment until user explicitly approves the plan.**

### 2. Git Commit

- Review current git status and staged changes
- Create a commit following project conventions:
  - Format: `<type>(<scope>): <subject>`
  - Include UUID if applicable
  - Ensure commit message is descriptive and follows standards
- **DO NOT commit without user approval of the commit message**

### 3. Git Push to GitHub

- Push the committed changes to the remote repository
- Target branch: `main` (triggers automatic deployment)
- **IMPORTANT**: Pushing to `main` triggers GitHub Actions workflow automatically
- Confirm push was successful before proceeding

### 4. Monitor GitHub Actions Execution

- Use GitHub CLI (`gh`) to watch the GitHub Actions workflow execution
- Monitor the following workflow stages:
  - **GCP Code Build**: Docker image build process
  - **GCP Code Deploy**: Cloud Run deployment process
- Continuously watch logs until workflow completes (success or failure)

**Commands to use:**
```bash
# List recent workflow runs
gh run list

# Watch a specific workflow run
gh run watch <run-id>

# Stream logs from a workflow run
gh run view <run-id> --log
```

### 5. Handle Deployment Errors

- **If deployment succeeds**: Proceed to verification step (Step 6)
- **If deployment fails**:
  1. Analyze the error logs from GitHub Actions
  2. Identify the root cause
  3. **Create a fix plan** and present it to the user
  4. **DO NOT fix errors without user approval**
  5. After user approves, implement the fix
  6. Repeat Steps 2-4 until deployment succeeds

### 6. Verify Deployment (Chrome MCP)

Once deployment succeeds, verify the deployment using Chrome MCP browser automation:

#### 6.1 Initialize Chrome Browser
- List available pages
- Create a new page or select existing page
- Navigate to the deployed Cloud Run URL

#### 6.2 Navigate and Verify Each Page
For each page/route in the application:
1. **Navigate** to the page URL first
2. **Wait** for page to fully load
3. **Take a screenshot** using Chrome MCP to capture the page state
4. **Check console messages** for any errors or warnings
5. **List network requests** to verify API calls are working
6. **Save screenshot** to `debuging/images/` with descriptive filename

#### 6.3 Pages to Verify (Example Routes)
- Home page (`/`)
- Key application pages (based on project structure)
- API health check endpoints (if applicable)

#### 6.4 Handle Verification Issues
- **If issues found**: Document the issue and create a fix plan
- **DO NOT fix without user approval**
- After approval, fix the issue and repeat deployment process

### 7. Post-Deployment Verification

- Confirm all pages loaded successfully
- Verify no console errors or network failures
- Check that the deployed service is accessible
- Document any issues or warnings in deployment notes

## Chrome MCP Commands Reference

### Required Chrome MCP Operations:
- `list_pages` - List available browser pages
- `select_page` or `new_page` - Select/create page for navigation
- `navigate_page` - Navigate to deployment URL
- `take_snapshot` - Get page structure and element UIDs
- `take_screenshot` - Capture visual state of page
- `list_console_messages` - Check for JavaScript errors
- `list_network_requests` - Verify network requests
- `wait_for` - Wait for specific content to appear

## Important Rules

1. **ALWAYS create a plan first** - Never execute deployment without a user-approved plan
2. **User approval required** - Get explicit user approval before:
   - Committing changes
   - Pushing to main
   - Fixing errors
   - Any major deployment step
3. **Monitor continuously** - Watch GitHub Actions logs until completion
4. **Verify thoroughly** - Use Chrome MCP to verify all pages after deployment
5. **Document issues** - Log any problems encountered during deployment
6. **Clean up** - Remove temporary screenshots after verification (optional, can keep for reference)

## Deployment Checklist

Before starting:
- [ ] Git status is clean or changes are ready to commit
- [ ] User has approved deployment plan
- [ ] All tests pass locally (recommended)
- [ ] Environment variables are configured in GCP

During deployment:
- [ ] Commit created with proper message
- [ ] Push completed successfully
- [ ] GitHub Actions workflow started
- [ ] Build process completed successfully
- [ ] Deploy process completed successfully
- [ ] Cloud Run service is accessible

After deployment:
- [ ] All pages verified via Chrome MCP
- [ ] Screenshots captured for verification
- [ ] No console errors detected
- [ ] Network requests are successful
- [ ] Deployment verified and documented
