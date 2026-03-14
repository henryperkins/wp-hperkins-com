// packages/block-editor/src/components/font-sizes/utils.js
import { privateApis as componentsPrivateApis } from "@wordpress/components";
import { unlock } from "../../lock-unlock.mjs";
var { kebabCase } = unlock(componentsPrivateApis);
var getFontSize = (fontSizes, fontSizeAttribute, customFontSizeAttribute) => {
  if (fontSizeAttribute) {
    const fontSizeObject = fontSizes?.find(
      ({ slug }) => slug === fontSizeAttribute
    );
    if (fontSizeObject) {
      return fontSizeObject;
    }
  }
  return {
    size: customFontSizeAttribute
  };
};
function getFontSizeObjectByValue(fontSizes, value) {
  const fontSizeObject = fontSizes?.find(({ size }) => size === value);
  if (fontSizeObject) {
    return fontSizeObject;
  }
  return {
    size: value
  };
}
function getFontSizeClass(fontSizeSlug) {
  if (!fontSizeSlug) {
    return;
  }
  return `has-${kebabCase(fontSizeSlug)}-font-size`;
}
export {
  getFontSize,
  getFontSizeClass,
  getFontSizeObjectByValue
};
//# sourceMappingURL=utils.mjs.map
