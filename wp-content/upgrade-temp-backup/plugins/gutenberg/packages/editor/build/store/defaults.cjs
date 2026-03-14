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

// packages/editor/src/store/defaults.js
var defaults_exports = {};
__export(defaults_exports, {
  EDITOR_SETTINGS_DEFAULTS: () => EDITOR_SETTINGS_DEFAULTS
});
module.exports = __toCommonJS(defaults_exports);
var import_block_editor = require("@wordpress/block-editor");
var EDITOR_SETTINGS_DEFAULTS = {
  ...import_block_editor.SETTINGS_DEFAULTS,
  richEditingEnabled: true,
  codeEditingEnabled: true,
  fontLibraryEnabled: true,
  enableCustomFields: void 0,
  defaultRenderingMode: "post-only"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EDITOR_SETTINGS_DEFAULTS
});
//# sourceMappingURL=defaults.cjs.map
