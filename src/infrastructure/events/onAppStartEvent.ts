// UUID: on-app-start-event-uuid-001
// Application start event - registers all dependencies

import 'reflect-metadata';
import { container } from 'tsyringe';
import { logger } from '@/infrastructure/adapters/logging';

// Import Infrastructure Layer
import { firebaseConfig } from '@/infrastructure/adapters/database/firebase/FirebaseConfig';
import { FirebaseUserRepository } from '@/infrastructure/adapters/database/firebase/repositories/FirebaseUserRepository';
import { FirebaseFlashcardRepository } from '@/infrastructure/adapters/database/firebase/repositories/FirebaseFlashcardRepository';
import { GeminiAIModel } from '@/infrastructure/adapters/ai/GeminiAIModel';

// Import Application Layer (Use Cases)
import { CreateUserUseCase } from '@/application/use-cases/user/CreateUserUseCase';
import { GetUserUseCase } from '@/application/use-cases/user/GetUserUseCase';
import { ListUsersUseCase } from '@/application/use-cases/user/ListUsersUseCase';
import { DeleteUserUseCase } from '@/application/use-cases/user/DeleteUserUseCase';
import { UpdateUserUseCase } from '@/application/use-cases/user/UpdateUserUseCase';
import { GenerateFlashcardUseCase } from '@/application/use-cases/flashcard/GenerateFlashcardUseCase';

/**
 * On Application Start Event
 * Called once when the application starts to register all dependencies
 */
let isInitialized = false;

export function onAppStartEvent(): void {
  const eventLogger = logger.child({ event: 'onAppStart' });
  
  // Skip if already initialized
  if (isInitialized) {
    eventLogger.debug('Application already initialized, skipping');
    return;
  }
  
  eventLogger.info('Application start event triggered');

  try {
    // Initialize Firebase
    eventLogger.debug('Initializing Firebase...');
    firebaseConfig.initialize();

    // Register Firebase repositories
    eventLogger.debug('Registering Firebase User Repository...');
    container.registerSingleton('IUserRepository', FirebaseUserRepository);
    
    eventLogger.debug('Registering Firebase Flashcard Repository...');
    container.registerSingleton('IFlashcardRepository', FirebaseFlashcardRepository);

    // Register AI Service
    eventLogger.debug('Registering AI Model Service...');
    container.registerSingleton('IAIModelService', GeminiAIModel);

    // Register Use Cases (classes with @injectable() decorator are auto-discovered)
    eventLogger.debug('Registering Use Cases...');
    container.registerSingleton(CreateUserUseCase);
    container.registerSingleton(GetUserUseCase);
    container.registerSingleton(ListUsersUseCase);
    container.registerSingleton(DeleteUserUseCase);
    container.registerSingleton(UpdateUserUseCase);
    container.registerSingleton(GenerateFlashcardUseCase);

    eventLogger.info('Application start event completed successfully');
    isInitialized = true;
  } catch (error) {
    eventLogger.error('Application start event failed', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

