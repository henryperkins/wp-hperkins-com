"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/global-styles-ui/src/font-library/library-font-details.tsx
var library_font_details_exports = {};
__export(library_font_details_exports, {
  default: () => library_font_details_default
});
module.exports = __toCommonJS(library_font_details_exports);
var import_components = require("@wordpress/components");
var import_library_font_variant = __toESM(require("./library-font-variant.cjs"));
var import_sort_font_faces = require("./utils/sort-font-faces.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function LibraryFontDetails({ font }) {
  const fontFaces = font.fontFace && font.fontFace.length ? (0, import_sort_font_faces.sortFontFaces)(font.fontFace) : [
    {
      fontFamily: font.fontFamily,
      fontStyle: "normal",
      fontWeight: "400"
    }
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { margin: 4 }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 0, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { margin: 8 }),
      fontFaces.map((face, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_library_font_variant.default,
        {
          font,
          face
        },
        `face${i}`
      ))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { margin: 8 })
  ] });
}
var library_font_details_default = LibraryFontDetails;
//# sourceMappingURL=library-font-details.cjs.map
