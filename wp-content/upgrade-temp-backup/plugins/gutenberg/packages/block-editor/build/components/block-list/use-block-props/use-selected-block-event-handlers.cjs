"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-editor/src/components/block-list/use-block-props/use-selected-block-event-handlers.js
var use_selected_block_event_handlers_exports = {};
__export(use_selected_block_event_handlers_exports, {
  useEventHandlers: () => useEventHandlers
});
module.exports = __toCommonJS(use_selected_block_event_handlers_exports);
var import_blocks = require("@wordpress/blocks");
var import_dom = require("@wordpress/dom");
var import_keycodes = require("@wordpress/keycodes");
var import_data = require("@wordpress/data");
var import_compose = require("@wordpress/compose");
var import_store = require("../../../store/index.cjs");
var import_lock_unlock = require("../../../lock-unlock.cjs");
function isColorTransparent(color) {
  return !color || color === "transparent" || color === "rgba(0, 0, 0, 0)";
}
function useEventHandlers({ clientId, isSelected }) {
  const {
    getBlockRootClientId,
    isZoomOut,
    hasMultiSelection,
    isSectionBlock,
    editedContentOnlySection,
    getBlock
  } = (0, import_lock_unlock.unlock)((0, import_data.useSelect)(import_store.store));
  const {
    insertAfterBlock,
    removeBlock,
    resetZoomLevel,
    startDraggingBlocks,
    stopDraggingBlocks,
    editContentOnlySection
  } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_store.store));
  return (0, import_compose.useRefEffect)(
    (node) => {
      if (!isSelected) {
        return;
      }
      function onKeyDown(event) {
        const { keyCode, target } = event;
        if (keyCode !== import_keycodes.ENTER && keyCode !== import_keycodes.BACKSPACE && keyCode !== import_keycodes.DELETE) {
          return;
        }
        if (target !== node || (0, import_dom.isTextField)(target)) {
          return;
        }
        event.preventDefault();
        if (keyCode === import_keycodes.ENTER && isZoomOut()) {
          resetZoomLevel();
        } else if (keyCode === import_keycodes.ENTER) {
          insertAfterBlock(clientId);
        } else {
          removeBlock(clientId);
        }
      }
      function onDragStart(event) {
        if (node !== event.target || node.isContentEditable || node.ownerDocument.activeElement !== node || hasMultiSelection()) {
          event.preventDefault();
          return;
        }
        const data = JSON.stringify({
          type: "block",
          srcClientIds: [clientId],
          srcRootClientId: getBlockRootClientId(clientId)
        });
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.clearData();
        event.dataTransfer.setData("wp-blocks", data);
        const { ownerDocument } = node;
        const { defaultView } = ownerDocument;
        const selection = defaultView.getSelection();
        selection.removeAllRanges();
        const dragElement = ownerDocument.createElement("div");
        dragElement.style.width = "1px";
        dragElement.style.height = "1px";
        dragElement.style.position = "fixed";
        dragElement.style.visibility = "hidden";
        ownerDocument.body.appendChild(dragElement);
        event.dataTransfer.setDragImage(dragElement, 0, 0);
        const rect = node.getBoundingClientRect();
        const id = node.id;
        const clone = node.cloneNode();
        clone.style.display = "none";
        node.id = null;
        node.after(clone);
        let _scale = 1;
        {
          let parentElement = node;
          while (parentElement = parentElement.parentElement) {
            const { scale } = defaultView.getComputedStyle(parentElement);
            if (scale && scale !== "none") {
              _scale = parseFloat(scale);
              break;
            }
          }
        }
        const inverted = 1 / _scale;
        const originalNodeProperties = {};
        for (const property of [
          "transform",
          "transformOrigin",
          "transition",
          "zIndex",
          "position",
          "top",
          "left",
          "pointerEvents",
          "opacity",
          "backgroundColor"
        ]) {
          originalNodeProperties[property] = node.style[property];
        }
        const originScrollTop = defaultView.scrollY;
        const originScrollLeft = defaultView.scrollX;
        const originClientX = event.clientX;
        const originClientY = event.clientY;
        node.style.position = "relative";
        node.style.top = `${0}px`;
        node.style.left = `${0}px`;
        const originX = event.clientX - rect.left;
        const originY = event.clientY - rect.top;
        const dragScale = rect.height > 200 ? 200 / rect.height : 1;
        node.style.zIndex = "1000";
        node.style.transformOrigin = `${originX * inverted}px ${originY * inverted}px`;
        node.style.transition = "transform 0.2s ease-out";
        node.style.transform = `scale(${dragScale})`;
        node.style.opacity = "0.9";
        if (isColorTransparent(
          defaultView.getComputedStyle(node).backgroundColor
        )) {
          let bgColor = "transparent";
          let parentElement = node;
          while (parentElement = parentElement.parentElement) {
            const { backgroundColor } = defaultView.getComputedStyle(parentElement);
            if (!isColorTransparent(backgroundColor)) {
              bgColor = backgroundColor;
              break;
            }
          }
          node.style.backgroundColor = bgColor;
        }
        let hasStarted = false;
        let lastClientX = originClientX;
        let lastClientY = originClientY;
        function dragOver(e) {
          if (e.clientX === lastClientX && e.clientY === lastClientY) {
            return;
          }
          lastClientX = e.clientX;
          lastClientY = e.clientY;
          over();
        }
        function over() {
          if (!hasStarted) {
            hasStarted = true;
            node.style.pointerEvents = "none";
          }
          const pointerYDelta = lastClientY - originClientY;
          const pointerXDelta = lastClientX - originClientX;
          const scrollTop = defaultView.scrollY;
          const scrollLeft = defaultView.scrollX;
          const scrollTopDelta = scrollTop - originScrollTop;
          const scrollLeftDelta = scrollLeft - originScrollLeft;
          const topDelta = pointerYDelta + scrollTopDelta;
          const leftDelta = pointerXDelta + scrollLeftDelta;
          node.style.top = `${topDelta * inverted}px`;
          node.style.left = `${leftDelta * inverted}px`;
        }
        function end() {
          ownerDocument.removeEventListener("dragover", dragOver);
          ownerDocument.removeEventListener("dragend", end);
          ownerDocument.removeEventListener("drop", end);
          ownerDocument.removeEventListener("scroll", over);
          for (const [property, value] of Object.entries(
            originalNodeProperties
          )) {
            node.style[property] = value;
          }
          clone.remove();
          node.id = id;
          dragElement.remove();
          stopDraggingBlocks();
          document.body.classList.remove(
            "is-dragging-components-draggable"
          );
          ownerDocument.documentElement.classList.remove(
            "is-dragging"
          );
        }
        ownerDocument.addEventListener("dragover", dragOver);
        ownerDocument.addEventListener("dragend", end);
        ownerDocument.addEventListener("drop", end);
        ownerDocument.addEventListener("scroll", over);
        startDraggingBlocks([clientId]);
        document.body.classList.add(
          "is-dragging-components-draggable"
        );
        ownerDocument.documentElement.classList.add("is-dragging");
      }
      node.addEventListener("keydown", onKeyDown);
      node.addEventListener("dragstart", onDragStart);
      function onDoubleClick(event) {
        const isSection = isSectionBlock(clientId);
        const block = getBlock(clientId);
        const isSyncedPattern = (0, import_blocks.isReusableBlock)(block);
        const isTemplatePartBlock = (0, import_blocks.isTemplatePart)(block);
        const isAlreadyEditing = editedContentOnlySection === clientId;
        if (!isSection || isAlreadyEditing || isSyncedPattern || isTemplatePartBlock) {
          return;
        }
        event.preventDefault();
        editContentOnlySection(clientId);
      }
      node.addEventListener("dblclick", onDoubleClick);
      return () => {
        node.removeEventListener("keydown", onKeyDown);
        node.removeEventListener("dragstart", onDragStart);
        node.removeEventListener("dblclick", onDoubleClick);
      };
    },
    [
      clientId,
      isSelected,
      getBlockRootClientId,
      getBlock,
      import_blocks.isReusableBlock,
      import_blocks.isTemplatePart,
      insertAfterBlock,
      removeBlock,
      isZoomOut,
      resetZoomLevel,
      hasMultiSelection,
      startDraggingBlocks,
      stopDraggingBlocks,
      isSectionBlock,
      editedContentOnlySection,
      editContentOnlySection
    ]
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useEventHandlers
});
//# sourceMappingURL=use-selected-block-event-handlers.cjs.map
