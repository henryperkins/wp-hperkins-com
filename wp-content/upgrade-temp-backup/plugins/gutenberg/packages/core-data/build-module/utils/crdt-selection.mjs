// packages/core-data/src/utils/crdt-selection.ts
import { dispatch, select } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { isUnmodifiedBlock } from "@wordpress/blocks";
import { Y } from "@wordpress/sync";
import {
  createBlockSelectionHistory,
  YSelectionType
} from "./block-selection-history.mjs";
import { findBlockByClientIdInDoc } from "./crdt-utils.mjs";
var selectionHistoryMap = /* @__PURE__ */ new WeakMap();
function getBlockSelectionHistory(ydoc) {
  let history = selectionHistoryMap.get(ydoc);
  if (!history) {
    history = createBlockSelectionHistory(ydoc);
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
  if (ySelection.type === YSelectionType.RelativeSelection) {
    const { relativePosition, attributeKey, clientId } = ySelection;
    const absolutePosition = Y.createAbsolutePositionFromRelativePosition(
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
  } else if (ySelection.type === YSelectionType.BlockSelection) {
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
  const startBlock = findBlockByClientIdInDoc(start.clientId, ydoc);
  const endBlock = findBlockByClientIdInDoc(end.clientId, ydoc);
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
  const { getBlock } = select(blockEditorStore);
  const { resetSelection } = dispatch(blockEditorStore);
  const { selectionStart, selectionEnd } = selectionToRestore;
  const isSelectionInSameBlock = selectionStart.clientId === selectionEnd.clientId;
  if (isSelectionInSameBlock) {
    const block = getBlock(selectionStart.clientId);
    const isBlockEmpty = block && isUnmodifiedBlock(block);
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
  if (start.type === YSelectionType.BlockSelection || end.type === YSelectionType.BlockSelection) {
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
export {
  getSelectionHistory,
  getShiftedSelection,
  restoreSelection,
  updateSelectionHistory
};
//# sourceMappingURL=crdt-selection.mjs.map
