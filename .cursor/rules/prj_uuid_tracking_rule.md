---
alwaysApply: true
---

// UUID: 06bf326f-7bb9-4531-b2a9-9b3dc8924cd4
// UUID Tracking System Quick Reference - Enhanced with prominent development history logging reminders and step-by-step workflow

# UUID Tracking System - Quick Reference Card

## 🚨 CRITICAL: Development History Logging is MANDATORY

**⚠️ EVERY CODE CHANGE MUST BE LOGGED - THIS IS ALWAYS THE LAST STEP ⚠️**

## For AI Agent: UUID Tracking Requirements

### When Creating/Modifying ANY Code:

**MANDATORY STEPS (IN ORDER):**

1. **Generate UUID**
   ```typescript
   import { randomUUID } from 'crypto';
   const uuid = randomUUID();
   ```

2. **Complete the User's Request**
   - Write/modify code
   - Fix linter errors
   - Run tests
   - Verify everything works

3. **Add UUID Comment to Each Code Block**
   ```typescript
   // UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   // [Brief description of what this block does]
   export class MyClass { }
   ```

4. **Track File Paths and Line Numbers**
   - Note starting line of each modified block
   - Keep list of all modified files
   - Track UUID for each block

5. **⚠️ UPDATE DEVELOPMENT HISTORY (MANDATORY - ALWAYS LAST STEP)**
   ```markdown
   **UUID:** xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   **DateTime:** YYYY-MM-DD HH:MM:SS
   
   **User Request:** [Brief summary]
   
   **Actions Completed:**
   - [Action 1]
   - [Action 2]
   
   **Code Blocks Modified:**
   - `src/path/to/file.ts` (line 25) - UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   - `src/path/to/another.ts` (line 67) - UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   
   
   
   ```
   
   **File:** `debuging/code_development_history.md`
   **Action:** Append to end of file with 3 blank lines after

6. **Create Testing Report Entry** (if applicable)
   - Include UUID
   - Include file paths and line numbers
   - Save to `testing_reports/`

7. **⚠️ STOP - TASK IS COMPLETE**
   - NO code changes after logging
   - NO file modifications after logging
   - NO additional actions after logging

### UUID Comment Format:

```typescript
// UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
// [Description]
```

**Rules:**
- Single-line comment (`//`)
- Place immediately before code block
- Include brief description
- UUID must match history entry
- Multiple blocks in same file each get UUID comment

### What Gets UUID Comments:

✅ **DO Add UUID Comments:**
- Class definitions
- Function definitions
- Interface/Type definitions
- Component definitions
- Configuration objects
- Test suites

❌ **DON'T Add UUID Comments:**
- Import statements
- Single-line variable declarations
- Simple return statements
- Comments (unless modifying comment block)

### Code Block Tracking Format:

```markdown
**Code Blocks Modified:**
- `src/services/user_service/UserService.ts` (line 25) - UUID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
- `src/services/user_service/index.ts` (line 5) - UUID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

### Benefits:

- Search codebase for UUID to find all related changes
- Match code changes to history entries instantly
- Track evolution of specific code blocks
- Create complete audit trail for debugging

### Anti-Patterns:

❌ **NEVER:**
- Create code without UUID comments
- Use different UUIDs for related changes
- Forget UUID comment on modified blocks
- Skip UUID generation step
- Skip code block tracking in history

### Quick Checklist:

Before considering code complete:
- [ ] UUID generated for change set
- [ ] User request completed (code written, tests passing, linter clean)
- [ ] UUID comment added to each code block
- [ ] File paths and line numbers tracked for all modified blocks
- [ ] **DEVELOPMENT HISTORY UPDATED** with UUID, datetime, user request, actions, and code blocks
- [ ] Testing report created with UUID (if applicable)
- [ ] **STOPPED - NO MORE ACTIONS** (logging is the final step)

---

**See full documentation in:**
- `prj_general_rules.mdc` - Development History Logging section
- `prj_typescript_rules.mdc` - TypeScript Language Rules section
- `prj_documentaton_rules.mdc` - JSDoc Comments section

