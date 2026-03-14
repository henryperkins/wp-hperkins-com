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

// packages/block-directory/src/plugins/inserter-menu-downloadable-blocks-panel/index.js
var inserter_menu_downloadable_blocks_panel_exports = {};
__export(inserter_menu_downloadable_blocks_panel_exports, {
  default: () => inserter_menu_downloadable_blocks_panel_default
});
module.exports = __toCommonJS(inserter_menu_downloadable_blocks_panel_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_compose = require("@wordpress/compose");
var import_element = require("@wordpress/element");
var import_downloadable_blocks_panel = __toESM(require("../../components/downloadable-blocks-panel/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function InserterMenuDownloadableBlocksPanel() {
  const [debouncedFilterValue, setFilterValue] = (0, import_element.useState)("");
  const debouncedSetFilterValue = (0, import_compose.debounce)(setFilterValue, 400);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.__unstableInserterMenuExtension, { children: ({ onSelect, onHover, filterValue, hasItems }) => {
    if (debouncedFilterValue !== filterValue) {
      debouncedSetFilterValue(filterValue);
    }
    if (!debouncedFilterValue) {
      return null;
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_downloadable_blocks_panel.default,
      {
        onSelect,
        onHover,
        filterValue: debouncedFilterValue,
        hasLocalBlocks: hasItems,
        isTyping: filterValue !== debouncedFilterValue
      }
    );
  } });
}
var inserter_menu_downloadable_blocks_panel_default = InserterMenuDownloadableBlocksPanel;
//# sourceMappingURL=index.cjs.map
