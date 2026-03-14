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

// packages/global-styles-ui/src/color-preview.tsx
var color_preview_exports = {};
__export(color_preview_exports, {
  ColorPreview: () => ColorPreview
});
module.exports = __toCommonJS(color_preview_exports);
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_global_styles_engine = require("@wordpress/global-styles-engine");
var import_context = require("./context.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function ColorPreview() {
  const { merged } = (0, import_element.useContext)(import_context.GlobalStylesContext);
  const backgroundColor = (0, import_global_styles_engine.getStyle)(merged, "color.background") || "#ffffff";
  const textColor = (0, import_global_styles_engine.getStyle)(merged, "color.text") || "#000000";
  const palette = merged?.settings?.color?.palette;
  let paletteColors = [];
  if (Array.isArray(palette)) {
    paletteColors = palette;
  } else if (palette && typeof palette === "object") {
    paletteColors = palette.theme || palette.custom || [];
  }
  const previewColors = paletteColors.slice(0, 4);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__experimentalHStack,
    {
      spacing: 0,
      justify: "center",
      style: {
        height: "100%",
        overflow: "hidden",
        minHeight: "40px"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            style: {
              backgroundColor,
              width: "25%",
              height: "100%",
              minHeight: "40px"
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            style: {
              backgroundColor: textColor,
              width: "25%",
              height: "100%",
              minHeight: "40px"
            }
          }
        ),
        previewColors.slice(0, 2).map((color, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            style: {
              backgroundColor: color.color,
              width: "25%",
              height: "100%",
              minHeight: "40px"
            }
          },
          index
        ))
      ]
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ColorPreview
});
//# sourceMappingURL=color-preview.cjs.map
