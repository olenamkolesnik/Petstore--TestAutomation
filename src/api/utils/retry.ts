import { logger } from './logger';

/**
 * Generic retry utility for Playwright API or any async function.
 *
 * @param fn - Function to execute (must return a Promise)
 * @param retries - How many times to retry (default 3)
 * @param delayMs - Delay between retries in milliseconds (default 500ms)
 * @param backoff - Multiply delay by this number each retry (default 1 = disabled)
 * @param retryOn - Optional function to determine whether to retry based on error or result
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 500,
  backoff: number = 1,
  retryOn?: (result: T | undefined, error?: any) => boolean
): Promise<T> {
  let lastError: any = null;
  let lastResult: T | undefined = undefined;

  logger.debug('Retry operation started', { maxRetries: retries, initialDelayMs: delayMs });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      logger.debug(`Retry attempt ${attempt}/${retries}`);
      lastResult = await fn();

      // If custom retry logic was supplied
      if (retryOn && retryOn(lastResult) === true) {
        const retryError = new Error(`Retry condition triggered on attempt ${attempt}`);
        logger.warn(`Custom retry condition triggered on attempt ${attempt}`);
        throw retryError;
      }

      logger.info(`Retry operation succeeded on attempt ${attempt}`);
      return lastResult;
    } catch (err: any) {
      lastError = err;

      // If this was the last attempt → throw
      if (attempt === retries) {
        logger.error(
          `Retry operation failed after ${retries} attempts`,
          lastError,
          { finalAttempt: attempt }
        );
        throw lastError;
      }

      logger.warn(`Attempt ${attempt} failed, retrying...`, {
        error: lastError.message,
        nextDelayMs: delayMs,
      });

      // Delay before next retry
      await new Promise(res => setTimeout(res, delayMs));

      // Apply exponential backoff if enabled
      if (backoff > 1) {
        delayMs *= backoff;
        logger.debug(`Backoff applied, next delay: ${delayMs}ms`);
      }
    }
  }

  // Should never reach this, but TypeScript needs a return
  throw lastError ?? new Error('Retry failed with unknown error');
}
