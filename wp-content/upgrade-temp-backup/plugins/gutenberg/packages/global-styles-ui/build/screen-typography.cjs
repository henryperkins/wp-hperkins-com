"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/global-styles-ui/src/screen-typography.tsx
var screen_typography_exports = {};
__export(screen_typography_exports, {
  default: () => screen_typography_default
});
module.exports = __toCommonJS(screen_typography_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_screen_header = require("./screen-header.cjs");
var import_screen_body = require("./screen-body.cjs");
var import_typography_elements = __toESM(require("./typography-elements.cjs"));
var import_variations_typography = __toESM(require("./variations/variations-typography.cjs"));
var import_font_families = __toESM(require("./font-families.cjs"));
var import_font_sizes_count = __toESM(require("./font-sizes/font-sizes-count.cjs"));
var import_context = require("./context.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function ScreenTypography() {
  const { fontLibraryEnabled } = (0, import_element.useContext)(import_context.GlobalStylesContext);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_screen_header.ScreenHeader,
      {
        title: (0, import_i18n.__)("Typography"),
        description: (0, import_i18n.__)(
          "Available fonts, typographic styles, and the application of those styles."
        )
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_body.ScreenBody, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 7, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_variations_typography.default, { title: (0, import_i18n.__)("Typesets") }),
      fontLibraryEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_font_families.default, {}),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_typography_elements.default, {}),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_font_sizes_count.default, {})
    ] }) })
  ] });
}
var screen_typography_default = ScreenTypography;
//# sourceMappingURL=screen-typography.cjs.map
