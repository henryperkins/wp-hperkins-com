// packages/block-editor/src/components/color-palette/with-color-context.js
import { createHigherOrderComponent } from "@wordpress/compose";
import { useSettings } from "../use-settings/index.mjs";
import { jsx } from "react/jsx-runtime";
var with_color_context_default = createHigherOrderComponent((WrappedComponent) => {
  return function WithColorContext(props) {
    const [
      defaultColors,
      themeColors,
      customColors,
      enableCustomColors,
      enableDefaultColors
    ] = useSettings(
      "color.palette.default",
      "color.palette.theme",
      "color.palette.custom",
      "color.custom",
      "color.defaultPalette"
    );
    const _colors = enableDefaultColors ? [
      ...themeColors || [],
      ...defaultColors || [],
      ...customColors || []
    ] : [...themeColors || [], ...customColors || []];
    const { colors = _colors, disableCustomColors = !enableCustomColors } = props;
    const hasColorsToChoose = colors && colors.length > 0 || !disableCustomColors;
    return /* @__PURE__ */ jsx(
      WrappedComponent,
      {
        ...{
          ...props,
          colors,
          disableCustomColors,
          hasColorsToChoose
        }
      }
    );
  };
}, "withColorContext");
export {
  with_color_context_default as default
};
//# sourceMappingURL=with-color-context.mjs.map
