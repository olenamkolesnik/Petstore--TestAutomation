import Ajv from 'ajv';
import { logger } from './logger';

const ajv = new Ajv();

export function validateSchema(schema: object, data: any) {
  logger.debug('Schema validation initiated');
  
  try {
    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (!valid) {
      const errors = validate.errors || [];
      logger.error('Schema validation failed', new Error('Schema validation errors'), {
        errorCount: errors.length,
        errors: errors.map(e => ({
          instancePath: e.instancePath,
          schemaPath: e.schemaPath,
          message: e.message,
        })),
      });
      throw new Error(`Schema validation failed: ${JSON.stringify(validate.errors, null, 2)}`);
    }

    logger.debug('Schema validation passed');
  } catch (error) {
    logger.error('Schema validation error', error as Error, { schema });
    throw error;
  }
}
