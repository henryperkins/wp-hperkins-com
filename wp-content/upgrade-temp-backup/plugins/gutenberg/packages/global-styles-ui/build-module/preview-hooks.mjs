// packages/global-styles-ui/src/preview-hooks.tsx
import { useSetting, useStyle } from "./hooks.mjs";
function useStylesPreviewColors() {
  const [textColor = "black"] = useStyle("color.text");
  const [backgroundColor = "white"] = useStyle("color.background");
  const [headingColor = textColor] = useStyle(
    "elements.h1.color.text"
  );
  const [linkColor = headingColor] = useStyle(
    "elements.link.color.text"
  );
  const [buttonBackgroundColor = linkColor] = useStyle(
    "elements.button.color.background"
  );
  const [coreColors] = useSetting("color.palette.core") || [];
  const [themeColors] = useSetting("color.palette.theme") || [];
  const [customColors] = useSetting("color.palette.custom") || [];
  const paletteColors = (themeColors ?? []).concat(customColors ?? []).concat(coreColors ?? []);
  const textColorObject = paletteColors.filter(
    ({ color }) => color === textColor
  );
  const buttonBackgroundColorObject = paletteColors.filter(
    ({ color }) => color === buttonBackgroundColor
  );
  const highlightedColors = textColorObject.concat(buttonBackgroundColorObject).concat(paletteColors).filter(
    // we exclude these background color because it is already visible in the preview.
    ({ color }) => color !== backgroundColor
  ).slice(0, 2);
  return {
    paletteColors,
    highlightedColors
  };
}
export {
  useStylesPreviewColors
};
//# sourceMappingURL=preview-hooks.mjs.map
