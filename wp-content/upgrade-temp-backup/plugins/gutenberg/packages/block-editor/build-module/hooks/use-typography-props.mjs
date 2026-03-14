// packages/block-editor/src/hooks/use-typography-props.js
import clsx from "clsx";
import { privateApis as componentsPrivateApis } from "@wordpress/components";
import { getTypographyFontSizeValue } from "@wordpress/global-styles-engine";
import { getInlineStyles } from "./style.mjs";
import { getFontSizeClass } from "../components/font-sizes/index.mjs";
import { unlock } from "../lock-unlock.mjs";
var { kebabCase } = unlock(componentsPrivateApis);
function getTypographyClassesAndStyles(attributes, settings) {
  let typographyStyles = attributes?.style?.typography || {};
  typographyStyles = {
    ...typographyStyles,
    fontSize: getTypographyFontSizeValue(
      { size: attributes?.style?.typography?.fontSize },
      settings
    )
  };
  const style = getInlineStyles({ typography: typographyStyles });
  const fontFamilyClassName = !!attributes?.fontFamily ? `has-${kebabCase(attributes.fontFamily)}-font-family` : "";
  const textAlignClassName = !!attributes?.style?.typography?.textAlign ? `has-text-align-${attributes?.style?.typography?.textAlign}` : "";
  const className = clsx(
    fontFamilyClassName,
    textAlignClassName,
    getFontSizeClass(attributes?.fontSize)
  );
  return {
    className,
    style
  };
}
export {
  getTypographyClassesAndStyles
};
//# sourceMappingURL=use-typography-props.mjs.map
