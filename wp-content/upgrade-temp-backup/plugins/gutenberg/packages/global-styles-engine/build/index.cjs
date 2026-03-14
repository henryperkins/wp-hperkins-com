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

// packages/global-styles-engine/src/index.ts
var index_exports = {};
__export(index_exports, {
  areGlobalStylesEqual: () => import_equal.areGlobalStylesEqual,
  generateGlobalStyles: () => import_render.generateGlobalStyles,
  getBlockSelector: () => import_selectors.getBlockSelector,
  getBlockSelectors: () => import_render2.getBlockSelectors,
  getDimensionPresetCssVar: () => import_dimensions.getDimensionPresetCssVar,
  getGlobalStylesChanges: () => import_get_global_styles_changes.default,
  getLayoutStyles: () => import_render2.getLayoutStyles,
  getPalettes: () => import_get_palette.default,
  getPresetVariableFromValue: () => import_common.getPresetVariableFromValue,
  getResolvedValue: () => import_common.getResolvedValue,
  getSetting: () => import_get_setting.getSetting,
  getStyle: () => import_get_style.getStyle,
  getTypographyFontSizeValue: () => import_typography.getTypographyFontSizeValue,
  getValueFromVariable: () => import_common.getValueFromVariable,
  mergeGlobalStyles: () => import_merge.mergeGlobalStyles,
  processCSSNesting: () => import_render2.processCSSNesting,
  setSetting: () => import_set_setting.setSetting,
  setStyle: () => import_set_style.setStyle,
  toStyles: () => import_render2.transformToStyles
});
module.exports = __toCommonJS(index_exports);
var import_get_setting = require("./settings/get-setting.cjs");
var import_set_setting = require("./settings/set-setting.cjs");
var import_get_style = require("./settings/get-style.cjs");
var import_set_style = require("./settings/set-style.cjs");
var import_get_palette = __toESM(require("./settings/get-palette.cjs"));
var import_equal = require("./core/equal.cjs");
var import_merge = require("./core/merge.cjs");
var import_get_global_styles_changes = __toESM(require("./utils/get-global-styles-changes.cjs"));
var import_render = require("./core/render.cjs");
var import_render2 = require("./core/render.cjs");
var import_selectors = require("./core/selectors.cjs");
var import_typography = require("./utils/typography.cjs");
var import_dimensions = require("./utils/dimensions.cjs");
var import_common = require("./utils/common.cjs");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  areGlobalStylesEqual,
  generateGlobalStyles,
  getBlockSelector,
  getBlockSelectors,
  getDimensionPresetCssVar,
  getGlobalStylesChanges,
  getLayoutStyles,
  getPalettes,
  getPresetVariableFromValue,
  getResolvedValue,
  getSetting,
  getStyle,
  getTypographyFontSizeValue,
  getValueFromVariable,
  mergeGlobalStyles,
  processCSSNesting,
  setSetting,
  setStyle,
  toStyles
});
//# sourceMappingURL=index.cjs.map
