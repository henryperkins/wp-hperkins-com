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

// packages/global-styles-ui/src/style-variations-content.tsx
var style_variations_content_exports = {};
__export(style_variations_content_exports, {
  StyleVariationsContent: () => StyleVariationsContent
});
module.exports = __toCommonJS(style_variations_content_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_style_variations_container = __toESM(require("./style-variations-container.cjs"));
var import_variations_typography = __toESM(require("./variations/variations-typography.cjs"));
var import_variations_color = __toESM(require("./variations/variations-color.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function StyleVariationsContent() {
  const gap = 3;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 10, className: "global-styles-ui-variation-container", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_style_variations_container.default, { gap }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_variations_color.default, { title: (0, import_i18n.__)("Color Variations"), gap }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_variations_typography.default, { title: (0, import_i18n.__)("Typography"), gap })
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StyleVariationsContent
});
//# sourceMappingURL=style-variations-content.cjs.map
