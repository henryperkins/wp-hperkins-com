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

// packages/editor/src/components/post-transform-panel/hooks.js
var hooks_exports = {};
__export(hooks_exports, {
  useAvailablePatterns: () => useAvailablePatterns
});
module.exports = __toCommonJS(hooks_exports);
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_core_data = require("@wordpress/core-data");
var import_blocks = require("@wordpress/blocks");
var import_patterns = require("@wordpress/patterns");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var { EXCLUDED_PATTERN_SOURCES, PATTERN_TYPES } = (0, import_lock_unlock.unlock)(import_patterns.privateApis);
function injectThemeAttributeInBlockTemplateContent(block, currentThemeStylesheet) {
  block.innerBlocks = block.innerBlocks.map((innerBlock) => {
    return injectThemeAttributeInBlockTemplateContent(
      innerBlock,
      currentThemeStylesheet
    );
  });
  if (block.name === "core/template-part" && block.attributes.theme === void 0) {
    block.attributes.theme = currentThemeStylesheet;
  }
  return block;
}
function filterPatterns(patterns, template) {
  const filterOutDuplicatesByName = (currentItem, index, items) => index === items.findIndex((item) => currentItem.name === item.name);
  const filterOutExcludedPatternSources = (pattern) => {
    if (template.area === "navigation-overlay" && pattern.blockTypes?.includes(
      "core/template-part/navigation-overlay"
    )) {
      return true;
    }
    return !EXCLUDED_PATTERN_SOURCES.includes(pattern.source);
  };
  const filterCompatiblePatterns = (pattern) => pattern.templateTypes?.includes(template.slug) || pattern.blockTypes?.includes("core/template-part/" + template.area);
  return patterns.filter((pattern, index, items) => {
    return filterOutDuplicatesByName(pattern, index, items) && filterOutExcludedPatternSources(pattern) && filterCompatiblePatterns(pattern);
  });
}
function preparePatterns(patterns, currentThemeStylesheet) {
  return patterns.map((pattern) => ({
    ...pattern,
    keywords: pattern.keywords || [],
    type: PATTERN_TYPES.theme,
    blocks: (0, import_blocks.parse)(pattern.content, {
      __unstableSkipMigrationLogs: true
    }).map(
      (block) => injectThemeAttributeInBlockTemplateContent(
        block,
        currentThemeStylesheet
      )
    )
  }));
}
function useAvailablePatterns({ area, name, slug }) {
  const { blockPatterns, restBlockPatterns, currentThemeStylesheet } = (0, import_data.useSelect)((select) => {
    const { getEditorSettings } = select(import_store.store);
    const settings = getEditorSettings();
    return {
      blockPatterns: settings.__experimentalAdditionalBlockPatterns ?? settings.__experimentalBlockPatterns,
      restBlockPatterns: select(import_core_data.store).getBlockPatterns(),
      currentThemeStylesheet: select(import_core_data.store).getCurrentTheme().stylesheet
    };
  }, []);
  return (0, import_element.useMemo)(() => {
    const mergedPatterns = [
      ...blockPatterns || [],
      ...restBlockPatterns || []
    ];
    const filteredPatterns = filterPatterns(mergedPatterns, {
      area,
      name,
      slug
    });
    return preparePatterns(filteredPatterns, currentThemeStylesheet);
  }, [
    area,
    name,
    slug,
    blockPatterns,
    restBlockPatterns,
    currentThemeStylesheet
  ]);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useAvailablePatterns
});
//# sourceMappingURL=hooks.cjs.map
