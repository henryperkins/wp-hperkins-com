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

// packages/block-editor/src/components/block-settings-menu-controls/index.js
var block_settings_menu_controls_exports = {};
__export(block_settings_menu_controls_exports, {
  default: () => block_settings_menu_controls_default
});
module.exports = __toCommonJS(block_settings_menu_controls_exports);
var import_components = require("@wordpress/components");
var import_blocks = require("@wordpress/blocks");
var import_data = require("@wordpress/data");
var import_convert_to_group_buttons = require("../convert-to-group-buttons/index.cjs");
var import_block_lock = require("../block-lock/index.cjs");
var import_store = require("../../store/index.cjs");
var import_block_mode_toggle = __toESM(require("../block-settings-menu/block-mode-toggle.cjs"));
var import_block_rename = require("../block-rename/index.cjs");
var import_block_visibility = require("../block-visibility/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Fill, Slot } = (0, import_components.createSlotFill)("BlockSettingsMenuControls");
var BlockSettingsMenuControlsSlot = ({ fillProps, clientIds = null }) => {
  const {
    selectedBlocks,
    selectedClientIds,
    isContentOnly,
    canToggleSelectedBlocksVisibility,
    canEdit
  } = (0, import_data.useSelect)(
    (select) => {
      const {
        getBlocksByClientId,
        getBlockNamesByClientId,
        getSelectedBlockClientIds,
        getBlockEditingMode,
        canEditBlock
      } = select(import_store.store);
      const ids = clientIds !== null ? clientIds : getSelectedBlockClientIds();
      return {
        selectedBlocks: getBlockNamesByClientId(ids),
        selectedClientIds: ids,
        isContentOnly: getBlockEditingMode(ids[0]) === "contentOnly",
        canToggleSelectedBlocksVisibility: getBlocksByClientId(
          ids
        ).every(
          (block) => (0, import_blocks.hasBlockSupport)(block.name, "visibility", true)
        ),
        canEdit: canEditBlock(ids[0])
      };
    },
    [clientIds]
  );
  const { canLock } = (0, import_block_lock.useBlockLock)(selectedClientIds[0]);
  const { canRename } = (0, import_block_rename.useBlockRename)(selectedBlocks[0]);
  const showLockButton = selectedClientIds.length === 1 && canLock && !isContentOnly;
  const showRenameButton = selectedClientIds.length === 1 && canRename && !isContentOnly;
  const showVisibilityButton = canToggleSelectedBlocksVisibility && !isContentOnly;
  const convertToGroupButtonProps = (0, import_convert_to_group_buttons.useConvertToGroupButtonProps)(selectedClientIds);
  const { isGroupable, isUngroupable } = convertToGroupButtonProps;
  const showConvertToGroupButton = (isGroupable || isUngroupable) && !isContentOnly;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.MenuGroup, { children: [
          showConvertToGroupButton && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_convert_to_group_buttons.ConvertToGroupButton,
            {
              ...convertToGroupButtonProps,
              onClose: fillProps?.onClose
            }
          ),
          canEdit && showLockButton && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_block_lock.BlockLockMenuItem,
            {
              clientId: selectedClientIds[0]
            }
          ),
          canEdit && showRenameButton && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_block_rename.BlockRenameControl,
            {
              clientId: selectedClientIds[0]
            }
          ),
          canEdit && showVisibilityButton && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_block_visibility.BlockVisibilityViewportMenuItem,
            {
              clientIds: selectedClientIds
            }
          ),
          fills,
          canEdit && fillProps?.count === 1 && !isContentOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_block_mode_toggle.default,
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalStyleProvider, { document, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fill, { ...props }) });
}
BlockSettingsMenuControls.Slot = BlockSettingsMenuControlsSlot;
var block_settings_menu_controls_default = BlockSettingsMenuControls;
//# sourceMappingURL=index.cjs.map
