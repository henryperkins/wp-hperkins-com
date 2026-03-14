// packages/block-editor/src/components/list-view/utils.js
import { __, sprintf } from "@wordpress/i18n";
import { focus } from "@wordpress/dom";
var getBlockPositionDescription = (position, siblingCount, level) => sprintf(
  /* translators: 1: The numerical position of the block. 2: The total number of blocks. 3. The level of nesting for the block. */
  __("Block %1$d of %2$d, Level %3$d."),
  position,
  siblingCount,
  level
);
var getBlockPropertiesDescription = (blockInformation, isLocked) => [
  blockInformation?.positionLabel ? `${sprintf(
    // translators: %s: Position of selected block, e.g. "Sticky" or "Fixed".
    __("Position: %s"),
    blockInformation.positionLabel
  )}.` : void 0,
  isLocked ? __("This block is locked.") : void 0
].filter(Boolean).join(" ");
var isClientIdSelected = (clientId, selectedBlockClientIds) => Array.isArray(selectedBlockClientIds) && selectedBlockClientIds.length ? selectedBlockClientIds.indexOf(clientId) !== -1 : selectedBlockClientIds === clientId;
function getCommonDepthClientIds(startId, endId, startParents, endParents) {
  const startPath = [...startParents, startId];
  const endPath = [...endParents, endId];
  const depth = Math.min(startPath.length, endPath.length) - 1;
  const start = startPath[depth];
  const end = endPath[depth];
  return {
    start,
    end
  };
}
function focusListItem(focusClientId, treeGridElement) {
  if (!treeGridElement) {
    return;
  }
  const selector = `[role=row][data-block="${focusClientId}"]`;
  return new Promise((resolve) => {
    if (treeGridElement.querySelector(selector)) {
      return resolve(treeGridElement.querySelector(selector));
    }
    let timer = null;
    const observer = new window.MutationObserver(() => {
      if (treeGridElement.querySelector(selector)) {
        clearTimeout(timer);
        observer.disconnect();
        resolve(treeGridElement.querySelector(selector));
      }
    });
    observer.observe(treeGridElement, {
      childList: true,
      subtree: true
    });
    timer = setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, 3e3);
  }).then((element) => {
    if (element && element.isConnected) {
      focus.focusable.find(element)?.[0]?.focus();
    }
  });
}
function getDragDisplacementValues({
  blockIndexes,
  blockDropTargetIndex,
  blockDropPosition,
  clientId,
  firstDraggedBlockIndex,
  isDragged
}) {
  let displacement;
  let isNesting;
  let isAfterDraggedBlocks;
  if (!isDragged) {
    isNesting = false;
    const thisBlockIndex = blockIndexes[clientId];
    isAfterDraggedBlocks = thisBlockIndex > firstDraggedBlockIndex;
    if (blockDropTargetIndex !== void 0 && blockDropTargetIndex !== null && firstDraggedBlockIndex !== void 0) {
      if (thisBlockIndex !== void 0) {
        if (thisBlockIndex >= firstDraggedBlockIndex && thisBlockIndex < blockDropTargetIndex) {
          displacement = "up";
        } else if (thisBlockIndex < firstDraggedBlockIndex && thisBlockIndex >= blockDropTargetIndex) {
          displacement = "down";
        } else {
          displacement = "normal";
        }
        isNesting = typeof blockDropTargetIndex === "number" && blockDropTargetIndex - 1 === thisBlockIndex && blockDropPosition === "inside";
      }
    } else if (blockDropTargetIndex === null && firstDraggedBlockIndex !== void 0) {
      if (thisBlockIndex !== void 0 && thisBlockIndex >= firstDraggedBlockIndex) {
        displacement = "up";
      } else {
        displacement = "normal";
      }
    } else if (blockDropTargetIndex !== void 0 && blockDropTargetIndex !== null && firstDraggedBlockIndex === void 0) {
      if (thisBlockIndex !== void 0) {
        if (thisBlockIndex < blockDropTargetIndex) {
          displacement = "normal";
        } else {
          displacement = "down";
        }
      }
    } else if (blockDropTargetIndex === null) {
      displacement = "normal";
    }
  }
  return {
    displacement,
    isNesting,
    isAfterDraggedBlocks
  };
}
export {
  focusListItem,
  getBlockPositionDescription,
  getBlockPropertiesDescription,
  getCommonDepthClientIds,
  getDragDisplacementValues,
  isClientIdSelected
};
//# sourceMappingURL=utils.mjs.map
