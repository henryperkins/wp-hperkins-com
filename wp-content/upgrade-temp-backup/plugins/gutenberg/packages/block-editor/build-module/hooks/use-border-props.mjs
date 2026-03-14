// packages/block-editor/src/hooks/use-border-props.js
import { getInlineStyles } from "./style.mjs";
import { getBorderClasses, getMultiOriginColor } from "./border.mjs";
import useMultipleOriginColorsAndGradients from "../components/colors-gradients/use-multiple-origin-colors-and-gradients.mjs";
function getBorderClassesAndStyles(attributes) {
  const border = attributes.style?.border || {};
  const className = getBorderClasses(attributes);
  return {
    className: className || void 0,
    style: getInlineStyles({ border })
  };
}
function useBorderProps(attributes) {
  const { colors } = useMultipleOriginColorsAndGradients();
  const borderProps = getBorderClassesAndStyles(attributes);
  const { borderColor } = attributes;
  if (borderColor) {
    const borderColorObject = getMultiOriginColor({
      colors,
      namedColor: borderColor
    });
    borderProps.style.borderColor = borderColorObject.color;
  }
  return borderProps;
}
export {
  getBorderClassesAndStyles,
  useBorderProps
};
//# sourceMappingURL=use-border-props.mjs.map
