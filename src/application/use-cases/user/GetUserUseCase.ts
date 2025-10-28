// UUID: 3456789a-bcdef0-1234-5678-9abcdef01234
// Get user use case

import { injectable, inject } from 'tsyringe';
import { User } from '@/domain/entities/User';
import type { IUserRepository } from '@/domain/interfaces/repositories/IUserRepository';

interface GetUserDTO {
  id: string;
}

/**
 * Get user use case
 * Handles fetching a user by ID
 */
@injectable()
export class GetUserUseCase {
  constructor(
    @inject('IUserRepository') private readonly userRepository: IUserRepository
  ) {}

  /**
   * Execute the get user use case
   * @param dto User ID
   * @returns User entity or null if not found
   */
  async execute(dto: GetUserDTO): Promise<User | null> {
    return await this.userRepository.findById(dto.id);
  }
}

