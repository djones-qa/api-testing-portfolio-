import Ajv, { JSONSchemaType } from 'ajv';

const ajv = new Ajv();

/**
 * Validates a JSON payload against a given AJV schema.
 * Throws a descriptive error if validation fails.
 */
export function validateSchema<T>(data: unknown, schema: JSONSchemaType<T>): void {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    const errors = ajv.errorsText(validate.errors);
    throw new Error(`Schema validation failed: ${errors}`);
  }
}
