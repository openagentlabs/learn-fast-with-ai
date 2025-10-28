# Clean Architecture Migration

## Overview

This document tracks the migration of modules from `src/lib/` to proper Clean Architecture locations.

**Date**: January 2025
**Status**: Completed

---

## Migration Summary

### Completed Migrations

#### 1. Configuration Module
- **From**: `src/lib/config/AppConfig.ts`
- **To**: `src/infrastructure/adapters/config/AppConfig.ts`
- **Reason**: Configuration is an infrastructure concern

#### 2. Logging Module
- **From**: `src/lib/logging/index.ts`
- **To**: `src/infrastructure/adapters/logging/index.ts`
- **Reason**: Logging is a cross-cutting infrastructure concern

#### 3. AI Gemini Implementation
- **From**: `src/lib/ai_gemini_model/GeminiModel.ts`
- **To**: `src/infrastructure/adapters/ai/GeminiModelImpl.ts`
- **Reason**: External AI service implementation belongs in infrastructure

---

## Current Architecture Structure

```
src/
├── domain/                        # Business logic and interfaces
│   ├── entities/                  # Business entities
│   └── interfaces/
│       ├── repositories/          # Repository interfaces
│       └── services/              # Service interfaces
│
├── application/                   # Use cases and orchestration
│   ├── use-cases/                # Business workflows
│   └── dtos/                      # Data transfer objects
│
├── infrastructure/                # External adapters and implementations
│   ├── adapters/
│   │   ├── config/               # ✅ Moved from lib/config
│   │   │   └── AppConfig.ts
│   │   ├── logging/              # ✅ Moved from lib/logging
│   │   │   └── index.ts
│   │   ├── database/             # Database adapters
│   │   │   └── firebase/         # Firestore implementation
│   │   ├── ai/                   # AI service adapters
│   │   │   ├── GeminiAIModel.ts  # Domain interface implementation
│   │   │   └── GeminiModelImpl.ts # ✅ Moved from lib/ai_gemini_model
│   │   └── ...                   # Other adapters
│   ├── events/                    # Application lifecycle events
│   └── di/                        # Dependency injection
│
├── presentation/                  # Request/response handling
│   └── actions/                   # Server actions
│
└── app/                           # Next.js routing
    └── (pages)/                   # Page components
```

---

## Import Path Changes

### Before (Old)
```typescript
import { appConfig } from '@/lib/config';
import { logger } from '@/lib/logging';
import { GeminiModel } from '@/lib/ai_gemini_model/GeminiModel';
```

### After (New)
```typescript
import { appConfig } from '@/infrastructure/adapters/config/AppConfig';
import { logger } from '@/infrastructure/adapters/logging';
import { GeminiModelImpl } from '@/infrastructure/adapters/ai/GeminiModelImpl';
```

---

## Module Placement Guidelines

### Where Modules Belong in Clean Architecture

| Module Type | Location | Examples |
|-------------|----------|----------|
| **Configuration** | `src/infrastructure/adapters/config/` | AppConfig, environment variables |
| **Logging** | `src/infrastructure/adapters/logging/` | Logger implementations |
| **External Services** | `src/infrastructure/adapters/[service]/` | AI, database, APIs |
| **Business Entities** | `src/domain/entities/` | User, Flashcard |
| **Repository Interfaces** | `src/domain/interfaces/repositories/` | IUserRepository |
| **Service Interfaces** | `src/domain/interfaces/services/` | IAIModelService |
| **Use Cases** | `src/application/use-cases/` | CreateUserUseCase |
| **DTOs** | `src/application/dtos/` | CreateUserDTO |
| **Server Actions** | `src/presentation/actions/` | user actions |

---

## Migration Checklist

- [x] Move `lib/config` → `infrastructure/adapters/config`
- [x] Move `lib/logging` → `infrastructure/adapters/logging`
- [x] Move `lib/ai_gemini_model` → `infrastructure/adapters/ai`
- [ ] Update all imports in existing code
- [ ] Remove `src/lib/` directory
- [ ] Update documentation references
- [ ] Run tests to verify migration
- [ ] Update CI/CD if needed

---

## Benefits of Migration

### Better Organization
- Clear separation of concerns
- Easy to find modules by purpose
- Follows Clean Architecture principles

### Improved Maintainability
- Infrastructure concerns isolated
- Easier to swap implementations
- Better dependency management

### Type Safety
- Explicit dependencies
- Clear import paths
- Better IDE support

---

## Removed Components

### No Longer Needed
- `src/lib/config/` - Moved to infrastructure
- `src/lib/logging/` - Moved to infrastructure
- `src/lib/ai_gemini_model/` - Moved to infrastructure
- `src/lib/database/` - Removed (using Firestore instead of SQLite)

---

## Related Documentation

- [Clean Architecture Events](./ARCHITECTURE_EVENTS.md) - Event lifecycle management
- [Main README](./README.md) - Deployment and CI/CD documentation
- [Coding Rules](../../.cursor/rules/prj_architecture_rules.mdc) - Architecture guidelines
- [Coding Rules](../../.cursor/rules/prj_coding_rules.mdc) - Development guidelines

---

**Last Updated**: 2025-01-XX
**Version**: 1.0.0
