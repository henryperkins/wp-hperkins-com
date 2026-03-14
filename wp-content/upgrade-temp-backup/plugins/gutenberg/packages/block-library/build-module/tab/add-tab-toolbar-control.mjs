// packages/block-library/src/tab/add-tab-toolbar-control.js
import { sprintf, __ } from "@wordpress/i18n";
import { createBlock } from "@wordpress/blocks";
import {
  BlockControls,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { ToolbarGroup, ToolbarButton } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { jsx } from "react/jsx-runtime";
function AddTabToolbarControl({ tabsClientId }) {
  const { insertBlock } = useDispatch(blockEditorStore);
  const { tabPanelClientId, nextTabIndex } = useSelect(
    (select) => {
      if (!tabsClientId) {
        return {
          tabPanelClientId: null,
          nextTabIndex: 0
        };
      }
      const { getBlocks } = select(blockEditorStore);
      const innerBlocks = getBlocks(tabsClientId);
      const tabPanel = innerBlocks.find(
        (block) => block.name === "core/tab-panel"
      );
      return {
        tabPanelClientId: tabPanel?.clientId || null,
        nextTabIndex: (tabPanel?.innerBlocks.length || 0) + 1
      };
    },
    [tabsClientId]
  );
  const addTab = () => {
    if (!tabPanelClientId) {
      return;
    }
    const newTabBlock = createBlock("core/tab", {
      anchor: "tab-" + nextTabIndex,
      /* translators: %d: tab number */
      label: sprintf(__("Tab %d"), nextTabIndex)
    });
    insertBlock(newTabBlock, void 0, tabPanelClientId);
  };
  return /* @__PURE__ */ jsx(BlockControls, { group: "other", children: /* @__PURE__ */ jsx(ToolbarGroup, { children: /* @__PURE__ */ jsx(
    ToolbarButton,
    {
      className: "components-toolbar__control",
      onClick: addTab,
      text: __("Add tab")
    }
  ) }) });
}
export {
  AddTabToolbarControl as default
};
//# sourceMappingURL=add-tab-toolbar-control.mjs.map
