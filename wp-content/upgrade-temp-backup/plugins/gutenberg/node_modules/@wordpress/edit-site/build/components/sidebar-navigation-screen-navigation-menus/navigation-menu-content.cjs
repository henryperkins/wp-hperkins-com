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

// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menus/navigation-menu-content.js
var navigation_menu_content_exports = {};
__export(navigation_menu_content_exports, {
  default: () => NavigationMenuContent
});
module.exports = __toCommonJS(navigation_menu_content_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_blocks = require("@wordpress/blocks");
var import_element = require("@wordpress/element");
var import_core_data = require("@wordpress/core-data");
var import_block_library = require("@wordpress/block-library");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_leaf_more_menu = __toESM(require("./leaf-more-menu.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var { PrivateListView } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
var { NavigationLinkUI } = (0, import_lock_unlock.unlock)(import_block_library.privateApis);
var MAX_PAGE_COUNT = 100;
var PAGES_QUERY = [
  "postType",
  "page",
  {
    per_page: MAX_PAGE_COUNT,
    _fields: ["id", "link", "menu_order", "parent", "title", "type"],
    // TODO: When https://core.trac.wordpress.org/ticket/39037 REST API support for multiple orderby
    // values is resolved, update 'orderby' to [ 'menu_order', 'post_title' ] to provide a consistent
    // sort.
    orderby: "menu_order",
    order: "asc"
  }
];
function NavigationMenuContent({ rootClientId }) {
  const { listViewRootClientId, isLoading } = (0, import_data.useSelect)(
    (select) => {
      const {
        areInnerBlocksControlled,
        getBlockName,
        getBlockCount,
        getBlockOrder
      } = select(import_block_editor.store);
      const { isResolving } = select(import_core_data.store);
      const blockClientIds = getBlockOrder(rootClientId);
      const hasOnlyPageListBlock = blockClientIds.length === 1 && getBlockName(blockClientIds[0]) === "core/page-list";
      const pageListHasBlocks = hasOnlyPageListBlock && getBlockCount(blockClientIds[0]) > 0;
      const isLoadingPages = isResolving(
        "getEntityRecords",
        PAGES_QUERY
      );
      return {
        listViewRootClientId: pageListHasBlocks ? blockClientIds[0] : rootClientId,
        // This is a small hack to wait for the navigation block
        // to actually load its inner blocks.
        isLoading: !areInnerBlocksControlled(rootClientId) || isLoadingPages
      };
    },
    [rootClientId]
  );
  const { replaceBlock, __unstableMarkNextChangeAsNotPersistent } = (0, import_data.useDispatch)(import_block_editor.store);
  const offCanvasOnselect = (0, import_element.useCallback)(
    (block) => {
      if (block.name === "core/navigation-link" && !block.attributes.url) {
        __unstableMarkNextChangeAsNotPersistent();
        replaceBlock(
          block.clientId,
          (0, import_blocks.createBlock)("core/navigation-link", block.attributes)
        );
      }
    },
    [__unstableMarkNextChangeAsNotPersistent, replaceBlock]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    !isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      PrivateListView,
      {
        rootClientId: listViewRootClientId,
        onSelect: offCanvasOnselect,
        blockSettingsMenu: import_leaf_more_menu.default,
        showAppender: true,
        additionalBlockContent: NavigationLinkUI,
        isExpanded: true
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-site-sidebar-navigation-screen-navigation-menus__helper-block-editor", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockList, {}) })
  ] });
}
//# sourceMappingURL=navigation-menu-content.cjs.map
