// UUID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
// Database connection singleton for SQLite

import BetterSqlite3Database from 'better-sqlite3';
import { logger } from '@/lib/logging';
import path from 'node:path';

/**
 * Database singleton class for managing SQLite connections
 * Handles database initialization, connection management, and provides
 * access to the underlying database instance
 */
export class Database {
  private static instance: Database | null = null;
  private db: BetterSqlite3Database.Database | null = null;
  private readonly dbPath: string;
  private readonly dbLogger = logger.child({ module: 'Database' });

  private constructor() {
    // Use environment variable or default path
    const dbDir = process.env.DB_PATH ?? path.join(process.cwd(), 'data');
    this.dbPath = path.join(dbDir, 'app.db');
  }

  /**
   * Gets the singleton instance of Database
   * @returns Database singleton instance
   */
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /**
   * Initializes the database connection
   * Creates database file and tables if they don't exist
   * @param schema SQL schema for table creation
   */
  public initialize(schema: string): void {
    try {
      this.dbLogger.info('Initializing database connection', { path: this.dbPath });

      // Create database directory if it doesn't exist
      const fs = require('fs');
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.dbLogger.info('Created database directory', { path: dir });
      }

      // Connect to database
      this.db = new BetterSqlite3Database(this.dbPath);
      this.db.pragma('journal_mode = WAL'); // Write-Ahead Logging for better concurrency

      // Enable foreign keys
      this.db.pragma('foreign_keys = ON');

      // Create tables if schema provided
      if (schema) {
        this.db.exec(schema);
        this.dbLogger.info('Database schema initialized');
      }

      this.dbLogger.info('Database initialized successfully');
    } catch (error) {
      this.dbLogger.error('Database initialization failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  /**
   * Gets the underlying SQLite database instance
   * @returns SQLite database instance
   * @throws Error if database is not initialized
   */
  public getConnection(): BetterSqlite3Database.Database {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  /**
   * Closes the database connection
   */
  public close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.dbLogger.info('Database connection closed');
    }
  }

  /**
   * Executes a SQL query and returns all results
   * @param sql SQL query string
   * @param params Query parameters
   * @returns Array of result rows
   */
  public query(sql: string, params: any[] = []): any[] {
    const connection = this.getConnection();
    const statement = connection.prepare(sql);
    return statement.all(...params);
  }

  /**
   * Executes a SQL query and returns the first result
   * @param sql SQL query string
   * @param params Query parameters
   * @returns First result row or undefined
   */
  public queryOne(sql: string, params: any[] = []): any {
    const connection = this.getConnection();
    const statement = connection.prepare(sql);
    return statement.get(...params);
  }

  /**
   * Executes a SQL statement (INSERT, UPDATE, DELETE)
   * @param sql SQL statement string
   * @param params Statement parameters
   * @returns Result info object
   */
  public execute(sql: string, params: any[] = []): BetterSqlite3Database.RunResult {
    const connection = this.getConnection();
    const statement = connection.prepare(sql);
    return statement.run(...params);
  }

  /**
   * Checks if a table exists
   * @param tableName Name of the table
   * @returns True if table exists, false otherwise
   */
  public tableExists(tableName: string): boolean {
    const connection = this.getConnection();
    const result = connection.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name=?"
    ).get(tableName);
    return result !== undefined;
  }
}

// Export singleton instance getter
export const getDatabase = () => Database.getInstance();