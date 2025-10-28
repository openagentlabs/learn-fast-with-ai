// UUID: firebase-user-repo-uuid-002
// Firebase User Repository for Firestore

import { injectable } from 'tsyringe';
import admin from 'firebase-admin';
import { User } from '@/domain/entities/User';
import { IUserRepository } from '@/domain/interfaces/repositories/IUserRepository';
import { firebaseConfig } from '../FirebaseConfig';
import { logger } from '@/infrastructure/adapters/logging';

/**
 * Firebase User Repository
 * Implements IUserRepository interface using Firestore
 */
@injectable()
export class FirebaseUserRepository implements IUserRepository {
  private readonly db = firebaseConfig.getFirestore();
  private readonly collectionName = 'users';
  private readonly repoLogger = logger.child({ module: 'FirebaseUserRepository' });

  /**
   * Find user by ID
   * @param id User ID
   * @returns User entity or null if not found
   */
  async findById(id: string): Promise<User | null> {
    this.repoLogger.debug('Finding user by ID', { id });

    try {
      const docRef = await this.db.collection(this.collectionName).doc(id).get();

      if (!docRef.exists) {
        return null;
      }

      return this.mapToEntity({ id: docRef.id, ...docRef.data() });
    } catch (error) {
      this.repoLogger.error('Failed to find user', { error, id });
      throw error;
    }
  }

  /**
   * Find user by email
   * @param email User email
   * @returns User entity or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    this.repoLogger.debug('Finding user by email', { email });

    try {
      const snapshot = await this.db.collection(this.collectionName)
        .where('email', '==', email)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return this.mapToEntity({ id: doc.id, ...doc.data() });
    } catch (error) {
      this.repoLogger.error('Failed to find user by email', { error, email });
      throw error;
    }
  }

  /**
   * Get all users
   * @returns Array of user entities
   */
  async findAll(): Promise<User[]> {
    this.repoLogger.debug('Finding all users');

    try {
      const snapshot = await this.db.collection(this.collectionName).get();
      const users = snapshot.docs.map(doc => 
        this.mapToEntity({ id: doc.id, ...doc.data() })
      );

      this.repoLogger.debug('Found users', { count: users.length });
      return users;
    } catch (error) {
      this.repoLogger.error('Failed to find all users', { error });
      throw error;
    }
  }

  /**
   * Save user (create or update)
   * @param user User entity
   * @returns Saved user entity
   */
  async save(user: User): Promise<User> {
    this.repoLogger.debug('Saving user', { id: user.id });

    try {
      await this.db.collection(this.collectionName).doc(user.id).set({
        email: user.email,
        name: user.name,
        createdAt: admin.firestore.Timestamp.fromDate(user.createdAt),
        updatedAt: user.updatedAt ? admin.firestore.Timestamp.fromDate(user.updatedAt) : null
      }, { merge: true });

      this.repoLogger.info('User saved', { id: user.id });
      return user;
    } catch (error) {
      this.repoLogger.error('Failed to save user', { error });
      throw error;
    }
  }

  /**
   * Delete user by ID
   * @param id User ID
   */
  async delete(id: string): Promise<void> {
    this.repoLogger.debug('Deleting user', { id });

    try {
      await this.db.collection(this.collectionName).doc(id).delete();
      this.repoLogger.info('User deleted', { id });
    } catch (error) {
      this.repoLogger.error('Failed to delete user', { error, id });
      throw error;
    }
  }

  /**
   * Map Firestore document to User entity
   * @param data Document data
   * @returns User entity
   */
  private mapToEntity(data: any): User {
    return new User(
      data.id,
      data.email,
      data.name,
      data.createdAt?.toDate() || new Date(data.createdAt),
      data.updatedAt?.toDate()
    );
  }
}

