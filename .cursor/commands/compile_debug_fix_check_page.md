# Compile, Debug, Fix, and Validate Web Page

## Overview

This command compiles the Next.js application, debugs and fixes any errors, runs the application, and uses Chrome MCP Server to validate that the web page loads correctly without errors.

## Steps

### Phase 1: Compilation and Error Resolution

1. **Compile the Application**
   - Run `npm run build` to compile the Next.js application
   - Wait for the build process to complete

2. **Identify Build Errors**
   - Review the build output for any errors or warnings
   - List each separate error or issue found
   - Document the error type (TypeScript error, linter error, build error, etc.)

3. **Fix Each Error**
   - Fix each error separately, one at a time
   - Use appropriate tools (read_lints, search, edit) to resolve issues
   - After fixing each error, proceed to step 4

4. **Recompile After Fix**
   - Run `npm run build` again to verify the fix
   - Check if the error is resolved

5. **Loop Until Error-Free**
   - If errors remain, go back to step 2
   - Continue this loop until the build completes with zero errors
   - Only proceed to Phase 2 when build is completely successful

### Phase 2: Application Execution

6. **Start the Application in Background**
   - Run `npm run dev` as a background task
   - Set `is_background: true` when running the command
   - Note the process ID for later termination

7. **Wait for Application Initialization**
   - Wait 20 seconds for the application to fully initialize
   - Check the terminal output to confirm the server is ready
   - Verify no startup errors occurred

### Phase 3: Chrome MCP Validation

8. **List Chrome Pages**
   - Use `mcp_chrome-devtools_list_pages` to get available pages
   - Select the appropriate page using `mcp_chrome-devtools_select_page`

9. **Navigate to Target Page**
   - Use `mcp_chrome-devtools_navigate_page` to navigate to the page to validate
   - Provide the full URL (e.g., `http://localhost:3000/test`)
   - Wait for the page to fully load

10. **Take Screenshot**
    - Use `mcp_chrome-devtools_take_screenshot` to capture the page
    - Save the screenshot to `debuging/images/` directory
    - Use a descriptive filename (e.g., `test-page-validation.png`)

11. **Check Console for Errors**
    - Use `mcp_chrome-devtools_list_console_messages` to check for console errors
    - Filter for messages with level 'error' or 'warning'
    - Document any errors found

12. **Check Network Requests**
    - Use `mcp_chrome-devtools_list_network_requests` to check network activity
    - Identify any failed requests (status >= 400)
    - Document any network errors

13. **Validate Page Loads Correctly**
    - Analyze the screenshot to confirm the page renders properly
    - Verify no visual errors or broken layouts
    - Confirm all expected UI elements are present

14. **Validate UI Requirements**
    - Compare the page against the PRD requirements
    - Verify all required components are displayed
    - Check that styling and layout match specifications

### Phase 4: Cleanup and Reporting

15. **Close Chrome MCP Server**
    - Close all open pages using `mcp_chrome-devtools_close_page`
    - Clean up any temporary files created during validation

16. **Stop the Application**
    - Terminate the background process running the application
    - Use the process ID noted in step 6 to stop the dev server

17. **Create Validation Report**
    - Create a concise summary report with the following sections:
      - **Build Status**: Success or failure
      - **Errors Found**: List of errors encountered and fixed
      - **Page Validation**: Screenshot location and validation results
      - **Console Errors**: Any errors found in browser console
      - **Network Errors**: Any failed network requests
      - **UI Validation**: Compliance with PRD requirements
      - **Overall Status**: Pass or fail recommendation
    - Keep the report short, clear, and actionable