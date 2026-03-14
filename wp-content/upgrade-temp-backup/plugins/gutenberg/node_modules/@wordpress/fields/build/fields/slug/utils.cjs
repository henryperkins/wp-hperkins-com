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

// packages/fields/src/fields/slug/utils.ts
var utils_exports = {};
__export(utils_exports, {
  getSlug: () => getSlug
});
module.exports = __toCommonJS(utils_exports);
var import_url = require("@wordpress/url");
var import_utils = require("../../actions/utils.cjs");
var getSlug = (item) => {
  if (typeof item !== "object") {
    return "";
  }
  return item.slug || (0, import_url.cleanForSlug)((0, import_utils.getItemTitle)(item)) || item.id.toString();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getSlug
});
//# sourceMappingURL=utils.cjs.map
