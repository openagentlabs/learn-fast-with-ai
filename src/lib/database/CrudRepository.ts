// UUID: b2c3d4e5-f6a7-8901-bcde-f123456789ab
// CRUD repository implementation using the repository pattern

import { IDatabaseRepository } from './IDatabaseRepository';
import { logger } from '@/lib/logging';
import { Database } from './Database';

/**
 * Configuration interface for CRUD repository
 */
export interface CrudRepositoryConfig {
  tableName: string;
  primaryKey?: string;
}

/**
 * Generic CRUD repository implementation
 * Provides complete CRUD operations for any entity type
 * 
 * @template T - The entity type to manage (must have an 'id' property)
 */
export class CrudRepository<T extends { id: number }> implements IDatabaseRepository<T> {
  private readonly tableName: string;
  private readonly primaryKey: string;
  private readonly repositoryLogger = logger.child({ module: 'CrudRepository', table: '' });

  /**
   * Creates a new CRUD repository instance
   * @param config Configuration object with table name and primary key
   */
  private constructor(config: CrudRepositoryConfig) {
    this.tableName = config.tableName;
    this.primaryKey = config.primaryKey ?? 'id';
    this.repositoryLogger = logger.child({ module: 'CrudRepository', table: this.tableName });
  }

  /**
   * Factory method to create a CRUD repository instance
   * @param config Configuration object with table name and primary key
   * @returns New CrudRepository instance
   */
  public static create<T extends { id: number }>(config: CrudRepositoryConfig): CrudRepository<T> {
    return new CrudRepository<T>(config);
  }

  /**
   * Creates a new entity in the database
   * @param data Entity data to insert (excluding id)
   * @returns Created entity with generated ID
   */
  async create(data: Omit<T, 'id'>): Promise<T> {
    this.repositoryLogger.debug('Creating new entity', { data });

    const db = Database.getInstance().getConnection();
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map(() => '?').join(', ');

    const sql = `
      INSERT INTO ${this.tableName} (${columns.join(', ')})
      VALUES (${placeholders})
    `;

    try {
      const result = db.prepare(sql).run(...values);
      const createdId = result.lastInsertRowid as number;

      this.repositoryLogger.info('Entity created successfully', { id: createdId });

      return {
        ...data,
        id: createdId ?? 0
      } as T;
    } catch (error) {
      this.repositoryLogger.error('Failed to create entity', {
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  /**
   * Retrieves an entity by ID
   * @param id Entity ID to retrieve
   * @returns Entity if found, null otherwise
   */
  async getById(id: number): Promise<T | null> {
    this.repositoryLogger.debug('Getting entity by ID', { id });

    const db = Database.getInstance().getConnection();
    const sql = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;

    try {
      const result = db.prepare(sql).get(id) as T | undefined;
      return result ?? null;
    } catch (error) {
      this.repositoryLogger.error('Failed to get entity by ID', {
        id,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  /**
   * Retrieves all entities from the database
   * @param limit Optional limit on number of results
   * @param offset Optional offset for pagination
   * @returns Array of entities
   */
  async getAll(limit?: number, offset?: number): Promise<T[]> {
    this.repositoryLogger.debug('Getting all entities', { limit, offset });

    const db = Database.getInstance().getConnection();
    let sql = `SELECT * FROM ${this.tableName}`;

    const params: any[] = [];
    if (limit !== undefined) {
      sql += ' LIMIT ?';
      params.push(limit);
      if (offset !== undefined) {
        sql += ' OFFSET ?';
        params.push(offset);
      }
    }

    try {
      const results = db.prepare(sql).all(...params) as T[];
      this.repositoryLogger.debug('Retrieved entities', { count: results.length });
      return results;
    } catch (error) {
      this.repositoryLogger.error('Failed to get all entities', {
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  /**
   * Updates an existing entity in the database
   * @param id Entity ID to update
   * @param data Partial data to update
   * @returns Updated entity if found, null otherwise
   */
  async update(id: number, data: Partial<T>): Promise<T | null> {
    this.repositoryLogger.debug('Updating entity', { id, data });

    const db = Database.getInstance().getConnection();
    const columns = Object.keys(data).filter(key => key !== this.primaryKey);
    const values = Object.values(data);

    if (columns.length === 0) {
      this.repositoryLogger.warn('No columns to update', { id });
      return this.getById(id);
    }

    const setClause = columns.map(col => `${col} = ?`).join(', ');
    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE ${this.primaryKey} = ?`;

    try {
      db.prepare(sql).run(...values, id);
      this.repositoryLogger.info('Entity updated successfully', { id });
      return this.getById(id);
    } catch (error) {
      this.repositoryLogger.error('Failed to update entity', {
        id,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  /**
   * Deletes an entity from the database
   * @param id Entity ID to delete
   * @returns True if deleted, false if not found
   */
  async delete(id: number): Promise<boolean> {
    this.repositoryLogger.debug('Deleting entity', { id });

    const db = Database.getInstance().getConnection();
    const sql = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;

    try {
      const result = db.prepare(sql).run(id);
      const deleted = result.changes > 0;
      this.repositoryLogger.info(deleted ? 'Entity deleted successfully' : 'Entity not found', { id });
      return deleted;
    } catch (error) {
      this.repositoryLogger.error('Failed to delete entity', {
        id,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  /**
   * Counts total number of entities
   * @returns Total count
   */
  async count(): Promise<number> {
    this.repositoryLogger.debug('Counting entities');

    const db = Database.getInstance().getConnection();
    const sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;

    try {
      const result = db.prepare(sql).get() as { count: number };
      return result.count;
    } catch (error) {
      this.repositoryLogger.error('Failed to count entities', {
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
}
