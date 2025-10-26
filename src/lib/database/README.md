# Database Module

## Overview
Provides SQLite database management with the repository pattern for CRUD operations. This module includes a singleton database connection manager and a generic repository implementation that works with any entity type.

## Purpose
- **Centralized Database Management**: Single source of truth for database connections
- **Repository Pattern**: Generic CRUD operations that work with any entity type
- **Type Safety**: Full TypeScript support with generic types
- **Easy Testing**: Isolated database operations for unit testing

## Usage Examples

### Basic Setup

```typescript
import { Database } from '@/lib/database';

// Initialize database with schema
const db = Database.getInstance();
const schema = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    age INTEGER
  );
`;
db.initialize(schema);
```

### Using the Repository Pattern

```typescript
import { CrudRepository } from '@/lib/database';

// Define your entity type
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Create a repository for your entity
const userRepo = CrudRepository.create<User>({
  tableName: 'users',
  primaryKey: 'id' // optional, defaults to 'id'
});

// Perform CRUD operations
const newUser = await userRepo.create({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});

const user = await userRepo.getById(newUser.id);
const allUsers = await userRepo.getAll();
const updatedUser = await userRepo.update(newUser.id, { age: 31 });
const deleted = await userRepo.delete(newUser.id);
const count = await userRepo.count();
```

## API Reference

### Database Class

Singleton class for managing SQLite database connections.

#### Methods

- `getInstance()`: Get singleton database instance
- `initialize(schema: string)`: Initialize database with schema
- `getConnection()`: Get the underlying SQLite database instance
- `close()`: Close database connection
- `query(sql, params)`: Execute query and return all results
- `queryOne(sql, params)`: Execute query and return first result
- `execute(sql, params)`: Execute SQL statement
- `tableExists(tableName)`: Check if table exists

### CrudRepository Class

Generic CRUD repository implementation.

#### Methods

- `create(data)`: Create new entity
- `getById(id)`: Get entity by ID
- `getAll(limit?, offset?)`: Get all entities with optional pagination
- `update(id, data)`: Update entity
- `delete(id)`: Delete entity
- `count()`: Count total entities

## Configuration

The database is stored in `data/app.db` by default. You can change the location using the `DB_PATH` environment variable.

## Integration Points

- **AppConfig**: Uses app configuration for database path
- **Logging**: Uses logger for all database operations
- **Testing**: Includes comprehensive test suite

## Error Handling

All database operations include error handling and logging. Errors are rethrown with full context for debugging.

## Testing

Run the database tests:

```bash
npx ava src/lib/database/tests/Database.test.ts
npx ava src/lib/database/tests/CrudRepository.test.ts
```

Tests include:
- Singleton pattern verification
- Database initialization
- Schema creation
- CRUD operations
- Error handling
- Edge cases

## Best Practices

1. **Initialize Early**: Initialize database in app startup hook
2. **Use Type Safety**: Always define entity interfaces with proper types
3. **Handle Errors**: Wrap database operations in try-catch blocks
4. **Close Connections**: Call `close()` when shutting down the app
5. **Use Transactions**: For multi-step operations, use database transactions
6. **Test Coverage**: Write tests for all repository operations

## Architecture

- **Singleton Pattern**: Ensures single database connection across the app
- **Repository Pattern**: Provides clean abstraction for data access
- **Generic Types**: Works with any entity type without code duplication
- **Dependency Injection**: Repository can be easily mocked for testing
