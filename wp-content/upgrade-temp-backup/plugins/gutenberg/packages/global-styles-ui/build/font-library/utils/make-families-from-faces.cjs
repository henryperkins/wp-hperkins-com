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

// packages/global-styles-ui/src/font-library/utils/make-families-from-faces.ts
var make_families_from_faces_exports = {};
__export(make_families_from_faces_exports, {
  default: () => makeFamiliesFromFaces
});
module.exports = __toCommonJS(make_families_from_faces_exports);
var import_components = require("@wordpress/components");
var import_lock_unlock = require("../../lock-unlock.cjs");
var { kebabCase } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function makeFamiliesFromFaces(fontFaces) {
  const fontFamiliesObject = fontFaces.reduce(
    (acc, item) => {
      if (!acc[item.fontFamily]) {
        acc[item.fontFamily] = {
          name: item.fontFamily,
          fontFamily: item.fontFamily,
          slug: kebabCase(item.fontFamily.toLowerCase()),
          fontFace: []
        };
      }
      acc[item.fontFamily].fontFace.push(item);
      return acc;
    },
    {}
  );
  return Object.values(fontFamiliesObject);
}
//# sourceMappingURL=make-families-from-faces.cjs.map
