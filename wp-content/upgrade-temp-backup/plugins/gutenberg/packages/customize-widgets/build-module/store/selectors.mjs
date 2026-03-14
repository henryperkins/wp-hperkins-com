// packages/customize-widgets/src/store/selectors.js
var EMPTY_INSERTION_POINT = {
  rootClientId: void 0,
  insertionIndex: void 0
};
function isInserterOpened(state) {
  return !!state.blockInserterPanel;
}
function __experimentalGetInsertionPoint(state) {
  if (typeof state.blockInserterPanel === "boolean") {
    return EMPTY_INSERTION_POINT;
  }
  return state.blockInserterPanel;
}
export {
  __experimentalGetInsertionPoint,
  isInserterOpened
};
//# sourceMappingURL=selectors.mjs.map
