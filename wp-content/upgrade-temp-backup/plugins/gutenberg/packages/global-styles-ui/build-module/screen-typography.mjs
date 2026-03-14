// packages/global-styles-ui/src/screen-typography.tsx
import { __ } from "@wordpress/i18n";
import { __experimentalVStack as VStack } from "@wordpress/components";
import { useContext } from "@wordpress/element";
import { ScreenHeader } from "./screen-header.mjs";
import { ScreenBody } from "./screen-body.mjs";
import TypographyElements from "./typography-elements.mjs";
import TypographyVariations from "./variations/variations-typography.mjs";
import FontFamilies from "./font-families.mjs";
import FontSizesCount from "./font-sizes/font-sizes-count.mjs";
import { GlobalStylesContext } from "./context.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function ScreenTypography() {
  const { fontLibraryEnabled } = useContext(GlobalStylesContext);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ScreenHeader,
      {
        title: __("Typography"),
        description: __(
          "Available fonts, typographic styles, and the application of those styles."
        )
      }
    ),
    /* @__PURE__ */ jsx(ScreenBody, { children: /* @__PURE__ */ jsxs(VStack, { spacing: 7, children: [
      /* @__PURE__ */ jsx(TypographyVariations, { title: __("Typesets") }),
      fontLibraryEnabled && /* @__PURE__ */ jsx(FontFamilies, {}),
      /* @__PURE__ */ jsx(TypographyElements, {}),
      /* @__PURE__ */ jsx(FontSizesCount, {})
    ] }) })
  ] });
}
var screen_typography_default = ScreenTypography;
export {
  screen_typography_default as default
};
//# sourceMappingURL=screen-typography.mjs.map
