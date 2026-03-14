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

// packages/block-editor/src/components/block-quick-navigation/index.js
var block_quick_navigation_exports = {};
__export(block_quick_navigation_exports, {
  default: () => BlockQuickNavigation
});
module.exports = __toCommonJS(block_quick_navigation_exports);
var import_blocks = require("@wordpress/blocks");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_store = require("../../store/index.cjs");
var import_block_icon = __toESM(require("../block-icon/index.cjs"));
var import_use_block_display_information = __toESM(require("../use-block-display-information/index.cjs"));
var import_use_block_display_title = __toESM(require("../block-title/use-block-display-title.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function BlockQuickNavigation({
  clientIds,
  onSelect,
  onSwitchToListView,
  hasListViewTab
}) {
  if (!clientIds.length) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalVStack, { spacing: 1, children: clientIds.map((clientId) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    BlockQuickNavigationItem,
    {
      onSelect,
      onSwitchToListView,
      hasListViewTab,
      clientId
    },
    clientId
  )) });
}
function BlockQuickNavigationItem({
  clientId,
  onSelect,
  onSwitchToListView,
  hasListViewTab
}) {
  const blockInformation = (0, import_use_block_display_information.default)(clientId);
  const { isSelected, childBlocks, hasListViewSupport, blockName } = (0, import_data.useSelect)(
    (select) => {
      const {
        isBlockSelected,
        hasSelectedInnerBlock,
        getBlockOrder,
        getBlockName
      } = select(import_store.store);
      const _blockName = getBlockName(clientId);
      return {
        isSelected: isBlockSelected(clientId) || hasSelectedInnerBlock(
          clientId,
          /* deep: */
          true
        ),
        childBlocks: getBlockOrder(clientId),
        hasListViewSupport: _blockName === "core/navigation" || (0, import_blocks.hasBlockSupport)(_blockName, "listView"),
        blockName: _blockName
      };
    },
    [clientId]
  );
  const blockType = (0, import_blocks.getBlockType)(blockName);
  const displayTitle = (0, import_use_block_display_title.default)({
    clientId,
    context: "list-view"
  });
  const blockTitle = displayTitle || blockType?.title || blockName;
  const { selectBlock } = (0, import_data.useDispatch)(import_store.store);
  const hasChildren = childBlocks && childBlocks.length > 0;
  const canNavigateToListView = hasChildren && hasListViewTab && hasListViewSupport;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      __next40pxDefaultSize: true,
      className: "block-editor-block-quick-navigation__item",
      isPressed: isSelected,
      onClick: async () => {
        await selectBlock(clientId);
        if (canNavigateToListView && onSwitchToListView) {
          onSwitchToListView(clientId);
        }
        if (onSelect) {
          onSelect(clientId);
        }
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Flex, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_icon.default, { icon: blockInformation?.icon }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexBlock, { style: { textAlign: "left" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalTruncate, { children: blockTitle }) }),
        canNavigateToListView && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icons.Icon, { icon: import_icons.chevronRight, size: 24 }) })
      ] })
    }
  );
}
//# sourceMappingURL=index.cjs.map
