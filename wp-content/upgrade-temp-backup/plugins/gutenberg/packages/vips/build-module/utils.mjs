// packages/vips/src/utils.ts
function supportsQuality(type) {
  return ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(
    type
  );
}
function supportsAnimation(type) {
  return ["image/webp", "image/gif"].includes(type);
}
function supportsInterlace(type) {
  return ["image/jpeg", "image/gif", "image/png"].includes(type);
}
export {
  supportsAnimation,
  supportsInterlace,
  supportsQuality
};
//# sourceMappingURL=utils.mjs.map
