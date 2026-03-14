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

// packages/block-editor/src/components/block-visibility/use-block-visibility.js
var use_block_visibility_exports = {};
__export(use_block_visibility_exports, {
  default: () => useBlockVisibility
});
module.exports = __toCommonJS(use_block_visibility_exports);
var import_compose = require("@wordpress/compose");
var import_constants = require("./constants.cjs");
function useBlockVisibility(options = {}) {
  const {
    blockVisibility = void 0,
    deviceType = import_constants.BLOCK_VISIBILITY_VIEWPORTS.desktop.key
  } = options;
  const isLargerThanMobile = (0, import_compose.useViewportMatch)("mobile", ">=");
  const isLargerThanTablet = (0, import_compose.useViewportMatch)("medium", ">=");
  let currentViewport;
  if (deviceType === import_constants.BLOCK_VISIBILITY_VIEWPORTS.mobile.key) {
    currentViewport = import_constants.BLOCK_VISIBILITY_VIEWPORTS.mobile.key;
  } else if (deviceType === import_constants.BLOCK_VISIBILITY_VIEWPORTS.tablet.key) {
    currentViewport = import_constants.BLOCK_VISIBILITY_VIEWPORTS.tablet.key;
  } else if (!isLargerThanMobile) {
    currentViewport = import_constants.BLOCK_VISIBILITY_VIEWPORTS.mobile.key;
  } else if (isLargerThanMobile && !isLargerThanTablet) {
    currentViewport = import_constants.BLOCK_VISIBILITY_VIEWPORTS.tablet.key;
  } else {
    currentViewport = import_constants.BLOCK_VISIBILITY_VIEWPORTS.desktop.key;
  }
  const isBlockCurrentlyHidden = blockVisibility === false || blockVisibility?.viewport?.[currentViewport] === false;
  return { isBlockCurrentlyHidden, currentViewport };
}
//# sourceMappingURL=use-block-visibility.cjs.map
