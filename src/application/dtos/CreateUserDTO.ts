// UUID: 9e0f1234-5678-9abc-def0-123456789abc
// User DTOs for application layer

/**
 * DTO for creating a user
 */
export interface CreateUserDTO {
  email: string;
  name: string;
}

/**
 * DTO for user data
 */
export interface UserDTO {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt?: Date;
}


