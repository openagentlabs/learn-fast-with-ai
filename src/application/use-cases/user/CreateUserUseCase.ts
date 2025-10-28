// UUID: 23456789-abcdef-0123-4567-89abcdef0123
// Create user use case

import { injectable, inject } from 'tsyringe';
import { User } from '@/domain/entities/User';
import type { IUserRepository } from '@/domain/interfaces/repositories/IUserRepository';
import type { CreateUserDTO } from '@/application/dtos/CreateUserDTO';

/**
 * Create user use case
 * Handles the business logic for creating a new user
 */
@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('IUserRepository') private readonly userRepository: IUserRepository
  ) {}

  /**
   * Execute the create user use case
   * @param dto User creation data
   * @returns Created user entity
   * @throws Error if user already exists
   */
  async execute(dto: CreateUserDTO): Promise<User> {
    // Check if user already exists
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    // Create user entity
    const user = new User(
      crypto.randomUUID(),
      dto.email,
      dto.name,
      new Date()
    );

    // Save to repository
    return await this.userRepository.save(user);
  }
}

