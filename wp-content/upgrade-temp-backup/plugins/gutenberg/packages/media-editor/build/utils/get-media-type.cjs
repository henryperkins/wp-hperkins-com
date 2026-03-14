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

// packages/media-editor/src/utils/get-media-type.ts
var get_media_type_exports = {};
__export(get_media_type_exports, {
  getMediaTypeFromMimeType: () => getMediaTypeFromMimeType
});
module.exports = __toCommonJS(get_media_type_exports);
function getMediaTypeFromMimeType(mimeType) {
  if (!mimeType) {
    return { type: "application" };
  }
  if (mimeType.startsWith("image/")) {
    return { type: "image" };
  }
  if (mimeType.startsWith("video/")) {
    return { type: "video" };
  }
  if (mimeType.startsWith("audio/")) {
    return { type: "audio" };
  }
  return { type: "application" };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getMediaTypeFromMimeType
});
//# sourceMappingURL=get-media-type.cjs.map
