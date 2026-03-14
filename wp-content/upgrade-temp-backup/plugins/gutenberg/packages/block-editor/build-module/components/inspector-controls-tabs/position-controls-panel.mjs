// packages/block-editor/src/components/inspector-controls-tabs/position-controls-panel.js
import {
  __experimentalUseSlotFills as useSlotFills,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import InspectorControlsGroups from "../inspector-controls/groups.mjs";
import { default as InspectorControls } from "../inspector-controls/index.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { useToolsPanelDropdownMenuProps } from "../global-styles/utils.mjs";
import { cleanEmptyObject } from "../../hooks/utils.mjs";
import { jsx } from "react/jsx-runtime";
var PositionControlsPanel = () => {
  const { selectedClientIds, selectedBlocks, hasPositionAttribute } = useSelect((select) => {
    const { getBlocksByClientId, getSelectedBlockClientIds } = select(blockEditorStore);
    const selectedBlockClientIds = getSelectedBlockClientIds();
    const _selectedBlocks = getBlocksByClientId(
      selectedBlockClientIds
    );
    return {
      selectedClientIds: selectedBlockClientIds,
      selectedBlocks: _selectedBlocks,
      hasPositionAttribute: _selectedBlocks?.some(
        ({ attributes }) => !!attributes?.style?.position?.type
      )
    };
  }, []);
  const { updateBlockAttributes } = useDispatch(blockEditorStore);
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  function resetPosition() {
    if (!selectedClientIds?.length || !selectedBlocks?.length) {
      return;
    }
    const attributesByClientId = Object.fromEntries(
      selectedBlocks?.map(({ clientId, attributes }) => [
        clientId,
        {
          style: cleanEmptyObject({
            ...attributes?.style,
            position: {
              ...attributes?.style?.position,
              type: void 0,
              top: void 0,
              right: void 0,
              bottom: void 0,
              left: void 0
            }
          })
        }
      ])
    );
    updateBlockAttributes(selectedClientIds, attributesByClientId, true);
  }
  return /* @__PURE__ */ jsx(
    ToolsPanel,
    {
      className: "block-editor-block-inspector__position",
      label: __("Position"),
      resetAll: resetPosition,
      dropdownMenuProps,
      children: /* @__PURE__ */ jsx(
        ToolsPanelItem,
        {
          isShownByDefault: hasPositionAttribute,
          label: __("Position"),
          hasValue: () => hasPositionAttribute,
          onDeselect: resetPosition,
          children: /* @__PURE__ */ jsx(InspectorControls.Slot, { group: "position" })
        }
      )
    }
  );
};
var PositionControls = () => {
  const fills = useSlotFills(InspectorControlsGroups.position.name);
  const hasFills = Boolean(fills && fills.length);
  if (!hasFills) {
    return null;
  }
  return /* @__PURE__ */ jsx(PositionControlsPanel, {});
};
var position_controls_panel_default = PositionControls;
export {
  position_controls_panel_default as default
};
//# sourceMappingURL=position-controls-panel.mjs.map
