# Rules Analysis Summary - Quick Reference

## 🎯 Key Findings

Analyzed 13 rule files and found:
- **3 Critical Conflicts** (will cause wrong behavior)
- **5 Ambiguities** (will cause confusion)
- **2 Minor Issues** (cosmetic/wording)

---

## ⚠️ TOP 3 ISSUES REQUIRING IMMEDIATE FIX

### Issue #1: Test Location Conflict
**What's Wrong**: Rules say tests go in `tests/` folder but memory says `@test_workspace`  
**Impact**: Agent will be confused about where to create tests  
**Fix**: Delete the conflicting memory (memory ID: 5701938)  
**Files Affected**: All test creation tasks

### Issue #2: Server Action Naming Inconsistency
**What's Wrong**: Rules show `action_name_sa.ts` but memory says use `SA` suffix  
**Impact**: Agent will use underscore format instead of camelCase  
**Fix**: Update line 94 in `prj_coding_rules.mdc` to use camelCase  
**Change**: `create_user_sa.ts` → `createUserSA.ts`

### Issue #3: Import Extension Confusion
**What's Wrong**: General rules say "never use .js" but tests require .js  
**Impact**: Agent will be confused about when to use extensions  
**Fix**: Add exception clause to general rules  
**Change**: "Never use .js" → "Never use .js (except in test files)"

---

## 📊 Detailed Analysis

### Critical Conflicts (HIGH PRIORITY)

| Issue | Location | Impact | Fix Complexity |
|-------|----------|--------|----------------|
| Test Location | Memory vs Rules | HIGH | ⭐ Easy (delete memory) |
| Server Action Naming | Line 94 | HIGH | ⭐⭐ Medium (edit rule) |
| Import Extensions | Multiple files | MEDIUM | ⭐ Easy (add exception) |

### Ambiguities (MEDIUM PRIORITY)

1. **System Boundary Definition**: When to use Zod validation
   - **Where**: `prj_coding_rules.mdc` line 345
   - **Issue**: Says "at system boundaries" but doesn't define boundaries
   - **Fix**: Add definition and examples

2. **UUID Comment Scope**: What code needs UUIDs
   - **Where**: `prj_coding_rules.mdc` lines 321-325
   - **Issue**: Examples are not comprehensive enough
   - **Fix**: Add more examples of what doesn't need UUIDs

3. **Development History Sequence**: What's the correct order
   - **Where**: Multiple files mention "last step"
   - **Issue**: Unclear if logs happen before or after tests
   - **Fix**: Clarify: Code → Tests → Log

4. **Component Folder vs File**: Naming confusion
   - **Where**: `prj_coding_rules.mdc` line 173
   - **Issue**: Folders are PascalCase but files are snake_case
   - **Fix**: Add examples showing both patterns

5. **Server Action Location**: Where do they live?
   - **Where**: `prj_coding_rules.mdc` line 94
   - **Issue**: Shows naming but not directory structure
   - **Fix**: Add directory structure example

### Minor Issues (LOW PRIORITY)

1. **Database Rules Typo**: Duplicate git content
   - **Where**: `prj_database_rules.mdc` line 737
   - **Issue**: Wrong content in file
   - **Fix**: Delete lines 737-738

2. **Workflow Clarity**: Multiple references
   - **Where**: Multiple files
   - **Issue**: Repeated "MANDATORY" warnings create confusion
   - **Fix**: Consolidate or clarify sequencing

---

## 🚀 Recommended Fix Order

### Phase 1: Critical Fixes (Do First)
1. Delete memory about @test_workspace
2. Update server action naming to camelCase
3. Add .js exception for test files

### Phase 2: Clarifications (Do Next)
4. Define system boundaries for Zod
5. Add UUID comment examples
6. Clarify development history sequence

### Phase 3: Improvements (Nice to Have)
7. Remove database rules typo
8. Add component naming examples
9. Add server actions directory examples

---

## 📝 Quick Reference: What Each File Does

| File | Purpose | Key Rules |
|------|---------|-----------|
| `prj_coding_rules.mdc` | Core coding standards | Naming, structure, class patterns |
| `prj_config_rules.mdc` | Configuration management | AppConfig usage, env vars |
| `prj_database_rules.mdc` | Database conventions | Prisma schema, migrations |
| `prj_debuging_rules.mdc` | Debugging workflow | Logging, Chrome MCP |
| `prj_git_rules.mdc` | Git workflow | Branches, commits, PRs |
| `prj_hook_rules.mdc` | Application hooks | Lifecycle hooks |
| `prj_general_rules.mdc` | Overview | Import conventions, general |
| `prj_infrastructure_rules.mdc` | Deployment | Vercel, environment |
| `prj_uuid_tracking_rule.md` | Change tracking | UUID comments, history |
| `prj_web_design_rules.mdc` | UI framework | Tailwind, shadcn |
| `prj_testing_rule.mdc` | Testing | AVA, test structure |
| `prj_logging_rule.mdc` | Logging system | Winston usage |
| `prj_mcp_servers.mdc` | MCP tools | Chrome MCP usage |

---

## 🎓 Lessons Learned

### What Works Well
- ✅ Clear mandatory vs optional distinctions
- ✅ Good examples provided in most rules
- ✅ UUID tracking system is clear
- ✅ Testing requirements are well-defined

### What Needs Improvement
- ❌ Conflicting information between files
- ❌ Unclear priorities when rules conflict
- ❌ Missing definitions for technical terms
- ❌ Workflow sequences not always clear

### Best Practices for Future Rules
1. **Cross-reference check**: Before adding rules, check for conflicts
2. **Define terms**: Always define technical terms in context
3. **Provide examples**: Show both good and bad examples
4. **Specify exceptions**: List when rules don't apply
5. **Link related rules**: Reference other rules when relevant

---

**Next Steps**: Review `rules_fixes_required.md` for specific code changes needed
