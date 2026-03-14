// packages/block-editor/src/utils/block-bindings.js
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
export {
  hasPatternOverridesDefaultBinding,
  replacePatternOverridesDefaultBinding
};
//# sourceMappingURL=block-bindings.mjs.map
