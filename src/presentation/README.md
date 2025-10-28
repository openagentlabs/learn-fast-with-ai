# Presentation Layer

## Overview
The presentation layer contains server actions for browser-to-server communication. This layer follows Clean Architecture principles and handles all user interactions.

## Purpose
- Handle form submissions and data mutations
- Orchestrate use cases from the application layer
- Provide type-safe server actions
- Maintain clean architecture boundaries
- Provide reusable UI components for user interactions

## Structure
```
presentation/
├── actions/           # Server Actions (Primary Pattern)
│   ├── user/         # User server actions
│   │   ├── actions.ts
│   │   └── index.ts
│   ├── flashcard/    # Flashcard server actions
│   │   ├── actions.ts
│   │   └── index.ts
│   └── index.ts
├── components/        # UI Components
│   └── ui/           # Reusable UI components (Button, Input, Table, etc.)
│       ├── button.tsx
│       ├── input.tsx
│       ├── table.tsx
│       ├── index.ts
│       └── README.md
└── index.ts
```

## Server Actions Pattern (Primary - Default)

**Used by:** Browser-to-server communication, forms, mutations, page data fetching  
**Location:** `src/presentation/actions/[domain]/actions.ts`

```typescript
// src/presentation/actions/user/actions.ts
'use server';

import { container } from '@/infrastructure/di/Container';
import { CreateUserUseCase } from '@/application/use-cases/user/CreateUserUseCase';

export async function createUser(input: CreateUserInput) {
  try {
    const useCase = container.resolve(CreateUserUseCase);
    const user = await useCase.execute(input);
    
    return {
      success: true,
      data: user
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user'
    };
  }
}

// src/app/(pages)/users/add/page.tsx
import { createUser } from '@/presentation/actions/user/actions';

export default function AddUserPage() {
  const handleSubmit = async (formData: FormData) => {
    const result = await createUser({
      email: formData.get('email'),
      name: formData.get('name')
    });
    
    if (result.success) {
      router.push('/users');
    }
  };

  return <form action={handleSubmit}>...</form>;
}
```

## Benefits
✅ **Type-Safe**: End-to-end TypeScript types  
✅ **Framework Integration**: Native Next.js server actions  
✅ **No API Layer**: Direct function calls  
✅ **Progressive Enhancement**: Works without JavaScript  
✅ **Better DX**: Better developer experience

## UI Components (`src/presentation/components/ui/`)

The presentation layer includes reusable UI components built with shadcn/ui patterns and Tailwind CSS v4.

**Why in Presentation Layer?**
- UI components handle user interactions (presentation concerns)
- They are reusable presentation building blocks
- They depend on no other layers (only React and Tailwind CSS)
- They are consumed by the app layer (routing/pages) and can be used by other presentation components

### Available Components

**Button** - Flexible button with multiple variants and sizes
```tsx
import { Button } from '@/presentation/components/ui/button';
<Button variant="default" size="default">Click me</Button>
```

**Input** - Form input with label and error support
```tsx
import { Input } from '@/presentation/components/ui/input';
<Input label="Email" type="email" placeholder="Enter email" />
```

**Table** - Complete table components for structured data
```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/presentation/components/ui/table';
```

See `src/presentation/components/ui/README.md` for complete documentation.

## Available Server Actions

### User Actions (`src/presentation/actions/user/actions.ts`)
- `createUser(input)` - Create a new user
- `getUser(input)` - Get user by ID
- `listUsers()` - List all users
- `updateUser(input)` - Update a user
- `deleteUser(input)` - Delete a user

### Flashcard Actions (`src/presentation/actions/flashcard/actions.ts`)
- `generateFlashcard(input)` - Generate a flashcard using AI

## Layer Dependencies

```
Presentation (this layer)
    ↓
Application (use cases)
    ↓
Domain (entities & interfaces)
```

The presentation layer **only** depends on the application layer (use cases).

## Usage in Components

### Server Components
```typescript
// Page component
import { listUsers } from '@/presentation/actions/user/actions';

export default async function UsersPage() {
  const result = await listUsers();
  const users = result.success ? result.data : [];
  
  return <div>{/* Render users */}</div>;
}
```

### Client Components
```typescript
'use client';
import { createUser } from '@/presentation/actions/user/actions';

export default function AddUserForm() {
  const handleSubmit = async (formData: FormData) => {
    const result = await createUser({
      email: formData.get('email'),
      name: formData.get('name')
    });
    
    if (result.success) {
      // Success!
    }
  };

  return <form action={handleSubmit}>...</form>;
}
```

## Best Practices

1. ✅ Use server actions for all browser-to-server communication
2. ✅ Return consistent response format: `{ success: boolean, data?: T, error?: string }`
3. ✅ Handle errors gracefully and return user-friendly messages
4. ✅ Use TypeScript interfaces for input parameters
5. ✅ Keep actions focused on a single responsibility
6. ✅ Use the DI container to resolve use cases
7. ✅ Never call infrastructure directly from actions

## Error Handling

All server actions return a consistent response format:

```typescript
// Success
{
  success: true,
  data: { /* data */ }
}

// Error
{
  success: false,
  error: "Error message"
}
```

## Testing

Server actions can be tested directly:

```typescript
import { createUser } from '@/presentation/actions/user/actions';

test('should create user', async t => {
  const result = await createUser({
    email: 'test@example.com',
    name: 'Test User'
  });
  
  t.true(result.success);
  t.truthy(result.data);
});
```

---

**Last Updated**: 2025-01-XX  
**Version**: 2.0.0 (Server Actions Only)
