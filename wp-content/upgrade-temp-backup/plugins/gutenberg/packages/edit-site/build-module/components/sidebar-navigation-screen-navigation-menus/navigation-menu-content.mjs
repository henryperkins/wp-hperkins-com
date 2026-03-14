// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menus/navigation-menu-content.js
import {
  privateApis as blockEditorPrivateApis,
  store as blockEditorStore,
  BlockList
} from "@wordpress/block-editor";
import { useDispatch, useSelect } from "@wordpress/data";
import { createBlock } from "@wordpress/blocks";
import { useCallback } from "@wordpress/element";
import { store as coreStore } from "@wordpress/core-data";
import { privateApis as blockLibraryPrivateApis } from "@wordpress/block-library";
import { unlock } from "../../lock-unlock.mjs";
import LeafMoreMenu from "./leaf-more-menu.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { PrivateListView } = unlock(blockEditorPrivateApis);
var { NavigationLinkUI } = unlock(blockLibraryPrivateApis);
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
  const { listViewRootClientId, isLoading } = useSelect(
    (select) => {
      const {
        areInnerBlocksControlled,
        getBlockName,
        getBlockCount,
        getBlockOrder
      } = select(blockEditorStore);
      const { isResolving } = select(coreStore);
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
  const { replaceBlock, __unstableMarkNextChangeAsNotPersistent } = useDispatch(blockEditorStore);
  const offCanvasOnselect = useCallback(
    (block) => {
      if (block.name === "core/navigation-link" && !block.attributes.url) {
        __unstableMarkNextChangeAsNotPersistent();
        replaceBlock(
          block.clientId,
          createBlock("core/navigation-link", block.attributes)
        );
      }
    },
    [__unstableMarkNextChangeAsNotPersistent, replaceBlock]
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    !isLoading && /* @__PURE__ */ jsx(
      PrivateListView,
      {
        rootClientId: listViewRootClientId,
        onSelect: offCanvasOnselect,
        blockSettingsMenu: LeafMoreMenu,
        showAppender: true,
        additionalBlockContent: NavigationLinkUI,
        isExpanded: true
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "edit-site-sidebar-navigation-screen-navigation-menus__helper-block-editor", children: /* @__PURE__ */ jsx(BlockList, {}) })
  ] });
}
export {
  NavigationMenuContent as default
};
//# sourceMappingURL=navigation-menu-content.mjs.map
