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

// packages/global-styles-ui/src/font-library/utils/filter-fonts.ts
var filter_fonts_exports = {};
__export(filter_fonts_exports, {
  default: () => filterFonts
});
module.exports = __toCommonJS(filter_fonts_exports);
function filterFonts(fonts, filters) {
  const { category, search } = filters;
  let filteredFonts = fonts || [];
  if (category && category !== "all") {
    filteredFonts = filteredFonts.filter(
      (font) => font.categories && font.categories.indexOf(category) !== -1
    );
  }
  if (search) {
    filteredFonts = filteredFonts.filter(
      (font) => font.font_family_settings && font.font_family_settings.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  return filteredFonts;
}
//# sourceMappingURL=filter-fonts.cjs.map
