// packages/block-editor/src/hooks/use-spacing-props.js
import { getInlineStyles } from "./style.mjs";
function getSpacingClassesAndStyles(attributes) {
  const { style } = attributes;
  const spacingStyles = style?.spacing || {};
  const styleProp = getInlineStyles({ spacing: spacingStyles });
  return {
    style: styleProp
  };
}
export {
  getSpacingClassesAndStyles
};
//# sourceMappingURL=use-spacing-props.mjs.map
