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

// packages/global-styles-ui/src/preview-hooks.tsx
var preview_hooks_exports = {};
__export(preview_hooks_exports, {
  useStylesPreviewColors: () => useStylesPreviewColors
});
module.exports = __toCommonJS(preview_hooks_exports);
var import_hooks = require("./hooks.cjs");
function useStylesPreviewColors() {
  const [textColor = "black"] = (0, import_hooks.useStyle)("color.text");
  const [backgroundColor = "white"] = (0, import_hooks.useStyle)("color.background");
  const [headingColor = textColor] = (0, import_hooks.useStyle)(
    "elements.h1.color.text"
  );
  const [linkColor = headingColor] = (0, import_hooks.useStyle)(
    "elements.link.color.text"
  );
  const [buttonBackgroundColor = linkColor] = (0, import_hooks.useStyle)(
    "elements.button.color.background"
  );
  const [coreColors] = (0, import_hooks.useSetting)("color.palette.core") || [];
  const [themeColors] = (0, import_hooks.useSetting)("color.palette.theme") || [];
  const [customColors] = (0, import_hooks.useSetting)("color.palette.custom") || [];
  const paletteColors = (themeColors ?? []).concat(customColors ?? []).concat(coreColors ?? []);
  const textColorObject = paletteColors.filter(
    ({ color }) => color === textColor
  );
  const buttonBackgroundColorObject = paletteColors.filter(
    ({ color }) => color === buttonBackgroundColor
  );
  const highlightedColors = textColorObject.concat(buttonBackgroundColorObject).concat(paletteColors).filter(
    // we exclude these background color because it is already visible in the preview.
    ({ color }) => color !== backgroundColor
  ).slice(0, 2);
  return {
    paletteColors,
    highlightedColors
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useStylesPreviewColors
});
//# sourceMappingURL=preview-hooks.cjs.map
