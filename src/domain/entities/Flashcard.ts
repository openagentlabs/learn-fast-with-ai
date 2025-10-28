// UUID: 9b3c4d5e-6f78-9012-bcde-f12345678901
// Flashcard domain entity with business logic

export interface FlashcardData {
  id: string;
  userId: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Flashcard domain entity
 * Contains core business logic for flashcards
 */
export class Flashcard {
  constructor(private data: FlashcardData) {
    this.validate();
  }

  /**
   * Validate flashcard data
   * @private
   */
  private validate(): void {
    if (!this.data.front || this.data.front.trim().length === 0) {
      throw new Error('Flashcard front cannot be empty');
    }
    if (!this.data.back || this.data.back.trim().length === 0) {
      throw new Error('Flashcard back cannot be empty');
    }
    if (!this.data.difficulty) {
      throw new Error('Flashcard difficulty is required');
    }
  }

  get id(): string { return this.data.id; }
  get userId(): string { return this.data.userId; }
  get front(): string { return this.data.front; }
  get back(): string { return this.data.back; }
  get difficulty(): string { return this.data.difficulty; }
  get createdAt(): Date { return this.data.createdAt; }
  get updatedAt(): Date | undefined { return this.data.updatedAt; }

  /**
   * Update flashcard content
   * @param front New front text
   * @param back New back text
   * @throws Error if front or back is empty
   */
  public updateContent(front: string, back: string): void {
    if (!front || !back) {
      throw new Error('Front and back cannot be empty');
    }
    this.data.front = front;
    this.data.back = back;
    this.data.updatedAt = new Date();
  }

  /**
   * Update flashcard difficulty
   * @param difficulty New difficulty level
   * @throws Error if difficulty is invalid
   */
  public updateDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void {
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      throw new Error('Invalid difficulty level');
    }
    this.data.difficulty = difficulty;
    this.data.updatedAt = new Date();
  }

  /**
   * Get flashcard data
   * @returns Flashcard data object
   */
  public getData(): FlashcardData {
    return { ...this.data };
  }
}


