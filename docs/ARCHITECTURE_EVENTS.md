# Clean Architecture: Events and Lifecycle Management

## Overview

This document outlines the architecture for application events and lifecycle management in the Learn Fast with AI project, following Clean Architecture principles.

---

## Table of Contents

1. [Event Architecture Principles](#event-architecture-principles)
2. [Layer Responsibilities](#layer-responsibilities)
3. [Event Placement Guidelines](#event-placement-guidelines)
4. [Current Implementation](#current-implementation)
5. [Event Structure](#event-structure)
6. [Best Practices](#best-practices)
7. [Examples](#examples)

---

## Event Architecture Principles

### Core Principle: Composition Root Pattern

The **Infrastructure layer** acts as the **Composition Root** for application composition. All dependency registration, configuration, and initialization logic belongs in the Infrastructure layer.

### Why Infrastructure for Events?

Events that orchestrate application startup, dependency registration, and infrastructure initialization **must** be located in the Infrastructure layer because:

1. ✅ **Dependency Registration**: Events register all dependencies with the DI container
2. ✅ **Infrastructure Setup**: Events initialize databases, services, and external connections
3. ✅ **Composition Responsibility**: Events compose the application from all layers
4. ✅ **Single Source of Truth**: One place to manage all application dependencies

---

## Layer Responsibilities

### Domain Layer (`src/domain/`)

**Events**: ❌ **NO EVENTS**

**Why?**
- Pure business logic entities and interfaces
- Zero infrastructure dependencies
- No initialization or lifecycle concerns
- Only contains business rules

**Contains:**
- Entities (User, Flashcard)
- Repository interfaces (IUserRepository, IFlashcardRepository)
- Service interfaces (IAIModelService)

---

### Application Layer (`src/application/`)

**Events**: ❌ **NO EVENTS**

**Why?**
- Contains use cases (business workflows)
- Depends on domain interfaces only
- No infrastructure awareness
- No initialization concerns

**Contains:**
- Use Cases (CreateUserUseCase, ListUsersUseCase, etc.)
- DTOs (CreateUserDTO, UpdateUserDTO, etc.)

---

### Infrastructure Layer (`src/infrastructure/`)

**Events**: ✅ **YES - Events belong here**

**Why?**
- Implements domain interfaces (repositories, services)
- Manages dependency registration
- Handles external service initialization
- Acts as the Composition Root

**Contains:**
```
src/infrastructure/
├── events/                    # ✅ Application lifecycle events
│   ├── onAppStartEvent.ts    # Registers all dependencies
│   └── index.ts
├── adapters/                  # External service implementations
│   ├── database/              # Database adapters
│   ├── ai/                    # AI service adapters
│   └── logging/               # Logging adapters
└── di/                        # Dependency injection
    ├── Container.ts           # Exports DI container
    └── index.ts
```

---

### Presentation Layer (`src/presentation/`)

**Events**: ❌ **NO EVENTS**

**Why?**
- Handles request/response concerns
- Implements server actions and API handlers
- Does not orchestrate application startup
- Responds to incoming requests only

**Contains:**
- Server Actions (`src/presentation/actions/`)
- API Handlers (`src/presentation/handlers/`)

---

### App Layer (`src/app/`)

**Events**: ❌ **NO EVENTS** (calls infrastructure events)

**Why?**
- Thin Next.js routing layer
- Calls infrastructure events on startup
- Does not define events, only triggers them

**Implementation:**
```typescript
// src/app/layout.tsx
import { onAppStartEvent } from '@/infrastructure/events';

// Called once when application starts
onAppStartEvent();
```

---

## Event Placement Guidelines

### Decision Tree

```
Need to register dependencies or initialize infrastructure?
│
├─ YES → Place in src/infrastructure/events/
│         Examples: onAppStartEvent, onAppShutdownEvent
│
└─ NO → Don't create an event
         Let the appropriate layer handle it directly
```

### When to Create an Event?

Create an event in `src/infrastructure/events/` when:

✅ **DO:**
- Registering dependencies with the DI container
- Initializing external services (Firebase, databases, APIs)
- Setting up configuration
- Managing application lifecycle (startup, shutdown)
- Orchestrating infrastructure setup

❌ **DON'T:**
- Business logic (use Use Cases in Application layer)
- Request handling (use Server Actions in Presentation layer)
- Data validation (use Domain entities)
- Pure business rules (use Domain layer)

---

## Current Implementation

### Event Structure

```
src/infrastructure/events/
├── onAppStartEvent.ts    # Main application startup event
└── index.ts              # Exports all events
```

### `onAppStartEvent.ts` Responsibilities

This event is responsible for:

1. **Firebase Initialization**
   - Initializes Firebase Admin SDK
   - Connects to Firestore database

2. **Repository Registration**
   - Registers Firebase User Repository
   - Registers Firebase Flashcard Repository
   - Maps interfaces to implementations

3. **Service Registration**
   - Registers AI Model Service (Gemini)

4. **Use Case Registration**
   - Registers all use cases with DI container
   - Ensures dependency resolution works

### Code Example

```typescript
// src/infrastructure/events/onAppStartEvent.ts
export function onAppStartEvent(): void {
  const eventLogger = logger.child({ event: 'onAppStart' });
  
  eventLogger.info('Application start event triggered');

  try {
    // 1. Initialize Infrastructure
    firebaseConfig.initialize();

    // 2. Register Repositories
    container.registerSingleton('IUserRepository', { useClass: FirebaseUserRepository });
    container.registerSingleton('IFlashcardRepository', { useClass: FlashcardRepository });

    // 3. Register Services
    container.registerSingleton('IAIModelService', { useClass: GeminiAIModel });

    // 4. Register Use Cases
    container.register(CreateUserUseCase);
    container.register(GetUserUseCase);
    container.register(ListUsersUseCase);
    container.register(DeleteUserUseCase);
    container.register(UpdateUserUseCase);
    container.register(GenerateFlashcardUseCase);

    eventLogger.info('Application start event completed successfully');
  } catch (error) {
    eventLogger.error('Application start event failed', { error });
    throw error;
  }
}
```

---

## Event Structure

### Naming Conventions

| Event Type | Pattern | Example |
|------------|---------|---------|
| Application lifecycle | `onApp[X]Event` | `onAppStartEvent` |
| Module lifecycle | `on[X]InitEvent` | `onDatabaseInitEvent` |
| System events | `onSystem[X]Event` | `onSystemErrorEvent` |

### Event File Structure

```typescript
// src/infrastructure/events/[EventName]Event.ts

import { container } from 'tsyringe';
import { logger } from '@/lib/logging';

// Import dependencies

/**
 * [Event Description]
 * 
 * @purpose
 * - Purpose 1
 * - Purpose 2
 * 
 * @when-called
 * Describes when this event is triggered
 * 
 * @dependencies
 * Lists any infrastructure dependencies
 */
export function eventName(): void {
  const eventLogger = logger.child({ event: 'eventName' });
  
  eventLogger.info('Event triggered');

  try {
    // Event logic here
    
    eventLogger.info('Event completed successfully');
  } catch (error) {
    eventLogger.error('Event failed', { error });
    throw error;
  }
}
```

---

## Best Practices

### 1. Keep Events Infrastructure-Focused

✅ **Good:**
```typescript
// Infrastructure event - initializes Firebase
export function onAppStartEvent(): void {
  firebaseConfig.initialize();
  // ... register dependencies
}
```

❌ **Bad:**
```typescript
// Business logic doesn't belong in events
export function onAppStartEvent(): void {
  // ❌ Don't do this
  const user = new User(...); // Business logic
}
```

### 2. Use Logging

Always use the logger for debugging and monitoring:

```typescript
const eventLogger = logger.child({ event: 'onAppStart' });
eventLogger.info('Event started');
eventLogger.debug('Detailed information');
eventLogger.error('Error occurred', { error });
```

### 3. Handle Errors Properly

Events should handle errors gracefully:

```typescript
try {
  // Event logic
  eventLogger.info('Success');
} catch (error) {
  eventLogger.error('Failed', { error });
  throw error; // Re-throw to prevent silent failures
}
```

### 4. Single Responsibility

Each event should do one thing:

✅ **Good:**
- `onAppStartEvent` - Initializes and registers dependencies
- `onAppShutdownEvent` - Cleans up resources

❌ **Bad:**
- `onEverythingEvent` - Does too many things

---

## Examples

### Example 1: Application Start Event

**File**: `src/infrastructure/events/onAppStartEvent.ts`

**Purpose**: Initialize infrastructure and register dependencies

**Triggered By**: `src/app/layout.tsx` on module load

**What It Does:**
1. Initializes Firebase connection
2. Registers all repositories in DI container
3. Registers all services in DI container
4. Registers all use cases in DI container

---

### Example 2: Future - Database Migration Event

**File**: `src/infrastructure/events/onDatabaseInitEvent.ts`

**Purpose**: Run database migrations on startup

**Triggered By**: Called after Firebase initialization

**What It Would Do:**
1. Check database schema version
2. Run pending migrations
3. Update schema version in database

**Note**: This is an example of a future event that would belong in the Infrastructure layer.

---

## Summary

### Event Architecture Summary

| Layer | Events? | Location | Responsibility |
|-------|---------|----------|----------------|
| **Domain** | ❌ | N/A | Business entities and interfaces |
| **Application** | ❌ | N/A | Use cases and business workflows |
| **Infrastructure** | ✅ | `src/infrastructure/events/` | **Lifecycle events and dependency registration** |
| **Presentation** | ❌ | N/A | Request/response handling |
| **App** | ❌ | N/A | Triggers infrastructure events |

### Key Principles

1. ✅ **Composition Root**: Infrastructure layer orchestrates application composition
2. ✅ **Single Responsibility**: Each event does one thing well
3. ✅ **Infrastructure Only**: Events are infrastructure concerns
4. ✅ **Proper Logging**: All events log their lifecycle
5. ✅ **Error Handling**: Events handle errors gracefully

### Quick Reference

- **Where to put events?** → `src/infrastructure/events/`
- **Where NOT to put events?** → Domain, Application, Presentation, App layers
- **What do events do?** → Initialize infrastructure, register dependencies
- **When are events called?** → On application startup in `layout.tsx`

---

## References

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Composition Root Pattern](https://blog.ploeh.dk/2011/07/28/CompositionRoot/)
- [Dependency Injection Best Practices](https://www.martinfowler.com/articles/injection.html)

---

**Last Updated**: 2025-01-XX
**Version**: 1.0.0

