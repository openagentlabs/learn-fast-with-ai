# Rules Analysis Report - Conflicts and Ambiguities

## Executive Summary

Analysis of 13 rule files in `.cursor/rules/` directory reveals **8 major conflicts** and **5 areas of ambiguity** that could confuse the AI agent's decision-making process.

## Critical Conflicts (Must Fix Immediately)

### 1. Test Location - CONFLICT ⚠️
**Files**: `prj_testing_rule.mdc` vs Memory
- **Rule says**: Tests in `tests/` subfolder within module directory
- **Memory says**: Tests in `@test_workspace` directory
- **Impact**: HIGH - Agent won't know where to put tests
- **Resolution**: Remove memory, use tests/ subfolder rule

### 2. Server Action Naming - CONFLICT ⚠️
**Files**: `prj_coding_rules.mdc` vs Memory
- **Rule says**: `action_name_sa.ts` (underscore format)
- **Memory says**: Suffix 'SA' rather than '_sa' (camelCase + SA)
- **Impact**: HIGH - Wrong file naming will be used
- **Resolution**: Memory is correct, update rule to use `actionNameSA.ts`

### 3. Import Extensions - CONFLICT ⚠️
**Files**: `prj_general_rules.mdc` vs `prj_testing_rule.mdc`
- **General Rule**: Never use .js extensions
- **Testing Rule**: Always use .js extensions for ES modules
- **Impact**: MEDIUM - Confusing for agent
- **Resolution**: Add clarification that .js is ONLY for test files

## Moderate Ambiguities

### 4. Component Folder vs File Naming
**Issue**: Components use PascalCase folders but snake_case files
- **Impact**: LOW - Could cause naming confusion
- **Resolution**: Add clarifying examples

### 5. UUID Comment Scope
**Issue**: "Not needed for single-line variable declarations" but what counts?
- **Impact**: LOW - Might miss some code blocks
- **Resolution**: Add more specific examples of what doesn't need UUIDs

### 6. System Boundary Definition
**Issue**: "Use Zod at system boundaries" but no definition of boundaries
- **Impact**: MEDIUM - Inconsistent validation
- **Resolution**: Define "system boundary" explicitly

## Minor Issues

### 7. Database Rules Typo
**File**: `prj_database_rules.mdc` line 737
- **Issue**: Contains git rules content
- **Impact**: LOW - Just formatting issue
- **Resolution**: Remove duplicate content

### 8. Development History Workflow Clarity
**Issue**: Multiple mentions of "last step" but unclear sequence when tests are involved
- **Impact**: LOW - Could cause execution order confusion
- **Resolution**: Clarify workflow: Create code → Create tests → Run tests → Log history

## Recommendations

### Immediate Actions Required:

1. **Fix Memory Conflict** - Update the two conflicting memories
2. **Update Coding Rules** - Fix Server Action naming convention
3. **Add Import Clarification** - Specify .js only for tests
4. **Update Database Rules** - Remove duplicate content
5. **Clarify System Boundaries** - Define when to use Zod validation

### Priority Fixes:

**HIGH PRIORITY** (Conflicts that cause wrong behavior):
- Test location conflict
- Server action naming conflict
- Import extension confusion

**MEDIUM PRIORITY** (Ambiguities that reduce efficiency):
- System boundary definition
- UUID comment scope
- Workflow sequencing

**LOW PRIORITY** (Minor polish issues):
- Database rules typo
- Component naming clarification

---

Generated: 2025-01-23
Review Status: Pending User Approval
Next Step: User reviews and approves fixes
