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

// packages/global-styles-ui/src/preset-colors.tsx
var preset_colors_exports = {};
__export(preset_colors_exports, {
  default: () => PresetColors
});
module.exports = __toCommonJS(preset_colors_exports);
var import_preview_hooks = require("./preview-hooks.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PresetColors() {
  const { paletteColors } = (0, import_preview_hooks.useStylesPreviewColors)();
  return paletteColors.slice(0, 4).map(({ slug, color }, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      style: {
        flexGrow: 1,
        height: "100%",
        background: color
      }
    },
    `${slug}-${index}`
  ));
}
//# sourceMappingURL=preset-colors.cjs.map
