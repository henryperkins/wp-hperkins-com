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

// packages/global-styles-ui/src/highlighted-colors.tsx
var highlighted_colors_exports = {};
__export(highlighted_colors_exports, {
  default: () => HighlightedColors
});
module.exports = __toCommonJS(highlighted_colors_exports);
var import_components = require("@wordpress/components");
var import_preview_hooks = require("./preview-hooks.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function HighlightedColors({
  normalizedColorSwatchSize,
  ratio
}) {
  const { highlightedColors } = (0, import_preview_hooks.useStylesPreviewColors)();
  const scaledSwatchSize = normalizedColorSwatchSize * ratio;
  return highlightedColors.map(({ slug, color }, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__unstableMotion.div,
    {
      style: {
        height: scaledSwatchSize,
        width: scaledSwatchSize,
        background: color,
        borderRadius: scaledSwatchSize / 2
      },
      animate: {
        scale: 1,
        opacity: 1
      },
      initial: {
        scale: 0.1,
        opacity: 0
      },
      transition: {
        delay: index === 1 ? 0.2 : 0.1
      }
    },
    `${slug}-${index}`
  ));
}
//# sourceMappingURL=highlighted-colors.cjs.map
