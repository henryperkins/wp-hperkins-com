// packages/global-styles-ui/src/screen-style-variations.tsx
import { Card, CardBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { ScreenHeader } from "./screen-header.mjs";
import { StyleVariationsContent } from "./style-variations-content.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function ScreenStyleVariations() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ScreenHeader,
      {
        title: __("Browse styles"),
        description: __(
          "Choose a variation to change the look of the site."
        )
      }
    ),
    /* @__PURE__ */ jsx(
      Card,
      {
        size: "small",
        isBorderless: true,
        className: "global-styles-ui-screen-style-variations",
        children: /* @__PURE__ */ jsx(CardBody, { children: /* @__PURE__ */ jsx(StyleVariationsContent, {}) })
      }
    )
  ] });
}
var screen_style_variations_default = ScreenStyleVariations;
export {
  screen_style_variations_default as default
};
//# sourceMappingURL=screen-style-variations.mjs.map
