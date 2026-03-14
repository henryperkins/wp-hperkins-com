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

// packages/upload-media/src/store/constants.ts
var constants_exports = {};
__export(constants_exports, {
  CLIENT_SIDE_SUPPORTED_MIME_TYPES: () => CLIENT_SIDE_SUPPORTED_MIME_TYPES,
  DEFAULT_MAX_CONCURRENT_IMAGE_PROCESSING: () => DEFAULT_MAX_CONCURRENT_IMAGE_PROCESSING,
  DEFAULT_MAX_CONCURRENT_UPLOADS: () => DEFAULT_MAX_CONCURRENT_UPLOADS,
  STORE_NAME: () => STORE_NAME
});
module.exports = __toCommonJS(constants_exports);
var STORE_NAME = "core/upload-media";
var DEFAULT_MAX_CONCURRENT_UPLOADS = 5;
var DEFAULT_MAX_CONCURRENT_IMAGE_PROCESSING = 2;
var CLIENT_SIDE_SUPPORTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif"
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CLIENT_SIDE_SUPPORTED_MIME_TYPES,
  DEFAULT_MAX_CONCURRENT_IMAGE_PROCESSING,
  DEFAULT_MAX_CONCURRENT_UPLOADS,
  STORE_NAME
});
//# sourceMappingURL=constants.cjs.map
