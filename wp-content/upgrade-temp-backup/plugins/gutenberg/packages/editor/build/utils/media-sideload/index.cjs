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

// packages/editor/src/utils/media-sideload/index.js
var media_sideload_exports = {};
__export(media_sideload_exports, {
  default: () => media_sideload_default
});
module.exports = __toCommonJS(media_sideload_exports);
var import_media_utils = require("@wordpress/media-utils");
var import_lock_unlock = require("../../lock-unlock.cjs");
var { sideloadMedia: mediaSideload } = (0, import_lock_unlock.unlock)(import_media_utils.privateApis);
var media_sideload_default = mediaSideload;
//# sourceMappingURL=index.cjs.map
