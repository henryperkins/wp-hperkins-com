// packages/media-editor/src/utils/get-media-type.ts
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
export {
  getMediaTypeFromMimeType
};
//# sourceMappingURL=get-media-type.mjs.map
