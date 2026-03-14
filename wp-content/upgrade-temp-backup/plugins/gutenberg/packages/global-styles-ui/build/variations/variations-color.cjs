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

// packages/global-styles-ui/src/variations/variations-color.tsx
var variations_color_exports = {};
__export(variations_color_exports, {
  default: () => ColorVariations
});
module.exports = __toCommonJS(variations_color_exports);
var import_components = require("@wordpress/components");
var import_preview_colors = __toESM(require("../preview-colors.cjs"));
var import_hooks = require("../hooks.cjs");
var import_subtitle = require("../subtitle.cjs");
var import_variation = __toESM(require("./variation.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var propertiesToFilter = ["color"];
function ColorVariations({
  title,
  gap = 2
}) {
  const colorVariations = (0, import_hooks.useCurrentMergeThemeStyleVariationsWithUserConfig)(propertiesToFilter);
  if (colorVariations?.length <= 1) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 3, children: [
    title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_subtitle.Subtitle, { level: 3, children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalGrid, { gap, children: colorVariations.map((variation, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_variation.default,
      {
        variation,
        isPill: true,
        properties: propertiesToFilter,
        showTooltip: true,
        children: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_preview_colors.default, {})
      },
      index
    )) })
  ] });
}
//# sourceMappingURL=variations-color.cjs.map
