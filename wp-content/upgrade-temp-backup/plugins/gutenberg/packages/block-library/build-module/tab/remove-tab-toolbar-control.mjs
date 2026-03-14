// packages/block-library/src/tab/remove-tab-toolbar-control.js
import {
  BlockControls,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { ToolbarGroup, ToolbarButton } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useDispatch, useSelect } from "@wordpress/data";
import { jsx } from "react/jsx-runtime";
function RemoveTabToolbarControl({ tabsClientId }) {
  const {
    removeBlock,
    updateBlockAttributes,
    selectBlock,
    __unstableMarkNextChangeAsNotPersistent
  } = useDispatch(blockEditorStore);
  const { activeTabClientId, tabCount, editorActiveTabIndex } = useSelect(
    (select) => {
      if (!tabsClientId) {
        return {
          activeTabClientId: null,
          tabCount: 0,
          editorActiveTabIndex: 0
        };
      }
      const { getBlocks, getBlockAttributes } = select(blockEditorStore);
      const tabsAttributes = getBlockAttributes(tabsClientId);
      const activeIndex = tabsAttributes?.editorActiveTabIndex ?? tabsAttributes?.activeTabIndex ?? 0;
      const innerBlocks = getBlocks(tabsClientId);
      const tabPanel = innerBlocks.find(
        (block) => block.name === "core/tab-panel"
      );
      const tabs = tabPanel?.innerBlocks || [];
      const activeTab = tabs[activeIndex];
      return {
        activeTabClientId: activeTab?.clientId || null,
        tabCount: tabs.length,
        editorActiveTabIndex: activeIndex
      };
    },
    [tabsClientId]
  );
  const removeTab = () => {
    if (!activeTabClientId || tabCount <= 1) {
      return;
    }
    const newActiveIndex = editorActiveTabIndex >= tabCount - 1 ? tabCount - 2 : editorActiveTabIndex;
    __unstableMarkNextChangeAsNotPersistent();
    updateBlockAttributes(tabsClientId, {
      editorActiveTabIndex: newActiveIndex
    });
    removeBlock(activeTabClientId, false);
    if (tabsClientId) {
      selectBlock(tabsClientId);
    }
  };
  const isDisabled = tabCount <= 1 || !activeTabClientId;
  return /* @__PURE__ */ jsx(BlockControls, { group: "other", children: /* @__PURE__ */ jsx(ToolbarGroup, { children: /* @__PURE__ */ jsx(
    ToolbarButton,
    {
      className: "components-toolbar__control",
      onClick: removeTab,
      text: __("Remove tab"),
      disabled: isDisabled
    }
  ) }) });
}
export {
  RemoveTabToolbarControl as default
};
//# sourceMappingURL=remove-tab-toolbar-control.mjs.map
