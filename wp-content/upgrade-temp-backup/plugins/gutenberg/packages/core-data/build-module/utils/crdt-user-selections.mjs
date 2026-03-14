// packages/core-data/src/utils/crdt-user-selections.ts
import { select } from "@wordpress/data";
import { Y } from "@wordpress/sync";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { CRDT_RECORD_MAP_KEY } from "../sync.mjs";
import { getRootMap } from "./crdt-utils.mjs";
var SelectionType = /* @__PURE__ */ ((SelectionType2) => {
  SelectionType2["None"] = "none";
  SelectionType2["Cursor"] = "cursor";
  SelectionType2["SelectionInOneBlock"] = "selection-in-one-block";
  SelectionType2["SelectionInMultipleBlocks"] = "selection-in-multiple-blocks";
  SelectionType2["WholeBlock"] = "whole-block";
  return SelectionType2;
})(SelectionType || {});
function getSelectionState(selectionStart, selectionEnd, yDoc) {
  const ymap = getRootMap(yDoc, CRDT_RECORD_MAP_KEY);
  const yBlocks = ymap.get("blocks");
  const isSelectionEmpty = Object.keys(selectionStart).length === 0;
  const noSelection = {
    type: "none" /* None */
  };
  if (isSelectionEmpty || !yBlocks) {
    return noSelection;
  }
  const isSelectionInOneBlock = selectionStart.clientId === selectionEnd.clientId;
  const isCursorOnly = isSelectionInOneBlock && selectionStart.offset === selectionEnd.offset;
  const isSelectionAWholeBlock = isSelectionInOneBlock && selectionStart.offset === void 0 && selectionEnd.offset === void 0;
  if (isSelectionAWholeBlock) {
    const path = getBlockPathForLocalClientId(selectionStart.clientId);
    const blockPosition = path ? createRelativePositionForBlockPath(path, yBlocks) : null;
    if (!blockPosition) {
      return noSelection;
    }
    return {
      type: "whole-block" /* WholeBlock */,
      blockPosition
    };
  } else if (isCursorOnly) {
    const cursorPosition = getCursorPosition(selectionStart, yBlocks);
    if (!cursorPosition) {
      return noSelection;
    }
    return {
      type: "cursor" /* Cursor */,
      cursorPosition
    };
  } else if (isSelectionInOneBlock) {
    const cursorStartPosition2 = getCursorPosition(
      selectionStart,
      yBlocks
    );
    const cursorEndPosition2 = getCursorPosition(selectionEnd, yBlocks);
    if (!cursorStartPosition2 || !cursorEndPosition2) {
      return noSelection;
    }
    return {
      type: "selection-in-one-block" /* SelectionInOneBlock */,
      cursorStartPosition: cursorStartPosition2,
      cursorEndPosition: cursorEndPosition2
    };
  }
  const cursorStartPosition = getCursorPosition(selectionStart, yBlocks);
  const cursorEndPosition = getCursorPosition(selectionEnd, yBlocks);
  if (!cursorStartPosition || !cursorEndPosition) {
    return noSelection;
  }
  return {
    type: "selection-in-multiple-blocks" /* SelectionInMultipleBlocks */,
    cursorStartPosition,
    cursorEndPosition
  };
}
function getCursorPosition(selection, blocks) {
  const path = getBlockPathForLocalClientId(selection.clientId);
  const block = path ? findBlockByPath(path, blocks) : null;
  if (!block || !selection.attributeKey || void 0 === selection.offset) {
    return null;
  }
  const attributes = block.get("attributes");
  const currentYText = attributes?.get(selection.attributeKey);
  if (!(currentYText instanceof Y.Text)) {
    return null;
  }
  const relativePosition = Y.createRelativePositionFromTypeIndex(
    currentYText,
    selection.offset
  );
  return {
    relativePosition,
    absoluteOffset: selection.offset
  };
}
function getBlockPathForLocalClientId(clientId) {
  const { getBlockIndex, getBlockRootClientId, getBlockName } = select(blockEditorStore);
  const path = [];
  let current = clientId;
  while (current) {
    const index = getBlockIndex(current);
    if (index === -1) {
      return null;
    }
    path.unshift(index);
    const parent = getBlockRootClientId(current);
    if (!parent) {
      break;
    }
    const parentName = getBlockName(parent);
    if (parentName === "core/post-content") {
      break;
    }
    current = parent;
  }
  return path.length > 0 ? path : null;
}
function findBlockByPath(path, blocks) {
  let currentBlocks = blocks;
  for (let i = 0; i < path.length; i++) {
    if (path[i] >= currentBlocks.length) {
      return null;
    }
    const block = currentBlocks.get(path[i]);
    if (!block) {
      return null;
    }
    if (i === path.length - 1) {
      return block;
    }
    currentBlocks = block.get("innerBlocks") ?? new Y.Array();
  }
  return null;
}
function createRelativePositionForBlockPath(path, blocks) {
  let currentBlocks = blocks;
  for (let i = 0; i < path.length; i++) {
    if (path[i] >= currentBlocks.length) {
      return null;
    }
    if (i === path.length - 1) {
      return Y.createRelativePositionFromTypeIndex(
        currentBlocks,
        path[i]
      );
    }
    const block = currentBlocks.get(path[i]);
    currentBlocks = block?.get("innerBlocks") ?? new Y.Array();
  }
  return null;
}
function areSelectionsStatesEqual(selection1, selection2) {
  if (selection1.type !== selection2.type) {
    return false;
  }
  switch (selection1.type) {
    case "none" /* None */:
      return true;
    case "cursor" /* Cursor */:
      return areCursorPositionsEqual(
        selection1.cursorPosition,
        selection2.cursorPosition
      );
    case "selection-in-one-block" /* SelectionInOneBlock */:
      return areCursorPositionsEqual(
        selection1.cursorStartPosition,
        selection2.cursorStartPosition
      ) && areCursorPositionsEqual(
        selection1.cursorEndPosition,
        selection2.cursorEndPosition
      );
    case "selection-in-multiple-blocks" /* SelectionInMultipleBlocks */:
      return areCursorPositionsEqual(
        selection1.cursorStartPosition,
        selection2.cursorStartPosition
      ) && areCursorPositionsEqual(
        selection1.cursorEndPosition,
        selection2.cursorEndPosition
      );
    case "whole-block" /* WholeBlock */:
      return Y.compareRelativePositions(
        selection1.blockPosition,
        selection2.blockPosition
      );
    default:
      return false;
  }
}
function areCursorPositionsEqual(cursorPosition1, cursorPosition2) {
  const isRelativePositionEqual = Y.compareRelativePositions(
    cursorPosition1.relativePosition,
    cursorPosition2.relativePosition
  );
  const isAbsoluteOffsetEqual = cursorPosition1.absoluteOffset === cursorPosition2.absoluteOffset;
  return isRelativePositionEqual && isAbsoluteOffsetEqual;
}
export {
  SelectionType,
  areSelectionsStatesEqual,
  getBlockPathForLocalClientId,
  getSelectionState
};
//# sourceMappingURL=crdt-user-selections.mjs.map
