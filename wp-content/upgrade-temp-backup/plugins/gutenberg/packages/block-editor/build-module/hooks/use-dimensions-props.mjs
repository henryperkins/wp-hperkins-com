// packages/block-editor/src/hooks/use-dimensions-props.js
import { getInlineStyles } from "./style.mjs";
function getDimensionsClassesAndStyles(attributes) {
  const { style } = attributes;
  const dimensionsStyles = style?.dimensions || {};
  const styleProp = getInlineStyles({ dimensions: dimensionsStyles });
  return {
    className: dimensionsStyles.aspectRatio ? "has-aspect-ratio" : void 0,
    style: styleProp
  };
}
export {
  getDimensionsClassesAndStyles
};
//# sourceMappingURL=use-dimensions-props.mjs.map
