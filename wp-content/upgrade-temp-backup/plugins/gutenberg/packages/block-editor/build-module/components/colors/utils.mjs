// packages/block-editor/src/components/colors/utils.js
import { colord, extend } from "colord";
import namesPlugin from "colord/plugins/names";
import a11yPlugin from "colord/plugins/a11y";
import { privateApis as componentsPrivateApis } from "@wordpress/components";
import { unlock } from "../../lock-unlock.mjs";
extend([namesPlugin, a11yPlugin]);
var { kebabCase } = unlock(componentsPrivateApis);
var getColorObjectByAttributeValues = (colors, definedColor, customColor) => {
  if (definedColor) {
    const colorObj = colors?.find(
      (color) => color.slug === definedColor
    );
    if (colorObj) {
      return colorObj;
    }
  }
  return {
    color: customColor
  };
};
var getColorObjectByColorValue = (colors, colorValue) => {
  return colors?.find((color) => color.color === colorValue);
};
function getColorClassName(colorContextName, colorSlug) {
  if (!colorContextName || !colorSlug) {
    return void 0;
  }
  return `has-${kebabCase(colorSlug)}-${colorContextName}`;
}
function getMostReadableColor(colors, colorValue) {
  const colordColor = colord(colorValue);
  const getColorContrast = ({ color }) => colordColor.contrast(color);
  const maxContrast = Math.max(...colors.map(getColorContrast));
  return colors.find((color) => getColorContrast(color) === maxContrast).color;
}
export {
  getColorClassName,
  getColorObjectByAttributeValues,
  getColorObjectByColorValue,
  getMostReadableColor
};
//# sourceMappingURL=utils.mjs.map
