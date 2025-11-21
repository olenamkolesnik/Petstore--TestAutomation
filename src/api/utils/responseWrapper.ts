import { APIResponse } from '@playwright/test';
import { validateSchema } from './schemaValidator';
import { ApiResponseWrapper } from '../models/ApiResponseWrapper';
import { logger } from './logger';

export async function wrapResponse<T>(
  response: APIResponse,
  schema?: object
): Promise<ApiResponseWrapper<T>> {

  logger.debug('Wrapping API response', { 
    status: response.status(),
    statusText: response.statusText(),
    hasSchema: !!schema
  });

  try {
    const body = await response.json();

    logger.debug('Response body parsed', { bodyKeys: Object.keys(body) });

    if (schema) {
      logger.debug('Validating response against schema');
      validateSchema(schema, body);
      logger.info('Schema validation passed');
    }

    const wrappedResponse = new ApiResponseWrapper<T>(
      response.status(),
      response.ok(),
      body
    );

    logger.debug('Response wrapped successfully', { 
      status: wrappedResponse.status,
      ok: wrappedResponse.ok
    });

    return wrappedResponse;
  } catch (error) {
    logger.error(
      'Error wrapping response',
      error as Error,
      { status: response.status() }
    );
    throw error;
  }
}
