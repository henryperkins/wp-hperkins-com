"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/global-styles-ui/src/screen-style-variations.tsx
var screen_style_variations_exports = {};
__export(screen_style_variations_exports, {
  default: () => screen_style_variations_default
});
module.exports = __toCommonJS(screen_style_variations_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_screen_header = require("./screen-header.cjs");
var import_style_variations_content = require("./style-variations-content.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function ScreenStyleVariations() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_screen_header.ScreenHeader,
      {
        title: (0, import_i18n.__)("Browse styles"),
        description: (0, import_i18n.__)(
          "Choose a variation to change the look of the site."
        )
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Card,
      {
        size: "small",
        isBorderless: true,
        className: "global-styles-ui-screen-style-variations",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.CardBody, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_style_variations_content.StyleVariationsContent, {}) })
      }
    )
  ] });
}
var screen_style_variations_default = ScreenStyleVariations;
//# sourceMappingURL=screen-style-variations.cjs.map
