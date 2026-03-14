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

// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menu/navigation-menu-editor.js
var navigation_menu_editor_exports = {};
__export(navigation_menu_editor_exports, {
  default: () => NavigationMenuEditor
});
module.exports = __toCommonJS(navigation_menu_editor_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_blocks = require("@wordpress/blocks");
var import_core_data = require("@wordpress/core-data");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var import_navigation_menu_content = __toESM(require("../sidebar-navigation-screen-navigation-menus/navigation-menu-content.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var noop = () => {
};
function NavigationMenuEditor({ navigationMenuId }) {
  const { storedSettings } = (0, import_data.useSelect)((select) => {
    const { getSettings } = (0, import_lock_unlock.unlock)(select(import_store.store));
    return {
      storedSettings: getSettings()
    };
  }, []);
  const settings = (0, import_element.useMemo)(() => {
    return {
      ...storedSettings,
      __experimentalFetchLinkSuggestions: (search, searchOptions) => (0, import_core_data.__experimentalFetchLinkSuggestions)(search, searchOptions, storedSettings)
    };
  }, [storedSettings]);
  const blocks = (0, import_element.useMemo)(() => {
    if (!navigationMenuId) {
      return [];
    }
    return [(0, import_blocks.createBlock)("core/navigation", { ref: navigationMenuId })];
  }, [navigationMenuId]);
  if (!navigationMenuId || !blocks?.length) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_block_editor.BlockEditorProvider,
    {
      settings,
      value: blocks,
      onChange: noop,
      onInput: noop,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-site-sidebar-navigation-screen-navigation-menus__content", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_navigation_menu_content.default, { rootClientId: blocks[0].clientId }) })
    }
  );
}
//# sourceMappingURL=navigation-menu-editor.cjs.map
