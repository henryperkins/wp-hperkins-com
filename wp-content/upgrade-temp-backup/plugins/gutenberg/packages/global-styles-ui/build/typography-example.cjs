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

// packages/global-styles-ui/src/typography-example.tsx
var typography_example_exports = {};
__export(typography_example_exports, {
  default: () => PreviewTypography
});
module.exports = __toCommonJS(typography_example_exports);
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_context = require("./context.cjs");
var import_preview_styles = require("./font-library/utils/preview-styles.cjs");
var import_utils = require("./utils.cjs");
var import_hooks = require("./hooks.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PreviewTypography({
  fontSize,
  variation
}) {
  const { base } = (0, import_element.useContext)(import_context.GlobalStylesContext);
  let config = base;
  if (variation) {
    config = { ...base, ...variation };
  }
  const [textColor] = (0, import_hooks.useStyle)("color.text");
  const [bodyFontFamilies, headingFontFamilies] = (0, import_utils.getFontFamilies)(config);
  const bodyPreviewStyle = bodyFontFamilies ? (0, import_preview_styles.getFamilyPreviewStyle)(bodyFontFamilies) : {};
  const headingPreviewStyle = headingFontFamilies ? (0, import_preview_styles.getFamilyPreviewStyle)(headingFontFamilies) : {};
  if (textColor) {
    bodyPreviewStyle.color = textColor;
    headingPreviewStyle.color = textColor;
  }
  if (fontSize) {
    bodyPreviewStyle.fontSize = fontSize;
    headingPreviewStyle.fontSize = fontSize;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__unstableMotion.div,
    {
      animate: {
        scale: 1,
        opacity: 1
      },
      initial: {
        scale: 0.1,
        opacity: 0
      },
      transition: {
        delay: 0.3,
        type: "tween"
      },
      style: {
        textAlign: "center",
        lineHeight: 1
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: headingPreviewStyle, children: (0, import_i18n._x)("A", "Uppercase letter A") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: bodyPreviewStyle, children: (0, import_i18n._x)("a", "Lowercase letter A") })
      ]
    }
  );
}
//# sourceMappingURL=typography-example.cjs.map
