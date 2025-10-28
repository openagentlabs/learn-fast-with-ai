// UUID: b1c2d3e4-5678-9f01-2345-678901234567
// User server actions - primary pattern for browser-to-server communication

'use server';

import { container } from '@/infrastructure/di/Container';
import { onAppStartEvent } from '@/infrastructure/events';
import { CreateUserUseCase } from '@/application/use-cases/user/CreateUserUseCase';
import { GetUserUseCase } from '@/application/use-cases/user/GetUserUseCase';
import { ListUsersUseCase } from '@/application/use-cases/user/ListUsersUseCase';
import { DeleteUserUseCase } from '@/application/use-cases/user/DeleteUserUseCase';
import { UpdateUserUseCase } from '@/application/use-cases/user/UpdateUserUseCase';
import { UpdateUserDTO } from '@/application/dtos/UpdateUserDTO';

// Lazy initialization of DI container
function ensureInitialized() {
  try {
    // Check if IUserRepository is already registered
    const isRegistered = (container as any)._registry?.has('IUserRepository');
    if (isRegistered) {
      return;
    }
    // If not registered, run the initialization
    onAppStartEvent();
  } catch (error) {
    console.error('Failed to initialize DI container in server action:', error);
  }
}

export interface CreateUserInput {
  email: string;
  name: string;
}

export interface GetUserInput {
  id: string;
}

export interface DeleteUserInput {
  id: string;
}

export interface UpdateUserInput {
  id: string;
  email: string;
  name: string;
}

/**
 * Create user server action
 * Used by form submissions and client components
 * 
 * @param input - User creation data
 * @returns Success response with user data or error
 */
export async function createUser(input: CreateUserInput) {
  ensureInitialized();
  try {
    const useCase = container.resolve(CreateUserUseCase);
    const user = await useCase.execute(input);
    
    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user'
    };
  }
}

/**
 * Get user server action
 * Retrieves a user by ID
 * 
 * @param input - User ID
 * @returns Success response with user data or error
 */
export async function getUser(input: GetUserInput) {
  ensureInitialized();
  try {
    const useCase = container.resolve(GetUserUseCase);
    const user = await useCase.execute(input);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get user'
    };
  }
}

/**
 * List all users server action
 * Retrieves all users
 * 
 * @returns Success response with array of user data or error
 */
export async function listUsers() {
  ensureInitialized();
  try {
    const useCase = container.resolve(ListUsersUseCase);
    const users = await useCase.execute();
    
    return {
      success: true,
      data: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list users'
    };
  }
}

/**
 * Delete user server action
 * Deletes a user by ID
 * 
 * @param input - User ID
 * @returns Success response or error
 */
export async function deleteUser(input: DeleteUserInput) {
  ensureInitialized();
  try {
    const useCase = container.resolve(DeleteUserUseCase);
    await useCase.execute(input);
    
    return {
      success: true,
      message: 'User deleted successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete user'
    };
  }
}

/**
 * Update user server action
 * Updates an existing user
 * 
 * @param input - User update data
 * @returns Success response with updated user data or error
 */
export async function updateUser(input: UpdateUserInput) {
  ensureInitialized();
  try {
    const useCase = container.resolve(UpdateUserUseCase);
    const dto: UpdateUserDTO = {
      id: input.id,
      email: input.email,
      name: input.name
    };
    
    const user = await useCase.execute(dto);
    
    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user'
    };
  }
}

