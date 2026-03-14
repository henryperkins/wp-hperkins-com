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

// packages/block-editor/src/hooks/supports.js
var supports_exports = {};
__export(supports_exports, {
  getAlignSupport: () => getAlignSupport,
  getAlignWideSupport: () => getAlignWideSupport,
  getBorderSupport: () => getBorderSupport,
  getColorSupport: () => getColorSupport,
  getCustomClassNameSupport: () => getCustomClassNameSupport,
  getFontFamilySupport: () => getFontFamilySupport,
  getFontSizeSupport: () => getFontSizeSupport,
  getLayoutSupport: () => getLayoutSupport,
  getTextAlignSupport: () => getTextAlignSupport,
  hasAlignSupport: () => hasAlignSupport,
  hasAlignWideSupport: () => hasAlignWideSupport,
  hasBackgroundColorSupport: () => hasBackgroundColorSupport,
  hasBorderSupport: () => hasBorderSupport,
  hasColorSupport: () => hasColorSupport,
  hasCustomClassNameSupport: () => hasCustomClassNameSupport,
  hasFontFamilySupport: () => hasFontFamilySupport,
  hasFontSizeSupport: () => hasFontSizeSupport,
  hasGradientSupport: () => hasGradientSupport,
  hasLayoutSupport: () => hasLayoutSupport,
  hasLinkColorSupport: () => hasLinkColorSupport,
  hasStyleSupport: () => hasStyleSupport,
  hasTextAlignSupport: () => hasTextAlignSupport,
  hasTextColorSupport: () => hasTextColorSupport
});
module.exports = __toCommonJS(supports_exports);
var import_blocks = require("@wordpress/blocks");
var import_element = require("@wordpress/element");
var ALIGN_SUPPORT_KEY = "align";
var ALIGN_WIDE_SUPPORT_KEY = "alignWide";
var BORDER_SUPPORT_KEY = "__experimentalBorder";
var COLOR_SUPPORT_KEY = "color";
var CUSTOM_CLASS_NAME_SUPPORT_KEY = "customClassName";
var FONT_FAMILY_SUPPORT_KEY = "typography.__experimentalFontFamily";
var FONT_SIZE_SUPPORT_KEY = "typography.fontSize";
var LINE_HEIGHT_SUPPORT_KEY = "typography.lineHeight";
var FONT_STYLE_SUPPORT_KEY = "typography.__experimentalFontStyle";
var FONT_WEIGHT_SUPPORT_KEY = "typography.__experimentalFontWeight";
var TEXT_ALIGN_SUPPORT_KEY = "typography.textAlign";
var TEXT_COLUMNS_SUPPORT_KEY = "typography.textColumns";
var TEXT_DECORATION_SUPPORT_KEY = "typography.__experimentalTextDecoration";
var WRITING_MODE_SUPPORT_KEY = "typography.__experimentalWritingMode";
var TEXT_TRANSFORM_SUPPORT_KEY = "typography.__experimentalTextTransform";
var LETTER_SPACING_SUPPORT_KEY = "typography.__experimentalLetterSpacing";
var LAYOUT_SUPPORT_KEY = "layout";
var TYPOGRAPHY_SUPPORT_KEYS = [
  LINE_HEIGHT_SUPPORT_KEY,
  FONT_SIZE_SUPPORT_KEY,
  FONT_STYLE_SUPPORT_KEY,
  FONT_WEIGHT_SUPPORT_KEY,
  FONT_FAMILY_SUPPORT_KEY,
  TEXT_ALIGN_SUPPORT_KEY,
  TEXT_COLUMNS_SUPPORT_KEY,
  TEXT_DECORATION_SUPPORT_KEY,
  TEXT_TRANSFORM_SUPPORT_KEY,
  WRITING_MODE_SUPPORT_KEY,
  LETTER_SPACING_SUPPORT_KEY
];
var EFFECTS_SUPPORT_KEYS = ["shadow"];
var SPACING_SUPPORT_KEY = "spacing";
var styleSupportKeys = [
  ...EFFECTS_SUPPORT_KEYS,
  ...TYPOGRAPHY_SUPPORT_KEYS,
  BORDER_SUPPORT_KEY,
  COLOR_SUPPORT_KEY,
  SPACING_SUPPORT_KEY
];
var hasAlignSupport = (nameOrType) => (0, import_blocks.hasBlockSupport)(nameOrType, ALIGN_SUPPORT_KEY);
var getAlignSupport = (nameOrType) => (0, import_blocks.getBlockSupport)(nameOrType, ALIGN_SUPPORT_KEY);
var hasAlignWideSupport = (nameOrType) => (0, import_blocks.hasBlockSupport)(nameOrType, ALIGN_WIDE_SUPPORT_KEY);
var getAlignWideSupport = (nameOrType) => (0, import_blocks.getBlockSupport)(nameOrType, ALIGN_WIDE_SUPPORT_KEY);
function hasBorderSupport(nameOrType, feature = "any") {
  if (import_element.Platform.OS !== "web") {
    return false;
  }
  const support = (0, import_blocks.getBlockSupport)(nameOrType, BORDER_SUPPORT_KEY);
  if (support === true) {
    return true;
  }
  if (feature === "any") {
    return !!(support?.color || support?.radius || support?.width || support?.style);
  }
  return !!support?.[feature];
}
var getBorderSupport = (nameOrType, feature) => (0, import_blocks.getBlockSupport)(nameOrType, [BORDER_SUPPORT_KEY, feature]);
var hasColorSupport = (nameOrType) => {
  const colorSupport = (0, import_blocks.getBlockSupport)(nameOrType, COLOR_SUPPORT_KEY);
  return colorSupport && (colorSupport.link === true || colorSupport.gradient === true || colorSupport.background !== false || colorSupport.text !== false);
};
var hasLinkColorSupport = (nameOrType) => {
  if (import_element.Platform.OS !== "web") {
    return false;
  }
  const colorSupport = (0, import_blocks.getBlockSupport)(nameOrType, COLOR_SUPPORT_KEY);
  return colorSupport !== null && typeof colorSupport === "object" && !!colorSupport.link;
};
var hasGradientSupport = (nameOrType) => {
  const colorSupport = (0, import_blocks.getBlockSupport)(nameOrType, COLOR_SUPPORT_KEY);
  return colorSupport !== null && typeof colorSupport === "object" && !!colorSupport.gradients;
};
var hasBackgroundColorSupport = (nameOrType) => {
  const colorSupport = (0, import_blocks.getBlockSupport)(nameOrType, COLOR_SUPPORT_KEY);
  return colorSupport && colorSupport.background !== false;
};
var hasTextAlignSupport = (nameOrType) => (0, import_blocks.hasBlockSupport)(nameOrType, TEXT_ALIGN_SUPPORT_KEY);
var getTextAlignSupport = (nameOrType) => (0, import_blocks.getBlockSupport)(nameOrType, TEXT_ALIGN_SUPPORT_KEY);
var hasTextColorSupport = (nameOrType) => {
  const colorSupport = (0, import_blocks.getBlockSupport)(nameOrType, COLOR_SUPPORT_KEY);
  return colorSupport && colorSupport.text !== false;
};
var getColorSupport = (nameOrType, feature) => (0, import_blocks.getBlockSupport)(nameOrType, [COLOR_SUPPORT_KEY, feature]);
var hasCustomClassNameSupport = (nameOrType) => (0, import_blocks.hasBlockSupport)(nameOrType, CUSTOM_CLASS_NAME_SUPPORT_KEY, true);
var getCustomClassNameSupport = (nameOrType) => (0, import_blocks.getBlockSupport)(nameOrType, CUSTOM_CLASS_NAME_SUPPORT_KEY, true);
var hasFontFamilySupport = (nameOrType) => (0, import_blocks.hasBlockSupport)(nameOrType, FONT_FAMILY_SUPPORT_KEY);
var getFontFamilySupport = (nameOrType) => (0, import_blocks.getBlockSupport)(nameOrType, FONT_FAMILY_SUPPORT_KEY);
var hasFontSizeSupport = (nameOrType) => (0, import_blocks.hasBlockSupport)(nameOrType, FONT_SIZE_SUPPORT_KEY);
var getFontSizeSupport = (nameOrType) => (0, import_blocks.getBlockSupport)(nameOrType, FONT_SIZE_SUPPORT_KEY);
var hasLayoutSupport = (nameOrType) => (0, import_blocks.hasBlockSupport)(nameOrType, LAYOUT_SUPPORT_KEY);
var getLayoutSupport = (nameOrType) => (0, import_blocks.getBlockSupport)(nameOrType, LAYOUT_SUPPORT_KEY);
var hasStyleSupport = (nameOrType) => styleSupportKeys.some((key) => (0, import_blocks.hasBlockSupport)(nameOrType, key));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAlignSupport,
  getAlignWideSupport,
  getBorderSupport,
  getColorSupport,
  getCustomClassNameSupport,
  getFontFamilySupport,
  getFontSizeSupport,
  getLayoutSupport,
  getTextAlignSupport,
  hasAlignSupport,
  hasAlignWideSupport,
  hasBackgroundColorSupport,
  hasBorderSupport,
  hasColorSupport,
  hasCustomClassNameSupport,
  hasFontFamilySupport,
  hasFontSizeSupport,
  hasGradientSupport,
  hasLayoutSupport,
  hasLinkColorSupport,
  hasStyleSupport,
  hasTextAlignSupport,
  hasTextColorSupport
});
//# sourceMappingURL=supports.cjs.map
