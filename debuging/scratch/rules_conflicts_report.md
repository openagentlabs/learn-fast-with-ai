# Rules Conflict Analysis Report

**Generated:** 2025-01-18
**Files Analyzed:** 13 rule files
**Total Issues Found:** 15

---

## CRITICAL Issues (Must Fix)

### Issue #1: Import File Extension Inconsistency ✅ RESOLVED
- **Conflict Type:** Import Convention
- **Affected Files:** `prj_general_rules.mdc`, `prj_testing_rule.mdc`
- **Severity:** CRITICAL
- **Status:** FIXED

**Original Description:**
`prj_general_rules.mdc` states: "**Never include `.js` extensions** in TypeScript imports (except in test files)."
`prj_testing_rule.mdc` states: "Always use `.js` extension in imports (ES modules requirement)"

**Original Conflict:** Both rules agree on the exception for test files, but there's ambiguity about what "except in test files" means in the general rules. The testing rules are more specific and clear.

**Resolution Applied:**
- ✅ Clarified in `prj_general_rules.mdc` with explicit examples showing source code vs test files
- ✅ Enhanced `prj_testing_rule.mdc` with clear distinction between test file imports and source code imports
- ✅ Added visual indicators (✅ CORRECT and ❌ WRONG) to both files
- ✅ Updated AI Agent generation rules to reinforce the distinction
- ✅ Added examples to the workflow section

---

### Issue #2: Server Action Naming Convention Contradiction
- **Conflict Type:** Naming Convention
- **Affected Files:** `prj_coding_rules.mdc`
- **Severity:** CRITICAL

**Description:**
`prj_coding_rules.mdc` line 104 states: "Server Actions use **camelCase** with `SA` suffix"
BUT line 87 states: "ALL file names MUST use snake_case format"

**Conflict:** Server Actions are marked as an exception to snake_case with camelCase + SA suffix. However, line 87 says "ALL file names" without qualification, creating ambiguity.

**Rule 1 (prj_coding_rules.mdc line 87):** "MANDATORY: ALL file names MUST use snake_case format."
**Rule 2 (prj_coding_rules.mdc line 104):** "Server actions use **camelCase** with `SA` suffix (not snake_case) to distinguish them from regular actions."

**Recommended Resolution:**
- Make line 87 more specific: "ALL file names MUST use snake_case format, EXCEPT server actions which use camelCase with SA suffix"
- OR move the server action exception to a more prominent location
- Add clarifying examples for the exception

---

### Issue #3: Test Location Inconsistency
- **Conflict Type:** File Structure
- **Affected Files:** `prj_testing_rule.mdc`, general workspace rules
- **Severity:** HIGH

**Description:**
The workspace rules in the `prj_testing_rule.mdc` clearly state tests go in a `tests/` subfolder, BUT the workspace memory (memory ID: 5701938) states "Test code should be created in @test_workspace directory for this project."

**Rule 1 (prj_testing_rule.mdc):** "All test files must be placed in a `tests/` subfolder within each module"
**Memory 5701938:** "Test code should be created in @test_workspace directory"

**Recommended Resolution:**
- Memory 5701938 appears to be outdated or from a different project
- The `tests/` subfolder pattern is consistent across multiple rule files
- Recommend removing or updating memory 5701938 to match current testing rules

---

## HIGH Priority Issues

### Issue #4: Temporary Script Location Ambiguity
- **Conflict Type:** File Structure
- **Affected Files:** `prj_general_rules.mdc`, `prj_debuging_rules.mdc`
- **Severity:** HIGH

**Description:**
`prj_general_rules.mdc` states: "Temporary or debugging scripts must be stored in `/debuging/scripts/`."
`prj_debuging_rules.mdc` states: "Store debugging artifacts in `/debuging/scratch/`"

**Conflict:** Both locations exist but serve slightly different purposes. The ambiguity is about WHEN to use each location.

**Rule 1 (prj_general_rules.mdc):** Scripts go in `/debuging/scripts/`
**Rule 2 (prj_debuging_rules.mdc):** Debugging artifacts go in `/debuging/scratch/`

**Recommended Resolution:**
- Clearly define: scripts vs artifacts
- Add decision tree for when to use each location
- Maybe scripts = executable files, scratch = analysis/notes/temp data

---

### Issue #5: Documentation Section Count Mismatch
- **Conflict Type:** Documentation Requirements
- **Affected Files:** `prj_documentaton_rules.mdc`, `prj_coding_rules.mdc`
- **Severity:** MEDIUM

**Description:**
`prj_documentaton_rules.mdc` specifies 7 required sections for README.md files.
`prj_coding_rules.mdc` JSDoc section lists different required fields.

**Not necessarily a conflict, but inconsistency** - should standardize what's mandatory vs recommended across all documentation.

**Recommended Resolution:**
- Create a unified documentation standard
- Make it clear which sections are mandatory vs recommended
- Provide examples for each module type

---

### Issue #6: Class Configuration Object Naming Ambiguity
- **Conflict Type:** Code Structure
- **Affected Files:** `prj_coding_rules.mdc`
- **Severity:** MEDIUM

**Description:**
Lines 246-283 define configuration objects as `[ClassName]Config`, but there's no example of what happens when class name contains multiple words like `UserService`.

**Question:** Is it `UserServiceConfig` or `UserServiceConfig`? The examples show single-word classes only.

**Recommended Resolution:**
- Add examples for multi-word class names
- Clarify PascalCase applies to all words
- Provide examples: `UserServiceConfig`, `FlashcardServiceConfig`

---

## MEDIUM Priority Issues

### Issue #7: Hook File Naming vs Component File Naming
- **Conflict Type:** Naming Convention
- **Affected Files:** `prj_coding_rules.mdc`, `prj_hook_rules.mdc`
- **Severity:** MEDIUM

**Description:**
Hooks use `[event_name]_hook.ts` pattern (snake_case), but the hook rules specify this explicitly. Component rules also specify snake_case for files.

**No direct conflict** but should cross-reference for consistency.

---

### Issue #8: Database Service Naming Convention
- **Conflict Type:** Naming Convention
- **Affected Files:** `prj_database_rules.mdc`, `prj_coding_rules.mdc`
- **Severity:** MEDIUM

**Description:**
`prj_database_rules.mdc` specifies service files should be named like `user_service.ts` (snake_case), which aligns with general coding rules.

**Status:** Consistent ✅

---

### Issue #9: Git Commit Message Format
- **Conflict Type:** Workflow
- **Affected Files:** `prj_git_rules.mdc`, `prj_coding_rules.mdc` (development history)
- **Severity:** MEDIUM

**Description:**
Git rules specify conventional commit format, and coding rules specify UUID in development history. Need to ensure UUID tracking doesn't conflict with git workflow.

**No direct conflict** but should clarify relationship between UUIDs in code and git commits.

---

## LOW Priority Issues

### Issue #10: Minor Typo in MCP Servers File
- **Conflict Type:** Documentation Quality
- **Affected Files:** `prj_mcp_servers.mdc`
- **Severity:** LOW

**Description:**
Line 9 has typo: "CRITICAL: Read and follow ALL rules before generatin code" (should be "generating")
Line 11 has typo: "Rules to be follwed" (should be "followed")

**Recommended Resolution:** Fix typos

---

### Issue #11: Logging Rules File Name Inconsistency
- **Conflict Type:** File Naming
- **Affected Files:** `prj_logging_rule.mdc`
- **Severity:** LOW

**Description:**
Most rule files use `.mdc` extension, but logging rules file is named `prj_logging_rule.mdc` (singular "rule" vs "rules" in others like `prj_coding_rules.mdc`).

**Recommended Resolution:**
- Standardize naming: either all singular or all plural
- OR create mapping/dictionary of accepted names

---

### Issue #12: Test Location Memory Inconsistency
- **Conflict Type:** Memory vs Rules
- **Affected Files:** Workspace memory, `prj_testing_rule.mdc`
- **Severity:** LOW (already noted in Issue #3)

---

### Issue #13: UUID Tracking File Format
- **Conflict Type:** Documentation
- **Affected Files:** `prj_uuid_tracking_rule.md`
- **Severity:** LOW

**Description:**
The UUID tracking rule file uses `.md` extension instead of `.mdc` like other rules files.

**Recommended Resolution:**
- Consider renaming to `.mdc` for consistency
- OR document that both extensions are acceptable

---

## Ambiguities (Not Conflicts)

### Ambiguity #1: "System Boundaries" for Zod Validation
- **Affected Files:** `prj_coding_rules.mdc`
- **Severity:** MEDIUM

**Description:**
The rules specify "validate at system boundaries" but the definition of "system boundary" is somewhat vague. The examples help but a clearer decision tree would help.

---

### Ambiguity #2: When to Create New Hooks
- **Affected Files:** `prj_hook_rules.mdc`
- **Severity:** LOW

**Description:**
Hook rules describe how to create hooks but don't clearly define WHEN to create a new hook vs adding to existing hooks.

---

## Summary

### Issues by Severity:
- **CRITICAL:** 3 issues requiring immediate attention
- **HIGH:** 2 issues that should be fixed soon
- **MEDIUM:** 4 issues (nice to have fixes)
- **LOW:** 3 issues (minor improvements)

### Issues by Category:
- **Naming Conventions:** 4 issues
- **File Structure:** 3 issues
- **Documentation:** 2 issues
- **Import Conventions:** 2 issues
- **Workflow:** 2 issues
- **Documentation Quality:** 2 issues

### Top Priority Fixes:
1. Clarify server action naming exception
2. Standardize import extension rules between general and testing
3. Resolve test location memory vs current rules
4. Clarify temporary file locations (scripts vs scratch)
5. Fix typos in MCP servers documentation

---

## Recommended Next Steps

**Option A:** Fix all CRITICAL issues automatically
**Option B:** Review each issue individually before fixing
**Option C:** Generate detailed diff showing proposed changes
**Option D:** Focus only on CRITICAL issues first, then HIGH priority
**Option E:** User provides custom approach

---

## Detailed Analysis Notes

### Most Consistent Rules:
- ✅ File naming (snake_case) is well-established
- ✅ Test location (tests/ subfolder) is clear
- ✅ UUID tracking requirements are consistent
- ✅ Git workflow is well-defined

### Areas Needing Clarification:
- ⚠️ Server Actions naming (exception to snake_case)
- ⚠️ Temporary file storage (scripts vs scratch)
- ⚠️ Import extensions (general code vs tests)
- ⚠️ Documentation sections (mandatory vs optional)

### Suggested Improvements:
1. Create a decision tree/chart for file locations
2. Add cross-references between related rules
3. Provide more examples for edge cases
4. Standardize file extensions (.mdc vs .md)
5. Create a "Quick Reference" card combining all rules

