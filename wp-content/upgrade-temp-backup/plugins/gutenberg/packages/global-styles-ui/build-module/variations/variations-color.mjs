// packages/global-styles-ui/src/variations/variations-color.tsx
import {
  __experimentalGrid as Grid,
  __experimentalVStack as VStack
} from "@wordpress/components";
import StylesPreviewColors from "../preview-colors.mjs";
import { useCurrentMergeThemeStyleVariationsWithUserConfig } from "../hooks.mjs";
import { Subtitle } from "../subtitle.mjs";
import Variation from "./variation.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var propertiesToFilter = ["color"];
function ColorVariations({
  title,
  gap = 2
}) {
  const colorVariations = useCurrentMergeThemeStyleVariationsWithUserConfig(propertiesToFilter);
  if (colorVariations?.length <= 1) {
    return null;
  }
  return /* @__PURE__ */ jsxs(VStack, { spacing: 3, children: [
    title && /* @__PURE__ */ jsx(Subtitle, { level: 3, children: title }),
    /* @__PURE__ */ jsx(Grid, { gap, children: colorVariations.map((variation, index) => /* @__PURE__ */ jsx(
      Variation,
      {
        variation,
        isPill: true,
        properties: propertiesToFilter,
        showTooltip: true,
        children: () => /* @__PURE__ */ jsx(StylesPreviewColors, {})
      },
      index
    )) })
  ] });
}
export {
  ColorVariations as default
};
//# sourceMappingURL=variations-color.mjs.map
