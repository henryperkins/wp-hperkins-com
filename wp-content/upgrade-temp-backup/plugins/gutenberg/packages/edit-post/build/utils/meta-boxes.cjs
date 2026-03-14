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

// packages/edit-post/src/utils/meta-boxes.js
var meta_boxes_exports = {};
__export(meta_boxes_exports, {
  getMetaBoxContainer: () => getMetaBoxContainer
});
module.exports = __toCommonJS(meta_boxes_exports);
var getMetaBoxContainer = (location) => {
  const area = document.querySelector(
    `.edit-post-meta-boxes-area.is-${location} .metabox-location-${location}`
  );
  if (area) {
    return area;
  }
  return document.querySelector("#metaboxes .metabox-location-" + location);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getMetaBoxContainer
});
//# sourceMappingURL=meta-boxes.cjs.map
