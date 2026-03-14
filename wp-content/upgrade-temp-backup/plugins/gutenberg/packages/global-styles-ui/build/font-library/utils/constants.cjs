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

// packages/global-styles-ui/src/font-library/utils/constants.ts
var constants_exports = {};
__export(constants_exports, {
  ALLOWED_FILE_EXTENSIONS: () => ALLOWED_FILE_EXTENSIONS,
  FONT_STYLES: () => FONT_STYLES,
  FONT_WEIGHTS: () => FONT_WEIGHTS
});
module.exports = __toCommonJS(constants_exports);
var import_i18n = require("@wordpress/i18n");
var ALLOWED_FILE_EXTENSIONS = ["otf", "ttf", "woff", "woff2"];
var FONT_WEIGHTS = {
  100: (0, import_i18n._x)("Thin", "font weight"),
  200: (0, import_i18n._x)("Extra-light", "font weight"),
  300: (0, import_i18n._x)("Light", "font weight"),
  400: (0, import_i18n._x)("Normal", "font weight"),
  500: (0, import_i18n._x)("Medium", "font weight"),
  600: (0, import_i18n._x)("Semi-bold", "font weight"),
  700: (0, import_i18n._x)("Bold", "font weight"),
  800: (0, import_i18n._x)("Extra-bold", "font weight"),
  900: (0, import_i18n._x)("Black", "font weight")
};
var FONT_STYLES = {
  normal: (0, import_i18n._x)("Normal", "font style"),
  italic: (0, import_i18n._x)("Italic", "font style")
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ALLOWED_FILE_EXTENSIONS,
  FONT_STYLES,
  FONT_WEIGHTS
});
//# sourceMappingURL=constants.cjs.map
