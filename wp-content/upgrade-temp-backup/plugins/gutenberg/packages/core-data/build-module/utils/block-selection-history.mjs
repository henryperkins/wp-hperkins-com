// packages/core-data/src/utils/block-selection-history.ts
import { Y } from "@wordpress/sync";
import { findBlockByClientIdInDoc } from "./crdt-utils.mjs";
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
  const block = findBlockByClientIdInDoc(clientId, ydoc);
  const attributes = block?.get("attributes");
  const attributeKey = selection.attributeKey;
  const changedYText = attributeKey ? attributes?.get(attributeKey) : void 0;
  const isYText = changedYText instanceof Y.Text;
  const isFullyDefinedSelection = attributeKey && clientId;
  if (!isYText || !isFullyDefinedSelection) {
    return {
      type: "BlockSelection" /* BlockSelection */,
      clientId
    };
  }
  const offset = selection.offset ?? 0;
  const relativePosition = Y.createRelativePositionFromTypeIndex(
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
export {
  YSelectionType,
  createBlockSelectionHistory
};
//# sourceMappingURL=block-selection-history.mjs.map
