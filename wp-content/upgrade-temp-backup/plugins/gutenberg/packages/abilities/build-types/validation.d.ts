/**
 * Schema validation for client-side ability input and output schemas using AJV and ajv-formats.
 *
 * This utility provides validation for JSON Schema draft-04.
 * Rules are configured to support the intersection of common rules between JSON Schema draft-04, WordPress (a subset of JSON Schema draft-04),
 * and various providers like OpenAI and Anthropic.
 *
 * @see https://developer.wordpress.org/rest-api/extending-the-rest-api/schema/#json-schema-basics
 */
/**
 * Internal dependencies
 */
import type { ValidationError } from './types';
/**
 * Validates a value against a JSON Schema.
 *
 * @param value The value to validate.
 * @param args  The JSON Schema to validate against.
 * @param param Optional parameter name for error messages.
 * @return True if valid, error message string if invalid.
 */
export declare function validateValueFromSchema(value: any, args: Record<string, any>, param?: string): true | ValidationError;
//# sourceMappingURL=validation.d.ts.map