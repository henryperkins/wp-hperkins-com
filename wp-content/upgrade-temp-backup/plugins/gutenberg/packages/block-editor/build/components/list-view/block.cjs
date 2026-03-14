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

// packages/block-editor/src/components/list-view/block.js
var block_exports = {};
__export(block_exports, {
  default: () => block_default
});
module.exports = __toCommonJS(block_exports);
var import_clsx = __toESM(require("clsx"));
var import_blocks = require("@wordpress/blocks");
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_icons = require("@wordpress/icons");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_keycodes = require("@wordpress/keycodes");
var import_is_shallow_equal = require("@wordpress/is-shallow-equal");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_a11y = require("@wordpress/a11y");
var import_leaf = __toESM(require("./leaf.cjs"));
var import_use_list_view_scroll_into_view = __toESM(require("./use-list-view-scroll-into-view.cjs"));
var import_button = require("../block-mover/button.cjs");
var import_block_contents = __toESM(require("./block-contents.cjs"));
var import_context = require("./context.cjs");
var import_utils = require("./utils.cjs");
var import_store = require("../../store/index.cjs");
var import_use_block_display_information = __toESM(require("../use-block-display-information/index.cjs"));
var import_block_lock = require("../block-lock/index.cjs");
var import_block_rename = require("../block-rename/index.cjs");
var import_aria_referenced_text = __toESM(require("./aria-referenced-text.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_use_paste_styles = __toESM(require("../use-paste-styles/index.cjs"));
var import_block_visibility = require("../block-visibility/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function ListViewBlock({
  block: { clientId },
  displacement,
  isAfterDraggedBlocks,
  isDragged,
  isNesting,
  isSelected,
  isBranchSelected,
  selectBlock,
  position,
  level,
  rowCount,
  siblingBlockCount,
  showBlockMovers,
  path,
  isExpanded,
  selectedClientIds,
  isSyncedBranch
}) {
  const cellRef = (0, import_element.useRef)(null);
  const rowRef = (0, import_element.useRef)(null);
  const settingsRef = (0, import_element.useRef)(null);
  const [isHovered, setIsHovered] = (0, import_element.useState)(false);
  const [settingsAnchorRect, setSettingsAnchorRect] = (0, import_element.useState)();
  const [isRenameModalOpen, setIsRenameModalOpen] = (0, import_element.useState)(false);
  const { isLocked } = (0, import_block_lock.useBlockLock)(clientId);
  const isFirstSelectedBlock = isSelected && selectedClientIds[0] === clientId;
  const isLastSelectedBlock = isSelected && selectedClientIds[selectedClientIds.length - 1] === clientId;
  const {
    toggleBlockHighlight,
    duplicateBlocks,
    multiSelect,
    replaceBlocks,
    removeBlocks,
    insertAfterBlock,
    insertBeforeBlock,
    showViewportModal
  } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_store.store));
  const debouncedToggleBlockHighlight = (0, import_compose.useDebounce)(
    toggleBlockHighlight,
    50
  );
  const {
    canInsertBlockType,
    getSelectedBlockClientIds,
    getPreviousBlockClientId,
    getBlockRootClientId,
    getBlockOrder,
    getBlockParents,
    getBlockEditingMode,
    getBlocksByClientId,
    canEditBlock,
    canMoveBlock,
    canRemoveBlocks,
    isGroupable
  } = (0, import_data.useSelect)(import_store.store);
  const { getGroupingBlockName } = (0, import_data.useSelect)(import_blocks.store);
  const blockInformation = (0, import_use_block_display_information.default)(clientId);
  const pasteStyles = (0, import_use_paste_styles.default)();
  const { block, blockName, allowRightClickOverrides } = (0, import_data.useSelect)(
    (select) => {
      const { getBlock, getBlockName, getSettings } = (0, import_lock_unlock.unlock)(
        select(import_store.store)
      );
      return {
        block: getBlock(clientId),
        blockName: getBlockName(clientId),
        allowRightClickOverrides: getSettings().allowRightClickOverrides
      };
    },
    [clientId]
  );
  const { canRename } = (0, import_block_rename.useBlockRename)(blockName);
  const showBlockActions = (
    // When a block hides its toolbar it also hides the block settings menu,
    // since that menu is part of the toolbar in the editor canvas.
    // List View respects this by also hiding the block settings menu.
    (0, import_blocks.hasBlockSupport)(blockName, "__experimentalToolbar", true)
  );
  const instanceId = (0, import_compose.useInstanceId)(ListViewBlock);
  const descriptionId = `list-view-block-select-button__description-${instanceId}`;
  const {
    expand,
    collapse,
    collapseAll,
    BlockSettingsMenu,
    listViewInstanceId,
    expandedState,
    setInsertedBlock,
    treeGridElementRef,
    rootClientId
  } = (0, import_context.useListViewContext)();
  const isMatch = (0, import_keyboard_shortcuts.__unstableUseShortcutEventMatch)();
  function getBlocksToUpdate() {
    const selectedBlockClientIds = getSelectedBlockClientIds();
    const isUpdatingSelectedBlocks = selectedBlockClientIds.includes(clientId);
    const firstBlockClientId = isUpdatingSelectedBlocks ? selectedBlockClientIds[0] : clientId;
    const firstBlockRootClientId = getBlockRootClientId(firstBlockClientId);
    const blocksToUpdate = isUpdatingSelectedBlocks ? selectedBlockClientIds : [clientId];
    return {
      blocksToUpdate,
      firstBlockClientId,
      firstBlockRootClientId,
      selectedBlockClientIds
    };
  }
  async function onKeyDown(event) {
    if (event.defaultPrevented) {
      return;
    }
    if (event.target.closest("[role=dialog]")) {
      return;
    }
    const isDeleteKey = [import_keycodes.BACKSPACE, import_keycodes.DELETE].includes(event.keyCode);
    if (isMatch("core/block-editor/unselect", event) && selectedClientIds.length > 0) {
      event.stopPropagation();
      event.preventDefault();
      selectBlock(event, void 0);
    } else if (isDeleteKey || isMatch("core/block-editor/remove", event)) {
      const {
        blocksToUpdate: blocksToDelete,
        firstBlockClientId,
        firstBlockRootClientId,
        selectedBlockClientIds
      } = getBlocksToUpdate();
      if (!canRemoveBlocks(blocksToDelete)) {
        return;
      }
      let blockToFocus = getPreviousBlockClientId(firstBlockClientId) ?? // If the previous block is not found (when the first block is deleted),
      // fallback to focus the parent block.
      firstBlockRootClientId;
      removeBlocks(blocksToDelete, false);
      const shouldUpdateSelection = selectedBlockClientIds.length > 0 && getSelectedBlockClientIds().length === 0;
      if (!blockToFocus) {
        blockToFocus = getBlockOrder()[0];
      }
      updateFocusAndSelection(blockToFocus, shouldUpdateSelection);
    } else if (isMatch("core/block-editor/paste-styles", event)) {
      event.preventDefault();
      const { blocksToUpdate } = getBlocksToUpdate();
      const blocks = getBlocksByClientId(blocksToUpdate);
      pasteStyles(blocks);
    } else if (isMatch("core/block-editor/duplicate", event)) {
      event.preventDefault();
      const { blocksToUpdate, firstBlockRootClientId } = getBlocksToUpdate();
      const canDuplicate = getBlocksByClientId(blocksToUpdate).every(
        (blockToUpdate) => {
          return !!blockToUpdate && (0, import_blocks.hasBlockSupport)(
            blockToUpdate.name,
            "multiple",
            true
          ) && canInsertBlockType(
            blockToUpdate.name,
            firstBlockRootClientId
          );
        }
      );
      if (canDuplicate) {
        const updatedBlocks = await duplicateBlocks(
          blocksToUpdate,
          false
        );
        if (updatedBlocks?.length) {
          updateFocusAndSelection(updatedBlocks[0], false);
        }
      }
    } else if (isMatch("core/block-editor/insert-before", event)) {
      event.preventDefault();
      const { blocksToUpdate } = getBlocksToUpdate();
      await insertBeforeBlock(blocksToUpdate[0]);
      const newlySelectedBlocks = getSelectedBlockClientIds();
      updateFocusAndSelection(newlySelectedBlocks[0], false);
    } else if (isMatch("core/block-editor/insert-after", event)) {
      event.preventDefault();
      const { blocksToUpdate } = getBlocksToUpdate();
      await insertAfterBlock(blocksToUpdate.at(-1));
      const newlySelectedBlocks = getSelectedBlockClientIds();
      updateFocusAndSelection(newlySelectedBlocks[0], false);
    } else if (isMatch("core/block-editor/select-all", event)) {
      event.preventDefault();
      const { firstBlockRootClientId, selectedBlockClientIds } = getBlocksToUpdate();
      const blockClientIds = getBlockOrder(firstBlockRootClientId);
      if (!blockClientIds.length) {
        return;
      }
      if ((0, import_is_shallow_equal.isShallowEqual)(selectedBlockClientIds, blockClientIds)) {
        if (firstBlockRootClientId && firstBlockRootClientId !== rootClientId) {
          updateFocusAndSelection(firstBlockRootClientId, true);
          return;
        }
      }
      multiSelect(
        blockClientIds[0],
        blockClientIds[blockClientIds.length - 1],
        null
      );
    } else if (isMatch("core/block-editor/collapse-list-view", event)) {
      event.preventDefault();
      const { firstBlockClientId } = getBlocksToUpdate();
      const blockParents = getBlockParents(firstBlockClientId, false);
      collapseAll();
      expand(blockParents);
    } else if (isMatch("core/block-editor/group", event)) {
      const { blocksToUpdate } = getBlocksToUpdate();
      if (blocksToUpdate.length > 1 && isGroupable(blocksToUpdate)) {
        event.preventDefault();
        const blocks = getBlocksByClientId(blocksToUpdate);
        const groupingBlockName = getGroupingBlockName();
        const newBlocks = (0, import_blocks.switchToBlockType)(
          blocks,
          groupingBlockName
        );
        replaceBlocks(blocksToUpdate, newBlocks);
        (0, import_a11y.speak)((0, import_i18n.__)("Selected blocks are grouped."));
        const newlySelectedBlocks = getSelectedBlockClientIds();
        updateFocusAndSelection(newlySelectedBlocks[0], false);
      }
    } else if (isMatch("core/block-editor/toggle-block-visibility", event)) {
      event.preventDefault();
      const { blocksToUpdate } = getBlocksToUpdate();
      const blocks = getBlocksByClientId(blocksToUpdate);
      const supportsBlockVisibility = blocks.every(
        (_block) => (0, import_blocks.hasBlockSupport)(_block.name, "visibility", true)
      );
      if (!supportsBlockVisibility) {
        return;
      }
      if (blocksToUpdate.some(
        (id) => getBlockEditingMode(id) !== "default"
      )) {
        return;
      }
      showViewportModal(blocksToUpdate);
    } else if (isMatch("core/block-editor/rename", event)) {
      const { blocksToUpdate } = getBlocksToUpdate();
      const isContentOnly = getBlockEditingMode(blocksToUpdate[0]) === "contentOnly";
      if (blocksToUpdate.length === 1 && canRename && !isContentOnly) {
        event.preventDefault();
        setIsRenameModalOpen(true);
      }
    }
  }
  const onMouseEnter = (0, import_element.useCallback)(() => {
    setIsHovered(true);
    debouncedToggleBlockHighlight(clientId, true);
  }, [clientId, setIsHovered, debouncedToggleBlockHighlight]);
  const onMouseLeave = (0, import_element.useCallback)(() => {
    setIsHovered(false);
    debouncedToggleBlockHighlight(clientId, false);
  }, [clientId, setIsHovered, debouncedToggleBlockHighlight]);
  const selectEditorBlock = (0, import_element.useCallback)(
    (event) => {
      selectBlock(event, clientId);
      event.preventDefault();
    },
    [clientId, selectBlock]
  );
  const updateFocusAndSelection = (0, import_element.useCallback)(
    (focusClientId, shouldSelectBlock) => {
      if (shouldSelectBlock) {
        selectBlock(void 0, focusClientId, null, null);
      }
      (0, import_utils.focusListItem)(focusClientId, treeGridElementRef?.current);
    },
    [selectBlock, treeGridElementRef]
  );
  const toggleExpanded = (0, import_element.useCallback)(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (isExpanded === true) {
        collapse(clientId);
      } else if (isExpanded === false) {
        expand(clientId);
      }
    },
    [clientId, expand, collapse, isExpanded]
  );
  const onContextMenu = (0, import_element.useCallback)(
    (event) => {
      const { ownerDocument } = settingsRef?.current || {};
      if (!ownerDocument || !ownerDocument.hasFocus()) {
        return;
      }
      if (showBlockActions && allowRightClickOverrides) {
        settingsRef.current?.click();
        setSettingsAnchorRect(
          new window.DOMRect(event.clientX, event.clientY, 0, 0)
        );
        event.preventDefault();
      }
    },
    [allowRightClickOverrides, settingsRef, showBlockActions]
  );
  const onMouseDown = (0, import_element.useCallback)(
    (event) => {
      if (allowRightClickOverrides && event.button === 2) {
        event.preventDefault();
      }
    },
    [allowRightClickOverrides]
  );
  const settingsPopoverAnchor = (0, import_element.useMemo)(() => {
    const { ownerDocument } = rowRef?.current || {};
    if (!settingsAnchorRect || !ownerDocument) {
      return void 0;
    }
    return {
      ownerDocument,
      getBoundingClientRect() {
        return settingsAnchorRect;
      }
    };
  }, [settingsAnchorRect]);
  const clearSettingsAnchorRect = (0, import_element.useCallback)(() => {
    setSettingsAnchorRect(void 0);
  }, [setSettingsAnchorRect]);
  (0, import_use_list_view_scroll_into_view.default)({
    isSelected,
    rowItemRef: rowRef,
    selectedClientIds
  });
  if (!block) {
    return null;
  }
  const blockPositionDescription = (0, import_utils.getBlockPositionDescription)(
    position,
    siblingBlockCount,
    level
  );
  const blockPropertiesDescription = (0, import_utils.getBlockPropertiesDescription)(
    blockInformation,
    isLocked
  );
  const blockVisibilityDescription = (0, import_block_visibility.getBlockVisibilityLabel)(
    block?.attributes?.metadata?.blockVisibility
  );
  const hasSiblings = siblingBlockCount > 0;
  const hasRenderedMovers = showBlockMovers && hasSiblings;
  const moverCellClassName = (0, import_clsx.default)(
    "block-editor-list-view-block__mover-cell",
    { "is-visible": isHovered || isSelected }
  );
  const listViewBlockSettingsClassName = (0, import_clsx.default)(
    "block-editor-list-view-block__menu-cell",
    { "is-visible": isHovered || isFirstSelectedBlock }
  );
  let colSpan;
  if (hasRenderedMovers) {
    colSpan = 2;
  } else if (!showBlockActions) {
    colSpan = 3;
  }
  const classes = (0, import_clsx.default)({
    "is-selected": isSelected,
    "is-first-selected": isFirstSelectedBlock,
    "is-last-selected": isLastSelectedBlock,
    "is-branch-selected": isBranchSelected,
    "is-synced-branch": isSyncedBranch,
    "is-dragging": isDragged,
    "has-single-cell": !showBlockActions,
    "is-synced": blockInformation?.isSynced,
    "is-draggable": canMoveBlock,
    "is-displacement-normal": displacement === "normal",
    "is-displacement-up": displacement === "up",
    "is-displacement-down": displacement === "down",
    "is-after-dragged-blocks": isAfterDraggedBlocks,
    "is-nesting": isNesting
  });
  const dropdownClientIds = selectedClientIds.includes(clientId) ? selectedClientIds : [clientId];
  const currentlyEditingBlockInCanvas = isSelected && selectedClientIds.length === 1;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_leaf.default,
    {
      className: classes,
      isDragged,
      onKeyDown,
      onMouseEnter,
      onMouseLeave,
      onFocus: onMouseEnter,
      onBlur: onMouseLeave,
      level,
      position,
      rowCount,
      path,
      id: `list-view-${listViewInstanceId}-block-${clientId}`,
      "data-block": clientId,
      "data-expanded": canEditBlock ? isExpanded : void 0,
      ref: rowRef,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalTreeGridCell,
          {
            className: "block-editor-list-view-block__contents-cell",
            colSpan,
            ref: cellRef,
            "aria-selected": !!isSelected,
            children: ({ ref, tabIndex, onFocus }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "block-editor-list-view-block__contents-container", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_block_contents.default,
                {
                  block,
                  onClick: selectEditorBlock,
                  onContextMenu,
                  onMouseDown,
                  onToggleExpanded: toggleExpanded,
                  isSelected,
                  position,
                  siblingBlockCount,
                  level,
                  ref,
                  tabIndex: currentlyEditingBlockInCanvas ? 0 : tabIndex,
                  onFocus,
                  isExpanded: canEditBlock ? isExpanded : void 0,
                  selectedClientIds,
                  ariaDescribedBy: descriptionId
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_aria_referenced_text.default, { id: descriptionId, children: [
                blockPositionDescription,
                blockPropertiesDescription,
                blockVisibilityDescription
              ].filter(Boolean).join(" ") })
            ] })
          }
        ),
        hasRenderedMovers && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_components.__experimentalTreeGridCell,
          {
            className: moverCellClassName,
            withoutGridItem: true,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalTreeGridItem, { children: ({ ref, tabIndex, onFocus }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_button.BlockMoverUpButton,
                {
                  orientation: "vertical",
                  clientIds: [clientId],
                  ref,
                  tabIndex,
                  onFocus
                }
              ) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalTreeGridItem, { children: ({ ref, tabIndex, onFocus }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_button.BlockMoverDownButton,
                {
                  orientation: "vertical",
                  clientIds: [clientId],
                  ref,
                  tabIndex,
                  onFocus
                }
              ) })
            ]
          }
        ) }),
        showBlockActions && BlockSettingsMenu && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalTreeGridCell,
          {
            className: listViewBlockSettingsClassName,
            "aria-selected": !!isSelected,
            ref: settingsRef,
            children: ({ ref, tabIndex, onFocus }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              BlockSettingsMenu,
              {
                clientIds: dropdownClientIds,
                block,
                icon: import_icons.moreVertical,
                label: (0, import_i18n.__)("Options"),
                popoverProps: {
                  anchor: settingsPopoverAnchor
                  // Used to position the settings at the cursor on right-click.
                },
                toggleProps: {
                  ref,
                  className: "block-editor-list-view-block__menu",
                  tabIndex,
                  onClick: clearSettingsAnchorRect,
                  onFocus,
                  size: "small"
                },
                disableOpenOnArrowDown: true,
                expand,
                expandedState,
                setInsertedBlock,
                __experimentalSelectBlock: updateFocusAndSelection,
                isContentOnlyListView: !!rootClientId && getBlockEditingMode(rootClientId) === "contentOnly"
              }
            )
          }
        ),
        isRenameModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_block_rename.BlockRenameModal,
          {
            clientId,
            onClose: () => setIsRenameModalOpen(false)
          }
        )
      ]
    }
  );
}
var block_default = (0, import_element.memo)(ListViewBlock);
//# sourceMappingURL=block.cjs.map
