// UUID: 3e4f5a6b-7c8d-9012-ef34-567890123456
// Flashcard repository interface - domain layer

import { Flashcard } from '@/domain/entities/Flashcard';

/**
 * Flashcard repository interface
 * Defines the contract for flashcard data access
 */
export interface IFlashcardRepository {
  /**
   * Find flashcard by ID
   * @param id Flashcard ID
   * @returns Flashcard entity or null if not found
   */
  findById(id: string): Promise<Flashcard | null>;

  /**
   * Find all flashcards for a user
   * @param userId User ID
   * @returns Array of flashcard entities
   */
  findByUserId(userId: string): Promise<Flashcard[]>;

  /**
   * Get all flashcards
   * @returns Array of flashcard entities
   */
  findAll(): Promise<Flashcard[]>;

  /**
   * Save flashcard (create or update)
   * @param flashcard Flashcard entity
   * @returns Saved flashcard entity
   */
  save(flashcard: Flashcard): Promise<Flashcard>;

  /**
   * Delete flashcard by ID
   * @param id Flashcard ID
   */
  delete(id: string): Promise<void>;
}


