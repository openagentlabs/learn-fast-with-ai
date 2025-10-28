// UUID: 8a2b3c4d-5e6f-7890-abcd-ef1234567890
// User domain entity with business logic

/**
 * User domain entity
 * Contains core business logic for user management
 */
export class User {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public createdAt: Date,
    public updatedAt?: Date
  ) {
    this.validate();
  }

  /**
   * Validate user data
   * @private
   */
  private validate(): void {
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Invalid email address');
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
  }

  /**
   * Check if email is valid
   * @param email Email to validate
   * @returns True if email is valid
   */
  private isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Update user name
   * @param newName New name for user
   * @throws Error if name is invalid
   */
  public updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    this.name = newName;
    this.updatedAt = new Date();
  }

  /**
   * Update user email
   * @param newEmail New email for user
   * @throws Error if email is invalid
   */
  public updateEmail(newEmail: string): void {
    if (!this.isValidEmail(newEmail)) {
      throw new Error('Invalid email address');
    }
    this.email = newEmail;
    this.updatedAt = new Date();
  }
}


