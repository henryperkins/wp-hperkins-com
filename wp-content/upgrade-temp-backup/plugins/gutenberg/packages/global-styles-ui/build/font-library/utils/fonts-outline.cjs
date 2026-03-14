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

// packages/global-styles-ui/src/font-library/utils/fonts-outline.ts
var fonts_outline_exports = {};
__export(fonts_outline_exports, {
  getFontsOutline: () => getFontsOutline,
  isFontFontFaceInOutline: () => isFontFontFaceInOutline
});
module.exports = __toCommonJS(fonts_outline_exports);
function getFontsOutline(fonts) {
  return fonts.reduce(
    (acc, font) => ({
      ...acc,
      [font.slug]: (font?.fontFace || []).reduce(
        (faces, face) => ({
          ...faces,
          [`${face.fontStyle}-${face.fontWeight}`]: true
        }),
        {}
      )
    }),
    {}
  );
}
function isFontFontFaceInOutline(slug, face, outline) {
  if (!face) {
    return !!outline[slug];
  }
  return !!outline[slug]?.[`${face.fontStyle}-${face.fontWeight}`];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getFontsOutline,
  isFontFontFaceInOutline
});
//# sourceMappingURL=fonts-outline.cjs.map
