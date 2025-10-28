// UUID: 56789abc-def012-3456-789a-bcdef0123456
// Generate flashcard use case

import { injectable, inject } from 'tsyringe';
import { Flashcard } from '@/domain/entities/Flashcard';
import type { IFlashcardRepository } from '@/domain/interfaces/repositories/IFlashcardRepository';
import type { IAIModelService } from '@/domain/interfaces/services/IAIModelService';
import type { IUserRepository } from '@/domain/interfaces/repositories/IUserRepository';
import type { GenerateFlashcardDTO } from '@/application/dtos/FlashcardDTO';

/**
 * Generate flashcard use case
 * Uses AI to generate flashcard content
 */
@injectable()
export class GenerateFlashcardUseCase {
  constructor(
    @inject('IFlashcardRepository') private readonly flashcardRepository: IFlashcardRepository,
    @inject('IAIModelService') private readonly aiService: IAIModelService,
    @inject('IUserRepository') private readonly userRepository: IUserRepository
  ) {}

  /**
   * Execute the generate flashcard use case
   * @param dto Flashcard generation data
   * @returns Generated flashcard entity
   * @throws Error if user not found or AI generation fails
   */
  async execute(dto: GenerateFlashcardDTO): Promise<Flashcard> {
    // Validate user exists
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate flashcard content using AI
    const prompt = this.buildPrompt(dto.topic, dto.difficulty);
    const response = await this.aiService.generateContent({
      prompt,
      maxTokens: 500,
      temperature: 0.7
    });

    // Parse AI response and create flashcard
    const { front, back } = this.parseAIResponse(response.text);

    // Create and save flashcard
    const flashcard = new Flashcard({
      id: crypto.randomUUID(),
      userId: dto.userId,
      front,
      back,
      difficulty: dto.difficulty,
      createdAt: new Date()
    });

    return await this.flashcardRepository.save(flashcard);
  }

  /**
   * Build AI prompt for flashcard generation
   * @param topic Flashcard topic
   * @param difficulty Flashcard difficulty
   * @returns Generated prompt
   */
  private buildPrompt(topic: string, difficulty: string): string {
    return `Generate a flashcard about ${topic} at ${difficulty} difficulty level.
    Format: FRONT: [front text] BACK: [back text]`;
  }

  /**
   * Parse AI response to extract front and back
   * @param text AI response text
   * @returns Parsed front and back content
   */
  private parseAIResponse(text: string): { front: string; back: string } {
    // Parse AI response to extract front and back
    const regex = /FRONT: (.+?) BACK: (.+)/s;
    const match = regex.exec(text);
    if (!match) {
      throw new Error('Failed to parse AI response');
    }
    return { front: match[1].trim(), back: match[2].trim() };
  }
}

