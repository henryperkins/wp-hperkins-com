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

// packages/media-fields/src/filename/index.ts
var filename_exports = {};
__export(filename_exports, {
  default: () => filename_default
});
module.exports = __toCommonJS(filename_exports);
var import_i18n = require("@wordpress/i18n");
var import_url = require("@wordpress/url");
var import_view = __toESM(require("./view.cjs"));
var filenameField = {
  id: "filename",
  type: "text",
  label: (0, import_i18n.__)("File name"),
  getValue: ({ item }) => (0, import_url.getFilename)(item?.source_url || ""),
  render: import_view.default,
  enableSorting: false,
  filterBy: false,
  readOnly: true
};
var filename_default = filenameField;
//# sourceMappingURL=index.cjs.map
