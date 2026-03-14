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

// packages/block-editor/src/utils/block-bindings.js
var block_bindings_exports = {};
__export(block_bindings_exports, {
  hasPatternOverridesDefaultBinding: () => hasPatternOverridesDefaultBinding,
  replacePatternOverridesDefaultBinding: () => replacePatternOverridesDefaultBinding
});
module.exports = __toCommonJS(block_bindings_exports);
var DEFAULT_ATTRIBUTE = "__default";
var PATTERN_OVERRIDES_SOURCE = "core/pattern-overrides";
function hasPatternOverridesDefaultBinding(bindings) {
  return bindings?.[DEFAULT_ATTRIBUTE]?.source === PATTERN_OVERRIDES_SOURCE;
}
function replacePatternOverridesDefaultBinding(bindings, supportedAttributes) {
  if (hasPatternOverridesDefaultBinding(bindings)) {
    const bindingsWithDefaults = {};
    for (const attributeName of supportedAttributes) {
      const bindingSource = bindings[attributeName] ? bindings[attributeName] : { source: PATTERN_OVERRIDES_SOURCE };
      bindingsWithDefaults[attributeName] = bindingSource;
    }
    return bindingsWithDefaults;
  }
  return bindings;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  hasPatternOverridesDefaultBinding,
  replacePatternOverridesDefaultBinding
});
//# sourceMappingURL=block-bindings.cjs.map
