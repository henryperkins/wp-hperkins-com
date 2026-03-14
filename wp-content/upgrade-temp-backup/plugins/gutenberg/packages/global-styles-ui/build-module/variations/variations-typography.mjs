// packages/global-styles-ui/src/variations/variations-typography.tsx
import {
  __experimentalGrid as Grid,
  __experimentalVStack as VStack
} from "@wordpress/components";
import StylesPreviewTypography from "../preview-typography.mjs";
import { useCurrentMergeThemeStyleVariationsWithUserConfig } from "../hooks.mjs";
import { Subtitle } from "../subtitle.mjs";
import Variation from "./variation.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var propertiesToFilter = ["typography"];
function TypographyVariations({
  title,
  gap = 2
}) {
  const typographyVariations = useCurrentMergeThemeStyleVariationsWithUserConfig(propertiesToFilter);
  if (typographyVariations?.length <= 1) {
    return null;
  }
  return /* @__PURE__ */ jsxs(VStack, { spacing: 3, children: [
    title && /* @__PURE__ */ jsx(Subtitle, { level: 3, children: title }),
    /* @__PURE__ */ jsx(
      Grid,
      {
        columns: 3,
        gap,
        className: "global-styles-ui-style-variations-container",
        children: typographyVariations.map(
          (variation, index) => {
            return /* @__PURE__ */ jsx(
              Variation,
              {
                variation,
                properties: propertiesToFilter,
                showTooltip: true,
                children: () => /* @__PURE__ */ jsx(
                  StylesPreviewTypography,
                  {
                    variation
                  }
                )
              },
              index
            );
          }
        )
      }
    )
  ] });
}
export {
  TypographyVariations as default
};
//# sourceMappingURL=variations-typography.mjs.map
