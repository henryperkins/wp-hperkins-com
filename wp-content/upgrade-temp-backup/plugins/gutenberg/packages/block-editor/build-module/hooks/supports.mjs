// packages/block-editor/src/hooks/supports.js
import { getBlockSupport, hasBlockSupport } from "@wordpress/blocks";
import { Platform } from "@wordpress/element";
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
var hasAlignSupport = (nameOrType) => hasBlockSupport(nameOrType, ALIGN_SUPPORT_KEY);
var getAlignSupport = (nameOrType) => getBlockSupport(nameOrType, ALIGN_SUPPORT_KEY);
var hasAlignWideSupport = (nameOrType) => hasBlockSupport(nameOrType, ALIGN_WIDE_SUPPORT_KEY);
var getAlignWideSupport = (nameOrType) => getBlockSupport(nameOrType, ALIGN_WIDE_SUPPORT_KEY);
function hasBorderSupport(nameOrType, feature = "any") {
  if (Platform.OS !== "web") {
    return false;
  }
  const support = getBlockSupport(nameOrType, BORDER_SUPPORT_KEY);
  if (support === true) {
    return true;
  }
  if (feature === "any") {
    return !!(support?.color || support?.radius || support?.width || support?.style);
  }
  return !!support?.[feature];
}
var getBorderSupport = (nameOrType, feature) => getBlockSupport(nameOrType, [BORDER_SUPPORT_KEY, feature]);
var hasColorSupport = (nameOrType) => {
  const colorSupport = getBlockSupport(nameOrType, COLOR_SUPPORT_KEY);
  return colorSupport && (colorSupport.link === true || colorSupport.gradient === true || colorSupport.background !== false || colorSupport.text !== false);
};
var hasLinkColorSupport = (nameOrType) => {
  if (Platform.OS !== "web") {
    return false;
  }
  const colorSupport = getBlockSupport(nameOrType, COLOR_SUPPORT_KEY);
  return colorSupport !== null && typeof colorSupport === "object" && !!colorSupport.link;
};
var hasGradientSupport = (nameOrType) => {
  const colorSupport = getBlockSupport(nameOrType, COLOR_SUPPORT_KEY);
  return colorSupport !== null && typeof colorSupport === "object" && !!colorSupport.gradients;
};
var hasBackgroundColorSupport = (nameOrType) => {
  const colorSupport = getBlockSupport(nameOrType, COLOR_SUPPORT_KEY);
  return colorSupport && colorSupport.background !== false;
};
var hasTextAlignSupport = (nameOrType) => hasBlockSupport(nameOrType, TEXT_ALIGN_SUPPORT_KEY);
var getTextAlignSupport = (nameOrType) => getBlockSupport(nameOrType, TEXT_ALIGN_SUPPORT_KEY);
var hasTextColorSupport = (nameOrType) => {
  const colorSupport = getBlockSupport(nameOrType, COLOR_SUPPORT_KEY);
  return colorSupport && colorSupport.text !== false;
};
var getColorSupport = (nameOrType, feature) => getBlockSupport(nameOrType, [COLOR_SUPPORT_KEY, feature]);
var hasCustomClassNameSupport = (nameOrType) => hasBlockSupport(nameOrType, CUSTOM_CLASS_NAME_SUPPORT_KEY, true);
var getCustomClassNameSupport = (nameOrType) => getBlockSupport(nameOrType, CUSTOM_CLASS_NAME_SUPPORT_KEY, true);
var hasFontFamilySupport = (nameOrType) => hasBlockSupport(nameOrType, FONT_FAMILY_SUPPORT_KEY);
var getFontFamilySupport = (nameOrType) => getBlockSupport(nameOrType, FONT_FAMILY_SUPPORT_KEY);
var hasFontSizeSupport = (nameOrType) => hasBlockSupport(nameOrType, FONT_SIZE_SUPPORT_KEY);
var getFontSizeSupport = (nameOrType) => getBlockSupport(nameOrType, FONT_SIZE_SUPPORT_KEY);
var hasLayoutSupport = (nameOrType) => hasBlockSupport(nameOrType, LAYOUT_SUPPORT_KEY);
var getLayoutSupport = (nameOrType) => getBlockSupport(nameOrType, LAYOUT_SUPPORT_KEY);
var hasStyleSupport = (nameOrType) => styleSupportKeys.some((key) => hasBlockSupport(nameOrType, key));
export {
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
};
//# sourceMappingURL=supports.mjs.map
