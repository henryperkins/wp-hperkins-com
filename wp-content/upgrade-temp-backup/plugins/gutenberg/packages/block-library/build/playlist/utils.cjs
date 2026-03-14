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

// packages/block-library/src/playlist/utils.js
var utils_exports = {};
__export(utils_exports, {
  getTrackAttributes: () => getTrackAttributes
});
module.exports = __toCommonJS(utils_exports);
var import_uuid = require("uuid");
var import_i18n = require("@wordpress/i18n");
function getTrackAttributes(media) {
  return {
    id: media.id || media.url,
    // Attachment ID or URL.
    uniqueId: (0, import_uuid.v4)(),
    // Unique ID for the track.
    src: media.url,
    title: media.title,
    artist: media.artist || media?.meta?.artist || media?.media_details?.artist || (0, import_i18n.__)("Unknown artist"),
    album: media.album || media?.meta?.album || media?.media_details?.album || (0, import_i18n.__)("Unknown album"),
    length: media?.fileLength || media?.media_details?.length_formatted,
    // Prevent using the default media attachment icon as the track image.
    // Note: Image is not available when a new track is uploaded.
    image: media?.image?.src && media?.image?.src.endsWith("/images/media/audio.svg") ? "" : media?.image?.src
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getTrackAttributes
});
//# sourceMappingURL=utils.cjs.map
