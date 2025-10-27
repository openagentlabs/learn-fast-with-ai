# Clean and Simplify Code in Currently Open File

## Purpose

This command instructs the AI agent to clean, simplify, and document the currently open file in the editor.

## Instructions for AI Agent

Execute the following steps in order on the **currently open file only**:

### Step 1: Remove Unused Code
- Delete all unused imports, variables, functions, and code blocks
- Remove commented-out code unless it contains important documentation
- Remove duplicate code and consolidate repeated logic

### Step 2: Simplify Code
- Break down complex functions into smaller, focused functions
- Reduce nesting depth (maximum 3 levels)
- Replace complex expressions with descriptive intermediate variables
- Use early returns to eliminate unnecessary nesting
- Ensure code is readable and maintainable for human developers

### Step 3: Apply Best Practices
- Follow project naming conventions (see project rules)
- Ensure functions follow Single Responsibility Principle
- Extract magic numbers and repeated values to named constants
- Use descriptive variable and function names
- Maintain consistent code formatting

### Step 4: Fix All Issues
- Run linter and fix all errors and warnings
- Fix all TypeScript compilation errors
- Resolve any syntax or semantic issues
- Verify code compiles without errors

### Step 5: Add Documentation
- Add JSDoc comments to:
  - All public classes
  - All public functions
  - All exported functions
  - All exported enums
  - All exported constants
- Include parameter descriptions, return types, and purpose

### Step 6: Update README.md
- If a `README.md` exists in the same directory as the current file:
  - Update it to reflect code changes
  - Ensure examples match current implementation
  - Update API documentation if public interfaces changed

## Expected Outcome

After completing all steps:
- Code is clean, simple, and maintainable
- No linter errors or warnings remain
- All public APIs are documented
- README.md (if present) is up to date
- Code follows project conventions and best practices
