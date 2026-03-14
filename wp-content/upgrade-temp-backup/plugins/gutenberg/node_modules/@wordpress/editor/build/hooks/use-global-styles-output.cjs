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

// packages/editor/src/hooks/use-global-styles-output.js
var use_global_styles_output_exports = {};
__export(use_global_styles_output_exports, {
  useGlobalStylesOutput: () => useGlobalStylesOutput,
  useGlobalStylesOutputWithConfig: () => useGlobalStylesOutputWithConfig
});
module.exports = __toCommonJS(use_global_styles_output_exports);
var import_blocks = require("@wordpress/blocks");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_global_styles_engine = require("@wordpress/global-styles-engine");
var import_store = require("../store/index.cjs");
var import_global_styles = require("../components/global-styles/index.cjs");
function useGlobalStylesOutputWithConfig(mergedConfig = {}, disableRootPadding = false) {
  const blockGap = (0, import_global_styles.useSetting)("spacing.blockGap");
  const hasBlockGapSupport = blockGap !== null;
  const hasFallbackGapSupport = !hasBlockGapSupport;
  const { disableLayoutStyles, getBlockStyles } = (0, import_data.useSelect)((select) => {
    const { getEditorSettings } = select(import_store.store);
    const { getBlockStyles: getBlockStylesSelector } = select(import_blocks.store);
    const settings = getEditorSettings();
    return {
      disableLayoutStyles: !!settings?.disableLayoutStyles,
      getBlockStyles: getBlockStylesSelector
    };
  }, []);
  return (0, import_element.useMemo)(() => {
    if (!mergedConfig?.styles || !mergedConfig?.settings) {
      return [[], {}];
    }
    const blockTypes = (0, import_blocks.getBlockTypes)();
    return (0, import_global_styles_engine.generateGlobalStyles)(mergedConfig, blockTypes, {
      hasBlockGapSupport,
      hasFallbackGapSupport,
      disableLayoutStyles,
      disableRootPadding,
      getBlockStyles
    });
  }, [
    hasBlockGapSupport,
    hasFallbackGapSupport,
    mergedConfig,
    disableLayoutStyles,
    disableRootPadding,
    getBlockStyles
  ]);
}
function useGlobalStylesOutput(disableRootPadding = false) {
  const { merged: mergedConfig } = (0, import_global_styles.useGlobalStyles)();
  return useGlobalStylesOutputWithConfig(mergedConfig, disableRootPadding);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useGlobalStylesOutput,
  useGlobalStylesOutputWithConfig
});
//# sourceMappingURL=use-global-styles-output.cjs.map
