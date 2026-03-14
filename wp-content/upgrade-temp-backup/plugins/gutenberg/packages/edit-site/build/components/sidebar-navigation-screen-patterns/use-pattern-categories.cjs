"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/edit-site/src/components/sidebar-navigation-screen-patterns/use-pattern-categories.js
var use_pattern_categories_exports = {};
__export(use_pattern_categories_exports, {
  default: () => usePatternCategories
});
module.exports = __toCommonJS(use_pattern_categories_exports);
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_use_default_pattern_categories = __toESM(require("./use-default-pattern-categories.cjs"));
var import_use_theme_patterns = __toESM(require("./use-theme-patterns.cjs"));
var import_use_patterns = __toESM(require("../page-patterns/use-patterns.cjs"));
var import_constants = require("../../utils/constants.cjs");
function usePatternCategories() {
  const defaultCategories = (0, import_use_default_pattern_categories.default)();
  defaultCategories.push({
    name: import_constants.TEMPLATE_PART_AREA_DEFAULT_CATEGORY,
    label: (0, import_i18n.__)("Uncategorized")
  });
  const themePatterns = (0, import_use_theme_patterns.default)();
  const { patterns: userPatterns, categories: userPatternCategories } = (0, import_use_patterns.default)(import_constants.PATTERN_TYPES.user);
  const patternCategories = (0, import_element.useMemo)(() => {
    const categoryMap = {};
    const categoriesWithCounts = [];
    defaultCategories.forEach((category) => {
      if (!categoryMap[category.name]) {
        categoryMap[category.name] = { ...category, count: 0 };
      }
    });
    userPatternCategories.forEach((category) => {
      if (!categoryMap[category.name]) {
        categoryMap[category.name] = { ...category, count: 0 };
      }
    });
    themePatterns.forEach((pattern) => {
      pattern.categories?.forEach((category) => {
        if (categoryMap[category]) {
          categoryMap[category].count += 1;
        }
      });
      if (!pattern.categories?.length) {
        categoryMap.uncategorized.count += 1;
      }
    });
    userPatterns.forEach((pattern) => {
      pattern.wp_pattern_category?.forEach((catId) => {
        const category = userPatternCategories.find(
          (cat) => cat.id === catId
        )?.name;
        if (categoryMap[category]) {
          categoryMap[category].count += 1;
        }
      });
      if (!pattern.wp_pattern_category?.length || !pattern.wp_pattern_category?.some(
        (catId) => userPatternCategories.find((cat) => cat.id === catId)
      )) {
        categoryMap.uncategorized.count += 1;
      }
    });
    [...defaultCategories, ...userPatternCategories].forEach(
      (category) => {
        if (categoryMap[category.name].count && !categoriesWithCounts.find(
          (cat) => cat.name === category.name
        )) {
          categoriesWithCounts.push(categoryMap[category.name]);
        }
      }
    );
    const sortedCategories = categoriesWithCounts.sort(
      (a, b) => a.label.localeCompare(b.label)
    );
    sortedCategories.unshift({
      name: import_constants.PATTERN_USER_CATEGORY,
      label: (0, import_i18n.__)("My patterns"),
      count: userPatterns.length
    });
    sortedCategories.unshift({
      name: import_constants.PATTERN_DEFAULT_CATEGORY,
      label: (0, import_i18n.__)("All patterns"),
      description: (0, import_i18n.__)("A list of all patterns from all sources."),
      count: themePatterns.length + userPatterns.length
    });
    return sortedCategories;
  }, [
    defaultCategories,
    themePatterns,
    userPatternCategories,
    userPatterns
  ]);
  return { patternCategories, hasPatterns: !!patternCategories.length };
}
//# sourceMappingURL=use-pattern-categories.cjs.map
