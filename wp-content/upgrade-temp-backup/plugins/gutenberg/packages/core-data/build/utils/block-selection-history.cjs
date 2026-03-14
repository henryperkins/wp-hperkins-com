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

// packages/core-data/src/utils/block-selection-history.ts
var block_selection_history_exports = {};
__export(block_selection_history_exports, {
  YSelectionType: () => YSelectionType,
  createBlockSelectionHistory: () => createBlockSelectionHistory
});
module.exports = __toCommonJS(block_selection_history_exports);
var import_sync = require("@wordpress/sync");
var import_crdt_utils = require("./crdt-utils.cjs");
var SELECTION_HISTORY_DEFAULT_SIZE = 5;
var YSelectionType = /* @__PURE__ */ ((YSelectionType2) => {
  YSelectionType2["RelativeSelection"] = "RelativeSelection";
  YSelectionType2["BlockSelection"] = "BlockSelection";
  return YSelectionType2;
})(YSelectionType || {});
function createBlockSelectionHistory(ydoc, historySize = SELECTION_HISTORY_DEFAULT_SIZE) {
  let history = [];
  const getSelectionHistory = () => {
    return history.slice(0);
  };
  const updateSelection = (newSelection) => {
    if (!newSelection?.selectionStart?.clientId || !newSelection?.selectionEnd?.clientId) {
      return;
    }
    const { selectionStart, selectionEnd } = newSelection;
    const start = convertWPBlockSelectionToSelection(
      selectionStart,
      ydoc
    );
    const end = convertWPBlockSelectionToSelection(selectionEnd, ydoc);
    addToHistory({ start, end });
  };
  const addToHistory = (yFullSelection) => {
    const startClientId = yFullSelection.start.clientId;
    const endClientId = yFullSelection.end.clientId;
    history = history.filter((entry) => {
      const isSameBlockCombination = entry.start.clientId === startClientId && entry.end.clientId === endClientId;
      return !isSameBlockCombination;
    });
    history.unshift(yFullSelection);
    if (history.length > historySize + 1) {
      history = history.slice(0, historySize + 1);
    }
  };
  return {
    getSelectionHistory,
    updateSelection
  };
}
function convertWPBlockSelectionToSelection(selection, ydoc) {
  const clientId = selection.clientId;
  const block = (0, import_crdt_utils.findBlockByClientIdInDoc)(clientId, ydoc);
  const attributes = block?.get("attributes");
  const attributeKey = selection.attributeKey;
  const changedYText = attributeKey ? attributes?.get(attributeKey) : void 0;
  const isYText = changedYText instanceof import_sync.Y.Text;
  const isFullyDefinedSelection = attributeKey && clientId;
  if (!isYText || !isFullyDefinedSelection) {
    return {
      type: "BlockSelection" /* BlockSelection */,
      clientId
    };
  }
  const offset = selection.offset ?? 0;
  const relativePosition = import_sync.Y.createRelativePositionFromTypeIndex(
    changedYText,
    offset
  );
  return {
    type: "RelativeSelection" /* RelativeSelection */,
    attributeKey,
    relativePosition,
    clientId,
    offset
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  YSelectionType,
  createBlockSelectionHistory
});
//# sourceMappingURL=block-selection-history.cjs.map
