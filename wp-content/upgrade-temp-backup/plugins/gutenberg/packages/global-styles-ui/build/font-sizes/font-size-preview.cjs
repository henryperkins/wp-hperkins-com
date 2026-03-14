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

// packages/global-styles-ui/src/font-sizes/font-size-preview.tsx
var font_size_preview_exports = {};
__export(font_size_preview_exports, {
  default: () => font_size_preview_default
});
module.exports = __toCommonJS(font_size_preview_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_i18n = require("@wordpress/i18n");
var import_hooks = require("../hooks.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function FontSizePreview({ fontSize }) {
  const [font] = (0, import_hooks.useStyle)("typography");
  const input = typeof fontSize?.fluid === "object" && fontSize?.fluid?.min && fontSize?.fluid?.max ? {
    minimumFontSize: fontSize.fluid.min,
    maximumFontSize: fontSize.fluid.max
  } : {
    fontSize: fontSize.size
  };
  const computedFontSize = (0, import_block_editor.getComputedFluidTypographyValue)(input);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: "global-styles-ui-typography-preview",
      style: {
        fontSize: computedFontSize,
        fontFamily: font?.fontFamily ?? "serif"
      },
      children: (0, import_i18n.__)("Aa")
    }
  );
}
var font_size_preview_default = FontSizePreview;
//# sourceMappingURL=font-size-preview.cjs.map
