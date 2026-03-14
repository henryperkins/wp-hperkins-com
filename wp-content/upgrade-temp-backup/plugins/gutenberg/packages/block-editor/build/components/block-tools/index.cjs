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

// packages/block-editor/src/components/block-tools/index.js
var block_tools_exports = {};
__export(block_tools_exports, {
  default: () => BlockTools
});
module.exports = __toCommonJS(block_tools_exports);
var import_clsx = __toESM(require("clsx"));
var import_data = require("@wordpress/data");
var import_dom = require("@wordpress/dom");
var import_components = require("@wordpress/components");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_element = require("@wordpress/element");
var import_blocks = require("@wordpress/blocks");
var import_a11y = require("@wordpress/a11y");
var import_i18n = require("@wordpress/i18n");
var import_empty_block_inserter = __toESM(require("./empty-block-inserter.cjs"));
var import_insertion_point = __toESM(require("./insertion-point.cjs"));
var import_block_toolbar_popover = __toESM(require("./block-toolbar-popover.cjs"));
var import_store = require("../../store/index.cjs");
var import_use_popover_scroll = __toESM(require("../block-popover/use-popover-scroll.cjs"));
var import_zoom_out_mode_inserters = __toESM(require("./zoom-out-mode-inserters.cjs"));
var import_use_show_block_tools = require("./use-show-block-tools.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_use_paste_styles = __toESM(require("../use-paste-styles/index.cjs"));
var import_block_rename = require("../block-rename/index.cjs");
var import_block_visibility = require("../block-visibility/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function selector(select) {
  const {
    getSelectedBlockClientId,
    getFirstMultiSelectedBlockClientId,
    getSettings,
    isTyping,
    isDragging,
    isZoomOut,
    getViewportModalClientIds
  } = (0, import_lock_unlock.unlock)(select(import_store.store));
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
  } = (0, import_data.useSelect)(selector, []);
  const isMatch = (0, import_keyboard_shortcuts.__unstableUseShortcutEventMatch)();
  const {
    getBlocksByClientId,
    getSelectedBlockClientIds,
    getBlockRootClientId,
    getBlockEditingMode,
    getBlockName,
    isGroupable,
    getEditedContentOnlySection,
    canEditBlock
  } = (0, import_lock_unlock.unlock)((0, import_data.useSelect)(import_store.store));
  const { getGroupingBlockName } = (0, import_data.useSelect)(import_blocks.store);
  const { showEmptyBlockSideInserter, showBlockToolbarPopover } = (0, import_use_show_block_tools.useShowBlockTools)();
  const pasteStyles = (0, import_use_paste_styles.default)();
  const [renamingBlockClientId, setRenamingBlockClientId] = (0, import_element.useState)(null);
  const { canRename } = (0, import_block_rename.useBlockRename)(
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
  } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_store.store));
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
        const message = (0, import_i18n.sprintf)(
          // translators: %d: the name of the block that has been moved
          (0, import_i18n._n)(
            "%d block moved.",
            "%d blocks moved.",
            clientIds.length
          ),
          blockLength
        );
        (0, import_a11y.speak)(message);
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
      if ((0, import_dom.isTextField)(event.target) || (0, import_dom.isTextField)(
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
        const newBlocks = (0, import_blocks.switchToBlockType)(
          blocks,
          groupingBlockName
        );
        replaceBlocks(clientIds, newBlocks);
        (0, import_a11y.speak)((0, import_i18n.__)("Selected blocks are grouped."));
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
          (block) => (0, import_blocks.hasBlockSupport)(block.name, "visibility", true)
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
  const blockToolbarRef = (0, import_use_popover_scroll.default)(__unstableContentRef);
  const blockToolbarAfterRef = (0, import_use_popover_scroll.default)(__unstableContentRef);
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        ...props,
        onKeyDown,
        className: (0, import_clsx.default)(props.className, {
          "block-editor-block-tools--is-dragging": isDragging
        }),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_insertion_point.InsertionPointOpenRef.Provider, { value: (0, import_element.useRef)(false), children: [
            !isTyping && !isZoomOutMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_insertion_point.default,
              {
                __unstableContentRef
              }
            ),
            showEmptyBlockSideInserter && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_empty_block_inserter.default,
              {
                __unstableContentRef,
                clientId
              }
            ),
            showBlockToolbarPopover && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_block_toolbar_popover.default,
              {
                __unstableContentRef,
                clientId,
                isTyping
              }
            ),
            !isZoomOutMode && !hasFixedToolbar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.Popover.Slot,
              {
                name: "block-toolbar",
                ref: blockToolbarRef
              }
            ),
            children,
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.Popover.Slot,
              {
                name: "__unstable-block-tools-after",
                ref: blockToolbarAfterRef
              }
            ),
            isZoomOutMode && !isDragging && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_zoom_out_mode_inserters.default,
              {
                __unstableContentRef
              }
            )
          ] }),
          renamingBlockClientId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_block_rename.BlockRenameModal,
            {
              clientId: renamingBlockClientId,
              onClose: () => setRenamingBlockClientId(null)
            }
          ),
          viewportModalClientIds && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_block_visibility.BlockVisibilityModal,
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
//# sourceMappingURL=index.cjs.map
