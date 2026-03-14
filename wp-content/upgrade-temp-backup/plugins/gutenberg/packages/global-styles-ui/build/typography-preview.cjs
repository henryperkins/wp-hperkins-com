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

// packages/global-styles-ui/src/typography-preview.tsx
var typography_preview_exports = {};
__export(typography_preview_exports, {
  default: () => TypographyPreview
});
module.exports = __toCommonJS(typography_preview_exports);
var import_hooks = require("./hooks.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function TypographyPreview({
  name,
  element,
  headingLevel
}) {
  let prefix = "";
  if (element === "heading") {
    prefix = `elements.${headingLevel}.`;
  } else if (element && element !== "text") {
    prefix = `elements.${element}.`;
  }
  const [fontFamily] = (0, import_hooks.useStyle)(prefix + "typography.fontFamily", name);
  const [gradientValue] = (0, import_hooks.useStyle)(prefix + "color.gradient", name);
  const [backgroundColor] = (0, import_hooks.useStyle)(prefix + "color.background", name);
  const [fallbackBackgroundColor] = (0, import_hooks.useStyle)("color.background");
  const [color] = (0, import_hooks.useStyle)(prefix + "color.text", name);
  const [fontSize] = (0, import_hooks.useStyle)(prefix + "typography.fontSize", name);
  const [fontStyle] = (0, import_hooks.useStyle)(prefix + "typography.fontStyle", name);
  const [fontWeight] = (0, import_hooks.useStyle)(prefix + "typography.fontWeight", name);
  const [letterSpacing] = (0, import_hooks.useStyle)(
    prefix + "typography.letterSpacing",
    name
  );
  const extraStyles = element === "link" ? {
    textDecoration: "underline"
  } : {};
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: "global-styles-ui-typography-preview",
      style: {
        fontFamily: fontFamily ?? "serif",
        background: gradientValue ?? backgroundColor ?? fallbackBackgroundColor,
        color,
        fontSize,
        fontStyle,
        fontWeight,
        letterSpacing,
        ...extraStyles
      },
      children: "Aa"
    }
  );
}
//# sourceMappingURL=typography-preview.cjs.map
