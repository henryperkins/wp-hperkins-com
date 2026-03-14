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

// packages/edit-widgets/src/index.js
var index_exports = {};
__export(index_exports, {
  initialize: () => initialize,
  initializeEditor: () => initializeEditor,
  reinitializeEditor: () => reinitializeEditor,
  store: () => import_store2.store
});
module.exports = __toCommonJS(index_exports);
var import_blocks = require("@wordpress/blocks");
var import_data = require("@wordpress/data");
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_element = require("@wordpress/element");
var import_block_library = require("@wordpress/block-library");
var import_core_data = require("@wordpress/core-data");
var import_widgets = require("@wordpress/widgets");
var import_preferences = require("@wordpress/preferences");
var import_store = require("./store/index.cjs");
var import_filters = require("./filters/index.cjs");
var widgetArea = __toESM(require("./blocks/widget-area/index.cjs"));
var import_layout = __toESM(require("./components/layout/index.cjs"));
var import_constants = require("./constants.cjs");
var import_store2 = require("./store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var disabledBlocks = [
  "core/more",
  "core/freeform",
  "core/template-part",
  ...import_constants.ALLOW_REUSABLE_BLOCKS ? [] : ["core/block"]
];
function initializeEditor(id, settings) {
  const target = document.getElementById(id);
  const root = (0, import_element.createRoot)(target);
  const coreBlocks = (0, import_block_library.__experimentalGetCoreBlocks)().filter((block) => {
    return !(disabledBlocks.includes(block.name) || block.name.startsWith("core/post") || block.name.startsWith("core/query") || block.name.startsWith("core/site") || block.name.startsWith("core/navigation") || block.name.startsWith("core/term"));
  });
  (0, import_data.dispatch)(import_preferences.store).setDefaults("core/edit-widgets", {
    fixedToolbar: false,
    welcomeGuide: true,
    showBlockBreadcrumbs: true,
    themeStyles: true
  });
  (0, import_data.dispatch)(import_blocks.store).reapplyBlockTypeFilters();
  (0, import_block_library.registerCoreBlocks)(coreBlocks);
  (0, import_widgets.registerLegacyWidgetBlock)();
  if (globalThis.IS_GUTENBERG_PLUGIN) {
    (0, import_block_library.__experimentalRegisterExperimentalCoreBlocks)({
      enableFSEBlocks: import_constants.ENABLE_EXPERIMENTAL_FSE_BLOCKS
    });
  }
  (0, import_widgets.registerLegacyWidgetVariations)(settings);
  registerBlock(widgetArea);
  (0, import_widgets.registerWidgetGroupBlock)();
  settings.__experimentalFetchLinkSuggestions = (search, searchOptions) => (0, import_core_data.__experimentalFetchLinkSuggestions)(search, searchOptions, settings);
  (0, import_blocks.setFreeformContentHandlerName)("core/html");
  root.render(
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_element.StrictMode, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_layout.default, { blockEditorSettings: settings }) })
  );
  return root;
}
var initialize = initializeEditor;
function reinitializeEditor() {
  (0, import_deprecated.default)("wp.editWidgets.reinitializeEditor", {
    since: "6.2",
    version: "6.3"
  });
}
var registerBlock = (block) => {
  if (!block) {
    return;
  }
  const { metadata, settings, name } = block;
  if (metadata) {
    (0, import_blocks.unstable__bootstrapServerSideBlockDefinitions)({ [name]: metadata });
  }
  (0, import_blocks.registerBlockType)(name, settings);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  initialize,
  initializeEditor,
  reinitializeEditor,
  store
});
//# sourceMappingURL=index.cjs.map
