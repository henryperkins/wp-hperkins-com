"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-editor/src/hooks/generate-fields-from-attributes.js
var generate_fields_from_attributes_exports = {};
__export(generate_fields_from_attributes_exports, {
  generateFieldsFromAttributes: () => generateFieldsFromAttributes
});
module.exports = __toCommonJS(generate_fields_from_attributes_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateFieldsFromAttributes
});
//# sourceMappingURL=generate-fields-from-attributes.cjs.map
