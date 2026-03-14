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

// packages/media-fields/src/filesize/index.tsx
var filesize_exports = {};
__export(filesize_exports, {
  default: () => filesize_default
});
module.exports = __toCommonJS(filesize_exports);
var import_i18n = require("@wordpress/i18n");
var KB_IN_BYTES = 1024;
var MB_IN_BYTES = 1024 * KB_IN_BYTES;
var GB_IN_BYTES = 1024 * MB_IN_BYTES;
var TB_IN_BYTES = 1024 * GB_IN_BYTES;
var PB_IN_BYTES = 1024 * TB_IN_BYTES;
var EB_IN_BYTES = 1024 * PB_IN_BYTES;
var ZB_IN_BYTES = 1024 * EB_IN_BYTES;
var YB_IN_BYTES = 1024 * ZB_IN_BYTES;
function getBytesString(bytes, unitSymbol, decimals = 2) {
  return (0, import_i18n.sprintf)(
    // translators: 1: Actual bytes of a file. 2: The unit symbol (e.g. MB).
    (0, import_i18n._x)("%1$s %2$s", "file size"),
    bytes.toLocaleString(void 0, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    }),
    unitSymbol
  );
}
function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) {
    return getBytesString(0, (0, import_i18n._x)("B", "unit symbol"), decimals);
  }
  const quant = {
    /* translators: Unit symbol for yottabyte. */
    [(0, import_i18n._x)("YB", "unit symbol")]: YB_IN_BYTES,
    /* translators: Unit symbol for zettabyte. */
    [(0, import_i18n._x)("ZB", "unit symbol")]: ZB_IN_BYTES,
    /* translators: Unit symbol for exabyte. */
    [(0, import_i18n._x)("EB", "unit symbol")]: EB_IN_BYTES,
    /* translators: Unit symbol for petabyte. */
    [(0, import_i18n._x)("PB", "unit symbol")]: PB_IN_BYTES,
    /* translators: Unit symbol for terabyte. */
    [(0, import_i18n._x)("TB", "unit symbol")]: TB_IN_BYTES,
    /* translators: Unit symbol for gigabyte. */
    [(0, import_i18n._x)("GB", "unit symbol")]: GB_IN_BYTES,
    /* translators: Unit symbol for megabyte. */
    [(0, import_i18n._x)("MB", "unit symbol")]: MB_IN_BYTES,
    /* translators: Unit symbol for kilobyte. */
    [(0, import_i18n._x)("KB", "unit symbol")]: KB_IN_BYTES,
    /* translators: Unit symbol for byte. */
    [(0, import_i18n._x)("B", "unit symbol")]: 1
  };
  for (const [unit, mag] of Object.entries(quant)) {
    if (bytes >= mag) {
      return getBytesString(bytes / mag, unit, decimals);
    }
  }
  return "";
}
var filesizeField = {
  id: "filesize",
  type: "text",
  label: (0, import_i18n.__)("File size"),
  getValue: ({ item }) => item?.media_details?.filesize ? formatFileSize(item?.media_details?.filesize) : "",
  isVisible: (item) => {
    return !!item?.media_details?.filesize;
  },
  enableSorting: false,
  filterBy: false,
  readOnly: true
};
var filesize_default = filesizeField;
//# sourceMappingURL=index.cjs.map
