// packages/edit-post/src/utils/meta-boxes.js
var getMetaBoxContainer = (location) => {
  const area = document.querySelector(
    `.edit-post-meta-boxes-area.is-${location} .metabox-location-${location}`
  );
  if (area) {
    return area;
  }
  return document.querySelector("#metaboxes .metabox-location-" + location);
};
export {
  getMetaBoxContainer
};
//# sourceMappingURL=meta-boxes.mjs.map
