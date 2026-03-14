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

// packages/image-cropper/src/index.ts
var index_exports = {};
__export(index_exports, {
  ImageCropper: () => import_image_cropper.default,
  ImageCropperProvider: () => import_provider.default,
  normalizeRotation: () => import_utils.normalizeRotation,
  useImageCropper: () => import_provider.useImageCropper
});
module.exports = __toCommonJS(index_exports);
var import_image_cropper = __toESM(require("./components/image-cropper/index.cjs"));
var import_provider = __toESM(require("./provider/index.cjs"));
var import_utils = require("./utils.cjs");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ImageCropper,
  ImageCropperProvider,
  normalizeRotation,
  useImageCropper
});
//# sourceMappingURL=index.cjs.map
