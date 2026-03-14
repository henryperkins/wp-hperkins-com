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

// packages/edit-site/src/components/sidebar-navigation-screen-patterns/use-default-pattern-categories.js
var use_default_pattern_categories_exports = {};
__export(use_default_pattern_categories_exports, {
  default: () => useDefaultPatternCategories
});
module.exports = __toCommonJS(use_default_pattern_categories_exports);
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
function useDefaultPatternCategories() {
  const blockPatternCategories = (0, import_data.useSelect)((select) => {
    const { getSettings } = (0, import_lock_unlock.unlock)(select(import_store.store));
    const settings = getSettings();
    return settings.__experimentalAdditionalBlockPatternCategories ?? settings.__experimentalBlockPatternCategories;
  });
  const restBlockPatternCategories = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getBlockPatternCategories()
  );
  return [
    ...blockPatternCategories || [],
    ...restBlockPatternCategories || []
  ];
}
//# sourceMappingURL=use-default-pattern-categories.cjs.map
