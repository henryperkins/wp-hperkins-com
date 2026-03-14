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

// packages/edit-site/src/components/media/index.js
var media_exports = {};
__export(media_exports, {
  default: () => media_default
});
module.exports = __toCommonJS(media_exports);
var import_core_data = require("@wordpress/core-data");
var import_jsx_runtime = require("react/jsx-runtime");
function Media({ id, size = ["large", "medium", "thumbnail"], ...props }) {
  const { record: media } = (0, import_core_data.useEntityRecord)("postType", "attachment", id);
  const currentSize = size.find(
    (s) => !!media?.media_details?.sizes?.[s]
  );
  const mediaUrl = media?.media_details?.sizes?.[currentSize]?.source_url || media?.source_url;
  if (!mediaUrl) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { ...props, src: mediaUrl, alt: media.alt_text });
}
var media_default = Media;
//# sourceMappingURL=index.cjs.map
