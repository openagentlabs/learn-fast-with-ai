// UUID: d1e2f3a4-b5c6-7890-def1-234567890abc
// Tests for Database singleton class

import test from 'ava';
import { Database } from '../Database.js';
import { unlinkSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Test entity interface
interface TestEntity {
  id: number;
  name: string;
  value: number;
}

// Schema for test table
const TEST_SCHEMA = `
  CREATE TABLE IF NOT EXISTS test_entities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    value INTEGER NOT NULL
  );
`;

// Helper function to clean up test database
function cleanupTestDb(dbPath: string) {
  if (existsSync(dbPath)) {
    try {
      unlinkSync(dbPath);
    } catch {
      // Ignore cleanup errors
    }
  }
}

test.beforeEach(() => {
  // Reset singleton instance for clean tests
  (Database as any).instance = null;
});

test('should create singleton instance', t => {
  const db1 = Database.getInstance();
  const db2 = Database.getInstance();
  
  t.is(db1, db2, 'Should return same instance');
});

test('should initialize database with schema', t => {
  const testDbPath = join(__dirname, '../../../../test.db');
  
  // Clean up before test
  cleanupTestDb(testDbPath);
  
  const db = Database.getInstance();
  db.initialize(TEST_SCHEMA);
  
  const connection = db.getConnection();
  const result = connection.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='test_entities'"
  ).get() as { name: string } | undefined;
  
  t.truthy(result, 'Test table should exist');
  t.is(result?.name, 'test_entities', 'Table name should match');
  
  // Clean up after test
  db.close();
  cleanupTestDb(testDbPath);
});

test('should throw error when accessing uninitialized database', t => {
  (Database as any).instance = null;
  const newDb = new (Database as any)();
  
  t.throws(() => {
    newDb.getConnection();
  }, { instanceOf: Error, message: /not initialized/ });
});

test('should query database successfully', t => {
  const db = Database.getInstance();
  const testDbPath = join(__dirname, '../../../../test.db');
  
  cleanupTestDb(testDbPath);
  db.initialize(TEST_SCHEMA);
  
  const connection = db.getConnection();
  connection.prepare('INSERT INTO test_entities (name, value) VALUES (?, ?)').run('Test', 42);
  
  const result = db.query('SELECT * FROM test_entities WHERE id = 1') as TestEntity[];
  
  t.is(result.length, 1, 'Should return one row');
  t.is(result[0].name, 'Test', 'Name should match');
  t.is(result[0].value, 42, 'Value should match');
  
  db.close();
  cleanupTestDb(testDbPath);
});

test('should check table existence', t => {
  const db = Database.getInstance();
  const testDbPath = join(__dirname, '../../../../test.db');
  
  cleanupTestDb(testDbPath);
  db.initialize(TEST_SCHEMA);
  
  const exists = db.tableExists('test_entities');
  
  t.true(exists, 'Table should exist');
  
  db.close();
  cleanupTestDb(testDbPath);
});

test('should close database connection', t => {
  const db = Database.getInstance();
  const testDbPath = join(__dirname, '../../../../test.db');
  
  cleanupTestDb(testDbPath);
  db.initialize(TEST_SCHEMA);
  
  db.close();
  
  // After close, getConnection should throw
  t.throws(() => {
    db.getConnection();
  }, { instanceOf: Error });
  
  cleanupTestDb(testDbPath);
});
