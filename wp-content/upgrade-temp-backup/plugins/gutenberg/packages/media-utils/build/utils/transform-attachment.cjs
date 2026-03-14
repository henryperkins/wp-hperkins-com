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

// packages/media-utils/src/utils/transform-attachment.ts
var transform_attachment_exports = {};
__export(transform_attachment_exports, {
  transformAttachment: () => transformAttachment
});
module.exports = __toCommonJS(transform_attachment_exports);
function transformAttachment(attachment) {
  const { alt_text, source_url, ...savedMediaProps } = attachment;
  return {
    ...savedMediaProps,
    alt: attachment.alt_text,
    caption: attachment.caption?.raw ?? "",
    title: attachment.title.raw,
    url: attachment.source_url,
    poster: attachment._embedded?.["wp:featuredmedia"]?.[0]?.source_url || void 0
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  transformAttachment
});
//# sourceMappingURL=transform-attachment.cjs.map
