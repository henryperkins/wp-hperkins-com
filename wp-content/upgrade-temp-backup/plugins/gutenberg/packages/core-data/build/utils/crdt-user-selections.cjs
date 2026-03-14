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

// packages/core-data/src/utils/crdt-user-selections.ts
var crdt_user_selections_exports = {};
__export(crdt_user_selections_exports, {
  SelectionType: () => SelectionType,
  areSelectionsStatesEqual: () => areSelectionsStatesEqual,
  getBlockPathForLocalClientId: () => getBlockPathForLocalClientId,
  getSelectionState: () => getSelectionState
});
module.exports = __toCommonJS(crdt_user_selections_exports);
var import_data = require("@wordpress/data");
var import_sync = require("@wordpress/sync");
var import_block_editor = require("@wordpress/block-editor");
var import_sync2 = require("../sync.cjs");
var import_crdt_utils = require("./crdt-utils.cjs");
var SelectionType = /* @__PURE__ */ ((SelectionType2) => {
  SelectionType2["None"] = "none";
  SelectionType2["Cursor"] = "cursor";
  SelectionType2["SelectionInOneBlock"] = "selection-in-one-block";
  SelectionType2["SelectionInMultipleBlocks"] = "selection-in-multiple-blocks";
  SelectionType2["WholeBlock"] = "whole-block";
  return SelectionType2;
})(SelectionType || {});
function getSelectionState(selectionStart, selectionEnd, yDoc) {
  const ymap = (0, import_crdt_utils.getRootMap)(yDoc, import_sync2.CRDT_RECORD_MAP_KEY);
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
  if (!(currentYText instanceof import_sync.Y.Text)) {
    return null;
  }
  const relativePosition = import_sync.Y.createRelativePositionFromTypeIndex(
    currentYText,
    selection.offset
  );
  return {
    relativePosition,
    absoluteOffset: selection.offset
  };
}
function getBlockPathForLocalClientId(clientId) {
  const { getBlockIndex, getBlockRootClientId, getBlockName } = (0, import_data.select)(import_block_editor.store);
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
    currentBlocks = block.get("innerBlocks") ?? new import_sync.Y.Array();
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
      return import_sync.Y.createRelativePositionFromTypeIndex(
        currentBlocks,
        path[i]
      );
    }
    const block = currentBlocks.get(path[i]);
    currentBlocks = block?.get("innerBlocks") ?? new import_sync.Y.Array();
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
      return import_sync.Y.compareRelativePositions(
        selection1.blockPosition,
        selection2.blockPosition
      );
    default:
      return false;
  }
}
function areCursorPositionsEqual(cursorPosition1, cursorPosition2) {
  const isRelativePositionEqual = import_sync.Y.compareRelativePositions(
    cursorPosition1.relativePosition,
    cursorPosition2.relativePosition
  );
  const isAbsoluteOffsetEqual = cursorPosition1.absoluteOffset === cursorPosition2.absoluteOffset;
  return isRelativePositionEqual && isAbsoluteOffsetEqual;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SelectionType,
  areSelectionsStatesEqual,
  getBlockPathForLocalClientId,
  getSelectionState
});
//# sourceMappingURL=crdt-user-selections.cjs.map
