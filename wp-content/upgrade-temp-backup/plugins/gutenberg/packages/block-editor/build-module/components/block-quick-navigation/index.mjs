// packages/block-editor/src/components/block-quick-navigation/index.js
import { hasBlockSupport, getBlockType } from "@wordpress/blocks";
import { useSelect, useDispatch } from "@wordpress/data";
import {
  Button,
  __experimentalVStack as VStack,
  __experimentalTruncate as Truncate,
  Flex,
  FlexBlock,
  FlexItem
} from "@wordpress/components";
import { Icon, chevronRight } from "@wordpress/icons";
import { store as blockEditorStore } from "../../store/index.mjs";
import BlockIcon from "../block-icon/index.mjs";
import useBlockDisplayInformation from "../use-block-display-information/index.mjs";
import useBlockDisplayTitle from "../block-title/use-block-display-title.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function BlockQuickNavigation({
  clientIds,
  onSelect,
  onSwitchToListView,
  hasListViewTab
}) {
  if (!clientIds.length) {
    return null;
  }
  return /* @__PURE__ */ jsx(VStack, { spacing: 1, children: clientIds.map((clientId) => /* @__PURE__ */ jsx(
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
  const blockInformation = useBlockDisplayInformation(clientId);
  const { isSelected, childBlocks, hasListViewSupport, blockName } = useSelect(
    (select) => {
      const {
        isBlockSelected,
        hasSelectedInnerBlock,
        getBlockOrder,
        getBlockName
      } = select(blockEditorStore);
      const _blockName = getBlockName(clientId);
      return {
        isSelected: isBlockSelected(clientId) || hasSelectedInnerBlock(
          clientId,
          /* deep: */
          true
        ),
        childBlocks: getBlockOrder(clientId),
        hasListViewSupport: _blockName === "core/navigation" || hasBlockSupport(_blockName, "listView"),
        blockName: _blockName
      };
    },
    [clientId]
  );
  const blockType = getBlockType(blockName);
  const displayTitle = useBlockDisplayTitle({
    clientId,
    context: "list-view"
  });
  const blockTitle = displayTitle || blockType?.title || blockName;
  const { selectBlock } = useDispatch(blockEditorStore);
  const hasChildren = childBlocks && childBlocks.length > 0;
  const canNavigateToListView = hasChildren && hasListViewTab && hasListViewSupport;
  return /* @__PURE__ */ jsx(
    Button,
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
      children: /* @__PURE__ */ jsxs(Flex, { children: [
        /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(BlockIcon, { icon: blockInformation?.icon }) }),
        /* @__PURE__ */ jsx(FlexBlock, { style: { textAlign: "left" }, children: /* @__PURE__ */ jsx(Truncate, { children: blockTitle }) }),
        canNavigateToListView && /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(Icon, { icon: chevronRight, size: 24 }) })
      ] })
    }
  );
}
export {
  BlockQuickNavigation as default
};
//# sourceMappingURL=index.mjs.map
