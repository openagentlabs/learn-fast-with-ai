// UUID: update-user-usecase-uuid-006
// Update user use case

import { injectable, inject } from 'tsyringe';
import { User } from '@/domain/entities/User';
import type { IUserRepository } from '@/domain/interfaces/repositories/IUserRepository';
import type { UpdateUserDTO } from '@/application/dtos/UpdateUserDTO';

/**
 * Update user use case
 * Handles the business logic for updating an existing user
 */
@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject('IUserRepository') private readonly userRepository: IUserRepository
  ) {}

  /**
   * Execute the update user use case
   * @param dto User update data
   * @returns Updated user entity
   * @throws Error if user not found
   */
  async execute(dto: UpdateUserDTO): Promise<User> {
    // Find existing user
    const existing = await this.userRepository.findById(dto.id);
    if (!existing) {
      throw new Error('User not found');
    }

    // Check if email is being changed and if new email already exists
    if (existing.email !== dto.email) {
      const emailExists = await this.userRepository.findByEmail(dto.email);
      if (emailExists) {
        throw new Error('Email already in use by another user');
      }
    }

    // Update user entity
    existing.updateEmail(dto.email);
    existing.updateName(dto.name);

    // Save to repository
    return await this.userRepository.save(existing);
  }
}

