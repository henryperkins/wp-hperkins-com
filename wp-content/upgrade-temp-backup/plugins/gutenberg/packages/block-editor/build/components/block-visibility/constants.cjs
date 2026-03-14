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

// packages/block-editor/src/components/block-visibility/constants.js
var constants_exports = {};
__export(constants_exports, {
  BLOCK_VISIBILITY_VIEWPORTS: () => BLOCK_VISIBILITY_VIEWPORTS,
  BLOCK_VISIBILITY_VIEWPORT_ENTRIES: () => BLOCK_VISIBILITY_VIEWPORT_ENTRIES
});
module.exports = __toCommonJS(constants_exports);
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var BLOCK_VISIBILITY_VIEWPORTS = {
  desktop: {
    label: (0, import_i18n.__)("Desktop"),
    icon: import_icons.desktop,
    key: "desktop"
  },
  tablet: {
    label: (0, import_i18n.__)("Tablet"),
    icon: import_icons.tablet,
    key: "tablet"
  },
  mobile: {
    label: (0, import_i18n.__)("Mobile"),
    icon: import_icons.mobile,
    key: "mobile"
  }
};
var BLOCK_VISIBILITY_VIEWPORT_ENTRIES = Object.entries(
  BLOCK_VISIBILITY_VIEWPORTS
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BLOCK_VISIBILITY_VIEWPORTS,
  BLOCK_VISIBILITY_VIEWPORT_ENTRIES
});
//# sourceMappingURL=constants.cjs.map
