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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/edit-site/src/index.js
var index_exports = {};
__export(index_exports, {
  PluginTemplateSettingPanel: () => import_plugin_template_setting_panel.default,
  initializeEditor: () => initializeEditor,
  reinitializeEditor: () => reinitializeEditor,
  store: () => import_store2.store
});
module.exports = __toCommonJS(index_exports);
var import_blocks = require("@wordpress/blocks");
var import_block_library = require("@wordpress/block-library");
var import_data = require("@wordpress/data");
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_element = require("@wordpress/element");
var import_editor = require("@wordpress/editor");
var import_preferences = require("@wordpress/preferences");
var import_widgets = require("@wordpress/widgets");
var import_store = require("./store/index.cjs");
var import_lock_unlock = require("./lock-unlock.cjs");
var import_app = __toESM(require("./components/app/index.cjs"));
var import_plugin_template_setting_panel = __toESM(require("./components/plugin-template-setting-panel/index.cjs"));
var import_store2 = require("./store/index.cjs");
__reExport(index_exports, require("./deprecated.cjs"), module.exports);
var import_jsx_runtime = require("react/jsx-runtime");
var { registerCoreBlockBindingsSources } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
function initializeEditor(id, settings) {
  const target = document.getElementById(id);
  const root = (0, import_element.createRoot)(target);
  (0, import_data.dispatch)(import_blocks.store).reapplyBlockTypeFilters();
  const coreBlocks = (0, import_block_library.__experimentalGetCoreBlocks)().filter(
    ({ name }) => name !== "core/freeform"
  );
  (0, import_block_library.registerCoreBlocks)(coreBlocks);
  registerCoreBlockBindingsSources();
  (0, import_data.dispatch)(import_blocks.store).setFreeformFallbackBlockName("core/html");
  (0, import_widgets.registerLegacyWidgetBlock)({ inserter: false });
  (0, import_widgets.registerWidgetGroupBlock)({ inserter: false });
  if (globalThis.IS_GUTENBERG_PLUGIN) {
    (0, import_block_library.__experimentalRegisterExperimentalCoreBlocks)({
      enableFSEBlocks: true
    });
  }
  (0, import_data.dispatch)(import_preferences.store).setDefaults("core/edit-site", {
    welcomeGuide: true,
    welcomeGuideStyles: true,
    welcomeGuidePage: true,
    welcomeGuideTemplate: true
  });
  (0, import_data.dispatch)(import_preferences.store).setDefaults("core", {
    allowRightClickOverrides: true,
    distractionFree: false,
    editorMode: "visual",
    editorTool: "edit",
    fixedToolbar: false,
    focusMode: false,
    inactivePanels: [],
    keepCaretInsideBlock: false,
    openPanels: ["post-status"],
    showBlockBreadcrumbs: true,
    showListViewByDefault: false,
    enableChoosePatternModal: true
  });
  if (window.__clientSideMediaProcessing) {
    (0, import_data.dispatch)(import_preferences.store).setDefaults("core/media", {
      requireApproval: true,
      optimizeOnUpload: true
    });
  }
  (0, import_data.dispatch)(import_store.store).updateSettings(settings);
  window.addEventListener("dragover", (e) => e.preventDefault(), false);
  window.addEventListener("drop", (e) => e.preventDefault(), false);
  root.render(
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_element.StrictMode, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_app.default, {}) })
  );
  return root;
}
function reinitializeEditor() {
  (0, import_deprecated.default)("wp.editSite.reinitializeEditor", {
    since: "6.2",
    version: "6.3"
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PluginTemplateSettingPanel,
  initializeEditor,
  reinitializeEditor,
  store,
  ...require("./deprecated.cjs")
});
//# sourceMappingURL=index.cjs.map
