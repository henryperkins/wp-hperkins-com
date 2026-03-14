// packages/blocks/src/api/parser/apply-built-in-validation-fixes.js
import { fixCustomClassname } from "./fix-custom-classname.mjs";
import { fixGlobalAttribute } from "./fix-global-attribute.mjs";
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
  updatedBlockAttributes = fixCustomClassname(
    attributes,
    blockType,
    originalContent
  );
  updatedBlockAttributes = fixGlobalAttribute(
    updatedBlockAttributes,
    blockType,
    originalContent,
    "ariaLabel",
    "data-aria-label",
    ARIA_LABEL_ATTR_SCHEMA
  );
  updatedBlockAttributes = fixGlobalAttribute(
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
export {
  applyBuiltInValidationFixes
};
//# sourceMappingURL=apply-built-in-validation-fixes.mjs.map
