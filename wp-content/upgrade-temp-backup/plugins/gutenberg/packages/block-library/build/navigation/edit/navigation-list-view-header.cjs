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

// packages/block-library/src/navigation/edit/navigation-list-view-header.js
var navigation_list_view_header_exports = {};
__export(navigation_list_view_header_exports, {
  default: () => NavigationListViewHeader
});
module.exports = __toCommonJS(navigation_list_view_header_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_navigation_menu_selector = __toESM(require("./navigation-menu-selector.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useBlockDisplayTitle } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
var actionLabel = (
  /* translators: %s: The name of a menu. */
  (0, import_i18n.__)("Switch to '%s'")
);
function NavigationListViewHeader({
  clientId,
  blockEditingMode,
  currentMenuId,
  onSelectClassicMenu,
  onSelectNavigationMenu,
  onCreateNew,
  createNavigationMenuIsSuccess,
  createNavigationMenuIsError,
  isManageMenusButtonDisabled
}) {
  const blockTitle = useBlockDisplayTitle({
    clientId,
    context: "list-view"
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { className: "wp-block-navigation-off-canvas-editor__header", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__experimentalHeading,
      {
        className: "wp-block-navigation-off-canvas-editor__title",
        level: 2,
        children: blockTitle
      }
    ),
    blockEditingMode === "default" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_navigation_menu_selector.default,
      {
        currentMenuId,
        onSelectClassicMenu,
        onSelectNavigationMenu,
        onCreateNew,
        createNavigationMenuIsSuccess,
        createNavigationMenuIsError,
        actionLabel,
        isManageMenusButtonDisabled
      }
    )
  ] });
}
//# sourceMappingURL=navigation-list-view-header.cjs.map
