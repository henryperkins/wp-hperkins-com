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

// packages/lazy-editor/src/index.tsx
var index_exports = {};
__export(index_exports, {
  Editor: () => import_editor.Editor,
  Preview: () => import_preview.Preview,
  loadEditorAssets: () => import_use_editor_assets.loadEditorAssets,
  useEditorAssets: () => import_use_editor_assets.useEditorAssets,
  useEditorSettings: () => import_use_editor_settings.useEditorSettings
});
module.exports = __toCommonJS(index_exports);
var import_editor = require("./components/editor/index.cjs");
var import_preview = require("./components/preview/index.cjs");
var import_use_editor_assets = require("./hooks/use-editor-assets.cjs");
var import_use_editor_settings = require("./hooks/use-editor-settings.cjs");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Editor,
  Preview,
  loadEditorAssets,
  useEditorAssets,
  useEditorSettings
});
//# sourceMappingURL=index.cjs.map
