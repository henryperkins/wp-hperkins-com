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

// packages/global-styles-ui/src/font-sizes/font-sizes-count.tsx
var font_sizes_count_exports = {};
__export(font_sizes_count_exports, {
  default: () => font_sizes_count_default
});
module.exports = __toCommonJS(font_sizes_count_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_subtitle = require("../subtitle.cjs");
var import_navigation_button = require("../navigation-button.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function FontSizes() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 2, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalHStack, { justify: "space-between", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_subtitle.Subtitle, { level: 3, children: (0, import_i18n.__)("Font Sizes") }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalItemGroup, { isBordered: true, isSeparated: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_navigation_button.NavigationButtonAsItem, { path: "/typography/font-sizes", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { direction: "row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: (0, import_i18n.__)("Font size presets") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icons.Icon, { icon: (0, import_i18n.isRTL)() ? import_icons.chevronLeft : import_icons.chevronRight })
    ] }) }) })
  ] });
}
var font_sizes_count_default = FontSizes;
//# sourceMappingURL=font-sizes-count.cjs.map
