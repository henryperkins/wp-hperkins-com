// packages/block-editor/src/components/media-placeholder/utils.js
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
export {
  getComputedAcceptAttribute
};
//# sourceMappingURL=utils.mjs.map
