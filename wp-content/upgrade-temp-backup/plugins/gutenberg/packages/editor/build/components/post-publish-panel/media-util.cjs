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

// packages/editor/src/components/post-publish-panel/media-util.js
var media_util_exports = {};
__export(media_util_exports, {
  fetchMedia: () => fetchMedia,
  generateUniqueBasenames: () => generateUniqueBasenames
});
module.exports = __toCommonJS(media_util_exports);
var import_uuid = require("uuid");
var import_url = require("@wordpress/url");
function generateUniqueBasenames(urls) {
  const basenames = /* @__PURE__ */ new Set();
  return Object.fromEntries(
    urls.map((url) => {
      const filename = (0, import_url.getFilename)(url);
      let basename = "";
      if (filename) {
        const parts = filename.split(".");
        if (parts.length > 1) {
          parts.pop();
        }
        basename = parts.join(".");
      }
      if (!basename) {
        basename = (0, import_uuid.v4)();
      }
      if (basenames.has(basename)) {
        basename = `${basename}-${(0, import_uuid.v4)()}`;
      }
      basenames.add(basename);
      return [url, basename];
    })
  );
}
function fetchMedia(urls) {
  return Object.fromEntries(
    Object.entries(generateUniqueBasenames(urls)).map(
      ([url, basename]) => {
        const filePromise = window.fetch(url.includes("?") ? url : url + "?").then((response) => response.blob()).then((blob) => {
          return new File([blob], `${basename}.png`, {
            type: blob.type
          });
        });
        return [url, filePromise];
      }
    )
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fetchMedia,
  generateUniqueBasenames
});
//# sourceMappingURL=media-util.cjs.map
