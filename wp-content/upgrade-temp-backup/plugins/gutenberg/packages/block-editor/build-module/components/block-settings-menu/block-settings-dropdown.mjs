// packages/block-editor/src/components/block-settings-menu/block-settings-dropdown.js
import {
  getBlockType,
  serialize,
  store as blocksStore
} from "@wordpress/blocks";
import { DropdownMenu, MenuGroup, MenuItem } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { chevronDown, chevronUp, moreVertical } from "@wordpress/icons";
import { Children, cloneElement } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { store as keyboardShortcutsStore } from "@wordpress/keyboard-shortcuts";
import { pipe, useCopyToClipboard } from "@wordpress/compose";
import BlockActions from "../block-actions/index.mjs";
import CommentIconSlotFill from "../collab/block-comment-icon-slot.mjs";
import BlockHTMLConvertButton from "./block-html-convert-button.mjs";
import __unstableBlockSettingsMenuFirstItem from "./block-settings-menu-first-item.mjs";
import BlockSettingsMenuControls from "../block-settings-menu-controls/index.mjs";
import BlockParentSelectorMenuItem from "./block-parent-selector-menu-item.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { useNotifyCopy } from "../../utils/use-notify-copy.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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
  const { getBlocksByClientId } = useSelect(blockEditorStore);
  const { removeBlocks } = useDispatch(blockEditorStore);
  const notifyCopy = useNotifyCopy();
  const ref = useCopyToClipboard(
    () => serialize(getBlocksByClientId(clientIds)),
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
  const copyMenuItemLabel = label ? label : __("Copy");
  return /* @__PURE__ */ jsx(MenuItem, { ref, shortcut, children: copyMenuItemLabel });
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
  } = useSelect(
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
      } = unlock(select(blockEditorStore));
      const { getActiveBlockVariation } = select(blocksStore);
      const _firstParentClientId = getBlockRootClientId(firstBlockClientId);
      const parentBlockName = _firstParentClientId && getBlockName(_firstParentClientId);
      return {
        firstParentClientId: _firstParentClientId,
        parentBlockType: _firstParentClientId && (getActiveBlockVariation(
          parentBlockName,
          getBlockAttributes(_firstParentClientId)
        ) || getBlockType(parentBlockName)),
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
  const { getBlockOrder, getSelectedBlockClientIds } = useSelect(blockEditorStore);
  const { moveBlocksDown, moveBlocksUp } = useDispatch(blockEditorStore);
  const shortcuts = useSelect((select) => {
    const { getShortcutRepresentation } = select(keyboardShortcutsStore);
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
  return /* @__PURE__ */ jsx(
    BlockActions,
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
        return /* @__PURE__ */ jsx(
          DropdownMenu,
          {
            icon: moreVertical,
            label: __("Options"),
            className: "block-editor-block-settings-menu",
            popoverProps: POPOVER_PROPS,
            noIcons: true,
            ...props,
            children: ({ onClose }) => /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(MenuGroup, { children: [
                /* @__PURE__ */ jsx(
                  __unstableBlockSettingsMenuFirstItem.Slot,
                  {
                    fillProps: { onClose }
                  }
                ),
                shouldShowBlockParentMenuItem && /* @__PURE__ */ jsx(
                  BlockParentSelectorMenuItem,
                  {
                    parentClientId: firstParentClientId,
                    parentBlockType
                  }
                ),
                canMove && isContentOnlyListView && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    MenuItem,
                    {
                      icon: chevronUp,
                      disabled: isFirst,
                      accessibleWhenDisabled: true,
                      onClick: pipe(onClose, () => {
                        moveBlocksUp(
                          clientIds,
                          firstParentClientId
                        );
                      }),
                      children: __("Move up")
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    MenuItem,
                    {
                      icon: chevronDown,
                      disabled: isLast,
                      accessibleWhenDisabled: true,
                      onClick: pipe(onClose, () => {
                        moveBlocksDown(
                          clientIds,
                          firstParentClientId
                        );
                      }),
                      children: __("Move down")
                    }
                  )
                ] }),
                canEdit && count === 1 && /* @__PURE__ */ jsx(
                  BlockHTMLConvertButton,
                  {
                    clientId: firstBlockClientId
                  }
                ),
                !isContentOnly && /* @__PURE__ */ jsx(
                  CopyMenuItem,
                  {
                    clientIds,
                    onCopy,
                    shortcut: shortcuts.copy
                  }
                ),
                canRemove && !isContentOnly && /* @__PURE__ */ jsx(
                  CopyMenuItem,
                  {
                    clientIds,
                    label: __("Cut"),
                    eventType: "cut",
                    shortcut: shortcuts.cut,
                    __experimentalUpdateSelection: !__experimentalSelectBlock
                  }
                ),
                canDuplicate && /* @__PURE__ */ jsx(
                  MenuItem,
                  {
                    onClick: pipe(
                      onClose,
                      onDuplicate,
                      updateSelectionAfterDuplicate
                    ),
                    shortcut: shortcuts.duplicate,
                    children: __("Duplicate")
                  }
                ),
                canInsertBlock && !isZoomOut && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    MenuItem,
                    {
                      onClick: pipe(
                        onClose,
                        onInsertBefore
                      ),
                      shortcut: shortcuts.insertBefore,
                      children: __("Add before")
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    MenuItem,
                    {
                      onClick: pipe(
                        onClose,
                        onInsertAfter
                      ),
                      shortcut: shortcuts.insertAfter,
                      children: __("Add after")
                    }
                  )
                ] }),
                canEdit && count === 1 && /* @__PURE__ */ jsx(
                  CommentIconSlotFill.Slot,
                  {
                    fillProps: {
                      clientId: firstBlockClientId,
                      onClose
                    }
                  }
                )
              ] }),
              canCopyStyles && !isContentOnly && /* @__PURE__ */ jsxs(MenuGroup, { children: [
                /* @__PURE__ */ jsx(
                  CopyMenuItem,
                  {
                    clientIds,
                    onCopy,
                    label: __("Copy styles"),
                    eventType: "copyStyles"
                  }
                ),
                canEdit && /* @__PURE__ */ jsx(MenuItem, { onClick: onPasteStyles, children: __("Paste styles") })
              ] }),
              !isContentOnly && /* @__PURE__ */ jsx(
                BlockSettingsMenuControls.Slot,
                {
                  fillProps: {
                    onClose,
                    count,
                    firstBlockClientId
                  },
                  clientIds
                }
              ),
              typeof children === "function" ? children({ onClose }) : Children.map(
                (child) => cloneElement(child, { onClose })
              ),
              canRemove && /* @__PURE__ */ jsx(MenuGroup, { children: /* @__PURE__ */ jsx(
                MenuItem,
                {
                  onClick: pipe(
                    onClose,
                    onRemove,
                    updateSelectionAfterRemove
                  ),
                  shortcut: shortcuts.remove,
                  children: __("Delete")
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
export {
  BlockSettingsDropdown,
  block_settings_dropdown_default as default
};
//# sourceMappingURL=block-settings-dropdown.mjs.map
