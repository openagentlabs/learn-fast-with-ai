# Presentation Server Actions

## Overview
Server Actions are the **PRIMARY pattern** for browser-to-server communication in Next.js. They provide type-safe, server-side functions that can be called directly from React components.

## Purpose
- Handle form submissions and mutations
- Perform server-side data operations
- Provide type-safe communication between client and server
- Enable progressive enhancement without JavaScript

## Structure
```
presentation/actions/
├── user/
│   ├── actions.ts       # User server actions
│   └── index.ts
├── flashcard/
│   ├── actions.ts       # Flashcard server actions
│   └── index.ts
└── index.ts             # Aggregate exports
```

## Usage Pattern

### In React Components

```typescript
// src/app/(pages)/users/page.tsx
'use client';

import { useState } from 'react';
import { createUser } from '@/presentation/actions/user/actions';

export default function UserPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const result = await createUser({ email, name });
    
    if (result.success) {
      console.log('User created:', result.data);
    } else {
      console.error('Error:', result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input value={name} onChange={e => setName(e.target.value)} />
      <button type="submit">Create User</button>
    </form>
  );
}
```

### In Form Actions

```typescript
// src/app/(pages)/users/page.tsx (Server Component)
import { createUser } from '@/presentation/actions/user/actions';

export default function UserPage() {
  return (
    <form action={createUser}>
      <input name="email" type="email" required />
      <input name="name" type="text" required />
      <button type="submit">Create User</button>
    </form>
  );
}
```

## Design Principles

1. **Type Safety**: Full end-to-end type checking from client to server
2. **Server-First**: Actions run on the server, not client
3. **Progressive Enhancement**: Works without JavaScript
4. **DI Integration**: Uses container.resolve() for use cases
5. **Consistent Responses**: Always return { success, data/error }

## Response Format

All actions return a consistent response format:

```typescript
// Success
{
  success: true,
  data: { /* result data */ }
}

// Error
{
  success: false,
  error: 'Error message'
}
```

## Testing

Actions can be tested independently:

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

## When to Use Server Actions

✅ **Use for:**
- Form submissions
- Data mutations (create, update, delete)
- Page data fetching
- User interactions
- Any browser-to-server communication

❌ **Don't use for:**
- External API consumers (use API routes)
- Webhooks (use API routes)
- Mobile app backends (use API routes)

## Architecture Flow

```
Client Component
    ↓
Server Action (this layer)
    ↓
Use Case (application layer)
    ↓
Repository (infrastructure layer)
    ↓
Response
```

## Benefits

✅ **Type-safe end-to-end**  
✅ **No API layer needed**  
✅ **Automatic revalidation**  
✅ **Progressive enhancement**  
✅ **Better developer experience**  
✅ **Server-first execution**

## Default Policy

**Server Actions are the DEFAULT and PRIMARY pattern for all browser-to-server communication. Only use API routes when explicitly required for external consumers.**

