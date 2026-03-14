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

// packages/global-styles-ui/src/font-library/utils/sort-font-faces.ts
var sort_font_faces_exports = {};
__export(sort_font_faces_exports, {
  sortFontFaces: () => sortFontFaces
});
module.exports = __toCommonJS(sort_font_faces_exports);
function getNumericFontWeight(value) {
  switch (value) {
    case "normal":
      return 400;
    case "bold":
      return 700;
    case "bolder":
      return 500;
    case "lighter":
      return 300;
    default:
      return parseInt(value, 10);
  }
}
function sortFontFaces(faces) {
  return faces.sort((a, b) => {
    if (a.fontStyle === "normal" && b.fontStyle !== "normal") {
      return -1;
    }
    if (b.fontStyle === "normal" && a.fontStyle !== "normal") {
      return 1;
    }
    if (a.fontStyle === b.fontStyle) {
      return getNumericFontWeight(a.fontWeight?.toString() ?? "normal") - getNumericFontWeight(b.fontWeight?.toString() ?? "normal");
    }
    if (!a.fontStyle || !b.fontStyle) {
      return !a.fontStyle ? 1 : -1;
    }
    return a.fontStyle.localeCompare(b.fontStyle);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sortFontFaces
});
//# sourceMappingURL=sort-font-faces.cjs.map
