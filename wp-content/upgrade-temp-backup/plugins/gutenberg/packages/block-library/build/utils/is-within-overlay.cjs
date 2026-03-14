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

// packages/block-library/src/utils/is-within-overlay.js
var is_within_overlay_exports = {};
__export(is_within_overlay_exports, {
  isWithinNavigationOverlay: () => isWithinNavigationOverlay
});
module.exports = __toCommonJS(is_within_overlay_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_constants = require("../navigation/constants.cjs");
function isWithinNavigationOverlay() {
  const editorStore = (0, import_data.select)("core/editor");
  if (!editorStore) {
    return false;
  }
  const { getCurrentPostType, getCurrentPostId } = editorStore;
  const { getEditedEntityRecord } = (0, import_data.select)(import_core_data.store);
  const postType = getCurrentPostType?.();
  const postId = getCurrentPostId?.();
  if (postType === "wp_template_part" && postId) {
    const templatePart = getEditedEntityRecord(
      "postType",
      "wp_template_part",
      postId
    );
    return templatePart?.area === import_constants.NAVIGATION_OVERLAY_TEMPLATE_PART_AREA;
  }
  return false;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isWithinNavigationOverlay
});
//# sourceMappingURL=is-within-overlay.cjs.map
