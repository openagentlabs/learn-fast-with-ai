// UUID: e2f3a4b5-c6d7-8901-ef23-456789abc012
// Tests for CrudRepository generic class

import test from 'ava';
import { CrudRepository } from '../CrudRepository.js';
import { Database } from '../Database.js';
import { join } from 'node:path';
import { existsSync, unlinkSync } from 'node:fs';

// Test entity interface
interface TestEntity {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Test schema
const TEST_SCHEMA = `
  CREATE TABLE IF NOT EXISTS test_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    age INTEGER NOT NULL
  );
`;

// Helper to cleanup
function cleanupTestDb(dbPath: string) {
  if (existsSync(dbPath)) {
    try {
      unlinkSync(dbPath);
    } catch {
      // Ignore errors
    }
  }
}

test.beforeEach(async t => {
  // Initialize database before each test
  const db = Database.getInstance();
  db.initialize(TEST_SCHEMA);
  
  // Clean up old data
  const connection = db.getConnection();
  connection.prepare('DELETE FROM test_users').run();
  
  (Database as any).instance = null;
});

test('should create repository instance', t => {
  const db = Database.getInstance();
  const testDbPath = join(__dirname, '../../../../test.db');
  
  cleanupTestDb(testDbPath);
  db.initialize(TEST_SCHEMA);
  
  const repo = CrudRepository.create<TestEntity>({
    tableName: 'test_users'
  });
  
  t.truthy(repo, 'Repository should be created');
  
  db.close();
  cleanupTestDb(testDbPath);
});

test('should create entity successfully', async t => {
  const db = Database.getInstance();
  const testDbPath = join(__dirname, '../../../../test.db');
  
  cleanupTestDb(testDbPath);
  db.initialize(TEST_SCHEMA);
  
  const repo = CrudRepository.create<TestEntity>({
    tableName: 'test_users'
  });
  
  const entity = await repo.create({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  });
  
  t.truthy(entity.id, 'Entity should have ID');
  t.is(entity.name, 'John Doe', 'Name should match');
  t.is(entity.email, 'john@example.com', 'Email should match');
  t.is(entity.age, 30, 'Age should match');
  
  db.close();
  cleanupTestDb(testDbPath);
});

test('should get entity by ID', async t => {
  const db = Database.getInstance();
  const testDbPath = join(__dirname, '../../../../test.db');
  
  cleanupTestDb(testDbPath);
  db.initialize(TEST_SCHEMA);
  
  const repo = CrudRepository.create<TestEntity>({
    tableName: 'test_users'
  });
  
  const created = await repo.create({
    name: 'Jane Doe',
    email: 'jane@example.com',
    age: 25
  });
  
  const found = await repo.getById(created.id);
  
  t.truthy(found, 'Entity should be found');
  t.is(found?.name, 'Jane Doe', 'Name should match');
  t.is(found?.email, 'jane@example.com', 'Email should match');
  
  db.close();
  cleanupTestDb(testDbPath);
});

test('should return null when entity not found', async t => {
  const db = Database.getInstance();
  const testDbPath = join(__dirname, '../../../../test.db');
  
  cleanupTestDb(testDbPath);
  db.initialize(TEST_SCHEMA);
  
  const repo = CrudRepository.create<TestEntity>({
    tableName: 'test_users'
  });
  
  const found = await repo.getById(999);
  
  t.is(found, null, 'Should return null when not found');
  
  db.close();
  cleanupTestDb(testDbPath);
});

test('should get all entities', async t => {
  const db = Database.getInstance();
  const testDbPath = join(__dirname, '../../../../test.db');
  
  cleanupTestDb(testDbPath);
  db.initialize(TEST_SCHEMA);
  
  const repo = CrudRepository.create<TestEntity>({
    tableName: 'test_users'
  });
  
  await repo.create({ name: 'User 1', email: 'user1@example.com', age: 20 });
  await repo.create({ name: 'User 2', email: 'user2@example.com', age: 30 });
  await repo.create({ name: 'User 3', email: 'user3@example.com', age: 40 });
  
  const all = await repo.getAll();
  
  t.is(all.length, 3, 'Should retrieve all entities');
  
  db.close();
  cleanupTestDb(testDbPath);
});

test('should get entities with limit', async t => {
  const db = Database.getInstance();
  const testDbPath = join(__dirname, '../../../../test.db');
  
  cleanupTestDb(testDbPath);
  db.initialize(TEST_SCHEMA);
  
  const repo = CrudRepository.create<TestEntity>({
    tableName: 'test_users'
  });
  
  await repo.create({ name: 'User 1', email: 'user1@example.com', age: 20 });
  await repo.create({ name: 'User 2', email: 'user2@example.com', age: 30 });
  await repo.create({ name: 'User 3', email: 'user3@example.com', age: 40 });
  
  const limited = await repo.getAll(2);
  
  t.is(limited.length, 2, 'Should respect limit');
  
  db.close();
  cleanupTestDb(testDbPath);
});

test('should update entity successfully', async t => {
  const db = Database.getInstance();
  const testDbPath = join(__dirname, '../../../../test.db');
  
  cleanupTestDb(testDbPath);
  db.initialize(TEST_SCHEMA);
  
  const repo = CrudRepository.create<TestEntity>({
    tableName: 'test_users'
  });
  
  const created = await repo.create({
    name: 'Original Name',
    email: 'original@example.com',
    age: 20
  });
  
  const updated = await repo.update(created.id, {
    name: 'Updated Name',
    age: 25
  });
  
  t.truthy(updated, 'Entity should be updated');
  t.is(updated?.name, 'Updated Name', 'Name should be updated');
  t.is(updated?.email, 'original@example.com', 'Email should remain unchanged');
  t.is(updated?.age, 25, 'Age should be updated');
  
  db.close();
  cleanupTestDb(testDbPath);
});

test('should delete entity successfully', async t => {
  const db = Database.getInstance();
  const testDbPath = join(__dirname, '../../../../test.db');
  
  cleanupTestDb(testDbPath);
  db.initialize(TEST_SCHEMA);
  
  const repo = CrudRepository.create<TestEntity>({
    tableName: 'test_users'
  });
  
  const created = await repo.create({
    name: 'To Delete',
    email: 'delete@example.com',
    age: 30
  });
  
  const deleted = await repo.delete(created.id);
  t.true(deleted, 'Should return true when deleted');
  
  const found = await repo.getById(created.id);
  t.is(found, null, 'Entity should no longer exist');
  
  db.close();
  cleanupTestDb(testDbPath);
});

test('should return false when deleting non-existent entity', async t => {
  const db = Database.getInstance();
  const testDbPath = join(__dirname, '../../../../test.db');
  
  cleanupTestDb(testDbPath);
  db.initialize(TEST_SCHEMA);
  
  const repo = CrudRepository.create<TestEntity>({
    tableName: 'test_users'
  });
  
  const deleted = await repo.delete(999);
  
  t.false(deleted, 'Should return false when not found');
  
  db.close();
  cleanupTestDb(testDbPath);
});

test('should count entities', async t => {
  const db = Database.getInstance();
  const testDbPath = join(__dirname, '../../../../test.db');
  
  cleanupTestDb(testDbPath);
  db.initialize(TEST_SCHEMA);
  
  const repo = CrudRepository.create<TestEntity>({
    tableName: 'test_users'
  });
  
  let count = await repo.count();
  t.is(count, 0, 'Initial count should be 0');
  
  await repo.create({ name: 'User 1', email: 'user1@example.com', age: 20 });
  await repo.create({ name: 'User 2', email: 'user2@example.com', age: 30 });
  
  count = await repo.count();
  t.is(count, 2, 'Count should be 2');
  
  db.close();
  cleanupTestDb(testDbPath);
});
