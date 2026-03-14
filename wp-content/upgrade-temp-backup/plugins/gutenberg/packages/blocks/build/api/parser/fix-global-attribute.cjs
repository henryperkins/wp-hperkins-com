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

// packages/blocks/src/api/parser/fix-global-attribute.js
var fix_global_attribute_exports = {};
__export(fix_global_attribute_exports, {
  fixGlobalAttribute: () => fixGlobalAttribute,
  getHTMLRootElement: () => getHTMLRootElement
});
module.exports = __toCommonJS(fix_global_attribute_exports);
var import_registration = require("../registration.cjs");
var import_get_block_attributes = require("./get-block-attributes.cjs");
function getHTMLRootElement(innerHTML, dataAttribute, attributeSchema) {
  const parsed = (0, import_get_block_attributes.parseWithAttributeSchema)(
    `<div ${dataAttribute}>${innerHTML}</div>`,
    attributeSchema
  );
  return parsed;
}
function fixGlobalAttribute(blockAttributes, blockType, innerHTML, supportKey, dataAttribute, attributeSchema) {
  if (!(0, import_registration.hasBlockSupport)(blockType, supportKey, false)) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fixGlobalAttribute,
  getHTMLRootElement
});
//# sourceMappingURL=fix-global-attribute.cjs.map
