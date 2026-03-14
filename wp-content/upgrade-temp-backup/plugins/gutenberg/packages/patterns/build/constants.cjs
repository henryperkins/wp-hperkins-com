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

// packages/patterns/src/constants.js
var constants_exports = {};
__export(constants_exports, {
  EXCLUDED_PATTERN_SOURCES: () => EXCLUDED_PATTERN_SOURCES,
  PATTERN_DEFAULT_CATEGORY: () => PATTERN_DEFAULT_CATEGORY,
  PATTERN_OVERRIDES_BINDING_SOURCE: () => PATTERN_OVERRIDES_BINDING_SOURCE,
  PATTERN_SYNC_TYPES: () => PATTERN_SYNC_TYPES,
  PATTERN_TYPES: () => PATTERN_TYPES,
  PATTERN_USER_CATEGORY: () => PATTERN_USER_CATEGORY
});
module.exports = __toCommonJS(constants_exports);
var PATTERN_TYPES = {
  theme: "pattern",
  user: "wp_block"
};
var PATTERN_DEFAULT_CATEGORY = "all-patterns";
var PATTERN_USER_CATEGORY = "my-patterns";
var EXCLUDED_PATTERN_SOURCES = [
  "core",
  "pattern-directory/core",
  "pattern-directory/featured"
];
var PATTERN_SYNC_TYPES = {
  full: "fully",
  unsynced: "unsynced"
};
var PATTERN_OVERRIDES_BINDING_SOURCE = "core/pattern-overrides";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EXCLUDED_PATTERN_SOURCES,
  PATTERN_DEFAULT_CATEGORY,
  PATTERN_OVERRIDES_BINDING_SOURCE,
  PATTERN_SYNC_TYPES,
  PATTERN_TYPES,
  PATTERN_USER_CATEGORY
});
//# sourceMappingURL=constants.cjs.map
