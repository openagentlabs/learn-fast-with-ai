// UUID: firebase-flashcard-repo-uuid-003
// Firebase Flashcard Repository for Firestore

import { injectable } from 'tsyringe';
import admin from 'firebase-admin';
import { Flashcard } from '@/domain/entities/Flashcard';
import { IFlashcardRepository } from '@/domain/interfaces/repositories/IFlashcardRepository';
import { firebaseConfig } from '../FirebaseConfig';
import { logger } from '@/infrastructure/adapters/logging';

/**
 * Firebase Flashcard Repository
 * Implements IFlashcardRepository interface using Firestore
 */
@injectable()
export class FirebaseFlashcardRepository implements IFlashcardRepository {
  private readonly db = firebaseConfig.getFirestore();
  private readonly collectionName = 'flashcards';
  private readonly repoLogger = logger.child({ module: 'FirebaseFlashcardRepository' });

  /**
   * Find flashcard by ID
   * @param id Flashcard ID
   * @returns Flashcard entity or null if not found
   */
  async findById(id: string): Promise<Flashcard | null> {
    this.repoLogger.debug('Finding flashcard by ID', { id });

    try {
      const docRef = await this.db.collection(this.collectionName).doc(id).get();

      if (!docRef.exists) {
        return null;
      }

      return this.mapToEntity({ id: docRef.id, ...docRef.data() });
    } catch (error) {
      this.repoLogger.error('Failed to find flashcard', { error, id });
      throw error;
    }
  }

  /**
   * Find all flashcards for a user
   * @param userId User ID
   * @returns Array of flashcard entities
   */
  async findByUserId(userId: string): Promise<Flashcard[]> {
    this.repoLogger.debug('Finding flashcards by user ID', { userId });

    try {
      const snapshot = await this.db.collection(this.collectionName)
        .where('userId', '==', userId)
        .get();

      const flashcards = snapshot.docs.map(doc =>
        this.mapToEntity({ id: doc.id, ...doc.data() })
      );

      this.repoLogger.debug('Found flashcards', { count: flashcards.length, userId });
      return flashcards;
    } catch (error) {
      this.repoLogger.error('Failed to find flashcards by user ID', { error, userId });
      throw error;
    }
  }

  /**
   * Get all flashcards
   * @returns Array of flashcard entities
   */
  async findAll(): Promise<Flashcard[]> {
    this.repoLogger.debug('Finding all flashcards');

    try {
      const snapshot = await this.db.collection(this.collectionName).get();
      const flashcards = snapshot.docs.map(doc =>
        this.mapToEntity({ id: doc.id, ...doc.data() })
      );

      this.repoLogger.debug('Found flashcards', { count: flashcards.length });
      return flashcards;
    } catch (error) {
      this.repoLogger.error('Failed to find all flashcards', { error });
      throw error;
    }
  }

  /**
   * Save flashcard (create or update)
   * @param flashcard Flashcard entity
   * @returns Saved flashcard entity
   */
  async save(flashcard: Flashcard): Promise<Flashcard> {
    this.repoLogger.debug('Saving flashcard', { id: flashcard.id });

    try {
      const data = flashcard.getData();
      await this.db.collection(this.collectionName).doc(data.id).set({
        userId: data.userId,
        front: data.front,
        back: data.back,
        difficulty: data.difficulty,
        createdAt: admin.firestore.Timestamp.fromDate(data.createdAt),
        updatedAt: data.updatedAt ? admin.firestore.Timestamp.fromDate(data.updatedAt) : null
      }, { merge: true });

      this.repoLogger.info('Flashcard saved', { id: flashcard.id });
      return flashcard;
    } catch (error) {
      this.repoLogger.error('Failed to save flashcard', { error });
      throw error;
    }
  }

  /**
   * Delete flashcard by ID
   * @param id Flashcard ID
   */
  async delete(id: string): Promise<void> {
    this.repoLogger.debug('Deleting flashcard', { id });

    try {
      await this.db.collection(this.collectionName).doc(id).delete();
      this.repoLogger.info('Flashcard deleted', { id });
    } catch (error) {
      this.repoLogger.error('Failed to delete flashcard', { error, id });
      throw error;
    }
  }

  /**
   * Map Firestore document to Flashcard entity
   * @param data Document data
   * @returns Flashcard entity
   */
  private mapToEntity(data: any): Flashcard {
    return new Flashcard({
      id: data.id,
      userId: data.userId,
      front: data.front,
      back: data.back,
      difficulty: data.difficulty,
      createdAt: data.createdAt?.toDate() || new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate()
    });
  }
}


