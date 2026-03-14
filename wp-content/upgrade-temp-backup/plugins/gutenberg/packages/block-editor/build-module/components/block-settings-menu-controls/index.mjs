// packages/block-editor/src/components/block-settings-menu-controls/index.js
import {
  createSlotFill,
  MenuGroup,
  __experimentalStyleProvider as StyleProvider
} from "@wordpress/components";
import { hasBlockSupport } from "@wordpress/blocks";
import { useSelect } from "@wordpress/data";
import {
  useConvertToGroupButtonProps,
  ConvertToGroupButton
} from "../convert-to-group-buttons/index.mjs";
import { BlockLockMenuItem, useBlockLock } from "../block-lock/index.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import BlockModeToggle from "../block-settings-menu/block-mode-toggle.mjs";
import { BlockRenameControl, useBlockRename } from "../block-rename/index.mjs";
import { BlockVisibilityViewportMenuItem } from "../block-visibility/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { Fill, Slot } = createSlotFill("BlockSettingsMenuControls");
var BlockSettingsMenuControlsSlot = ({ fillProps, clientIds = null }) => {
  const {
    selectedBlocks,
    selectedClientIds,
    isContentOnly,
    canToggleSelectedBlocksVisibility,
    canEdit
  } = useSelect(
    (select) => {
      const {
        getBlocksByClientId,
        getBlockNamesByClientId,
        getSelectedBlockClientIds,
        getBlockEditingMode,
        canEditBlock
      } = select(blockEditorStore);
      const ids = clientIds !== null ? clientIds : getSelectedBlockClientIds();
      return {
        selectedBlocks: getBlockNamesByClientId(ids),
        selectedClientIds: ids,
        isContentOnly: getBlockEditingMode(ids[0]) === "contentOnly",
        canToggleSelectedBlocksVisibility: getBlocksByClientId(
          ids
        ).every(
          (block) => hasBlockSupport(block.name, "visibility", true)
        ),
        canEdit: canEditBlock(ids[0])
      };
    },
    [clientIds]
  );
  const { canLock } = useBlockLock(selectedClientIds[0]);
  const { canRename } = useBlockRename(selectedBlocks[0]);
  const showLockButton = selectedClientIds.length === 1 && canLock && !isContentOnly;
  const showRenameButton = selectedClientIds.length === 1 && canRename && !isContentOnly;
  const showVisibilityButton = canToggleSelectedBlocksVisibility && !isContentOnly;
  const convertToGroupButtonProps = useConvertToGroupButtonProps(selectedClientIds);
  const { isGroupable, isUngroupable } = convertToGroupButtonProps;
  const showConvertToGroupButton = (isGroupable || isUngroupable) && !isContentOnly;
  return /* @__PURE__ */ jsx(
    Slot,
    {
      fillProps: {
        ...fillProps,
        canEdit,
        selectedBlocks,
        selectedClientIds
      },
      children: (fills) => {
        if (!fills?.length > 0 && !showConvertToGroupButton && !showLockButton) {
          return null;
        }
        return /* @__PURE__ */ jsxs(MenuGroup, { children: [
          showConvertToGroupButton && /* @__PURE__ */ jsx(
            ConvertToGroupButton,
            {
              ...convertToGroupButtonProps,
              onClose: fillProps?.onClose
            }
          ),
          canEdit && showLockButton && /* @__PURE__ */ jsx(
            BlockLockMenuItem,
            {
              clientId: selectedClientIds[0]
            }
          ),
          canEdit && showRenameButton && /* @__PURE__ */ jsx(
            BlockRenameControl,
            {
              clientId: selectedClientIds[0]
            }
          ),
          canEdit && showVisibilityButton && /* @__PURE__ */ jsx(
            BlockVisibilityViewportMenuItem,
            {
              clientIds: selectedClientIds
            }
          ),
          fills,
          canEdit && fillProps?.count === 1 && !isContentOnly && /* @__PURE__ */ jsx(
            BlockModeToggle,
            {
              clientId: fillProps?.firstBlockClientId,
              onToggle: fillProps?.onClose
            }
          )
        ] });
      }
    }
  );
};
function BlockSettingsMenuControls({ ...props }) {
  return /* @__PURE__ */ jsx(StyleProvider, { document, children: /* @__PURE__ */ jsx(Fill, { ...props }) });
}
BlockSettingsMenuControls.Slot = BlockSettingsMenuControlsSlot;
var block_settings_menu_controls_default = BlockSettingsMenuControls;
export {
  block_settings_menu_controls_default as default
};
//# sourceMappingURL=index.mjs.map
