// packages/abilities/src/validation.ts
import Ajv from "ajv-draft-04";
import addFormats from "ajv-formats";
var ajv = new Ajv({
  coerceTypes: false,
  // No type coercion - AI should send proper JSON
  useDefaults: true,
  removeAdditional: false,
  // Keep additional properties
  allErrors: true,
  verbose: true,
  allowUnionTypes: true
  // Allow anyOf without explicit type
});
addFormats(ajv, ["date-time", "email", "hostname", "ipv4", "ipv6", "uuid"]);
function formatAjvError(ajvError, param) {
  const instancePath = ajvError.instancePath ? ajvError.instancePath.replace(/\//g, "][").replace(/^\]\[/, "[") + "]" : "";
  const fullParam = param + instancePath;
  switch (ajvError.keyword) {
    case "type":
      return `${fullParam} is not of type ${ajvError.params.type}.`;
    case "required":
      return `${ajvError.params.missingProperty} is a required property of ${fullParam}.`;
    case "additionalProperties":
      return `${ajvError.params.additionalProperty} is not a valid property of Object.`;
    case "enum":
      const enumValues = ajvError.params.allowedValues.map(
        (v) => typeof v === "string" ? v : JSON.stringify(v)
      ).join(", ");
      return ajvError.params.allowedValues.length === 1 ? `${fullParam} is not ${enumValues}.` : `${fullParam} is not one of ${enumValues}.`;
    case "pattern":
      return `${fullParam} does not match pattern ${ajvError.params.pattern}.`;
    case "format":
      const format = ajvError.params.format;
      const formatMessages = {
        email: "Invalid email address.",
        "date-time": "Invalid date.",
        uuid: `${fullParam} is not a valid UUID.`,
        ipv4: `${fullParam} is not a valid IP address.`,
        ipv6: `${fullParam} is not a valid IP address.`,
        hostname: `${fullParam} is not a valid hostname.`
      };
      return formatMessages[format] || `Invalid ${format}.`;
    case "minimum":
    case "exclusiveMinimum":
      return ajvError.keyword === "exclusiveMinimum" ? `${fullParam} must be greater than ${ajvError.params.limit}` : `${fullParam} must be greater than or equal to ${ajvError.params.limit}`;
    case "maximum":
    case "exclusiveMaximum":
      return ajvError.keyword === "exclusiveMaximum" ? `${fullParam} must be less than ${ajvError.params.limit}` : `${fullParam} must be less than or equal to ${ajvError.params.limit}`;
    case "multipleOf":
      return `${fullParam} must be a multiple of ${ajvError.params.multipleOf}.`;
    case "anyOf":
    case "oneOf":
      return `${fullParam} is invalid (failed ${ajvError.keyword} validation).`;
    case "minLength":
      return `${fullParam} must be at least ${ajvError.params.limit} character${ajvError.params.limit === 1 ? "" : "s"} long.`;
    case "maxLength":
      return `${fullParam} must be at most ${ajvError.params.limit} character${ajvError.params.limit === 1 ? "" : "s"} long.`;
    case "minItems":
      return `${fullParam} must contain at least ${ajvError.params.limit} item${ajvError.params.limit === 1 ? "" : "s"}.`;
    case "maxItems":
      return `${fullParam} must contain at most ${ajvError.params.limit} item${ajvError.params.limit === 1 ? "" : "s"}.`;
    case "uniqueItems":
      return `${fullParam} has duplicate items.`;
    case "minProperties":
      return `${fullParam} must contain at least ${ajvError.params.limit} propert${ajvError.params.limit === 1 ? "y" : "ies"}.`;
    case "maxProperties":
      return `${fullParam} must contain at most ${ajvError.params.limit} propert${ajvError.params.limit === 1 ? "y" : "ies"}.`;
    default:
      return ajvError.message || `${fullParam} is invalid (failed ${ajvError.keyword} validation).`;
  }
}
function validateValueFromSchema(value, args, param = "") {
  if (!args || typeof args !== "object") {
    console.warn(`Schema must be an object. Received ${typeof args}.`);
    return true;
  }
  if (!args.type && !args.anyOf && !args.oneOf) {
    console.warn(
      `The "type" schema keyword for ${param || "value"} is required.`
    );
    return true;
  }
  try {
    const { default: defaultValue, ...schemaWithoutDefault } = args;
    const validate = ajv.compile(schemaWithoutDefault);
    const valid = validate(value === void 0 ? defaultValue : value);
    if (valid) {
      return true;
    }
    if (validate.errors && validate.errors.length > 0) {
      const anyOfError = validate.errors.find(
        (e) => e.keyword === "anyOf" || e.keyword === "oneOf"
      );
      if (anyOfError) {
        return formatAjvError(anyOfError, param);
      }
      return formatAjvError(validate.errors[0], param);
    }
    return `${param} is invalid.`;
  } catch (error) {
    console.error("Schema compilation error:", error);
    return "Invalid schema provided for validation.";
  }
}
export {
  validateValueFromSchema
};
//# sourceMappingURL=validation.mjs.map
