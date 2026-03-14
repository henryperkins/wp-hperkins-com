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

// packages/core-data/src/utils/crdt-selection.ts
var crdt_selection_exports = {};
__export(crdt_selection_exports, {
  getSelectionHistory: () => getSelectionHistory,
  getShiftedSelection: () => getShiftedSelection,
  restoreSelection: () => restoreSelection,
  updateSelectionHistory: () => updateSelectionHistory
});
module.exports = __toCommonJS(crdt_selection_exports);
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_blocks = require("@wordpress/blocks");
var import_sync = require("@wordpress/sync");
var import_block_selection_history = require("./block-selection-history.cjs");
var import_crdt_utils = require("./crdt-utils.cjs");
var selectionHistoryMap = /* @__PURE__ */ new WeakMap();
function getBlockSelectionHistory(ydoc) {
  let history = selectionHistoryMap.get(ydoc);
  if (!history) {
    history = (0, import_block_selection_history.createBlockSelectionHistory)(ydoc);
    selectionHistoryMap.set(ydoc, history);
  }
  return history;
}
function getSelectionHistory(ydoc) {
  return getBlockSelectionHistory(ydoc).getSelectionHistory();
}
function updateSelectionHistory(ydoc, wpSelection) {
  return getBlockSelectionHistory(ydoc).updateSelection(wpSelection);
}
function convertYSelectionToBlockSelection(ySelection, ydoc) {
  if (ySelection.type === import_block_selection_history.YSelectionType.RelativeSelection) {
    const { relativePosition, attributeKey, clientId } = ySelection;
    const absolutePosition = import_sync.Y.createAbsolutePositionFromRelativePosition(
      relativePosition,
      ydoc
    );
    if (absolutePosition) {
      return {
        clientId,
        attributeKey,
        offset: absolutePosition.index
      };
    }
  } else if (ySelection.type === import_block_selection_history.YSelectionType.BlockSelection) {
    return {
      clientId: ySelection.clientId,
      attributeKey: void 0,
      offset: void 0
    };
  }
  return null;
}
function convertYFullSelectionToWPSelection(yFullSelection, ydoc) {
  const { start, end } = yFullSelection;
  const startBlock = (0, import_crdt_utils.findBlockByClientIdInDoc)(start.clientId, ydoc);
  const endBlock = (0, import_crdt_utils.findBlockByClientIdInDoc)(end.clientId, ydoc);
  if (!startBlock || !endBlock) {
    return null;
  }
  const startBlockSelection = convertYSelectionToBlockSelection(
    start,
    ydoc
  );
  const endBlockSelection = convertYSelectionToBlockSelection(end, ydoc);
  if (startBlockSelection === null || endBlockSelection === null) {
    return null;
  }
  return {
    selectionStart: startBlockSelection,
    selectionEnd: endBlockSelection
  };
}
function findSelectionFromHistory(ydoc, selectionHistory) {
  for (const positionToTry of selectionHistory) {
    const result = convertYFullSelectionToWPSelection(
      positionToTry,
      ydoc
    );
    if (result !== null) {
      return result;
    }
  }
  return null;
}
function restoreSelection(selectionHistory, ydoc) {
  const selectionToRestore = findSelectionFromHistory(
    ydoc,
    selectionHistory
  );
  if (selectionToRestore === null) {
    return;
  }
  const { getBlock } = (0, import_data.select)(import_block_editor.store);
  const { resetSelection } = (0, import_data.dispatch)(import_block_editor.store);
  const { selectionStart, selectionEnd } = selectionToRestore;
  const isSelectionInSameBlock = selectionStart.clientId === selectionEnd.clientId;
  if (isSelectionInSameBlock) {
    const block = getBlock(selectionStart.clientId);
    const isBlockEmpty = block && (0, import_blocks.isUnmodifiedBlock)(block);
    const isBeginningOfEmptyBlock = 0 === selectionStart.offset && 0 === selectionEnd.offset && isBlockEmpty && !selectionStart.attributeKey && !selectionEnd.attributeKey;
    if (isBeginningOfEmptyBlock) {
      const selectionStartWithoutOffset = {
        clientId: selectionStart.clientId
      };
      const selectionEndWithoutOffset = {
        clientId: selectionEnd.clientId
      };
      resetSelection(
        selectionStartWithoutOffset,
        selectionEndWithoutOffset,
        0
      );
    } else {
      resetSelection(selectionStart, selectionEnd, 0);
    }
  } else {
    resetSelection(selectionEnd, selectionEnd, 0);
  }
}
function getShiftedSelection(ydoc, selectionHistory) {
  if (selectionHistory.length === 0) {
    return null;
  }
  const { start, end } = selectionHistory[0];
  if (start.type === import_block_selection_history.YSelectionType.BlockSelection || end.type === import_block_selection_history.YSelectionType.BlockSelection) {
    return null;
  }
  const selectionStart = convertYSelectionToBlockSelection(start, ydoc);
  const selectionEnd = convertYSelectionToBlockSelection(end, ydoc);
  if (!selectionStart || !selectionEnd) {
    return null;
  }
  const startShifted = selectionStart.offset !== start.offset;
  const endShifted = selectionEnd.offset !== end.offset;
  if (!startShifted && !endShifted) {
    return null;
  }
  return { selectionStart, selectionEnd };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getSelectionHistory,
  getShiftedSelection,
  restoreSelection,
  updateSelectionHistory
});
//# sourceMappingURL=crdt-selection.cjs.map
