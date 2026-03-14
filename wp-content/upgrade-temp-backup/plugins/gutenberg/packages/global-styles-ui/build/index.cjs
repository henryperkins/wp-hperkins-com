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

// packages/global-styles-ui/src/index.ts
var index_exports = {};
__export(index_exports, {
  ColorVariations: () => import_color_variations.ColorVariations,
  FontCollection: () => import_font_collection.default,
  FontLibrary: () => import_font_library.FontLibrary,
  FontLibraryContext: () => import_context2.FontLibraryContext,
  FontLibraryProvider: () => import_context.default,
  GlobalStylesUI: () => import_global_styles_ui.GlobalStylesUI,
  InstalledFonts: () => import_installed_fonts.default,
  StyleVariations: () => import_style_variations.StyleVariations,
  TypographyVariations: () => import_typography_variations.TypographyVariations,
  UploadFonts: () => import_upload_fonts.default,
  useGlobalStylesRevisions: () => import_use_global_styles_revisions.default
});
module.exports = __toCommonJS(index_exports);
var import_global_styles_ui = require("./global-styles-ui.cjs");
var import_style_variations = require("./style-variations.cjs");
var import_color_variations = require("./color-variations.cjs");
var import_typography_variations = require("./typography-variations.cjs");
var import_use_global_styles_revisions = __toESM(require("./screen-revisions/use-global-styles-revisions.cjs"));
var import_font_library = require("./font-library/font-library.cjs");
var import_context = __toESM(require("./font-library/context.cjs"));
var import_context2 = require("./font-library/context.cjs");
var import_installed_fonts = __toESM(require("./font-library/installed-fonts.cjs"));
var import_upload_fonts = __toESM(require("./font-library/upload-fonts.cjs"));
var import_font_collection = __toESM(require("./font-library/font-collection.cjs"));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ColorVariations,
  FontCollection,
  FontLibrary,
  FontLibraryContext,
  FontLibraryProvider,
  GlobalStylesUI,
  InstalledFonts,
  StyleVariations,
  TypographyVariations,
  UploadFonts,
  useGlobalStylesRevisions
});
//# sourceMappingURL=index.cjs.map
