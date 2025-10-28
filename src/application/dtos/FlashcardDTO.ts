// UUID: 0f123456-789a-bcde-f012-3456789abcde
// Flashcard DTOs for application layer

/**
 * DTO for creating a flashcard
 */
export interface CreateFlashcardDTO {
  userId: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

/**
 * DTO for generating a flashcard with AI
 */
export interface GenerateFlashcardDTO {
  userId: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

/**
 * DTO for flashcard data
 */
export interface FlashcardDTO {
  id: string;
  userId: string;
  front: string;
  back: string;
  difficulty: string;
  createdAt: Date;
  updatedAt?: Date;
}


