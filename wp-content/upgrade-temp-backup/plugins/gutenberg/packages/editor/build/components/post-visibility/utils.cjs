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

// packages/editor/src/components/post-visibility/utils.js
var utils_exports = {};
__export(utils_exports, {
  VISIBILITY_OPTIONS: () => VISIBILITY_OPTIONS
});
module.exports = __toCommonJS(utils_exports);
var import_i18n = require("@wordpress/i18n");
var VISIBILITY_OPTIONS = [
  {
    label: (0, import_i18n.__)("Public"),
    value: "public",
    description: (0, import_i18n.__)("Visible to everyone.")
  },
  {
    label: (0, import_i18n.__)("Private"),
    value: "private",
    description: (0, import_i18n.__)("Only visible to site admins and editors.")
  },
  {
    label: (0, import_i18n.__)("Password protected"),
    value: "password",
    description: (0, import_i18n.__)("Only visible to those who know the password.")
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VISIBILITY_OPTIONS
});
//# sourceMappingURL=utils.cjs.map
