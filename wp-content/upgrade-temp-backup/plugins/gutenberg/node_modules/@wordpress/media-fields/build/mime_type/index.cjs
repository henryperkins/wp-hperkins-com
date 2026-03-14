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

// packages/media-fields/src/mime_type/index.ts
var mime_type_exports = {};
__export(mime_type_exports, {
  default: () => mime_type_default
});
module.exports = __toCommonJS(mime_type_exports);
var import_i18n = require("@wordpress/i18n");
var mimeTypeField = {
  id: "mime_type",
  type: "text",
  label: (0, import_i18n.__)("File type"),
  getValue: ({ item }) => item?.mime_type || "",
  render: ({ item }) => item?.mime_type || "-",
  // Disable sorting until REST API support for ordering my `mime_type` is added.
  // See: https://core.trac.wordpress.org/ticket/64073
  enableSorting: false,
  filterBy: false,
  readOnly: true
};
var mime_type_default = mimeTypeField;
//# sourceMappingURL=index.cjs.map
