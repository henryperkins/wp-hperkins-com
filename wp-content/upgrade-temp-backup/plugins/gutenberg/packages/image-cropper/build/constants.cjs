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

// packages/image-cropper/src/constants.ts
var constants_exports = {};
__export(constants_exports, {
  DEFAULT_ASPECT_RATIO_SLUG: () => DEFAULT_ASPECT_RATIO_SLUG,
  MAX_ZOOM: () => MAX_ZOOM,
  MIN_ZOOM: () => MIN_ZOOM
});
module.exports = __toCommonJS(constants_exports);
var MIN_ZOOM = 1;
var MAX_ZOOM = 5;
var DEFAULT_ASPECT_RATIO_SLUG = "original";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_ASPECT_RATIO_SLUG,
  MAX_ZOOM,
  MIN_ZOOM
});
//# sourceMappingURL=constants.cjs.map
