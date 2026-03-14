// packages/block-editor/src/components/block-tools/index.js
import clsx from "clsx";
import { useSelect, useDispatch } from "@wordpress/data";
import { isTextField } from "@wordpress/dom";
import { Popover } from "@wordpress/components";
import { __unstableUseShortcutEventMatch as useShortcutEventMatch } from "@wordpress/keyboard-shortcuts";
import { useRef, useState } from "@wordpress/element";
import {
  switchToBlockType,
  hasBlockSupport,
  store as blocksStore
} from "@wordpress/blocks";
import { speak } from "@wordpress/a11y";
import { __, sprintf, _n } from "@wordpress/i18n";
import EmptyBlockInserter from "./empty-block-inserter.mjs";
import {
  InsertionPointOpenRef,
  default as InsertionPoint
} from "./insertion-point.mjs";
import BlockToolbarPopover from "./block-toolbar-popover.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import usePopoverScroll from "../block-popover/use-popover-scroll.mjs";
import ZoomOutModeInserters from "./zoom-out-mode-inserters.mjs";
import { useShowBlockTools } from "./use-show-block-tools.mjs";
import { unlock } from "../../lock-unlock.mjs";
import usePasteStyles from "../use-paste-styles/index.mjs";
import { BlockRenameModal, useBlockRename } from "../block-rename/index.mjs";
import { BlockVisibilityModal } from "../block-visibility/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function selector(select) {
  const {
    getSelectedBlockClientId,
    getFirstMultiSelectedBlockClientId,
    getSettings,
    isTyping,
    isDragging,
    isZoomOut,
    getViewportModalClientIds
  } = unlock(select(blockEditorStore));
  const clientId = getSelectedBlockClientId() || getFirstMultiSelectedBlockClientId();
  return {
    clientId,
    hasFixedToolbar: getSettings().hasFixedToolbar,
    isTyping: isTyping(),
    isZoomOutMode: isZoomOut(),
    isDragging: isDragging(),
    viewportModalClientIds: getViewportModalClientIds()
  };
}
function BlockTools({
  children,
  __unstableContentRef,
  ...props
}) {
  const {
    clientId,
    hasFixedToolbar,
    isTyping,
    isZoomOutMode,
    isDragging,
    viewportModalClientIds
  } = useSelect(selector, []);
  const isMatch = useShortcutEventMatch();
  const {
    getBlocksByClientId,
    getSelectedBlockClientIds,
    getBlockRootClientId,
    getBlockEditingMode,
    getBlockName,
    isGroupable,
    getEditedContentOnlySection,
    canEditBlock
  } = unlock(useSelect(blockEditorStore));
  const { getGroupingBlockName } = useSelect(blocksStore);
  const { showEmptyBlockSideInserter, showBlockToolbarPopover } = useShowBlockTools();
  const pasteStyles = usePasteStyles();
  const [renamingBlockClientId, setRenamingBlockClientId] = useState(null);
  const { canRename } = useBlockRename(
    getBlockName(getSelectedBlockClientIds()[0])
  );
  const {
    duplicateBlocks,
    removeBlocks,
    replaceBlocks,
    insertAfterBlock,
    insertBeforeBlock,
    selectBlock,
    moveBlocksUp,
    moveBlocksDown,
    expandBlock,
    stopEditingContentOnlySection,
    showViewportModal,
    hideViewportModal
  } = unlock(useDispatch(blockEditorStore));
  function onKeyDown(event) {
    if (event.defaultPrevented) {
      return;
    }
    if (isMatch("core/block-editor/move-up", event) || isMatch("core/block-editor/move-down", event)) {
      const clientIds = getSelectedBlockClientIds();
      if (clientIds.length) {
        event.preventDefault();
        const rootClientId = getBlockRootClientId(clientIds[0]);
        const direction = isMatch("core/block-editor/move-up", event) ? "up" : "down";
        if (direction === "up") {
          moveBlocksUp(clientIds, rootClientId);
        } else {
          moveBlocksDown(clientIds, rootClientId);
        }
        const blockLength = Array.isArray(clientIds) ? clientIds.length : 1;
        const message = sprintf(
          // translators: %d: the name of the block that has been moved
          _n(
            "%d block moved.",
            "%d blocks moved.",
            clientIds.length
          ),
          blockLength
        );
        speak(message);
      }
    } else if (isMatch("core/block-editor/duplicate", event)) {
      const clientIds = getSelectedBlockClientIds();
      if (clientIds.length) {
        event.preventDefault();
        duplicateBlocks(clientIds);
      }
    } else if (isMatch("core/block-editor/remove", event)) {
      const clientIds = getSelectedBlockClientIds();
      if (clientIds.length) {
        event.preventDefault();
        removeBlocks(clientIds);
      }
    } else if (isMatch("core/block-editor/paste-styles", event)) {
      const clientIds = getSelectedBlockClientIds();
      if (clientIds.length) {
        event.preventDefault();
        const blocks = getBlocksByClientId(clientIds);
        pasteStyles(blocks);
      }
    } else if (isMatch("core/block-editor/insert-after", event)) {
      const clientIds = getSelectedBlockClientIds();
      if (clientIds.length) {
        event.preventDefault();
        insertAfterBlock(clientIds[clientIds.length - 1]);
      }
    } else if (isMatch("core/block-editor/insert-before", event)) {
      const clientIds = getSelectedBlockClientIds();
      if (clientIds.length) {
        event.preventDefault();
        insertBeforeBlock(clientIds[0]);
      }
    } else if (isMatch("core/block-editor/unselect", event)) {
      if (event.target.closest("[role=toolbar]")) {
        return;
      }
      const clientIds = getSelectedBlockClientIds();
      if (clientIds.length > 1) {
        event.preventDefault();
        selectBlock(clientIds[0]);
      }
    } else if (isMatch("core/block-editor/collapse-list-view", event)) {
      if (isTextField(event.target) || isTextField(
        event.target?.contentWindow?.document?.activeElement
      )) {
        return;
      }
      event.preventDefault();
      expandBlock(clientId);
    } else if (isMatch("core/block-editor/group", event)) {
      const clientIds = getSelectedBlockClientIds();
      if (clientIds.length > 1 && isGroupable(clientIds)) {
        event.preventDefault();
        const blocks = getBlocksByClientId(clientIds);
        const groupingBlockName = getGroupingBlockName();
        const newBlocks = switchToBlockType(
          blocks,
          groupingBlockName
        );
        replaceBlocks(clientIds, newBlocks);
        speak(__("Selected blocks are grouped."));
      }
    } else if (isMatch("core/block-editor/rename", event)) {
      const clientIds = getSelectedBlockClientIds();
      if (clientIds.length === 1) {
        const isContentOnly = getBlockEditingMode(clientIds[0]) === "contentOnly";
        const canRenameBlock = canRename && !isContentOnly && canEditBlock(clientIds[0]);
        if (canRenameBlock) {
          event.preventDefault();
          setRenamingBlockClientId(clientIds[0]);
        }
      }
    } else if (isMatch("core/block-editor/toggle-block-visibility", event)) {
      const clientIds = getSelectedBlockClientIds();
      if (clientIds.length) {
        event.preventDefault();
        const blocks = getBlocksByClientId(clientIds);
        const supportsBlockVisibility = blocks.every(
          (block) => hasBlockSupport(block.name, "visibility", true)
        );
        if (!supportsBlockVisibility) {
          return;
        }
        if (clientIds.some(
          (id) => getBlockEditingMode(id) !== "default" || !canEditBlock(id)
        )) {
          return;
        }
        showViewportModal(clientIds);
      }
    }
    if (isMatch("core/block-editor/stop-editing-as-blocks", event)) {
      if (getEditedContentOnlySection()) {
        stopEditingContentOnlySection();
      }
    }
  }
  const blockToolbarRef = usePopoverScroll(__unstableContentRef);
  const blockToolbarAfterRef = usePopoverScroll(__unstableContentRef);
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    /* @__PURE__ */ jsxs(
      "div",
      {
        ...props,
        onKeyDown,
        className: clsx(props.className, {
          "block-editor-block-tools--is-dragging": isDragging
        }),
        children: [
          /* @__PURE__ */ jsxs(InsertionPointOpenRef.Provider, { value: useRef(false), children: [
            !isTyping && !isZoomOutMode && /* @__PURE__ */ jsx(
              InsertionPoint,
              {
                __unstableContentRef
              }
            ),
            showEmptyBlockSideInserter && /* @__PURE__ */ jsx(
              EmptyBlockInserter,
              {
                __unstableContentRef,
                clientId
              }
            ),
            showBlockToolbarPopover && /* @__PURE__ */ jsx(
              BlockToolbarPopover,
              {
                __unstableContentRef,
                clientId,
                isTyping
              }
            ),
            !isZoomOutMode && !hasFixedToolbar && /* @__PURE__ */ jsx(
              Popover.Slot,
              {
                name: "block-toolbar",
                ref: blockToolbarRef
              }
            ),
            children,
            /* @__PURE__ */ jsx(
              Popover.Slot,
              {
                name: "__unstable-block-tools-after",
                ref: blockToolbarAfterRef
              }
            ),
            isZoomOutMode && !isDragging && /* @__PURE__ */ jsx(
              ZoomOutModeInserters,
              {
                __unstableContentRef
              }
            )
          ] }),
          renamingBlockClientId && /* @__PURE__ */ jsx(
            BlockRenameModal,
            {
              clientId: renamingBlockClientId,
              onClose: () => setRenamingBlockClientId(null)
            }
          ),
          viewportModalClientIds && /* @__PURE__ */ jsx(
            BlockVisibilityModal,
            {
              clientIds: viewportModalClientIds,
              onClose: hideViewportModal
            }
          )
        ]
      }
    )
  );
}
export {
  BlockTools as default
};
//# sourceMappingURL=index.mjs.map
