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

// packages/block-editor/src/components/block-visibility/utils.js
var utils_exports = {};
__export(utils_exports, {
  getBlockVisibilityLabel: () => getBlockVisibilityLabel,
  getHideEverywhereCheckboxState: () => getHideEverywhereCheckboxState,
  getViewportCheckboxState: () => getViewportCheckboxState
});
module.exports = __toCommonJS(utils_exports);
var import_i18n = require("@wordpress/i18n");
var import_constants = require("./constants.cjs");
function isBlockHiddenForViewport(block, viewport) {
  if (!block) {
    return false;
  }
  const blockVisibility = block.attributes?.metadata?.blockVisibility;
  if (blockVisibility === true) {
    return false;
  }
  if ("object" !== typeof blockVisibility) {
    return false;
  }
  const viewportConfig = blockVisibility.viewport;
  if (!viewportConfig || "object" !== typeof viewportConfig) {
    return false;
  }
  if (!import_constants.BLOCK_VISIBILITY_VIEWPORT_ENTRIES.some(
    ([, { key }]) => key === viewport
  )) {
    return false;
  }
  return viewportConfig[viewport] === false;
}
function getViewportCheckboxState(blocks, viewport) {
  if (!blocks?.length) {
    return false;
  }
  const hiddenCount = blocks.filter(
    (block) => isBlockHiddenForViewport(block, viewport)
  ).length;
  if (hiddenCount === 0) {
    return false;
  }
  if (hiddenCount === blocks.length) {
    return true;
  }
  return null;
}
function getHideEverywhereCheckboxState(blocks) {
  if (!blocks?.length) {
    return false;
  }
  const hiddenEverywhereCount = blocks.filter(
    (block) => block && block.attributes?.metadata?.blockVisibility === false
  ).length;
  if (hiddenEverywhereCount === 0) {
    return false;
  }
  if (hiddenEverywhereCount === blocks.length) {
    return true;
  }
  return null;
}
function getBlockVisibilityLabel(blockVisibility) {
  if (!blockVisibility && blockVisibility !== false) {
    return null;
  }
  if (blockVisibility === false) {
    return (0, import_i18n.__)("Block is hidden");
  }
  if (blockVisibility?.viewport) {
    const hiddenViewports = import_constants.BLOCK_VISIBILITY_VIEWPORT_ENTRIES.filter(
      ([key]) => blockVisibility.viewport?.[key] === false
    ).map(([, viewport]) => viewport.label);
    if (hiddenViewports.length > 0) {
      return (0, import_i18n.sprintf)(
        /* translators: %s: comma-separated list of viewport names (Desktop, Tablet, Mobile) */
        (0, import_i18n.__)("Block is hidden on %s"),
        hiddenViewports.join(", ")
      );
    }
  }
  return null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getBlockVisibilityLabel,
  getHideEverywhereCheckboxState,
  getViewportCheckboxState
});
//# sourceMappingURL=utils.cjs.map
