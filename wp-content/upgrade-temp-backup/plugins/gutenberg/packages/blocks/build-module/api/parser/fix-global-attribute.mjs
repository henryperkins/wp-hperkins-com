// packages/blocks/src/api/parser/fix-global-attribute.js
import { hasBlockSupport } from "../registration.mjs";
import { parseWithAttributeSchema } from "./get-block-attributes.mjs";
function getHTMLRootElement(innerHTML, dataAttribute, attributeSchema) {
  const parsed = parseWithAttributeSchema(
    `<div ${dataAttribute}>${innerHTML}</div>`,
    attributeSchema
  );
  return parsed;
}
function fixGlobalAttribute(blockAttributes, blockType, innerHTML, supportKey, dataAttribute, attributeSchema) {
  if (!hasBlockSupport(blockType, supportKey, false)) {
    return blockAttributes;
  }
  const modifiedBlockAttributes = { ...blockAttributes };
  const attributeValue = getHTMLRootElement(
    innerHTML,
    dataAttribute,
    attributeSchema
  );
  if (attributeValue) {
    modifiedBlockAttributes[supportKey] = attributeValue;
  }
  return modifiedBlockAttributes;
}
export {
  fixGlobalAttribute,
  getHTMLRootElement
};
//# sourceMappingURL=fix-global-attribute.mjs.map
