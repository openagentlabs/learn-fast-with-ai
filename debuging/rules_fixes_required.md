# Required Rule Fixes - Specific Actions

## 🔴 CRITICAL FIXES (Do These First)

### Fix 1: Remove Conflicting Memory About Test Workspace
**File**: Memory system  
**Issue**: Memory says tests go in @test_workspace but rules say tests/ subfolder  
**Fix**: Delete the memory about @test_workspace  
**Action**: User should delete memory "Test code should be created in @test_workspace directory"

### Fix 2: Update Server Action Naming in Rules
**File**: `.cursor/rules/prj_coding_rules.mdc`  
**Current**: Line 94 shows `action_name_sa.ts`  
**Should be**: `actionNameSA.ts` (camelCase + SA suffix, no underscore)

**Change this**:
```diff
- | Server Actions | `action_name_sa.ts` | `create_user_sa.ts`, `generate_flashcard_sa.ts` |
+ | Server Actions | `actionNameSA.ts` | `createUserSA.ts`, `generateFlashcardSA.ts` |
```

### Fix 3: Clarify Import Extensions in General Rules
**File**: `.cursor/rules/prj_general_rules.mdc`  
**Issue**: Says never use .js but tests require it  
**Fix**: Add exception for test files

**Add this exception**:
```markdown
### TypeScript Import Conventions
- **Never include `.js` extensions** in TypeScript imports (except in test files)
- **Exception**: Test files MUST use `.js` extensions for ES module imports
- Maintain consistent alias imports (e.g., `@/lib/...`)
- Follow ESLint and TypeScript rules for consistency and build compatibility
```

### Fix 4: Remove Duplicate Content from Database Rules
**File**: `.cursor/rules/prj_database_rules.mdc`  
**Issue**: Line 737 has git rules content  
**Action**: Delete lines 737-738

## 🟡 RECOMMENDED IMPROVEMENTS

### Improvement 1: Define System Boundaries for Zod Validation
**File**: `.cursor/rules/prj_coding_rules.mdc`  
**Add section after line 361**:
```markdown
### What Counts as System Boundaries

A "system boundary" is any interface where data moves between contexts:

1. **External to Application**: API endpoints, webhooks, file uploads
2. **Client to Server**: Server actions, API route handlers
3. **Component Boundaries**: React component props, form inputs
4. **Service Boundaries**: Public methods of service classes
5. **Workflow Boundaries**: Workflow input/output parameters

**Always Validate At**:
- Server action inputs/outputs
- API route handler inputs/outputs
- Service method parameters
- Component prop types
- Form submission data
- External data fetches
```

### Improvement 2: Clarify UUID Comment Scope
**File**: `.cursor/rules/prj_coding_rules.mdc`  
**Update lines 321-325** with more examples:

```markdown
**UUID comments are NOT needed for:**
- Import statements
- Single-line variable declarations (const x = 5)
- Simple return statements (return value)
- Comments (unless modifying a comment block)
- Type definitions for simple types (type ID = string)
- Export statements that are just re-exports
```

### Improvement 3: Clarify Development History Workflow
**File**: `.cursor/rules/prj_uuid_tracking_rule.md`  
**Update lines 26-31** to clarify sequence:

```markdown
2. **Complete the User's Request**
   - Write/modify code
   - Create tests in tests/ subfolder (if creating new code)
   - Fix linter errors
   - Run tests and ensure they pass
   - Verify everything works
```

## 📝 SUGGESTED ADDITIONS

### Addition 1: Component Naming Examples
**File**: `.cursor/rules/prj_coding_rules.mdc`  
**Add to Module/Folder Naming section (after line 175)**:

```markdown
### Component Naming Clarification

- **Folder**: PascalCase for organization (`Button/`, `UserProfile/`)
- **File**: snake_case matching the folder (`button.tsx`, `user_profile.tsx`)
- **Example**:
  ```
  src/components/
    Button/
      button.tsx
      button.test.ts
      README.md
    UserProfile/
      user_profile.tsx
      user_profile.test.ts
      README.md
  ```
```

### Addition 2: Server Actions Directory Structure
**File**: `.cursor/rules/prj_coding_rules.mdc`  
**Add to Module/Folder Naming section**:

```markdown
### Server Actions Directory Structure

Server actions follow this structure:
```
src/app/actions/
  flashcard_operations/
    createFlashcardSA.ts
    updateFlashcardSA.ts
  user_management/
    createUserSA.ts
```

- Actions are grouped by domain in subdirectories
- Each action file uses camelCase + SA suffix
- File names match the action they perform
```

## 🎯 PRIORITY SUMMARY

**Do First (HIGH IMPACT)**:
1. Delete @test_workspace memory
2. Fix server action naming (camelCase + SA)
3. Clarify .js import exceptions

**Do Next (MEDIUM IMPACT)**:
4. Remove database rules typo
5. Define system boundaries for Zod
6. Clarify UUID scope with examples

**Consider (LOW IMPACT)**:
7. Add component naming examples
8. Add server actions directory examples
9. Clarify development history workflow sequence

---

## Testing the Fixes

After implementing fixes, test with these queries:
1. "Create a server action for user login" → Should create `loginUserSA.ts`
2. "Create tests for this class" → Should create in `tests/` subfolder
3. "Import this in a test file" → Should use `.js` extension
4. "Should I use Zod here?" → Should reference system boundary definition

---

**Note**: All fixes should be applied manually by the user as they involve multiple file modifications across the rules directory.
