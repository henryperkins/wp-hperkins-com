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

// packages/blocks/src/api/parser/apply-built-in-validation-fixes.js
var apply_built_in_validation_fixes_exports = {};
__export(apply_built_in_validation_fixes_exports, {
  applyBuiltInValidationFixes: () => applyBuiltInValidationFixes
});
module.exports = __toCommonJS(apply_built_in_validation_fixes_exports);
var import_fix_custom_classname = require("./fix-custom-classname.cjs");
var import_fix_global_attribute = require("./fix-global-attribute.cjs");
var ARIA_LABEL_ATTR_SCHEMA = {
  type: "string",
  source: "attribute",
  selector: "[data-aria-label] > *",
  attribute: "aria-label"
};
var ANCHOR_ATTR_SCHEMA = {
  type: "string",
  source: "attribute",
  selector: "[data-anchor] > *",
  attribute: "id"
};
function applyBuiltInValidationFixes(block, blockType) {
  const { attributes, originalContent } = block;
  let updatedBlockAttributes = attributes;
  updatedBlockAttributes = (0, import_fix_custom_classname.fixCustomClassname)(
    attributes,
    blockType,
    originalContent
  );
  updatedBlockAttributes = (0, import_fix_global_attribute.fixGlobalAttribute)(
    updatedBlockAttributes,
    blockType,
    originalContent,
    "ariaLabel",
    "data-aria-label",
    ARIA_LABEL_ATTR_SCHEMA
  );
  updatedBlockAttributes = (0, import_fix_global_attribute.fixGlobalAttribute)(
    updatedBlockAttributes,
    blockType,
    originalContent,
    "anchor",
    "data-anchor",
    ANCHOR_ATTR_SCHEMA
  );
  return {
    ...block,
    attributes: updatedBlockAttributes
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  applyBuiltInValidationFixes
});
//# sourceMappingURL=apply-built-in-validation-fixes.cjs.map
