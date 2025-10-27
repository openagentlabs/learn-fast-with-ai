# Remove Unused and Dead Code

## Overview

This command instructs the AI agent to perform a comprehensive cleanup of the TerraChatWeb project by identifying and removing unused and dead code. The process must be systematic, safe, and well-documented.

## Purpose

- Remove unused imports, functions, classes, and variables
- Eliminate dead code paths that are never executed
- Reduce codebase size and improve maintainability
- Ensure the project remains functional after cleanup

## Prerequisites

Before starting:
1. Ensure all tests are passing (`npm test`)
2. Ensure the project compiles without errors (`npm run build`)
3. Ensure linter shows no errors (`npm run lint`)
4. Create a backup branch: `git checkout -b cleanup/dead-code-removal`

## Dead Code Detection Criteria

### Code is considered "dead" if:

1. **Unused Exports**
   - Functions, classes, or constants exported but never imported elsewhere
   - TypeScript interfaces/types defined but never used
   - React components defined but never rendered

2. **Unused Imports**
   - Imported modules, functions, or types not used in the file
   - Side-effect imports that are no longer needed

3. **Unused Variables**
   - Local variables declared but never referenced
   - Function parameters that are never used
   - Class properties that are never accessed

4. **Dead Code Paths**
   - Code after unreachable return statements
   - Conditional branches that can never be true
   - Functions that are never called (including private methods)

5. **Commented-Out Code**
   - Large blocks of commented code (keep small explanatory comments)
   - TODO comments for features that will never be implemented

### Code is NOT considered "dead" if:

- It's part of a public API or exported interface
- It's a test file or test utility
- It's a configuration file
- It's documentation (README.md, .md files)
- It's called via dynamic imports or string references
- It's part of a workflow or tool system that may be invoked dynamically

## Step-by-Step Process

### Phase 1: Discovery and Analysis

1. **Generate File Inventory**
   - List all TypeScript/JavaScript files in `src/` directory
   - Exclude: `node_modules/`, `tests/`, `*.test.ts`, `*.spec.ts`
   - Save list to `debuging/scratch/file_inventory_YYYY-MM-DD.txt`

2. **Static Analysis**
   - Use `grep` to find all exports: `grep -r "export" src/`
   - Use `grep` to find all imports: `grep -r "import" src/`
   - Cross-reference exports with imports to find unused exports
   - Save analysis to `debuging/scratch/unused_exports_YYYY-MM-DD.txt`

3. **Dynamic Analysis**
   - Check for unused imports using TypeScript compiler warnings
   - Look for unreachable code using ESLint
   - Identify unused variables using ESLint rules
   - Save findings to `debuging/scratch/unused_code_YYYY-MM-DD.txt`

4. **Create Removal Plan**
   - Document each file to be modified
   - List specific line numbers or code blocks to remove
   - Categorize by type: imports, exports, functions, classes, variables
   - Save plan to `debuging/scratch/removal_plan_YYYY-MM-DD.md`

### Phase 2: Safe Removal

5. **Remove Unused Imports (One File at a Time)**
   - Start with files that have the most unused imports
   - Remove one import at a time
   - After each file: run linter and fix any issues
   - Commit changes: `git commit -m "chore: remove unused imports from [filename]"`

6. **Remove Unused Exports (One File at a Time)**
   - Remove unused exported functions, classes, or constants
   - Verify no other files import these exports
   - After each file: run linter and build
   - Commit changes: `git commit -m "chore: remove unused exports from [filename]"`

7. **Remove Unused Variables and Functions**
   - Remove unused local variables
   - Remove unused private methods
   - Remove unused helper functions
   - After each file: run tests and linter
   - Commit changes: `git commit -m "chore: remove unused code from [filename]"`

8. **Remove Dead Code Paths**
   - Remove unreachable code after return statements
   - Remove impossible conditional branches
   - After each file: run tests to ensure functionality unchanged
   - Commit changes: `git commit -m "chore: remove dead code paths from [filename]"`

9. **Remove Commented-Out Code**
   - Remove large blocks of commented code
   - Keep small explanatory comments
   - After each file: verify no important information was lost
   - Commit changes: `git commit -m "chore: remove commented-out code from [filename]"`

### Phase 3: Validation

10. **Run Full Test Suite**
    - Execute: `npm test`
    - All tests must pass
    - If tests fail, identify the issue and fix or revert

11. **Run Linter**
    - Execute: `npm run lint`
    - Fix all warnings and errors
    - Ensure code quality standards are met

12. **Build Project**
    - Execute: `npm run build`
    - Ensure project compiles without errors
    - Check for any TypeScript errors

13. **Manual Testing**
    - Test key user flows manually
    - Verify application starts correctly
    - Check that no functionality is broken

### Phase 4: Documentation and Reporting

14. **Generate Final Report**
    - Create comprehensive report in `debuging/scratch/dead_code_removal_report_YYYY-MM-DD.md`
    - Include:
      - Summary of changes
      - Files modified (with counts)
      - Lines of code removed
      - Types of code removed (imports, exports, functions, etc.)
      - Test results
      - Build status
      - Any issues encountered

15. **Update Development History**
    - Log the entire operation to `debuging/code_development_history.md`
    - Include:
      - UUID for this operation
      - DateTime of operation
      - User request
      - Actions completed
      - Files modified with line numbers
      - Test results
      - Final status

16. **Clean Up Temporary Files**
    - Delete temporary analysis files from `debuging/scratch/`
    - Keep only the final report

17. **Inform User**
    - Provide summary of what was removed
    - Report test results and build status
    - Mention any issues or concerns
    - Suggest next steps if needed

## Safety Measures

### Before Removal:
- ✅ Create backup branch
- ✅ Ensure tests pass
- ✅ Ensure build succeeds
- ✅ Document removal plan

### During Removal:
- ✅ Remove code incrementally (one file at a time)
- ✅ Commit after each file
- ✅ Run linter after each change
- ✅ Run tests after each change

### After Removal:
- ✅ Run full test suite
- ✅ Run linter
- ✅ Build project
- ✅ Manual testing
- ✅ Document all changes

## Rollback Plan

If something goes wrong:
1. Identify which commit introduced the issue
2. Revert to previous commit: `git revert [commit-hash]`
3. Or reset to backup branch: `git reset --hard cleanup/dead-code-removal`
4. Document the issue in the development history
5. Inform the user of the problem and resolution

## AI Agent Instructions

When executing this command, the AI agent MUST:

1. **Follow the process exactly** - Do not skip steps or rush
2. **Be conservative** - When in doubt, leave the code in place
3. **Test thoroughly** - Run tests after every significant change
4. **Document everything** - Log all actions to development history
5. **Communicate clearly** - Keep the user informed of progress
6. **Handle errors gracefully** - If something breaks, stop and report

## Expected Outcomes

After completion:
- Codebase is cleaner and more maintainable
- No unused imports or exports
- No dead code paths
- All tests pass
- Project builds successfully
- Development history is updated
- User is informed of results

## Notes

- This process may take significant time depending on codebase size
- Be patient and thorough - quality over speed
- When in doubt about whether code is used, keep it
- Some "unused" code may be used via dynamic imports or string references
- Always prioritize safety and functionality over code removal