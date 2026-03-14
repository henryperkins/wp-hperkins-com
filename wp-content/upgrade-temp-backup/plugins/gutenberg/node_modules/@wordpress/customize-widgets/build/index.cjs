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

// packages/customize-widgets/src/index.js
var index_exports = {};
__export(index_exports, {
  initialize: () => initialize,
  store: () => import_store.store
});
module.exports = __toCommonJS(index_exports);
var import_element = require("@wordpress/element");
var import_block_library = require("@wordpress/block-library");
var import_widgets = require("@wordpress/widgets");
var import_blocks = require("@wordpress/blocks");
var import_data = require("@wordpress/data");
var import_preferences = require("@wordpress/preferences");
var import_customize_widgets = __toESM(require("./components/customize-widgets/index.cjs"));
var import_sidebar_section = __toESM(require("./controls/sidebar-section.cjs"));
var import_sidebar_control = __toESM(require("./controls/sidebar-control.cjs"));
var import_filters = require("./filters/index.cjs");
var import_store = require("./store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { wp } = window;
var DISABLED_BLOCKS = [
  "core/more",
  "core/block",
  "core/freeform",
  "core/template-part"
];
var ENABLE_EXPERIMENTAL_FSE_BLOCKS = false;
function initialize(editorName, blockEditorSettings) {
  (0, import_data.dispatch)(import_preferences.store).setDefaults("core/customize-widgets", {
    fixedToolbar: false,
    welcomeGuide: true
  });
  (0, import_data.dispatch)(import_blocks.store).reapplyBlockTypeFilters();
  const coreBlocks = (0, import_block_library.__experimentalGetCoreBlocks)().filter((block) => {
    return !(DISABLED_BLOCKS.includes(block.name) || block.name.startsWith("core/post") || block.name.startsWith("core/query") || block.name.startsWith("core/site") || block.name.startsWith("core/navigation") || block.name.startsWith("core/term"));
  });
  (0, import_block_library.registerCoreBlocks)(coreBlocks);
  (0, import_widgets.registerLegacyWidgetBlock)();
  if (globalThis.IS_GUTENBERG_PLUGIN) {
    (0, import_block_library.__experimentalRegisterExperimentalCoreBlocks)({
      enableFSEBlocks: ENABLE_EXPERIMENTAL_FSE_BLOCKS
    });
  }
  (0, import_widgets.registerLegacyWidgetVariations)(blockEditorSettings);
  (0, import_widgets.registerWidgetGroupBlock)();
  (0, import_blocks.setFreeformContentHandlerName)("core/html");
  const SidebarControl = (0, import_sidebar_control.default)(blockEditorSettings);
  wp.customize.sectionConstructor.sidebar = (0, import_sidebar_section.default)();
  wp.customize.controlConstructor.sidebar_block_editor = SidebarControl;
  const container = document.createElement("div");
  document.body.appendChild(container);
  wp.customize.bind("ready", () => {
    const sidebarControls = [];
    wp.customize.control.each((control) => {
      if (control instanceof SidebarControl) {
        sidebarControls.push(control);
      }
    });
    (0, import_element.createRoot)(container).render(
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_element.StrictMode, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_customize_widgets.default,
        {
          api: wp.customize,
          sidebarControls,
          blockEditorSettings
        }
      ) })
    );
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  initialize,
  store
});
//# sourceMappingURL=index.cjs.map
