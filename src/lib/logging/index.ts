// UUID: 12345678-1234-5678-9012-123456789abc
// Simple logger implementation

/**
 * Simple logger utility for development
 * Provides basic logging functionality without external dependencies
 */
export const logger = {
  child: (ctx: Record<string, any>) => ({
    debug: (message: string, meta?: any) => console.debug(message, { ctx, ...meta }),
    info: (message: string, meta?: any) => console.info(message, { ctx, ...meta }),
    warn: (message: string, meta?: any) => console.warn(message, { ctx, ...meta }),
    error: (message: string, meta?: any) => console.error(message, { ctx, ...meta }),
  }),
  debug: (message: string, meta?: any) => console.debug(message, meta),
  info: (message: string, meta?: any) => console.info(message, meta),
  warn: (message: string, meta?: any) => console.warn(message, meta),
  error: (message: string, meta?: any) => console.error(message, meta),
};
