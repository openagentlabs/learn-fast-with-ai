# Rules Files Conflict Analysis Report
**Generated:** 2025-01-27

## Executive Summary

After analyzing all 15 rules files in `.cursor/rules/`, I found **several critical conflicts and inconsistencies** that need to be resolved. The main issues are:

1. ❌ **Database architecture mismatch** between database rules and actual project structure
2. ❌ **Wrong project path** in hook rules (references wrong project)
3. ❌ **Inconsistent repository structure** references
4. ✅ **Server actions rule** is now correctly added to web design rules

---

## Critical Conflicts Identified

### 1. Database Rules vs. Actual Project Structure ⚠️ CRITICAL

**Conflict:** `prj_database_rules.mdc` describes:
- Models in `/src/lib/models/`
- Repositories in `/src/lib/database/repositories/`
- Using FireORM with Firestore

**Actual Project Structure (from project_layout):**
```
src/
├── domain/
│   └── entities/          # Entities here (not /src/lib/models/)
├── infrastructure/
│   └── adapters/
│       └── database/
│           └── sqlite/    # SQLite, not Firestore!
│               └── repositories/
```

**Resolution Needed:**
- Database rules file references WRONG database (Firestore/FireORM vs SQLite)
- Database rules references WRONG paths (/src/lib/models/ vs /src/domain/entities/)
- Database rules don't match the Clean Architecture pattern used in the project

### 2. Hook Rules Wrong Project Path ❌ CRITICAL

**Conflict:** `prj_hook_rules.mdc` Line 11:
```typescript
**Location:** `/home/keith/Dev/TerraChatWeb/src/hooks/`
```

**Should Be:**
```typescript
**Location:** `/home/keith/Dev/learn-fast-with-ai/src/hooks/`
```

**Issue:** References a completely different project (TerraChatWeb vs learn-fast-with-ai)

### 3. Repository Pattern Inconsistency ⚠️

**Database Rules Claim:**
- Repositories in `/src/lib/database/repositories/`
- Models in `/src/lib/models/`

**Architecture Rules Say:**
- Repository interfaces in `/src/domain/interfaces/repositories/`
- Repository implementations in `/src/infrastructure/adapters/database/`
- Entities in `/src/domain/entities/`

**Verification from project structure:**
- ✅ Architecture rules are CORRECT
- ❌ Database rules are WRONG

### 4. Database Technology Mismatch ❌

**Database Rules Say:**
- Using Google Cloud Firestore
- Using FireORM ORM
- Project ID: keithtest001
- Region: europe-west2

**Actual Project:**
- Uses SQLite (data/app.db exists)
- Uses standard TypeScript repositories
- This is a local development project

**Impact:** Entire database rules file is for the WRONG project/technology

---

## Conflicting Files Status

### ✅ Web Design Rules - FIXED
- **Status:** Now includes server actions rule
- **Conflict:** Previously missing server actions guidance
- **Resolution:** Added critical server actions section referencing architecture rules

### ❌ Database Rules - NEEDS MAJOR REWRITE
- **Status:** Completely wrong for this project
- **Issues:**
  - References wrong database (Firestore vs SQLite)
  - References wrong paths (/src/lib/ vs /src/domain/, /src/infrastructure/)
  - References wrong ORM (FireORM vs standard TypeScript)
  - Entire file seems copied from another project

### ❌ Hook Rules - WRONG PATH
- **Status:** Contains wrong project path
- **Issue:** References `/home/keith/Dev/TerraChatWeb/` instead of current project
- **Fix:** Replace all paths with correct project path

### ❌ Debugging Rules - WRONG PROJECT NAME
- **Status:** References TerraChatWeb in title and paths
- **Issue:** Line 9 mentions "TerraChatWeb application"
- **Should:** Reference "learn-fast-with-ai"

### ✅ Architecture Rules - CONSISTENT
- **Status:** Matches actual project structure
- **No issues found**

### ✅ Coding Rules - CONSISTENT
- **Status:** Matches coding standards
- **No conflicts found**

### ✅ Testing Rules - CONSISTENT
- **Status:** References AVA framework correctly
- **No conflicts found**

### ✅ Git Rules - CONSISTENT
- **Status:** References correct repository and deployment
- **No conflicts found**

---

## Recommended Actions

### Priority 1: Critical Fixes (Breaking)

1. **Delete or Rewrite Database Rules** (`prj_database_rules.mdc`)
   - Current file is for entirely different project
   - Either delete it or completely rewrite for SQLite + Clean Architecture
   - Options:
     - Option A: Delete the file (recommended if not using Firestore)
     - Option B: Rewrite entire file for SQLite architecture

2. **Fix Hook Rules Path** (`prj_hook_rules.mdc`)
   - Replace `/home/keith/Dev/TerraChatWeb/src/hooks/`
   - With `/home/keith/Dev/learn-fast-with-ai/src/hooks/`
   - Fix on line 11 and any other references

3. **Fix Debugging Rules Title** (`prj_debuging_rules.mdc`)
   - Replace "TerraChatWeb" with "learn-fast-with-ai"
   - Update project name references throughout

### Priority 2: Verify Other Rules

4. **Check Configuration Rules** (`prj_config_rules.mdc`)
   - Verify AppConfig paths match actual project structure
   - Confirm config location is correct

5. **Verify Infrastructure Rules** (`prj_infrastructure_rules.mdc`)
   - Confirm GCP deployment info matches actual setup
   - Verify Cloud Run service details

---

## Specific Line-by-Line Conflicts

### Database Rules (prj_database_rules.mdc)

**Lines 28-31:** Define import aliases for models and database
```typescript
**Import Aliases:**
- Use `@database/` for database infrastructure
- Use `@models/` for all database models
```
**CONFLICT:** Project uses Clean Architecture with different structure

**Lines 38-56:** Repository structure
```
src/lib/database/
src/lib/models/
```
**CONFLICT:** Should be `src/infrastructure/adapters/database/` and `src/domain/entities/`

**Lines 82-99:** Database configuration
- Claims using Firestore
- Claims FireORM
- Claims GCP project keithtest001
**CONFLICT:** Project uses SQLite locally

### Hook Rules (prj_hook_rules.mdc)

**Line 11:** Wrong path
**Line 62:** Wrong path in example
**Line 100:** Wrong project references

### Debugging Rules (prj_debuging_rules.mdc)

**Line 9:** Mentions "TerraChatWeb application"
**Line 31:** References wrong project path `/home/keith/Dev/TerraChatWeb/`
**Line 59:** References wrong project path

---

## Summary of Conflicts

| File | Issue | Severity | Fix Required |
|------|-------|----------|--------------|
| `prj_database_rules.mdc` | Wrong database, wrong paths | 🔴 CRITICAL | Delete or complete rewrite |
| `prj_hook_rules.mdc` | Wrong project path | 🔴 CRITICAL | Fix paths (3 occurrences) |
| `prj_debuging_rules.mdc` | Wrong project name | 🟡 HIGH | Fix project name references |
| `prj_web_design_rules.mdc` | ✅ FIXED | ✅ RESOLVED | None - was fixed |
| `prj_architecture_rules.mdc` | ✅ CORRECT | ✅ OK | None |
| `prj_coding_rules.mdc` | ✅ CORRECT | ✅ OK | None |
| `prj_testing_rule.mdc` | ✅ CORRECT | ✅ OK | None |
| `prj_git_rules.mdc` | ✅ CORRECT | ✅ OK | None |
| `prj_typescript_rules.mdc` | ✅ CORRECT | ✅ OK | None |
| `prj_documentaton_rules.mdc` | ✅ CORRECT | ✅ OK | None |
| `prj_config_rules.mdc` | ⚠️ VERIFY | 🟢 LOW | Verify paths match |
| `prj_infrastructure_rules.mdc` | ⚠️ VERIFY | 🟢 LOW | Verify GCP info |
| `prj_logging_rule.mdc` | ✅ CORRECT | ✅ OK | None |
| `prj_uuid_tracking_rule.md` | ✅ CORRECT | ✅ OK | None |
| `prj_mcp_servers.mdc` | Empty placeholder | ⚠️ LOW | Add content if needed |

---

## Recommendations

1. **Immediate Action:** Fix the hook rules and debugging rules paths (quick fixes)
2. **Short-term:** Delete database rules file OR completely rewrite for this project
3. **Long-term:** Audit all remaining rules for consistency
4. **Documentation:** Update project README to clarify which rules apply

---

## Next Steps

1. Ask user which database they want to use:
   - SQLite (current) - delete database rules
   - Firestore (future) - rewrite database rules
2. Fix hook rules paths
3. Fix debugging rules project name
4. Verify infrastructure rules match actual deployment