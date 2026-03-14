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

// packages/block-editor/src/components/media-placeholder/utils.js
var utils_exports = {};
__export(utils_exports, {
  getComputedAcceptAttribute: () => getComputedAcceptAttribute
});
module.exports = __toCommonJS(utils_exports);
function getComputedAcceptAttribute(allowedTypes, allowedMimeTypes, accept) {
  if (accept) {
    return accept;
  }
  if (!allowedMimeTypes || typeof allowedMimeTypes !== "object" || Object.keys(allowedMimeTypes).length === 0) {
    if (allowedTypes && allowedTypes.length > 0) {
      return allowedTypes.map((type) => `${type}/*`).join(",");
    }
    return void 0;
  }
  if (!allowedTypes || allowedTypes.length === 0) {
    return void 0;
  }
  const acceptedMimeTypes = [];
  for (const [, mimeType] of Object.entries(allowedMimeTypes)) {
    const isAllowed = allowedTypes.some((allowedType) => {
      if (allowedType.includes("/")) {
        return mimeType === allowedType;
      }
      return mimeType.startsWith(`${allowedType}/`);
    });
    if (isAllowed) {
      acceptedMimeTypes.push(mimeType);
    }
  }
  if (acceptedMimeTypes.length > 0) {
    return acceptedMimeTypes.join(",");
  }
  return allowedTypes.map((type) => `${type}/*`).join(",");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getComputedAcceptAttribute
});
//# sourceMappingURL=utils.cjs.map
