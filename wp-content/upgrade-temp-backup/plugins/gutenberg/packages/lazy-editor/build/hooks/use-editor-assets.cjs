"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/lazy-editor/src/hooks/use-editor-assets.tsx
var use_editor_assets_exports = {};
__export(use_editor_assets_exports, {
  loadEditorAssets: () => loadEditorAssets,
  useEditorAssets: () => useEditorAssets
});
module.exports = __toCommonJS(use_editor_assets_exports);
var import_asset_loader = __toESM(require("@wordpress/asset-loader"));
var import_core_data = require("@wordpress/core-data");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_lock_unlock = require("../lock-unlock.cjs");
var loadAssetsPromise;
async function loadEditorAssets() {
  const load = async () => {
    const editorAssets = await (0, import_lock_unlock.unlock)(
      (0, import_data.resolveSelect)(import_core_data.store)
    ).getEditorAssets();
    await (0, import_asset_loader.default)(
      editorAssets.scripts || {},
      editorAssets.inline_scripts || { before: {}, after: {} },
      editorAssets.styles || {},
      editorAssets.inline_styles || { before: {}, after: {} },
      editorAssets.html_templates || [],
      editorAssets.script_modules || {}
    );
  };
  if (!loadAssetsPromise) {
    loadAssetsPromise = load();
  }
  return loadAssetsPromise;
}
function useEditorAssets() {
  const editorAssets = (0, import_data.useSelect)((select) => {
    return (0, import_lock_unlock.unlock)(select(import_core_data.store)).getEditorAssets();
  }, []);
  const [assetsLoaded, setAssetsLoaded] = (0, import_element.useState)(false);
  (0, import_element.useEffect)(() => {
    if (editorAssets && !assetsLoaded) {
      loadEditorAssets().then(() => {
        setAssetsLoaded(true);
      }).catch((error) => {
        console.error("Failed to load editor assets:", error);
      });
    }
  }, [editorAssets, assetsLoaded]);
  return {
    isReady: !!editorAssets && assetsLoaded,
    assetsLoaded
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  loadEditorAssets,
  useEditorAssets
});
//# sourceMappingURL=use-editor-assets.cjs.map
