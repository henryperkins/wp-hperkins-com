// packages/global-styles-ui/src/style-variations-content.tsx
import { __ } from "@wordpress/i18n";
import { __experimentalVStack as VStack } from "@wordpress/components";
import StyleVariationsContainer from "./style-variations-container.mjs";
import TypographyVariations from "./variations/variations-typography.mjs";
import ColorVariations from "./variations/variations-color.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function StyleVariationsContent() {
  const gap = 3;
  return /* @__PURE__ */ jsxs(VStack, { spacing: 10, className: "global-styles-ui-variation-container", children: [
    /* @__PURE__ */ jsx(StyleVariationsContainer, { gap }),
    /* @__PURE__ */ jsx(ColorVariations, { title: __("Color Variations"), gap }),
    /* @__PURE__ */ jsx(TypographyVariations, { title: __("Typography"), gap })
  ] });
}
export {
  StyleVariationsContent
};
//# sourceMappingURL=style-variations-content.mjs.map
