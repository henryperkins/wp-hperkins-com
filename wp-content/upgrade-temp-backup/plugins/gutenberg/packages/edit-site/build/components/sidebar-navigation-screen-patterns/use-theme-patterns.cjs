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

// packages/edit-site/src/components/sidebar-navigation-screen-patterns/use-theme-patterns.js
var use_theme_patterns_exports = {};
__export(use_theme_patterns_exports, {
  default: () => useThemePatterns
});
module.exports = __toCommonJS(use_theme_patterns_exports);
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_utils = require("../page-patterns/utils.cjs");
var import_constants = require("../../utils/constants.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
function useThemePatterns() {
  const blockPatterns = (0, import_data.useSelect)((select) => {
    const { getSettings } = (0, import_lock_unlock.unlock)(select(import_store.store));
    return getSettings().__experimentalAdditionalBlockPatterns ?? getSettings().__experimentalBlockPatterns;
  });
  const restBlockPatterns = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getBlockPatterns()
  );
  const patterns = (0, import_element.useMemo)(
    () => [...blockPatterns || [], ...restBlockPatterns || []].filter(
      (pattern) => !import_constants.EXCLUDED_PATTERN_SOURCES.includes(pattern.source)
    ).filter(import_utils.filterOutDuplicatesByName).filter((pattern) => pattern.inserter !== false),
    [blockPatterns, restBlockPatterns]
  );
  return patterns;
}
//# sourceMappingURL=use-theme-patterns.cjs.map
