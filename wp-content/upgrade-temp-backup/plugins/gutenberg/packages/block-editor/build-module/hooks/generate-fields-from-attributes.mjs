// packages/block-editor/src/hooks/generate-fields-from-attributes.js
function generateFieldsFromAttributes(attributes) {
  const fields = [];
  const fieldIds = [];
  Object.entries(attributes).forEach(([name, def]) => {
    if (!def.autoGenerateControl) {
      return;
    }
    const field = createFieldFromAttribute(name, def);
    if (field) {
      fields.push(field);
      fieldIds.push(name);
    }
  });
  return {
    fields,
    form: { fields: fieldIds }
  };
}
function createFieldFromAttribute(name, def) {
  const type = def.type;
  const field = {
    id: name,
    label: def.label || name,
    // Only 'string' needs mapping to 'text'; others are 1:1 with DataForm types.
    // This mapping will be unnecessary once #74105 lands.
    type: type === "string" ? "text" : type
  };
  if (def.enum && Array.isArray(def.enum)) {
    field.elements = def.enum.map((value) => ({
      value,
      label: String(value)
    }));
  }
  return field;
}
export {
  generateFieldsFromAttributes
};
//# sourceMappingURL=generate-fields-from-attributes.mjs.map
