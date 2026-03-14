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

// packages/global-styles-ui/src/font-library/utils/toggleFont.ts
var toggleFont_exports = {};
__export(toggleFont_exports, {
  toggleFont: () => toggleFont
});
module.exports = __toCommonJS(toggleFont_exports);
function toggleFont(font, face, initialfonts = []) {
  const isFontActivated = (f) => f.slug === font.slug;
  const getActivatedFont = (fonts) => fonts.find(isFontActivated);
  const toggleEntireFontFamily = (activatedFont2) => {
    if (!activatedFont2) {
      return [...initialfonts, font];
    }
    return initialfonts.filter(
      (f) => !isFontActivated(f)
    );
  };
  const toggleFontVariant = (activatedFont2) => {
    const isFaceActivated = (f) => f.fontWeight === face.fontWeight && f.fontStyle === face.fontStyle;
    if (!activatedFont2) {
      return [...initialfonts, { ...font, fontFace: [face] }];
    }
    let newFontFaces = activatedFont2.fontFace || [];
    if (newFontFaces.find(isFaceActivated)) {
      newFontFaces = newFontFaces.filter(
        (f) => !isFaceActivated(f)
      );
    } else {
      newFontFaces = [...newFontFaces, face];
    }
    if (newFontFaces.length === 0) {
      return initialfonts.filter(
        (f) => !isFontActivated(f)
      );
    }
    return initialfonts.map(
      (f) => isFontActivated(f) ? { ...f, fontFace: newFontFaces } : f
    );
  };
  const activatedFont = getActivatedFont(initialfonts);
  if (!face) {
    return toggleEntireFontFamily(activatedFont);
  }
  return toggleFontVariant(activatedFont);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  toggleFont
});
//# sourceMappingURL=toggleFont.cjs.map
