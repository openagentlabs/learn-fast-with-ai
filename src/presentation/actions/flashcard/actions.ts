// UUID: c2d3e4f5-6789-0a12-3456-789012345678
// Flashcard server actions - primary pattern for browser-to-server communication

'use server';

import { container } from '@/infrastructure/di/Container';
import { GenerateFlashcardUseCase } from '@/application/use-cases/flashcard/GenerateFlashcardUseCase';

export interface GenerateFlashcardInput {
  userId: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

/**
 * Generate flashcard server action
 * Uses AI to generate flashcard content
 * 
 * @param input - Flashcard generation parameters
 * @returns Success response with flashcard data or error
 */
export async function generateFlashcard(input: GenerateFlashcardInput) {
  try {
    const useCase = container.resolve(GenerateFlashcardUseCase);
    const flashcard = await useCase.execute(input);
    
    return {
      success: true,
      data: {
        id: flashcard.id,
        userId: flashcard.userId,
        front: flashcard.front,
        back: flashcard.back,
        difficulty: flashcard.difficulty,
        createdAt: flashcard.createdAt
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate flashcard'
    };
  }
}

