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

// packages/editor/src/bindings/pattern-overrides.js
var pattern_overrides_exports = {};
__export(pattern_overrides_exports, {
  default: () => pattern_overrides_default
});
module.exports = __toCommonJS(pattern_overrides_exports);
var import_block_editor = require("@wordpress/block-editor");
var CONTENT = "content";
var pattern_overrides_default = {
  name: "core/pattern-overrides",
  getValues({ select, clientId, context, bindings }) {
    const patternOverridesContent = context["pattern/overrides"];
    const { getBlockAttributes } = select(import_block_editor.store);
    const currentBlockAttributes = getBlockAttributes(clientId);
    const overridesValues = {};
    for (const attributeName of Object.keys(bindings)) {
      const overridableValue = patternOverridesContent?.[currentBlockAttributes?.metadata?.name]?.[attributeName];
      if (overridableValue === void 0) {
        overridesValues[attributeName] = currentBlockAttributes[attributeName];
        continue;
      } else {
        overridesValues[attributeName] = overridableValue === "" ? void 0 : overridableValue;
      }
    }
    return overridesValues;
  },
  setValues({ select, dispatch, clientId, bindings }) {
    const { getBlockAttributes, getBlockParentsByBlockName, getBlocks } = select(import_block_editor.store);
    const currentBlockAttributes = getBlockAttributes(clientId);
    const blockName = currentBlockAttributes?.metadata?.name;
    if (!blockName) {
      return;
    }
    const [patternClientId] = getBlockParentsByBlockName(
      clientId,
      "core/block",
      true
    );
    const attributes = Object.entries(bindings).reduce(
      (attrs, [key, { newValue }]) => {
        attrs[key] = newValue;
        return attrs;
      },
      {}
    );
    if (!patternClientId) {
      const syncBlocksWithSameName = (blocks) => {
        for (const block of blocks) {
          if (block.attributes?.metadata?.name === blockName) {
            dispatch(import_block_editor.store).updateBlockAttributes(
              block.clientId,
              attributes
            );
          }
          syncBlocksWithSameName(block.innerBlocks);
        }
      };
      syncBlocksWithSameName(getBlocks());
      return;
    }
    const currentBindingValue = getBlockAttributes(patternClientId)?.[CONTENT];
    dispatch(import_block_editor.store).updateBlockAttributes(patternClientId, {
      [CONTENT]: {
        ...currentBindingValue,
        [blockName]: {
          ...currentBindingValue?.[blockName],
          ...Object.entries(attributes).reduce(
            (acc, [key, value]) => {
              acc[key] = value === void 0 ? "" : value;
              return acc;
            },
            {}
          )
        }
      }
    });
  },
  canUserEditValue: () => true
};
//# sourceMappingURL=pattern-overrides.cjs.map
