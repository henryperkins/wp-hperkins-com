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

// packages/edit-site/src/utils/is-previewing-theme.js
var is_previewing_theme_exports = {};
__export(is_previewing_theme_exports, {
  currentlyPreviewingTheme: () => currentlyPreviewingTheme,
  isPreviewingTheme: () => isPreviewingTheme
});
module.exports = __toCommonJS(is_previewing_theme_exports);
var import_url = require("@wordpress/url");
function isPreviewingTheme() {
  return !!(0, import_url.getQueryArg)(window.location.href, "wp_theme_preview");
}
function currentlyPreviewingTheme() {
  if (isPreviewingTheme()) {
    return (0, import_url.getQueryArg)(window.location.href, "wp_theme_preview");
  }
  return null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  currentlyPreviewingTheme,
  isPreviewingTheme
});
//# sourceMappingURL=is-previewing-theme.cjs.map
