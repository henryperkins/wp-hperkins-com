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

// packages/media-fields/src/utils/get-media-type-from-mime-type.ts
var get_media_type_from_mime_type_exports = {};
__export(get_media_type_from_mime_type_exports, {
  getMediaTypeFromMimeType: () => getMediaTypeFromMimeType
});
module.exports = __toCommonJS(get_media_type_from_mime_type_exports);
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
function getMediaTypeFromMimeType(mimeType) {
  if (mimeType.startsWith("image/")) {
    return {
      type: "image",
      label: (0, import_i18n.__)("Image"),
      icon: import_icons.image
    };
  }
  if (mimeType.startsWith("video/")) {
    return {
      type: "video",
      label: (0, import_i18n.__)("Video"),
      icon: import_icons.video
    };
  }
  if (mimeType.startsWith("audio/")) {
    return {
      type: "audio",
      label: (0, import_i18n.__)("Audio"),
      icon: import_icons.audio
    };
  }
  return {
    type: "application",
    label: (0, import_i18n.__)("Application"),
    icon: import_icons.file
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getMediaTypeFromMimeType
});
//# sourceMappingURL=get-media-type-from-mime-type.cjs.map
