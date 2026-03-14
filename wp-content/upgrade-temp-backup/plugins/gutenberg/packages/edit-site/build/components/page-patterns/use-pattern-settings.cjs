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

// packages/edit-site/src/components/page-patterns/use-pattern-settings.js
var use_pattern_settings_exports = {};
__export(use_pattern_settings_exports, {
  default: () => usePatternSettings
});
module.exports = __toCommonJS(use_pattern_settings_exports);
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_editor = require("@wordpress/editor");
var import_global_styles_engine = require("@wordpress/global-styles-engine");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var import_utils = require("./utils.cjs");
var { useGlobalStyles } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
var { globalStylesDataKey } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function usePatternSettings() {
  const { merged: mergedConfig } = useGlobalStyles();
  const storedSettings = (0, import_data.useSelect)((select) => {
    const { getSettings } = (0, import_lock_unlock.unlock)(select(import_store.store));
    return getSettings();
  }, []);
  const settingsBlockPatterns = storedSettings.__experimentalAdditionalBlockPatterns ?? // WP 6.0
  storedSettings.__experimentalBlockPatterns;
  const restBlockPatterns = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getBlockPatterns(),
    []
  );
  const blockPatterns = (0, import_element.useMemo)(
    () => [
      ...settingsBlockPatterns || [],
      ...restBlockPatterns || []
    ].filter(import_utils.filterOutDuplicatesByName),
    [settingsBlockPatterns, restBlockPatterns]
  );
  const [globalStyles, globalSettings] = (0, import_element.useMemo)(() => {
    return (0, import_global_styles_engine.generateGlobalStyles)(mergedConfig, [], {
      disableRootPadding: false
    });
  }, [mergedConfig]);
  const settings = (0, import_element.useMemo)(() => {
    const {
      __experimentalAdditionalBlockPatterns,
      styles,
      __experimentalFeatures,
      ...restStoredSettings
    } = storedSettings;
    return {
      ...restStoredSettings,
      styles: globalStyles,
      __experimentalFeatures: globalSettings,
      [globalStylesDataKey]: mergedConfig.styles ?? {},
      __experimentalBlockPatterns: blockPatterns,
      isPreviewMode: true
    };
  }, [
    storedSettings,
    blockPatterns,
    globalStyles,
    globalSettings,
    mergedConfig
  ]);
  return settings;
}
//# sourceMappingURL=use-pattern-settings.cjs.map
