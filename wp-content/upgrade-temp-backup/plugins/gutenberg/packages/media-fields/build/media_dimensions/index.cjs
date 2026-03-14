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

// packages/media-fields/src/media_dimensions/index.ts
var media_dimensions_exports = {};
__export(media_dimensions_exports, {
  default: () => media_dimensions_default
});
module.exports = __toCommonJS(media_dimensions_exports);
var import_i18n = require("@wordpress/i18n");
var mediaDimensionsField = {
  id: "media_dimensions",
  type: "text",
  label: (0, import_i18n.__)("Dimensions"),
  getValue: ({ item }) => item?.media_details?.width && item?.media_details?.height ? (0, import_i18n.sprintf)(
    // translators: 1: Width. 2: Height.
    (0, import_i18n._x)("%1$s \xD7 %2$s", "image dimensions"),
    item?.media_details?.width?.toString(),
    item?.media_details?.height?.toString()
  ) : "",
  isVisible: (item) => {
    return !!(item?.media_details?.width && item?.media_details?.height);
  },
  enableSorting: false,
  filterBy: false,
  readOnly: true
};
var media_dimensions_default = mediaDimensionsField;
//# sourceMappingURL=index.cjs.map
