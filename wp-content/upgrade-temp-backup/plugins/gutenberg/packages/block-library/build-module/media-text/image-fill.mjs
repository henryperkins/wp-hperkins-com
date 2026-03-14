// packages/block-library/src/media-text/image-fill.js
function imageFillStyles(url, focalPoint) {
  return url ? {
    objectPosition: focalPoint ? `${Math.round(focalPoint.x * 100)}% ${Math.round(
      focalPoint.y * 100
    )}%` : `50% 50%`
  } : {};
}
export {
  imageFillStyles
};
//# sourceMappingURL=image-fill.mjs.map
