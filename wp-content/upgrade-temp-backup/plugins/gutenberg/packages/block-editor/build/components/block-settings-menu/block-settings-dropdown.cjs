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

// packages/block-editor/src/components/block-settings-menu/block-settings-dropdown.js
var block_settings_dropdown_exports = {};
__export(block_settings_dropdown_exports, {
  BlockSettingsDropdown: () => BlockSettingsDropdown,
  default: () => block_settings_dropdown_default
});
module.exports = __toCommonJS(block_settings_dropdown_exports);
var import_blocks = require("@wordpress/blocks");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_icons = require("@wordpress/icons");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_compose = require("@wordpress/compose");
var import_block_actions = __toESM(require("../block-actions/index.cjs"));
var import_block_comment_icon_slot = __toESM(require("../collab/block-comment-icon-slot.cjs"));
var import_block_html_convert_button = __toESM(require("./block-html-convert-button.cjs"));
var import_block_settings_menu_first_item = __toESM(require("./block-settings-menu-first-item.cjs"));
var import_block_settings_menu_controls = __toESM(require("../block-settings-menu-controls/index.cjs"));
var import_block_parent_selector_menu_item = __toESM(require("./block-parent-selector-menu-item.cjs"));
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_use_notify_copy = require("../../utils/use-notify-copy.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var POPOVER_PROPS = {
  className: "block-editor-block-settings-menu__popover",
  placement: "bottom-start"
};
function CopyMenuItem({
  clientIds,
  onCopy,
  label,
  shortcut,
  eventType = "copy",
  __experimentalUpdateSelection: updateSelection = false
}) {
  const { getBlocksByClientId } = (0, import_data.useSelect)(import_store.store);
  const { removeBlocks } = (0, import_data.useDispatch)(import_store.store);
  const notifyCopy = (0, import_use_notify_copy.useNotifyCopy)();
  const ref = (0, import_compose.useCopyToClipboard)(
    () => (0, import_blocks.serialize)(getBlocksByClientId(clientIds)),
    () => {
      switch (eventType) {
        case "copy":
        case "copyStyles":
          onCopy();
          notifyCopy(eventType, clientIds);
          break;
        case "cut":
          notifyCopy(eventType, clientIds);
          removeBlocks(clientIds, updateSelection);
          break;
        default:
          break;
      }
    }
  );
  const copyMenuItemLabel = label ? label : (0, import_i18n.__)("Copy");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuItem, { ref, shortcut, children: copyMenuItemLabel });
}
function BlockSettingsDropdown({
  block,
  clientIds,
  children,
  __experimentalSelectBlock,
  isContentOnlyListView,
  ...props
}) {
  const count = clientIds.length;
  const firstBlockClientId = clientIds[0];
  const {
    firstParentClientId,
    parentBlockType,
    previousBlockClientId,
    selectedBlockClientIds,
    isContentOnly,
    isZoomOut,
    canEdit,
    canMove,
    isFirst,
    isLast
  } = (0, import_data.useSelect)(
    (select) => {
      const {
        getBlockName,
        getBlockRootClientId,
        getPreviousBlockClientId,
        getSelectedBlockClientIds: getSelectedBlockClientIds2,
        getBlockAttributes,
        getBlockEditingMode,
        isZoomOut: _isZoomOut,
        canEditBlock,
        canMoveBlocks,
        getBlockIndex,
        getBlockCount
      } = (0, import_lock_unlock.unlock)(select(import_store.store));
      const { getActiveBlockVariation } = select(import_blocks.store);
      const _firstParentClientId = getBlockRootClientId(firstBlockClientId);
      const parentBlockName = _firstParentClientId && getBlockName(_firstParentClientId);
      return {
        firstParentClientId: _firstParentClientId,
        parentBlockType: _firstParentClientId && (getActiveBlockVariation(
          parentBlockName,
          getBlockAttributes(_firstParentClientId)
        ) || (0, import_blocks.getBlockType)(parentBlockName)),
        previousBlockClientId: getPreviousBlockClientId(firstBlockClientId),
        selectedBlockClientIds: getSelectedBlockClientIds2(),
        isContentOnly: getBlockEditingMode(firstBlockClientId) === "contentOnly",
        isZoomOut: _isZoomOut(),
        canEdit: canEditBlock(firstBlockClientId),
        canMove: canMoveBlocks(clientIds),
        isFirst: getBlockIndex(firstBlockClientId) === 0,
        isLast: getBlockIndex(firstBlockClientId) === getBlockCount(_firstParentClientId) - 1
      };
    },
    [firstBlockClientId, clientIds]
  );
  const { getBlockOrder, getSelectedBlockClientIds } = (0, import_data.useSelect)(import_store.store);
  const { moveBlocksDown, moveBlocksUp } = (0, import_data.useDispatch)(import_store.store);
  const shortcuts = (0, import_data.useSelect)((select) => {
    const { getShortcutRepresentation } = select(import_keyboard_shortcuts.store);
    return {
      copy: getShortcutRepresentation("core/block-editor/copy"),
      cut: getShortcutRepresentation("core/block-editor/cut"),
      duplicate: getShortcutRepresentation(
        "core/block-editor/duplicate"
      ),
      remove: getShortcutRepresentation("core/block-editor/remove"),
      insertAfter: getShortcutRepresentation(
        "core/block-editor/insert-after"
      ),
      insertBefore: getShortcutRepresentation(
        "core/block-editor/insert-before"
      )
    };
  }, []);
  const hasSelectedBlocks = selectedBlockClientIds.length > 0;
  async function updateSelectionAfterDuplicate(clientIdsPromise) {
    if (!__experimentalSelectBlock) {
      return;
    }
    const ids = await clientIdsPromise;
    if (ids && ids[0]) {
      __experimentalSelectBlock(ids[0], false);
    }
  }
  function updateSelectionAfterRemove() {
    if (!__experimentalSelectBlock) {
      return;
    }
    let blockToFocus = previousBlockClientId || firstParentClientId;
    if (!blockToFocus) {
      blockToFocus = getBlockOrder()[0];
    }
    const shouldUpdateSelection = hasSelectedBlocks && getSelectedBlockClientIds().length === 0;
    __experimentalSelectBlock(blockToFocus, shouldUpdateSelection);
  }
  const parentBlockIsSelected = selectedBlockClientIds?.includes(firstParentClientId);
  const shouldShowBlockParentMenuItem = !parentBlockIsSelected && !!firstParentClientId;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_block_actions.default,
    {
      clientIds,
      __experimentalUpdateSelection: !__experimentalSelectBlock,
      children: ({
        canCopyStyles,
        canDuplicate,
        canInsertBlock,
        canRemove,
        onDuplicate,
        onInsertAfter,
        onInsertBefore,
        onRemove,
        onCopy,
        onPasteStyles
      }) => {
        const isEmpty = !canRemove && !canDuplicate && !canInsertBlock && isContentOnly;
        if (isEmpty) {
          return null;
        }
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.DropdownMenu,
          {
            icon: import_icons.moreVertical,
            label: (0, import_i18n.__)("Options"),
            className: "block-editor-block-settings-menu",
            popoverProps: POPOVER_PROPS,
            noIcons: true,
            ...props,
            children: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.MenuGroup, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_block_settings_menu_first_item.default.Slot,
                  {
                    fillProps: { onClose }
                  }
                ),
                shouldShowBlockParentMenuItem && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_block_parent_selector_menu_item.default,
                  {
                    parentClientId: firstParentClientId,
                    parentBlockType
                  }
                ),
                canMove && isContentOnlyListView && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_components.MenuItem,
                    {
                      icon: import_icons.chevronUp,
                      disabled: isFirst,
                      accessibleWhenDisabled: true,
                      onClick: (0, import_compose.pipe)(onClose, () => {
                        moveBlocksUp(
                          clientIds,
                          firstParentClientId
                        );
                      }),
                      children: (0, import_i18n.__)("Move up")
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_components.MenuItem,
                    {
                      icon: import_icons.chevronDown,
                      disabled: isLast,
                      accessibleWhenDisabled: true,
                      onClick: (0, import_compose.pipe)(onClose, () => {
                        moveBlocksDown(
                          clientIds,
                          firstParentClientId
                        );
                      }),
                      children: (0, import_i18n.__)("Move down")
                    }
                  )
                ] }),
                canEdit && count === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_block_html_convert_button.default,
                  {
                    clientId: firstBlockClientId
                  }
                ),
                !isContentOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  CopyMenuItem,
                  {
                    clientIds,
                    onCopy,
                    shortcut: shortcuts.copy
                  }
                ),
                canRemove && !isContentOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  CopyMenuItem,
                  {
                    clientIds,
                    label: (0, import_i18n.__)("Cut"),
                    eventType: "cut",
                    shortcut: shortcuts.cut,
                    __experimentalUpdateSelection: !__experimentalSelectBlock
                  }
                ),
                canDuplicate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.MenuItem,
                  {
                    onClick: (0, import_compose.pipe)(
                      onClose,
                      onDuplicate,
                      updateSelectionAfterDuplicate
                    ),
                    shortcut: shortcuts.duplicate,
                    children: (0, import_i18n.__)("Duplicate")
                  }
                ),
                canInsertBlock && !isZoomOut && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_components.MenuItem,
                    {
                      onClick: (0, import_compose.pipe)(
                        onClose,
                        onInsertBefore
                      ),
                      shortcut: shortcuts.insertBefore,
                      children: (0, import_i18n.__)("Add before")
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_components.MenuItem,
                    {
                      onClick: (0, import_compose.pipe)(
                        onClose,
                        onInsertAfter
                      ),
                      shortcut: shortcuts.insertAfter,
                      children: (0, import_i18n.__)("Add after")
                    }
                  )
                ] }),
                canEdit && count === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_block_comment_icon_slot.default.Slot,
                  {
                    fillProps: {
                      clientId: firstBlockClientId,
                      onClose
                    }
                  }
                )
              ] }),
              canCopyStyles && !isContentOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.MenuGroup, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  CopyMenuItem,
                  {
                    clientIds,
                    onCopy,
                    label: (0, import_i18n.__)("Copy styles"),
                    eventType: "copyStyles"
                  }
                ),
                canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuItem, { onClick: onPasteStyles, children: (0, import_i18n.__)("Paste styles") })
              ] }),
              !isContentOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_block_settings_menu_controls.default.Slot,
                {
                  fillProps: {
                    onClose,
                    count,
                    firstBlockClientId
                  },
                  clientIds
                }
              ),
              typeof children === "function" ? children({ onClose }) : import_element.Children.map(
                (child) => (0, import_element.cloneElement)(child, { onClose })
              ),
              canRemove && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.MenuItem,
                {
                  onClick: (0, import_compose.pipe)(
                    onClose,
                    onRemove,
                    updateSelectionAfterRemove
                  ),
                  shortcut: shortcuts.remove,
                  children: (0, import_i18n.__)("Delete")
                }
              ) })
            ] })
          }
        );
      }
    }
  );
}
var block_settings_dropdown_default = BlockSettingsDropdown;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlockSettingsDropdown
});
//# sourceMappingURL=block-settings-dropdown.cjs.map
