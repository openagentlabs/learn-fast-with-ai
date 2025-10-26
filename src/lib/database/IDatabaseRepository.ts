// UUID: 8f0e1a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b
// Database repository interface for generic CRUD operations

/**
 * Interface for database repository operations
 * Provides a generic interface for CRUD operations on database entities
 * 
 * @template T - The entity type to manage
 */
export interface IDatabaseRepository<T> {
  /**
   * Creates a new entity in the database
   * @param data Entity data to insert
   * @returns Created entity with generated ID
   */
  create(data: Omit<T, 'id'>): Promise<T>;

  /**
   * Retrieves an entity by ID
   * @param id Entity ID to retrieve
   * @returns Entity if found, null otherwise
   */
  getById(id: number): Promise<T | null>;

  /**
   * Retrieves all entities from the database
   * @param limit Optional limit on number of results
   * @param offset Optional offset for pagination
   * @returns Array of entities
   */
  getAll(limit?: number, offset?: number): Promise<T[]>;

  /**
   * Updates an existing entity in the database
   * @param id Entity ID to update
   * @param data Partial data to update
   * @returns Updated entity if found, null otherwise
   */
  update(id: number, data: Partial<T>): Promise<T | null>;

  /**
   * Deletes an entity from the database
   * @param id Entity ID to delete
   * @returns True if deleted, false if not found
   */
  delete(id: number): Promise<boolean>;

  /**
   * Counts total number of entities
   * @returns Total count
   */
  count(): Promise<number>;
}
