// packages/block-editor/src/components/inspector-controls/block-support-tools-panel.js
import { __experimentalToolsPanel as ToolsPanel } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { store as blockEditorStore } from "../../store/index.mjs";
import { cleanEmptyObject } from "../../hooks/utils.mjs";
import { useToolsPanelDropdownMenuProps } from "../global-styles/utils.mjs";
import { jsx } from "react/jsx-runtime";
function BlockSupportToolsPanel({ children, group, label }) {
  const { updateBlockAttributes } = useDispatch(blockEditorStore);
  const {
    getBlockAttributes,
    getMultiSelectedBlockClientIds,
    getSelectedBlockClientId,
    hasMultiSelection
  } = useSelect(blockEditorStore);
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  const panelId = getSelectedBlockClientId();
  const resetAll = useCallback(
    (resetFilters = []) => {
      const newAttributes = {};
      const clientIds = hasMultiSelection() ? getMultiSelectedBlockClientIds() : [panelId];
      clientIds.forEach((clientId) => {
        const { style } = getBlockAttributes(clientId);
        let newBlockAttributes = { style };
        resetFilters.forEach((resetFilter) => {
          newBlockAttributes = {
            ...newBlockAttributes,
            ...resetFilter(newBlockAttributes)
          };
        });
        newBlockAttributes = {
          ...newBlockAttributes,
          style: cleanEmptyObject(newBlockAttributes.style)
        };
        newAttributes[clientId] = newBlockAttributes;
      });
      updateBlockAttributes(clientIds, newAttributes, true);
    },
    [
      getBlockAttributes,
      getMultiSelectedBlockClientIds,
      hasMultiSelection,
      panelId,
      updateBlockAttributes
    ]
  );
  return /* @__PURE__ */ jsx(
    ToolsPanel,
    {
      className: `${group}-block-support-panel`,
      label,
      resetAll,
      panelId,
      hasInnerWrapper: true,
      shouldRenderPlaceholderItems: true,
      __experimentalFirstVisibleItemClass: "first",
      __experimentalLastVisibleItemClass: "last",
      dropdownMenuProps,
      children
    },
    panelId
  );
}
export {
  BlockSupportToolsPanel as default
};
//# sourceMappingURL=block-support-tools-panel.mjs.map
