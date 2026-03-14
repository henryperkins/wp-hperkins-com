// packages/block-library/src/image/utils.js
import { NEW_TAB_REL, ALLOWED_MEDIA_TYPES } from "./constants.mjs";
function evalAspectRatio(value) {
  const [width, height = 1] = value.split("/").map(Number);
  const aspectRatio = width / height;
  return aspectRatio === Infinity || aspectRatio === 0 ? NaN : aspectRatio;
}
function removeNewTabRel(currentRel) {
  let newRel = currentRel;
  if (currentRel !== void 0 && newRel) {
    NEW_TAB_REL.forEach((relVal) => {
      const regExp = new RegExp("\\b" + relVal + "\\b", "gi");
      newRel = newRel.replace(regExp, "");
    });
    if (newRel !== currentRel) {
      newRel = newRel.trim();
    }
    if (!newRel) {
      newRel = void 0;
    }
  }
  return newRel;
}
function getUpdatedLinkTargetSettings(value, { rel }) {
  const linkTarget = value ? "_blank" : void 0;
  let updatedRel;
  if (!linkTarget && !rel) {
    updatedRel = void 0;
  } else {
    updatedRel = removeNewTabRel(rel);
  }
  return {
    linkTarget,
    rel: updatedRel
  };
}
function getImageSizeAttributes(image, size) {
  const url = image?.media_details?.sizes?.[size]?.source_url;
  if (url) {
    return { url, width: void 0, height: void 0, sizeSlug: size };
  }
  return {};
}
function isValidFileType(file) {
  return ALLOWED_MEDIA_TYPES.some(
    (mediaType) => file.type.indexOf(mediaType) === 0
  );
}
function mediaPosition({ x, y } = { x: 0.5, y: 0.5 }) {
  return `${Math.round(x * 100)}% ${Math.round(y * 100)}%`;
}
export {
  evalAspectRatio,
  getImageSizeAttributes,
  getUpdatedLinkTargetSettings,
  isValidFileType,
  mediaPosition,
  removeNewTabRel
};
//# sourceMappingURL=utils.mjs.map
