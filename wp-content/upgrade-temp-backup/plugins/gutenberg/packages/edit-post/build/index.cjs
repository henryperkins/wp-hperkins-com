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

// packages/edit-post/src/index.js
var index_exports = {};
__export(index_exports, {
  __experimentalFullscreenModeClose: () => import_fullscreen_mode_close.default,
  __experimentalMainDashboardButton: () => __experimentalMainDashboardButton,
  initializeEditor: () => initializeEditor,
  reinitializeEditor: () => reinitializeEditor,
  store: () => import_store.store
});
module.exports = __toCommonJS(index_exports);
var import_blocks = require("@wordpress/blocks");
var import_block_library = require("@wordpress/block-library");
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_preferences = require("@wordpress/preferences");
var import_widgets = require("@wordpress/widgets");
var import_editor = require("@wordpress/editor");
var import_layout = __toESM(require("./components/layout/index.cjs"));
var import_lock_unlock = require("./lock-unlock.cjs");
var import_fullscreen_mode_close = __toESM(require("./components/back-button/fullscreen-mode-close.cjs"));
var import_store = require("./store/index.cjs");
__reExport(index_exports, require("./deprecated.cjs"), module.exports);
var import_jsx_runtime = require("react/jsx-runtime");
var {
  BackButton: __experimentalMainDashboardButton,
  registerCoreBlockBindingsSources
} = (0, import_lock_unlock.unlock)(import_editor.privateApis);
function initializeEditor(id, postType, postId, settings, initialEdits) {
  const isMediumOrBigger = window.matchMedia("(min-width: 782px)").matches;
  const target = document.getElementById(id);
  const root = (0, import_element.createRoot)(target);
  (0, import_data.dispatch)(import_preferences.store).setDefaults("core/edit-post", {
    fullscreenMode: true,
    themeStyles: true,
    welcomeGuide: true,
    welcomeGuideTemplate: true
  });
  (0, import_data.dispatch)(import_preferences.store).setDefaults("core", {
    allowRightClickOverrides: true,
    editorMode: "visual",
    editorTool: "edit",
    fixedToolbar: false,
    hiddenBlockTypes: [],
    inactivePanels: [],
    openPanels: ["post-status"],
    showBlockBreadcrumbs: true,
    showIconLabels: false,
    showListViewByDefault: false,
    enableChoosePatternModal: true,
    isPublishSidebarEnabled: true
  });
  if (window.__clientSideMediaProcessing) {
    (0, import_data.dispatch)(import_preferences.store).setDefaults("core/media", {
      requireApproval: true,
      optimizeOnUpload: true
    });
  }
  (0, import_data.dispatch)(import_blocks.store).reapplyBlockTypeFilters();
  if (isMediumOrBigger && (0, import_data.select)(import_preferences.store).get("core", "showListViewByDefault") && !(0, import_data.select)(import_preferences.store).get("core", "distractionFree")) {
    (0, import_data.dispatch)(import_editor.store).setIsListViewOpened(true);
  }
  (0, import_block_library.registerCoreBlocks)();
  registerCoreBlockBindingsSources();
  (0, import_widgets.registerLegacyWidgetBlock)({ inserter: false });
  (0, import_widgets.registerWidgetGroupBlock)({ inserter: false });
  if (globalThis.IS_GUTENBERG_PLUGIN) {
    (0, import_block_library.__experimentalRegisterExperimentalCoreBlocks)({
      enableFSEBlocks: settings.__unstableEnableFullSiteEditingBlocks
    });
  }
  const documentMode = document.compatMode === "CSS1Compat" ? "Standards" : "Quirks";
  if (documentMode !== "Standards") {
    console.warn(
      "Your browser is using Quirks Mode. \nThis can cause rendering issues such as blocks overlaying meta boxes in the editor. Quirks Mode can be triggered by PHP errors or HTML code appearing before the opening <!DOCTYPE html>. Try checking the raw page source or your site's PHP error log and resolving errors there, removing any HTML before the doctype, or disabling plugins."
    );
  }
  const isIphone = window.navigator.userAgent.indexOf("iPhone") !== -1;
  if (isIphone) {
    window.addEventListener("scroll", (event) => {
      const editorScrollContainer = document.getElementsByClassName(
        "interface-interface-skeleton__body"
      )[0];
      if (event.target === document) {
        if (window.scrollY > 100) {
          editorScrollContainer.scrollTop = editorScrollContainer.scrollTop + window.scrollY;
        }
        if (document.getElementsByClassName("is-mode-visual")[0]) {
          window.scrollTo(0, 0);
        }
      }
    });
  }
  window.addEventListener("dragover", (e) => e.preventDefault(), false);
  window.addEventListener("drop", (e) => e.preventDefault(), false);
  root.render(
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_element.StrictMode, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_layout.default,
      {
        settings,
        postId,
        postType,
        initialEdits
      }
    ) })
  );
  return root;
}
function reinitializeEditor() {
  (0, import_deprecated.default)("wp.editPost.reinitializeEditor", {
    since: "6.2",
    version: "6.3"
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __experimentalFullscreenModeClose,
  __experimentalMainDashboardButton,
  initializeEditor,
  reinitializeEditor,
  store,
  ...require("./deprecated.cjs")
});
//# sourceMappingURL=index.cjs.map
