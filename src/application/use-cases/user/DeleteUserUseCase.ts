// UUID: delete-user-usecase-uuid-005
// Delete user use case

import { injectable, inject } from 'tsyringe';
import type { IUserRepository } from '@/domain/interfaces/repositories/IUserRepository';

interface DeleteUserDTO {
  id: string;
}

/**
 * Delete user use case
 * Handles deleting a user by ID
 */
@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject('IUserRepository') private readonly userRepository: IUserRepository
  ) {}

  /**
   * Execute the delete user use case
   * @param dto User ID
   */
  async execute(dto: DeleteUserDTO): Promise<void> {
    await this.userRepository.delete(dto.id);
  }
}

