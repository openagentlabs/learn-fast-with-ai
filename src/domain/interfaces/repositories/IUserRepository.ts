// UUID: 2d3e4f5a-6b7c-8901-def2-345678901234
// User repository interface - domain layer

import { User } from '@/domain/entities/User';

/**
 * User repository interface
 * Defines the contract for user data access
 */
export interface IUserRepository {
  /**
   * Find user by ID
   * @param id User ID
   * @returns User entity or null if not found
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find user by email
   * @param email User email
   * @returns User entity or null if not found
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Get all users
   * @returns Array of user entities
   */
  findAll(): Promise<User[]>;

  /**
   * Save user (create or update)
   * @param user User entity
   * @returns Saved user entity
   */
  save(user: User): Promise<User>;

  /**
   * Delete user by ID
   * @param id User ID
   */
  delete(id: string): Promise<void>;
}


