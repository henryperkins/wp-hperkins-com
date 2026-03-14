// packages/block-editor/src/components/color-palette/control.js
import ColorGradientControl from "../colors-gradients/control.mjs";
import { jsx } from "react/jsx-runtime";
function ColorPaletteControl({
  onChange,
  value,
  ...otherProps
}) {
  return /* @__PURE__ */ jsx(
    ColorGradientControl,
    {
      ...otherProps,
      onColorChange: onChange,
      colorValue: value,
      gradients: [],
      disableCustomGradients: true
    }
  );
}
export {
  ColorPaletteControl as default
};
//# sourceMappingURL=control.mjs.map
