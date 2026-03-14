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

// packages/block-editor/src/components/list-view/utils.js
var utils_exports = {};
__export(utils_exports, {
  focusListItem: () => focusListItem,
  getBlockPositionDescription: () => getBlockPositionDescription,
  getBlockPropertiesDescription: () => getBlockPropertiesDescription,
  getCommonDepthClientIds: () => getCommonDepthClientIds,
  getDragDisplacementValues: () => getDragDisplacementValues,
  isClientIdSelected: () => isClientIdSelected
});
module.exports = __toCommonJS(utils_exports);
var import_i18n = require("@wordpress/i18n");
var import_dom = require("@wordpress/dom");
var getBlockPositionDescription = (position, siblingCount, level) => (0, import_i18n.sprintf)(
  /* translators: 1: The numerical position of the block. 2: The total number of blocks. 3. The level of nesting for the block. */
  (0, import_i18n.__)("Block %1$d of %2$d, Level %3$d."),
  position,
  siblingCount,
  level
);
var getBlockPropertiesDescription = (blockInformation, isLocked) => [
  blockInformation?.positionLabel ? `${(0, import_i18n.sprintf)(
    // translators: %s: Position of selected block, e.g. "Sticky" or "Fixed".
    (0, import_i18n.__)("Position: %s"),
    blockInformation.positionLabel
  )}.` : void 0,
  isLocked ? (0, import_i18n.__)("This block is locked.") : void 0
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
      import_dom.focus.focusable.find(element)?.[0]?.focus();
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  focusListItem,
  getBlockPositionDescription,
  getBlockPropertiesDescription,
  getCommonDepthClientIds,
  getDragDisplacementValues,
  isClientIdSelected
});
//# sourceMappingURL=utils.cjs.map
