// UUID: list-users-usecase-uuid-004
// List users use case

import { injectable, inject } from 'tsyringe';
import { User } from '@/domain/entities/User';
import type { IUserRepository } from '@/domain/interfaces/repositories/IUserRepository';

/**
 * List users use case
 * Handles fetching all users
 */
@injectable()
export class ListUsersUseCase {
  constructor(
    @inject('IUserRepository') private readonly userRepository: IUserRepository
  ) {}

  /**
   * Execute the list users use case
   * @returns Array of all user entities
   */
  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}

